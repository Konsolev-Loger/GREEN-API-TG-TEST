import { LogOut, Plus } from "lucide-react";
import { Brand } from "./Brand";
import { NewChatForm } from "./NewChatForm";
import { ChatList } from "./ChatList";
export function Sidebar({
	chats,
	activeId,
	pollError,
	newChat,
	onCreate,
	onCloseNewChat,
	onToggleNewChat,
	onSelect,
	onLogout,
}) {
	return (
		<aside className="sidebar" aria-label="Список чатов">
			<header className="sidebar-header">
				<Brand />
				<button
					type="button"
					className="icon-button"
					title="Выйти и очистить переписку в этой вкладке"
					aria-label="Выйти"
					onClick={onLogout}
				>
					<LogOut size={20} />
				</button>
			</header>
			<div className="sidebar-heading">
				<h1>
					Сообщения <span>{chats.length}</span>
				</h1>
				<button
					type="button"
					className="icon-button blue"
					title="Новый чат"
					aria-label="Новый чат"
					onClick={onToggleNewChat}
				>
					<Plus size={23} />
				</button>
			</div>
			{newChat && <NewChatForm onCreate={onCreate} onClose={onCloseNewChat} />}

			<ChatList chats={chats} activeId={activeId} onSelect={onSelect} />
			<footer className="sidebar-footer">
				<span className={`connection-dot ${pollError ? "warning" : ""}`} />
				<span>
					{pollError ? "Получение приостановлено" : "Telegram подключён"}
				</span>
			</footer>
		</aside>
	);
}
