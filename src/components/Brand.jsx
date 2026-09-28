import { MessageCircle } from "lucide-react";
export function Brand() {
	return (
		<div className="brand">
			<span className="brand-icon">
				<MessageCircle size={24} />
			</span>
			<span>
				Telegram<span className="brand-caption">GREEN-API CHAT</span>
			</span>
		</div>
	);
}
