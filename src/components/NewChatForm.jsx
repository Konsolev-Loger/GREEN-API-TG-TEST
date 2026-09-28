import { useState, useRef, useEffect } from "react";
import { LoaderCircle, X } from "lucide-react";
import { errorText } from "../api";
import { ErrorNotice } from "./ErrorNotice";
export function NewChatForm({ onCreate, onClose }) {
	const [phone, setPhone] = useState("");
	const [creating, setCreating] = useState(false);
	const [createError, setCreateError] = useState("");
	const phoneInput = useRef(null);
	const mounted = useRef(false);
	useEffect(() => {
		mounted.current = true;
		phoneInput.current?.focus();
		return () => {
			mounted.current = false;
		};
	}, []);
	async function createChat(event) {
		event.preventDefault();
		if (creating) return;
		setCreating(true);
		setCreateError("");
		try {
			await onCreate(phone);
			if (mounted.current) onClose();
		} catch (error) {
			if (mounted.current) setCreateError(errorText(error));
		} finally {
			if (mounted.current) setCreating(false);
		}
	}
	return (
		<form className="new-chat" onSubmit={createChat}>
			<div className="form-heading">
				<strong>Новый диалог</strong>
				<button
					type="button"
					className="icon-button"
					aria-label="Закрыть форму"
					onClick={onClose}
				>
					<X size={17} />
				</button>
			</div>
			<label>
				Номер телефона
				<input
					ref={phoneInput}
					type="tel"
					placeholder="+7 999 123-45-67"
					value={phone}
					onChange={(event) => setPhone(event.target.value)}
					required
					disabled={creating}
				/>
			</label>
			<p className="field-help">В международном формате, с кодом страны</p>
			{createError && <ErrorNotice message={createError} />}
			<button type="submit" className="primary" disabled={creating}>
				{creating ? (
					<>
						<LoaderCircle className="spin" size={17} /> Ищем аккаунт…
					</>
				) : (
					"Начать переписку"
				)}
			</button>
		</form>
	);
}
