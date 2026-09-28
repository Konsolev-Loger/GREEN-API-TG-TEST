import { Check, Clock3, CircleAlert } from "lucide-react";
import { formatTime } from "../format-date";
export function MessageBubble({ message }) {
	const status = {
		received: "",
		sending: "Отправляется",
		queued: "В очереди отправки",
		uncertain: "Отправка не подтверждена",
	}[message.status];
	return (
		<article
			className={`message ${message.outgoing ? "outgoing" : "incoming"} ${message.status === "uncertain" ? "uncertain" : ""}`}
		>
			<p>{message.text}</p>
			<div className="message-meta">
				<time dateTime={new Date(message.timestamp).toISOString()}>
					{formatTime(message.timestamp)}
				</time>
				{message.outgoing && (
					<span role="img" title={status} aria-label={status}>
						{message.status === "sending" ? (
							<Clock3 size={13} />
						) : message.status === "uncertain" ? (
							<CircleAlert size={14} />
						) : (
							<Check size={14} />
						)}
					</span>
				)}
			</div>
			{message.status === "uncertain" && (
				<small>Отправка не подтверждена</small>
			)}
		</article>
	);
}
