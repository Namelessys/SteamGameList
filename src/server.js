const express = require("express");
const path = require("path");

const app = express();
const PORT = 53789;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/search-steam", async (req, res) => {
	try {
		const name = req.query.name;

		if (!name) {
			return res.status(400).json({
				error: "Missing game name"
			});
		}

		const response = await fetch(
			`https://steamcommunity.com/actions/SearchApps/${encodeURIComponent(name)}`
		);

		if (!response.ok) {
			throw new Error(`Steam returned ${response.status}`);
		}

		const results = await response.json();

		res.json(results);
	}
	catch (err) {
		console.error(err);

		res.status(500).json({
			error: "Failed to search Steam"
		});
	}
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});