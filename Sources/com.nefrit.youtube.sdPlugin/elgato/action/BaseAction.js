class BaseAction {

    constructor() {
        this.timers = new Map()
    }

    getYouTubeAPIKey(settings) {
        let apiKey = "";
        if (settings.hasOwnProperty('apiKey')) {
            apiKey = settings["apiKey"];
        }
        return apiKey
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

    async onWillAppear(context, settings, coordinates) {
        await this.createTimer(context, settings)
        await this.updateViews(context, settings);
    }

    async onWillDisappear(context, settings, coordinates) {
        await this.clearTimer(context, settings)
    }

    async didReceiveSettings(context, settings) {
        await this.updateTimer(context, settings);
        await this.updateViews(context, settings);
    }

    async updateViews(context, settings) {
        console.log('updateViews', context)
    }

    async updateTimer(context, settings) {
        await this.clearTimer(context, settings)
        await this.createTimer(context, settings)
    }

    async createTimer(context, settings) {
        if (this.timers.has(context)) {
            return
        }
        let period = 300000;
        if (settings.hasOwnProperty('period')) {
            period = settings["period"] * 60000;
        }
        console.log('create timer', context, period)
        const interval = setInterval(async () => {
            await this.updateViews(context, settings)
        }, period)

        this.timers.set(context, interval)
    }

    async clearTimer(context, settings) {
        if (!this.timers.has(context)) {
            return
        }
        const interval = this.timers.get(context)
        clearInterval(interval)
        this.timers.delete(context)
    }
}