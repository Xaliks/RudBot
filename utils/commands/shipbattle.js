module.exports = async (interaction, bot) => {
	const { values } = interaction;
	const [_, type, authorId, userId] = interaction.customId.split("-");

	const temp = bot.temp.get(`shipbattle-${authorId}-${userId}`);
	if (!temp)
		return interaction.reply({
			content: "Что-то прозошло! Возможно, у противника закрыт ЛС, либо бот перезагрузился",
			ephemeral: true,
		});

	let [PlayerMessage, Player2Message, generateMap, playerHits, player2Hits, playerShips, player2Ships, coords = null] =
		temp;

	// Буквы
	const options1 = PlayerMessage.components[0].components[0].options;
	// Цифры
	const options2 = PlayerMessage.components[1].components[0].options;

	interaction.deferUpdate();

	// выбор вуквы
	if (type === "letter") {
		// выключение кнопки выбора буквы (y)
		PlayerMessage.components[0].components[0].setDisabled(true);
		PlayerMessage.components[1].components[0].setDisabled(false);

		// запись
		temp[7] = values[0];
		bot.temp.set(`shipbattle-${authorId}-${userId}`, temp);

		// редактирование меню
		PlayerMessage.components[1].components[0].options = generateOptionsByY(player2Hits, Number(values[0]));
		PlayerMessage.edit({ content: "\n", components: PlayerMessage.components, embeds: PlayerMessage.embeds });
	}
	// выбор цифры
	else {
		// определение координат
		const stringCoords = values[0] + temp[7];
		coords = Number(stringCoords);
		// запись в массив с попаданиями
		player2Hits.push(coords);

		// генерация карты для игрока
		PlayerMessage.embeds[0].description = generateMap(playerShips, playerHits, true);
		PlayerMessage.embeds[1].description = generateMap(player2Ships, player2Hits, false);
		// генерация карты для противника
		Player2Message.embeds[0].description = generateMap(player2Ships, player2Hits, true);
		Player2Message.embeds[1].description = generateMap(playerShips, playerHits, false);

		// выключение выбора цифры
		PlayerMessage.components[1].components[0].setDisabled(true);

		// проверка на попадение
		if (player2Ships[coords] === "1") {
			// проверка на конец игры
			if (isEnd(player2Ships, player2Hits)) {
				// отправление отчёта
				PlayerMessage.channel.send({ content: `${coordsToEmojis(coords)} Попадание! Поздравляю, Вы победили!` });
				Player2Message.channel.send({ content: `${coordsToEmojis(coords)} Попадание в ваш корабль! Противник победил!` });

				// удаление выбора для игрока и противника
				PlayerMessage.components = [];
				Player2Message.components = [];

				// редактирование сообщений
				PlayerMessage.edit({ content: "\n", components: PlayerMessage.components, embeds: PlayerMessage.embeds });
				Player2Message.edit({ content: "\n", components: Player2Message.components, embeds: Player2Message.embeds });

				// удаление данных
				return bot.temp.delete(`shipbattle-${authorId}-${userId}`);
			}

			// отправление отчёта
			PlayerMessage.channel.send({ content: `${coordsToEmojis(coords)} Попадание! Вы ходите ещё раз!` }).then((msg) => {
				setTimeout(() => msg.delete(), 2500);
			});
			Player2Message.channel
				.send({ content: `${coordsToEmojis(coords)} Попадание в ваш корабль! Противник ходит еще раз!` })
				.then((msg) => {
					setTimeout(() => msg.delete(), 2500);
				});

			// выключение выбора буквы
			PlayerMessage.components[0].components[0].setDisabled(false);

			// запись
			temp[4] = player2Hits;
		}
		// проверка на промах
		else {
			// отправление отчёта
			PlayerMessage.channel.send({ content: `${coordsToEmojis(coords)} Мимо!` }).then((msg) => {
				setTimeout(() => msg.delete(), 2500);
			});
			Player2Message.channel.send({ content: `${coordsToEmojis(coords)} Мимо! Теперь ваш ход` }).then((msg) => {
				setTimeout(() => msg.delete(), 2500);
			});

			// включение выбора для противника
			Player2Message.components[0].components[0].setDisabled(false);
			Player2Message.components[1].components[0].setDisabled(true);

			// замена имени хода
			PlayerMessage.embeds[0].author.name = "Ход Противника. Ожидайте";
			Player2Message.embeds[0].author.name = "Ваш ход";

			// запись
			temp[0] = Player2Message;
			temp[1] = PlayerMessage;
			temp[3] = player2Hits;
			temp[4] = playerHits;
			temp[5] = player2Ships;
			temp[6] = playerShips;
		}

		// запись
		temp[7] = null;
		bot.temp.set(`shipbattle-${authorId}-${userId}`, temp);

		// редактирование сообщений
		PlayerMessage.components[0].components[0].options = generateOptions(player2Hits);
		Player2Message.edit({ content: "\n", components: Player2Message.components, embeds: Player2Message.embeds });
		PlayerMessage.edit({ content: "\n", components: PlayerMessage.components, embeds: PlayerMessage.embeds });

		function coordsToEmojis() {
			const yE = options1.find((opt) => opt.value === stringCoords[1]).emoji;
			const xE = options2.find((opt) => opt.value === stringCoords[0]).emoji;

			if (yE.id) return `<:${yE.name}:${yE.id}>` + xE.name;

			return yE.name + xE.name;
		}
	}

	function generateOptionsByY(hits, y) {
		let options = options2;

		for (let x = 0; x < 10; ++x) {
			if (hits.includes(Number(String(y) + x))) {
				options = options.filter((o) => o.value != x);
			}
		}

		return options;
	}

	function generateOptions(hits) {
		let options = options1;

		for (let y = 0; y < 10; ++y) {
			let i = 0;

			for (let x = 0; x < 10; ++x) {
				if (hits.includes(Number(String(y) + x))) ++i;
			}

			if (i === 10) options = options.filter((o) => o.value != y);
		}

		return options;
	}

	function isEnd(ships, hits) {
		let res = true;

		ships
			.map((s, i) => (s === "1" ? i : false))
			.filter((a) => a != false)
			.forEach((ship) => {
				if (!hits.includes(ship)) res = false;
			});

		return res;
	}
};
