/**
 * @param {Number} number
 * @param {String} titles
 * @returns {String}
 */
module.exports = (number, titles, TFnumber = true) => {
	number = Number(number);
	let number1 = number;
	number = Math.abs(number);
	const cases = [2, 0, 1, 1, 1, 2];
	return `${TFnumber === true ? `${number1} ` : ""}${
		titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]]
	}`;
};
