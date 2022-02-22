"use strict";

const fetch = require("node-fetch");

module.exports = class Track {
	constructor(manager, trackId) {
		this.manager = manager;
		this.trackId = trackId;
	}

	async fetch(trackId = this.trackId) {
		const baseInfo = await this.manager.rest.decode(trackId);
		const data = {
			type: baseInfo.sourceName,
			trackId,
			id: baseInfo.identifier,
			isStream: baseInfo.isStream,
			length: baseInfo.length,
			title: baseInfo.title,
			uri: baseInfo.uri,
			author: {
				name: baseInfo.author,
				url: null,
				avatar: null,
			},
			thumbnail: null,
		};

		if (baseInfo.sourceName === "youtube") {
			const yt = await this.fetchYoutubeVideo(data.id);

			data.title = yt.title;
			data.thumbnail = yt.thumbnail;
			data.author = yt.author;
		} else console.log(baseInfo)

		Object.assign(this, data);
		return this;
	}

	async fetchYoutubeVideo(ytVideoId) {
		if (!ytVideoId) return;

		const baseInfo = await fetch(
			`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ytVideoId}&format=json`,
		).then((res) => res.json());
		const authorAvatar = await fetch(baseInfo.author_url)
			.then((resp) => resp.text())
			.then((data) => data.match(/https:\/\/yt3\.ggpht\.com\/.*?"/g)[0].replace('"', ""));

		return {
			title: baseInfo.title,
			author: {
				name: baseInfo.author_name,
				url: baseInfo.author_url,
				avatar: authorAvatar,
			},
			thumbnail: baseInfo.thumbnail_url,
		};
	}
};
