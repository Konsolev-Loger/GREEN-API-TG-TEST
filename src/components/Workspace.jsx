import { useState } from "react";
import { useChat } from "../hooks/useChat";
import { Conversation } from "./Conversation";
import { ErrorNotice } from "./ErrorNotice";
import { Sidebar } from "./Sidebar";
import { Welcome } from "./Welcome";
export function Workspace({ api, onLogout }) {
	const chat = useChat(api);
	const [newChat, setNewChat] = useState(true);
	function logout() {
		chat.disconnect();
		onLogout();
	}
	return (
		<main className={"workspace " + (chat.active ? "has-active" : "")}>
			<Sidebar
				chats={chat.chats}
				activeId={chat.active?.id}
				pollError={chat.pollError}
				newChat={newChat}
				onCreate={chat.openChat}
				onCloseNewChat={() => setNewChat(false)}
				onToggleNewChat={() => setNewChat((value) => !value)}
				onSelect={chat.selectChat}
				onLogout={logout}
			/>
			<section className="conversation" aria-label="Переписка">
				{chat.pollError && (
					<div className="poll-error">
						<ErrorNotice message={chat.pollError} />
					</div>
				)}
				{chat.active ? (
					<Conversation
						active={chat.active}
						draft={chat.draft}
						sending={chat.sending}
						sendError={chat.sendError}
						onChangeDraft={chat.changeDraft}
						onSend={chat.sendMessage}
						onBack={() => chat.selectChat(null)}
					/>
				) : (
					<Welcome onNewChat={() => setNewChat(true)} />
				)}
			</section>
		</main>
	);
}
