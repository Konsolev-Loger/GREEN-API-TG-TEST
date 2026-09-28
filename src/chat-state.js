export const initialState = { chats: [], activeId: null };
export function chatReducer(state, action) {
	switch (action.type) {
		case "open": {
			const found = state.chats.some((chat) => chat.id === action.chat.id);
			const chats = found
				? state.chats.map((chat) =>
						chat.id === action.chat.id
							? { ...chat, ...action.chat, unread: 0 }
							: chat,
					)
				: [{ ...action.chat, messages: [], unread: 0 }, ...state.chats];
			return { chats, activeId: action.chat.id };
		}
		case "select":
			return {
				activeId: action.id,
				chats: state.chats.map((chat) =>
					chat.id === action.id ? { ...chat, unread: 0 } : chat,
				),
			};
		case "sending":
			return {
				...state,
				chats: state.chats.map((chat) =>
					chat.id === action.chatId
						? { ...chat, messages: [...chat.messages, action.message] }
						: chat,
				),
			};
		case "sent":
			return updateMessage(state, action.chatId, action.temporaryId, {
				id: action.id,
				status: "queued",
			});
		case "uncertain":
			return updateMessage(state, action.chatId, action.id, {
				status: "uncertain",
			});
		case "incoming": {
			const body = action.body;
			if (
				body.typeWebhook !== "incomingMessageReceived" ||
				!body.senderData?.chatId ||
				!body.idMessage
			)
				return state;
			const data = body.messageData;
			const text =
				data?.typeMessage === "textMessage"
					? data.textMessageData?.textMessage
					: data?.typeMessage === "extendedTextMessage"
						? data.extendedTextMessageData?.text
						: undefined;
			if (typeof text !== "string") return state;
			const id = String(body.senderData.chatId);
			const current = state.chats.find((chat) => chat.id === id);
			if (
				current?.messages.some(
					(message) => message.id === String(body.idMessage),
				)
			)
				return state;
			const message = {
				id: String(body.idMessage),
				text,
				timestamp: (body.timestamp ?? Date.now() / 1000) * 1000,
				outgoing: false,
				status: "received",
			};
			const chat = current ?? {
				id,
				title:
					body.senderData.chatName ||
					body.senderData.senderContactName ||
					body.senderData.senderName ||
					id,
				messages: [],
				unread: 0,
			};
			const updated = {
				...chat,
				messages: [...chat.messages, message],
				unread: state.activeId === id ? 0 : chat.unread + 1,
			};
			return {
				...state,
				chats: [updated, ...state.chats.filter((item) => item.id !== id)],
			};
		}
		default:
			return state;
	}
}

function updateMessage(state, chatId, id, changes) {
	return {
		...state,
		chats: state.chats.map((chat) =>
			chat.id !== chatId
				? chat
				: {
						...chat,
						messages: chat.messages.map((message) =>
							message.id === id ? { ...message, ...changes } : message,
						),
					},
		),
	};
}
