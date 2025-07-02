class TabInfo {
    constructor(tabId) {
        this.tabId = tabId;
        this.tabName = "";
        this.tabURL = "";
        this.startTime = Date.now() / 1000;
        this.totalActiveDuration = 0;
        this.active = true;
    }
    deactivate() {
    }

    activate() {
    }

    getDurationSoFar() {
    }
}
