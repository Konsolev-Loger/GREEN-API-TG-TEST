import { MessageCircle, Plus } from "lucide-react";
export function Welcome({ onNewChat }) {
	return (
		<div className="welcome">
			<span className="welcome-icon">
				<MessageCircle size={38} />
			</span>
			<h2>Разговор начинается здесь</h2>
			<p>
				Выберите диалог или добавьте собеседника,
				<br />
				чтобы отправить сообщение в Telegram.
			</p>
			<button type="button" className="primary" onClick={onNewChat}>
				<Plus size={18} /> Новый диалог
			</button>
			<span className="welcome-footnote">
				Только текст. Всё необходимое для общения.
			</span>
		</div>
	);
}
