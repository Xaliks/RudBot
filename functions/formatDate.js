/**
 * Формат даты
 *
 * %day - "01"
 * %month - "01"
 * %year - "1970"
 *
 * %sec - "00"
 * %min - "00"
 * %hour - "00"
 *
 * %fullDate - "%day.%month.%year"
 * %fullTime - "%sec:%min:%hour"
 * %full - "%fullDate в %fullTime"
 *
 * %dayOfWeek - "Понедельник"
 *
 * @param {Number | String} date
 * @param {String | Undefined} format
 * @returns Дата
 */
module.exports = (date, format = "%fullDate / %fullTime (%dayOfWeek)") => {
	const Time = String(new Date(date).toLocaleString("ru-RU", { timeZone: "Europe/Moscow" }));
	const Time2 = new Date(date);

	const fullDate = Time.split(", ")[0];
	const fullTime = Time.split(", ")[1];
	const full = `${fullDate} в ${fullTime}`;

	const d = fullDate.split(".");
	const s = fullTime.split(":");

	return format
		.replace(/%fullDate+/g, fullDate)
		.replace(/%fullTime+/g, fullTime)
		.replace(/%full+/g, full)

		.replace(
			/%dayOfWeek+/g,
			["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"][
				Time2.getDay()
			],
		)

		.replace(/%day+/g, d[0])
		.replace(/%month+/g, d[1])
		.replace(/%year+/g, d[2])
		.replace(/%sec+/g, s[0])
		.replace(/%min+/g, s[1])
		.replace(/%hour+/g, s[2]);
};
