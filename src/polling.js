import { ApiError, errorText } from "./api";
export function delay(ms, signal) {
	return new Promise((resolve) => {
		if (signal.aborted) return resolve();
		const finish = () => {
			clearTimeout(timer);
			signal.removeEventListener("abort", finish);
			resolve();
		};
		const timer = setTimeout(finish, ms);
		signal.addEventListener("abort", finish, { once: true });
	});
}
/** One consumer: process first, acknowledge second. A failed ack is retried before receiving again. */
export async function pollNotifications(
	api,
	signal,
	onMessage,
	onStatus,
	wait = delay,
) {
	let failures = 0;
	let pending = null;
	while (!signal.aborted) {
		try {
			if (pending === null) {
				const notification = await api.receive(signal);
				if (signal.aborted) return;
				if (notification) {
					onMessage(notification.body);
					pending = notification.receiptId;
				}
			}
			if (pending !== null) {
				await api.acknowledge(pending, signal);
				pending = null;
			}
			if (signal.aborted) return;
			failures = 0;
			onStatus(null);
			await wait(300, signal);
		} catch (error) {
			if (signal.aborted) return;
			const terminal =
				error instanceof ApiError && [400, 401, 403].includes(error.status);
			onStatus(
				`${errorText(error)} ${terminal ? "Исправьте настройки и подключитесь заново." : "Повторяем подключение автоматически."}`,
			);
			if (terminal) return;
			failures += 1;
			await wait(Math.min(1000 * 2 ** Math.min(failures, 5), 30_000), signal);
		}
	}
}
