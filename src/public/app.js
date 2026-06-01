const container = document.getElementById("games");

async function loadGameList() {
	const response = await fetch("/games.txt");

	if (!response.ok) {
		throw new Error("Failed to load games.txt");
	}

	const text = await response.text();

	return text
		.split("\n")
		.map(line => line.trim())
		.filter(line => line.length > 0);
}

async function searchSteam(name) {
	const response = await fetch(
		`/api/search-steam?name=${encodeURIComponent(name)}`
	);

	if (!response.ok) {
		throw new Error("Steam search failed");
	}

	return await response.json();
}

/* ---------- render helpers ---------- */

function renderHeader(text) {
	const h = document.createElement("h2");
	h.textContent = text.replace(/^#\s*/, "");
	container.appendChild(h);
}

function renderSmallText(text) {
	const div = document.createElement("div");
	div.textContent = text.replace(/^-+\s*/, "");
	div.style.fontSize = "0.95rem";
	div.style.opacity = "0.8";
	div.style.margin = "6px 0";
	container.appendChild(div);
}

function renderGameTitle(text) {
	const div = document.createElement("div");
	div.textContent = text;
	div.style.fontWeight = "bold";
	div.style.margin = "10px 0 5px 0";
	container.appendChild(div);
}

function renderGameWidget(appid) {
	const iframe = document.createElement("iframe");
	iframe.src = `https://store.steampowered.com/widget/${appid}/`;
	iframe.width = "646";
	iframe.height = "190";
	iframe.frameBorder = "0";

	container.appendChild(iframe);
}

/* ---------- main loader ---------- */

async function loadGames() {
	const lines = await loadGameList();

	for (const line of lines) {

		// comment line
		if (line.startsWith("//")) {
			continue;
		}

		// header
		if (line.startsWith("#")) {
			renderHeader(line);
			continue;
		}

		// small label
		if (line.startsWith("-")) {
			renderSmallText(line);
			continue;
		}

		// steam game
		try {
			const results = await searchSteam(line);

			if (!results.length) {
				console.warn(`No result for ${line}`);
				continue;
			}

			const game = results[0];

			renderGameTitle(game.appName);
			renderGameWidget(game.appid);
		}
		catch (err) {
			console.error(`Failed to load ${line}`, err);
		}
	}
}

loadGames();