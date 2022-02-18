const plural = require("./plural");

module.exports = (number) => {
	const ms = Math.abs(number);
	const seconds = Math.floor((ms / 1000) % 60);
	const minutes = Math.floor((ms / 1000 / 60) % 60);
	const hours = Math.floor((ms / 1000 / 60 / 60) % 24);
	const days = Math.floor((ms / 1000 / 60 / 60 / 24) % 30);
	const months = Math.floor((ms / 1000 / 60 / 60 / 24 / 30) % 12);
	const years = Math.floor((ms / 1000 / 60 / 60 / 24 / 30 / 12) % 100);

	const text = [];

	if (years > 0) text.push(time("y", years));
	if (months > 0) text.push(time("m", months));
	if (days > 0) text.push(time("d", days));
	if (hours > 0) text.push(time("h", hours));
	if (minutes > 0) text.push(time("min", minutes));
	if (seconds > 0) text.push(time("s", seconds));

	if (text.length === 0) return time("ms", ms);
	if (text.length === 1) return text[0];
	if (text.length === 2) return `${text[0]} и ${text[1]}`;
	return `${text[0]}, ${text[1]} и ${text[2]}`;

	function time(name, time) {
		const data = {
			y: ["год", "года", "лет"],
			m: ["месяц", "месяца", "месяцев"],
			d: ["день", "дня", "дней"],
			h: ["час", "часа", "часов"],
			min: ["минута", "минуты", "минут"],
			s: ["секунда", "секунды", "секунд"],
			ms: ["миллисекунда", "миллисекунды", "миллисекунд"],
		};

		return plural(time, data[name]);
	}
};
