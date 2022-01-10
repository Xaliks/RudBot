const { MessageButton, MessageEmbed, MessageSelectMenu } = require("discord.js");

module.exports = {
    name: "ship-battle",
    description: "Морской бой",
    usage: ["<@Противник>"],
    aliases: ["shipbattle", "shipduel", "battle-ship", "battleship"],
    category: "general",
    async execute(message, args, bot) {
        const user = bot.utils.findMember(message, args.join(" "))?.user;
        if (!user) return bot.utils.error("Пользователь не найден!", this, message, bot);
        if (user.bot) return bot.utils.error("Нельзя играть с ботами!", this, message, bot);
        if (user === message.author) return bot.utils.error("Нельзя играть с собой!", this, message, bot);

        const msg = await message.channel.send({
            content: `${user}, Вы хотите поиграть в Морской бой с ${message.author}? У вас есть 15 секунд.`,
            components: [
                {
                    type: 1,
                    components: [
                        new MessageButton().setEmoji("✅").setCustomId("yes").setStyle(2),
                        new MessageButton().setEmoji("🚫").setCustomId("no").setStyle(2),
                    ],
                },
            ],
        });

        const collector = msg.createMessageComponentCollector({
            time: 15000,
        });

        collector.on("collect", async (button) => {
            if (button.user.id != user.id)
                return button.reply({ content: "Ты не можешь нажимать на эту кнопку", ephemeral: true });

            if (button.customId === "no") {
                return message.channel.send(`${user} не захотел играть с вами!`);
            }

            const players = [create(), create()];
            const msgAuthor = await send(message.author, 0);
            const msgUser = await send(user, 1);

            if (!msgUser || !msgAuthor) return await msg.edit({ content: `${user}, у вас закрыта личка! Откройте её для начала игры!`, components: [] });

            bot.temp.set(`shipbattle-${message.author.id}-${user.id}`, [msgAuthor, msgUser, generateMap, getOptions, [], []].concat(players));

            await msg.edit({ content: "Смотрите в ЛС! Игра началась!", components: [] });

            async function send(u, n) {
                let name = "Ваш ход";
                const letter = new MessageSelectMenu().setCustomId(`shipbattle-letter-${message.author.id}-${user.id}`).setMaxValues(1).setMinValues(1).setPlaceholder("Буква").addOptions(getOptions()[0]).setDisabled(false);
                
                if (n === 1) {
                    name = "Ход противника"
                    letter.setDisabled(true)
                }

                return await u.send({ embeds: [new MessageEmbed().setAuthor({ name }).setTitle("Ваше поле").setDescription(generateMap(players[n], [], true)), new MessageEmbed().setTitle("Поле противника").setDescription(generateMap(players[n === 0 ? 1 : 0], [], false))], components: [{ type: 1, components: [letter] }, { type: 1, components: [new MessageSelectMenu().setCustomId(`shipbattle-number-${message.author.id}-${user.id}`).setMaxValues(1).setMinValues(1).setPlaceholder("Цифра").addOptions(getOptions()[1]).setDisabled(true)] }] }).catch((err) => {
                    console.log(err)
                    return null;
                });
            }
        });
    }
}

