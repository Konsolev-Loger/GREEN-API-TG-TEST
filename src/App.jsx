import { useState } from "react";
import { Login } from "./components/Login";
import { Workspace } from "./components/Workspace";
export function App() {
	const [api, setApi] = useState(null);
	return api ? (
		<Workspace api={api} onLogout={() => setApi(null)} />
	) : (
		<Login onConnect={setApi} />
	);
}
