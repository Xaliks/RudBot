const plural = require("../functions/plural");

/**
 * @param {Number} number Время в миллисекундах
 * @returns {String}
 */
module.exports = (number, options) => {
	if (!options) options = { relative: false };

	const ms = Math.abs(number);
	const seconds = Math.floor((ms / 1000) % 60);
	const minutes = Math.floor((ms / 1000 / 60) % 60);
	const hours = Math.floor((ms / 1000 / 60 / 60) % 24);
	const days = Math.floor((ms / 1000 / 60 / 60 / 24) % 30);
	const months = Math.floor((ms / 1000 / 60 / 60 / 24 / 30) % 12);
	const years = Math.floor((ms / 1000 / 60 / 60 / 24 / 30 / 12) % 100);
	let text = [];

	if (years > 0) text.push(time("y", years));
	if (months > 0) text.push(time("m", months));
	if (days > 0) text.push(time("d", days));
	if (hours > 0) text.push(time("h", hours));
	if (minutes > 0) text.push(time("min", minutes));
	if (seconds > 0) text.push(time("s", seconds));

	if (options.relative) {
		const tmp = ["", ""];
		if (number > 0) tmp[0] = "Через ";
		else tmp[1] = " назад";
		let txt = `${tmp[0]}{text}${tmp[1]}`;

		if (text.length === 0) return time("ms", ms);
		if (text.length === 1) return txt.replace("{text}", text[0]);
		if (text.length >= 2) {
			if (text.length > 2 && number > 0)
				return txt.replace("{text}", `${text[0]}, ${text[1]} и ${text[2]}`);
			return txt.replace("{text}", `${text[0]} и ${text[1]}`);
		}
	}
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
		if (options.relative) {
			if (name === "min") data.min[0] = "минуту";
			if (name === "s") data.min[0] = "секунду";
			if (name === "ms") data.ms[0] = "миллисекунду";
			return plural(time, data[name]);
		}
		return plural(time, data[name]);
	}
};
