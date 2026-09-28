import { MessageCircle } from "lucide-react";
import { Avatar } from "./Avatar";
import { formatTime } from "../format-date";
export function ChatList({ chats, activeId, onSelect }) {
	return (
		<div className="chat-list">
			{chats.length === 0 ? (
				<div className="empty-list">
					<MessageCircle size={30} />
					<strong>Пока нет диалогов</strong>
					<p>Добавьте собеседника по номеру телефона.</p>
				</div>
			) : (
				chats.map((chat) => {
					const last = chat.messages.at(-1);
					return (
						<button
							type="button"
							key={chat.id}
							className={`chat-item ${activeId === chat.id ? "selected" : ""}`}
							onClick={() => onSelect(chat.id)}
							aria-current={activeId === chat.id ? "true" : undefined}
						>
							<Avatar title={chat.title} />
							<span className="chat-summary">
								<span className="chat-title">{chat.title}</span>
								<span className="preview-text">
									{last
										? `${last.outgoing ? "Вы: " : ""}${last.text}`
										: "Начните разговор"}
								</span>
							</span>
							<span className="chat-meta">
								{last && <time>{formatTime(last.timestamp)}</time>}
								{chat.unread > 0 && (
									<span
										role="img"
										className="unread"
										aria-label={`${chat.unread} непрочитанных`}
									>
										{chat.unread}
									</span>
								)}
							</span>
						</button>
					);
				})
			)}
		</div>
	);
}
