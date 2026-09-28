import { ArrowRight, ChevronDown, KeyRound, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { errorText, GreenApi } from "../api";
import { ErrorNotice } from "./ErrorNotice";
export function LoginForm({ onConnect }) {
	const [credentials, setCredentials] = useState({
		apiUrl: "https://4100.api.green-api.com",
		idInstance: "",
		apiTokenInstance: "",
	});
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const controller = useRef(null);
	useEffect(() => () => controller.current?.abort(), []);
	const change = (key, value) =>
		setCredentials((current) => ({ ...current, [key]: value }));
	async function submit(event) {
		event.preventDefault();
		if (busy) return;
		setError("");
		setBusy(true);
		const request = new AbortController();
		controller.current = request;
		try {
			const client = new GreenApi(credentials);
			await client.connect(request.signal);
			if (!request.signal.aborted) onConnect(client);
		} catch (error) {
			if (!request.signal.aborted) setError(errorText(error));
		} finally {
			if (!request.signal.aborted) setBusy(false);
		}
	}
	return (
		<section className="login-card" aria-labelledby="login-title">
			<div className="card-icon">
				<KeyRound size={26} />
			</div>
			<h2 id="login-title">Подключение к чату</h2>
			<p className="muted">
				Введите данные Telegram-инстанса
				<br />
				из личного кабинета GREEN-API.
			</p>
			<form onSubmit={submit}>
				<label>
					ID инстанса
					<input
						value={credentials.idInstance}
						onChange={(event) => change("idInstance", event.target.value)}
						inputMode="numeric"
						placeholder="Например, 4100123456"
						required
						autoComplete="off"
						disabled={busy}
					/>
				</label>
				<label>
					Токен доступа
					<input
						value={credentials.apiTokenInstance}
						onChange={(event) => change("apiTokenInstance", event.target.value)}
						type="password"
						placeholder="apiTokenInstance"
						required
						autoComplete="off"
						disabled={busy}
					/>
				</label>
				<details>
					<summary>
						Адрес сервера API <ChevronDown size={16} />
					</summary>
					<label className="api-label">
						apiUrl
						<input
							type="url"
							value={credentials.apiUrl}
							onChange={(event) => change("apiUrl", event.target.value)}
							required
							disabled={busy}
						/>
					</label>
					<p className="field-help">
						Если адрес отличается, скопируйте apiUrl из кабинета.
					</p>
				</details>
				{error && <ErrorNotice message={error} />}
				<button className="primary connect" disabled={busy} type="submit">
					{busy ? (
						<>
							<LoaderCircle className="spin" size={19} /> Проверяем подключение…
						</>
					) : (
						<>
							Открыть чат <ArrowRight size={19} />
						</>
					)}
				</button>
			</form>
			<p className="setup-note">
				Перед подключением авторизуйте Telegram, включите входящие уведомления и
				оставьте webhookUrl пустым.
			</p>
		</section>
	);
}
