import { Send, LoaderCircle } from "lucide-react";
import { ErrorNotice } from "./ErrorNotice";
export function MessageComposer({
	draft,
	sending,
	sendError,
	onChange,
	onSend,
}) {
	function sendMessage(event) {
		event.preventDefault();
		onSend();
	}
	return (
		<div className="composer-area">
			{sendError && <ErrorNotice message={sendError} />}
			<form className="composer" onSubmit={sendMessage}>
				<textarea
					ref={focusInput}
					aria-label="Текст сообщения"
					placeholder="Написать сообщение…"
					value={draft}
					rows={1}
					maxLength={4096}
					onChange={(event) => onChange(event.target.value)}
					onKeyDown={(event) => {
						if (
							event.key === "Enter" &&
							!event.shiftKey &&
							!event.nativeEvent.isComposing
						) {
							event.preventDefault();
							event.currentTarget.form?.requestSubmit();
						}
					}}
				/>
				<button
					className="send-button"
					type="submit"
					disabled={!draft.trim() || sending}
					aria-label="Отправить сообщение"
				>
					{sending ? (
						<LoaderCircle className="spin" size={22} />
					) : (
						<Send size={22} />
					)}
				</button>
			</form>
			<div className="composer-hint">
				<span>Enter — отправить · Shift + Enter — новая строка</span>
				<span>{draft.length} / 4096</span>
			</div>
		</div>
	);
}

function focusInput(element) {
	element?.focus();
}
