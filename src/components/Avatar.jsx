export function Avatar({ title }) {
	return (
		<span className="avatar" aria-hidden="true">
			{title.replace(/^[@+]/, "").slice(0, 2).toUpperCase()}
		</span>
	);
}
