import { ArrowRight, ShieldCheck } from "lucide-react";
import { Brand } from "./Brand";
import { LoginForm } from "./LoginForm";
export function Login({ onConnect }) {
	return (
		<div className="login-page">
			<header className="login-header">
				<Brand />
				<a
					href="https://console.green-api.com/"
					target="_blank"
					rel="noreferrer"
				>
					Личный кабинет <ArrowRight size={16} />
				</a>
			</header>
			<main className="login-layout">
				<section className="intro">
					<span className="eyebrow">ВАШИ ДИАЛОГИ. ОДНО ОКНО.</span>
					<h1>
						На связи.
						<br />
						<span>В Telegram.</span>
					</h1>
					<p>Подключите свой аккаунт и начните переписку по номеру телефона.</p>
					<div className="intro-steps">
						<div>
							<span>01</span> Подключите GREEN-API
						</div>
						<div>
							<span>02</span> Добавьте собеседника
						</div>
						<div>
							<span>03</span> Отправьте первое сообщение
						</div>
					</div>
					<div className="privacy">
						<ShieldCheck size={20} />
						<span>
							Токен хранится только в этой вкладке
							<br />и не сохраняется после её закрытия.
						</span>
					</div>
				</section>
				<LoginForm onConnect={onConnect} />
			</main>
			<footer className="login-footer">
				<span>Текстовые сообщения через GREEN-API</span>
				<span>React · JavaScript</span>
			</footer>
		</div>
	);
}
