const { prefix } = require("../../config.json");

module.exports = class CacheManager extends Map {
	constructor(bot) {
		super();
		this.bot = bot;
	}

	async find(target, type) {
		return this.get(this._format(target)) || (await this.create(target, type));
	}

	search(target, val) {
		return Array.from(this).filter(([key, value]) => {
			let s;
			if (val) {
				s = Object.values(val).map((v) => v in value);
				if (s.length === s.filter((a) => a === true).length) s = true;
				else s = false;
			}

			return key.includes(this._format(target)) && s;
		});
	}

	async update(target, newData, type) {
		const data = await this.create(target, type);

		this.set(this._format(target), new Object({ ...data, ...newData }));

		await this.bot.database[type].updateOne(target, newData);
		return this.get(this._format(target));
	}

	async delete(target, del, type) {
		if (typeof del != "array") del = new Array(del);

		const data = await this.create(target, type);
		const tmp = {};

		del.forEach(async (d) => {
			tmp[d] = "";
			if (d in data) delete data[d];
		});

		this.set(this._format(target), data);

		await this.bot.database[type].updateOne(target, { $unset: tmp });
		return this.get(this._format(target));
	}

	async create(target, type) {
		const id = this._format(target);

		if (this.get(id)) return this.get(id);

		const types = {
			member: { reputation: 0 },
			guild: { prefix, ideas: { ideas: [] } },
		};

		if (!type) {
			if ("memberCount" in target) type = "guild";
			if ("joinedTimestamp" in target) type = "member";
		}

		const db = await this.bot.database[type].findOne(target);

		this.set(id, { ...db }._doc || types[type]);

		return this.get(id);
	}

	_format(data) {
		if (typeof data === "string") return data;

		return Object.values(data).join("_");
	}
};
