module.exports = {
	name: "menu",
	category: "botowner",
	async execute(message, args, bot) {
		const msg = await message.channel.send({
			content: "а",
			components: [
				{
					type: 1,
					components: [
						{
							type: 3,
							custom_id: "class_select_1",
							options: [
								{
									label: "Желтый цвет",
									value: "yellow",
									description: "Взять себе желтый цвет",
									emoji: "🟡",
								},
								{
									label: "Черный цвет",
									value: "black",
									description: "Взять себе черный цвет",
									emoji: "👾",
								},
							],
							placeholder: "Выберите роль",
							min_values: 1,
						},
					],
				},
			],
		});

		const collect = msg.createMessageComponentCollector((m) => m.user.id === message.author.id);

		collect.on("collect", (menu) => {
			if (
				menu.values.filter(
					(value) => !menu.member.roles.cache.find((role) => role.name === value),
				)[0] === undefined
			)
				return menu.reply({
					content: "У вас уже имеются эти роли!",
					ephemeral: true,
				});
			menu.values.forEach((value) => {
				menu.member.roles.add(menu.member.guild.roles.cache.find((role) => role.name === value));
			});

			menu.reply({
				content: `Вы взяли роли: ${menu.values
					.filter((value) => !menu.member.roles.cache.find((role) => role.name === value))
					.map((value) => menu.member.guild.roles.cache.find((role) => role.name === value))
					.join(", ")}`,
				ephemeral: true,
			});
		});
	},
};