function create() {
    const map = new Array(100).fill("0");
    const ships = {
        single: [4, 1],
        double: [3, 2],
        triple: [2, 3],
        four: [1, 4],
    };

    const matrix = [...Array(10)].map(() => Array(10).fill(0));
    const getRandom = n => Math.floor(Math.random() * (n + 1));

    for (let type in ships) {
        const count = ships[type][0];
        const decks = ships[type][1];

        for (let i = 0; i < count; i++) {
            const options = getCoordsDecks(decks);
            options.decks = decks;
            options.shipname = type;

            createShip(options);
        }
    }

    function getCoordsDecks(decks) {
        // ky == 1 — корабль расположен горизонтально,
        const kx = getRandom(1);
        const ky = (kx == 0) ? 1 : 0;
        let x, y;

        if (kx == 0) {
            x = getRandom(9); y = getRandom(10 - decks);
        } else {
            x = getRandom(10 - decks); y = getRandom(9);
        }

        const obj = { x, y, kx, ky }
        const result = checkLocationShip(obj, decks);

        if (!result) return getCoordsDecks(decks);
        return obj;
    }

    function checkLocationShip(obj, decks) {
        let { x, y, kx, ky, fromX, toX, fromY, toY } = obj;

        fromX = (x == 0) ? x : x - 1;

        if (x + kx * decks == 10 && kx == 1) toX = x + kx * decks;
        else if (x + kx * decks < 10 && kx == 1) toX = x + kx * decks + 1;
        else if (x == 9 && kx == 0) toX = x + 1;
        else if (x < 9 && kx == 0) toX = x + 2;

        fromY = (y == 0) ? y : y - 1;
        if (y + ky * decks == 10 && ky == 1) toY = y + ky * decks;
        else if (y + ky * decks < 10 && ky == 1) toY = y + ky * decks + 1;
        else if (y == 9 && ky == 0) toY = y + 1;
        else if (y < 9 && ky == 0) toY = y + 2;

        if (toX === undefined || toY === undefined) return false;

        setTimeout(() => {}, 180)
        if (matrix.slice(fromX, toX)
            .filter(arr => arr.slice(fromY, toY).includes(1))
            .length > 0) return false;
        return true;
    }

    function createShip({ decks, x, y, kx, ky }) {
        let arrDecks = [], k = 0;

        while (k < decks) {
            let i = x + k * kx, j = y + k * ky;

            matrix[i][j] = 1;
            arrDecks.push([i, j]);
            k++;
        }

        arrDecks.forEach((d) => {
            const pos = Number(String(d[0]) + d[1]);

            map[pos] = "1";
        })
    }

    return map
}

function generateMap(ships, hits, show) {
    let text = `⬜ | 1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣🔟
==========================`;
    const y = {
        0: "🇦",
        10: "<:B_:930137869425704990>",
        20: "🇧",
        30: "<:D_:930137869249572964>",
        40: "<:E_:930137869157289994>",
        50: "<:F_:930137869136322660>",
        60: "<:G_:930137868817551402>",
        70: "<:H_:930137869186646116>",
        80: "<:I_:930137869178249216>",
        90: "🇰",
    }

    ships.forEach((s, i) => {
        if (hits.includes(i)) s = ships[i] === "0" ? "2" : "3";
        else if (show === false) s = "0";

        if (i % 10 === 0) text += `\n${y[i]} | `;

        text += emoji(s);
    })

    function emoji(s) {
        if (s === "0") return "<:w:928995495974670347>";
        if (s === "1") return "<:s:928995495827877928>";
        if (s === "2") return "<:wD:928995496041807872>";
        if (s === "3") return "<:sF:928995495920152606>";
    }

    return text
}

function getOptions() {
    return [
    [
            { label: "А", value: "0", emoji: "930137868708507669" },
            { label: "Б", value: "1", emoji: "930137869425704990" },
            { label: "В", value: "2", emoji: "930137868721078284" },
            { label: "Г", value: "3", emoji: "930137869249572964" },
            { label: "Д", value: "4", emoji: "930137869157289994" },
            { label: "Е", value: "5", emoji: "930137869136322660" },
            { label: "Ж", value: "6", emoji: "930137868817551402" },
            { label: "З", value: "7", emoji: "930137869186646116" },
            { label: "И", value: "8", emoji: "930137869178249216" },
            { label: "К", value: "9", emoji: "930137869195046972" }
        ],
        [
            { label: "1", value: "0", emoji: "930139670153682975" },
            { label: "2", value: "1", emoji: "930139670313066527" },
            { label: "3", value: "2", emoji: "930139670241755146" },
            { label: "4", value: "3", emoji: "930139669914611733" },
            { label: "5", value: "4", emoji: "930139670300487740" },
            { label: "6", value: "5", emoji: "930139670304665751" },
            { label: "7", value: "6", emoji: "930139670308851753" },
            { label: "8", value: "7", emoji: "930139670233382962" },
            { label: "9", value: "8", emoji: "930139670292086794" },
            { label: "10", value: "9", emoji: "930139670178852935" }
        ]
    ]
}
