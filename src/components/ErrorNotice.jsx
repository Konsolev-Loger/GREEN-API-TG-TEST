import { CircleAlert } from "lucide-react";
export function ErrorNotice({ message }) {
	return (
		<div className="error" role="alert">
			<CircleAlert size={18} />
			<span>{message}</span>
		</div>
	);
}
