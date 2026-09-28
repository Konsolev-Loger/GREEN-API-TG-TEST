import { ArrowLeft, MessageCircle } from "lucide-react";
import { formatDate } from "../format-date";
import { Avatar } from "./Avatar";
import { MessageBubble } from "./MessageBubble";
import { MessageComposer } from "./MessageComposer";
export function Conversation({
	active,
	draft,
	sending,
	sendError,
	onChangeDraft,
	onSend,
	onBack,
}) {
	return (
		<>
			<header className="conversation-header">
				<button
					type="button"
					className="icon-button mobile-back"
					aria-label="К списку чатов"
					onClick={() => onBack()}
				>
					<ArrowLeft size={22} />
				</button>
				<Avatar title={active.title} />
				<div>
					<h2>{active.title}</h2>
					<p>{active.phone ? `+${active.phone} · ` : ""}Telegram</p>
				</div>
			</header>
			<div
				className="messages"
				role="log"
				aria-label="Сообщения"
				aria-live="polite"
			>
				{active.messages.length === 0 && (
					<div className="conversation-start">
						<MessageCircle size={28} />
						<h3>Начните разговор</h3>
						<p>
							Напишите первое сообщение.
							<br />
							Ответ появится здесь автоматически.
						</p>
					</div>
				)}
				{active.messages.map((message, index) => (
					<div key={message.id}>
						{(index === 0 ||
							formatDate(message.timestamp) !==
								formatDate(active.messages[index - 1].timestamp)) && (
							<div className="date-divider">
								<span>{formatDate(message.timestamp)}</span>
							</div>
						)}
						<MessageBubble message={message} />
					</div>
				))}
				<div
					key={active.id + ":" + active.messages.length}
					ref={scrollToBottom}
				/>
			</div>
			<MessageComposer
				key={active.id}
				draft={draft}
				sending={sending}
				sendError={sendError}
				onChange={onChangeDraft}
				onSend={onSend}
			/>
		</>
	);
}

function scrollToBottom(element) {
	element?.scrollIntoView({ block: "end" });
}
