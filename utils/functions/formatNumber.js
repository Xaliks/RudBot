module.exports = (number) => {
	return new Intl.NumberFormat("ru-RU").format(number);
};
