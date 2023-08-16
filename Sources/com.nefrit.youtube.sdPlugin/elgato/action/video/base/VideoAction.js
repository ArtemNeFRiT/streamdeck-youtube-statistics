class VideoAction {

    constructor(titleUpdater, youtube) {
        this.youtube = youtube;
        this.titleUpdater = titleUpdater;
        this.interval = null;
    }

    async onKeyDown(context, settings, coordinates, userDesiredState) {}

    async onKeyUp(context, settings, coordinates, userDesiredState) {
        await this.updateViews(context, settings);
    }

    async onWillAppear(context, settings, coordinates) {
        this.interval = setInterval(async () => {
            await this.updateViews(context, settings);
        }, 180000);
        await this.updateViews(context, settings);
    }

    async onWillDisappear() {
        clearInterval(this.interval);
    }

    async didReceiveSettings(context, settings) {
        await this.updateViews(context, settings);
    }

    async updateViews(context, settings) {
        if (settings == null) return
        var apiKey = ""
        if (settings.hasOwnProperty('apiKey')) {
            apiKey = settings["apiKey"];
        }
        var youtubeVideo = ""
        if (settings.hasOwnProperty('youtubeVideo')) {
            youtubeVideo = settings["youtubeVideo"];
        }
        if (!youtubeVideo || !apiKey) return

        const videoStat = await this.youtube.loadVideoStatistic(apiKey, youtubeVideo);
        this.titleUpdater.updateTitle(context, this.formatNumber(this.getVideoValue(videoStat)));
    }

    getVideoValue(channelStat) {
        return null;
    }

    formatNumber(numberString) {
        let number = parseInt(numberString);

        if (number >= 1000000) {
            number = (number / 1000000).toFixed(2) + "M";
        } else if (number >= 100000) {
            number = (number / 1000).toFixed(1) + "K";
        } else if (number >= 10000) {
            number = (number / 1000).toFixed(2) + "K";
        }

        return number;
    }
}