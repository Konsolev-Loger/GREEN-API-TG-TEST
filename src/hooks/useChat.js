import { useEffect, useReducer, useRef, useState } from "react";
import { errorText, normalizePhone } from "../api";
import { chatReducer, initialState } from "../chat-state";
import { pollNotifications } from "../polling";

export function useChat(api) {
	const [state, dispatch] = useReducer(chatReducer, initialState);
	const [pollError, setPollError] = useState(null);
	const [drafts, setDrafts] = useState({});
	const [sendErrors, setSendErrors] = useState({});
	const pendingChats = useRef(new Set());
	const session = useRef(null);
	const active = state.chats.find((chat) => chat.id === state.activeId);
	const draft = drafts[state.activeId] ?? "";

	useEffect(() => {
		const controller = new AbortController();
		session.current = controller;
		void pollNotifications(
			api,
			controller.signal,
			(body) => dispatch({ type: "incoming", body }),
			setPollError,
		);
		return () => controller.abort();
	}, [api]);

	async function openChat(phone) {
		const signal = session.current.signal;
		const digits = normalizePhone(phone);
		const existing = state.chats.find((chat) => chat.phone === digits);
		const chat = existing ?? (await api.resolvePhone(digits, signal));
		signal.throwIfAborted();
		dispatch({ type: "open", chat });
	}

	function changeDraft(value) {
		setDrafts((current) => ({ ...current, [state.activeId]: value }));
	}

	async function sendMessage() {
		if (
			!active ||
			pendingChats.current.has(active.id) ||
			!draft.trim() ||
			draft.length > 4096
		)
			return;
		const signal = session.current.signal;
		if (signal.aborted) return;
		const chatId = active.id;
		const text = draft.trim();
		const temporaryId = crypto.randomUUID();
		pendingChats.current.add(chatId);
		setSendErrors((current) => ({ ...current, [chatId]: "" }));
		setDrafts((current) => ({ ...current, [chatId]: "" }));
		dispatch({
			type: "sending",
			chatId,
			message: {
				id: temporaryId,
				text,
				outgoing: true,
				timestamp: Date.now(),
				status: "sending",
			},
		});
		try {
			const id = await api.send(chatId, text, signal);
			if (!signal.aborted) dispatch({ type: "sent", chatId, temporaryId, id });
		} catch (error) {
			if (!signal.aborted) {
				dispatch({ type: "uncertain", chatId, id: temporaryId });
				setSendErrors((current) => ({
					...current,
					[chatId]:
						errorText(error) +
						" Перед повторной отправкой проверьте Telegram: сообщение могло быть принято.",
				}));
			}
		} finally {
			pendingChats.current.delete(chatId);
		}
	}

	return {
		chats: state.chats,
		active,
		draft,
		pollError,
		sendError: sendErrors[state.activeId] ?? "",
		sending:
			active?.messages.some((message) => message.status === "sending") ?? false,
		openChat,
		sendMessage,
		changeDraft,
		selectChat: (id) => dispatch({ type: "select", id }),
		disconnect: () => session.current?.abort(),
	};
}
