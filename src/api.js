export class ApiError extends Error {
	status;
	constructor(message, status = 0) {
		super(message);
		this.status = status;
	}
}
export function validateCredentials(credentials) {
	const idInstance = credentials.idInstance.trim();
	const apiTokenInstance = credentials.apiTokenInstance.trim();
	if (!/^\d+$/.test(idInstance))
		throw new Error("idInstance должен содержать только цифры.");
	if (!/^[a-zA-Z0-9_-]+$/.test(apiTokenInstance))
		throw new Error("Проверьте apiTokenInstance: скопируйте токен целиком.");
	let url;
	try {
		url = new URL(credentials.apiUrl.trim());
	} catch {
		throw new Error("Укажите apiUrl из личного кабинета GREEN-API.");
	}
	if (
		url.protocol !== "https:" ||
		!/^(?:[a-z0-9-]+\.)*green-api\.com$/.test(url.hostname) ||
		url.port ||
		url.username ||
		url.password ||
		url.search ||
		url.hash ||
		url.pathname !== "/"
	) {
		throw new Error(
			"apiUrl должен быть HTTPS-адресом сервера green-api.com без пути и параметров.",
		);
	}
	return { apiUrl: url.origin, idInstance, apiTokenInstance };
}
export function normalizePhone(value) {
	if (!/^\+?[\d\s()-]+$/.test(value.trim()))
		throw new Error("Введите номер телефона с кодом страны.");
	const digits = value.replace(/\D/g, "");
	if (!/^[1-9]\d{6,14}$/.test(digits))
		throw new Error(
			"Номер должен содержать от 7 до 15 цифр, включая код страны.",
		);
	return digits;
}
export class GreenApi {
	credentials;
	constructor(credentials) {
		this.credentials = validateCredentials(credentials);
	}
	async request(method, verb, signal, body, suffix = "") {
		const { apiUrl, idInstance, apiTokenInstance } = this.credentials;
		const timeout = AbortSignal.timeout(40_000);
		let response;
		try {
			response = await fetch(
				`${apiUrl}/waInstance${idInstance}/${method}/${apiTokenInstance}${suffix}`,
				{
					method: verb,
					signal: AbortSignal.any([signal, timeout]),
					credentials: "omit",
					referrerPolicy: "no-referrer",
					cache: "no-store",
					...(body === undefined
						? {}
						: {
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify(body),
							}),
				},
			);
		} catch {
			if (signal.aborted) throw signal.reason;
			throw new ApiError(
				timeout.aborted
					? "Сервер не ответил вовремя. Проверьте соединение."
					: "Нет связи с GREEN-API. Проверьте интернет и apiUrl.",
			);
		}
		if (!response.ok) {
			const messages = {
				400: "Запрос отклонён. Проверьте данные и настройки инстанса (webhookUrl должен быть пустым).",
				401: "Неверные учётные данные. Проверьте idInstance и токен.",
				403: "Доступ запрещён. Проверьте токен, тариф и состояние инстанса.",
				429: "Слишком много запросов. Подождите перед повторной попыткой.",
				469: "Telegram временно ограничил поиск контактов. Попробуйте позже.",
			};
			throw new ApiError(
				messages[response.status] ??
					`Ошибка сервиса (HTTP ${response.status}). Попробуйте позже.`,
				response.status,
			);
		}
		const text = await response.text();
		if (!text.trim()) return null;
		try {
			return JSON.parse(text);
		} catch {
			throw new ApiError("Сервис вернул некорректный ответ.");
		}
	}
	async connect(signal) {
		const state = await this.request("getStateInstance", "GET", signal);
		if (state?.stateInstance !== "authorized")
			throw new Error(
				"Инстанс не готов. Авторизуйте Telegram в личном кабинете GREEN-API и проверьте его состояние.",
			);
		const settings = await this.request("getSettings", "GET", signal);
		if (settings?.webhookUrl)
			throw new Error(
				"Очистите webhookUrl в настройках инстанса, чтобы получать сообщения через HTTP API.",
			);
		if (settings?.incomingWebhook !== "yes")
			throw new Error(
				"Включите «Получать уведомления о входящих сообщениях и файлах» в настройках инстанса.",
			);
	}
	async resolvePhone(phone, signal) {
		const data = await this.request("checkAccount", "POST", signal, {
			phoneNumber: Number(phone),
		});
		if (data?.status === false)
			throw new Error(
				"Поиск контакта временно недоступен. Проверьте состояние инстанса и ограничения Telegram.",
			);
		if (!data?.exist || !data.chatId)
			throw new Error(
				"Аккаунт не найден или номер скрыт настройками приватности Telegram.",
			);
		return {
			id: String(data.chatId),
			title: data.username || `+${phone}`,
			phone,
		};
	}
	async send(chatId, message, signal) {
		const result = await this.request("sendMessage", "POST", signal, {
			chatId,
			message,
		});
		if (!result?.idMessage)
			throw new ApiError(
				"Не удалось подтвердить отправку. Проверьте чат в Telegram.",
			);
		return String(result.idMessage);
	}
	receive(signal) {
		return this.request(
			"receiveNotification",
			"GET",
			signal,
			undefined,
			"?receiveTimeout=25",
		);
	}
	async acknowledge(receiptId, signal) {
		await this.request(
			"deleteNotification",
			"DELETE",
			signal,
			undefined,
			`/${receiptId}`,
		);
	}
}
export const errorText = (error) =>
	error instanceof Error
		? error.message
		: "Произошла ошибка. Попробуйте ещё раз.";
