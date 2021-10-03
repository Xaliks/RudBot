const regex =
	/(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|мс|мсек|мил|миллисекунда?|миллисекунды|seconds?|secs?|s|с|сек|секунда?|секунды|minutes?|mins?|мин|минуты?|минута|hours?|hrs?|h|ч|часа?|часов|days?|d|д|дня?|день?|дней|weeks?|w|н|нед|неделя?|недели|недель|years?|yrs?|y|г|года?|лет)/gi;

module.exports = (time) => {
	const match = Array.from(time.matchAll(regex)).map((m) => m.slice(1, 3));
	if (!match[0]) return undefined;
	const tmp = [];
	match.map((mat) => {
		const n = parseFloat(mat[0]);
		const type = (mat[1] || "ms").toLowerCase();

		switch (type) {
			case "years":
			case "year":
			case "yrs":
			case "yr":
			case "y":
			case "г":
			case "года":
			case "лет":
			case "год":
				tmp.push(n * 1000 * 60 * 60 * 24 * 365.25);
				break;
			case "weeks":
			case "week":
			case "w":
			case "нед":
			case "неделя":
			case "недели":
			case "недель":
			case "недел":
				tmp.push(n * 1000 * 60 * 60 * 24 * 7);
				break;
			case "days":
			case "day":
			case "d":
			case "дня":
			case "день":
			case "дней":
			case "дн":
			case "ден":
			case "д":
				tmp.push(n * 1000 * 60 * 60 * 24);
				break;
			case "hours":
			case "hour":
			case "hrs":
			case "hr":
			case "h":
			case "ч":
			case "часа":
			case "часов":
			case "час":
				tmp.push(n * 1000 * 60 * 60);
				break;
			case "minutes":
			case "minute":
			case "mins":
			case "min":
			case "мин":
			case "минуты":
			case "минута":
			case "минут":
				tmp.push(n * 1000 * 60);
				break;
			case "seconds":
			case "second":
			case "secs":
			case "sec":
			case "s":
			case "с":
			case "сек":
			case "секунда":
			case "секунды":
			case "секунд":
				tmp.push(n * 1000);
				break;
			case "milliseconds":
			case "millisecond":
			case "msecs":
			case "msec":
			case "ms":
			case "мсек":
			case "мил":
			case "миллисекунда":
			case "миллисекунды":
			case "миллисекунд":
			case "мс":
				tmp.push(n);
				break;
			default:
				break;
		}
	});
	return tmp.reduce((a, b) => a + b);
};
