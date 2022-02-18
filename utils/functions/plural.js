module.exports = (number, titles, showNumber = true) => {
	let number1 = Number(number);
	number = Math.abs(number);

	const cases = [2, 0, 1, 1, 1, 2];

	return `${showNumber === true ? `${number1} ` : ""}${
		titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]]
	}`;
};
