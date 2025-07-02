const tabMap = new Map();
let lastTab

function addTabToMap(tabId, tab) {
    if (tabMap.has(tabId)) {
        let inMap = tabMap.get(tabId);
        inMap.tabName = tab.title
        inMap.tabURL = tab.url
        // inMap.totalActiveDuration = Math.max(inMap.totalActiveDuration, tabObj.totalActiveDuration);
    } else {
        let newTab = new TabInfo(tabId);
        newTab.tabName = tab.title
        newTab.tabURL = tab.url
        tabMap.set(tabId, newTab)
    }
}

chrome.tabs.onUpdated.addListener((tabId, changeDetails, tab) => {
        if (changeDetails.status === 'complete') {
            console.log("new tab/website created: " + tab.title);
            console.log("taburl " + tab.url)

            //console.log("activestatus " + tab.active)
            //console.log("status " + tab.status)

            addTabToMap(tabId, tab)
            newTab = tabMap.get(tabId)
            //console.log("creation date " + newTab.startTime)
        }
    }
);
chrome.tabs.onActivated.addListener(({tabId}) => { // how does this top part work
    chrome.tabs.get(tabId, (tab) => {
        if (lastTab !== undefined) {
            lastTab.deactivate()
        }
        console.log("tab switched to: " + tab.title);

        let tabObj = tabMap.get(tabId);
        if (!tabObj) {
            addTabToMap(tabId, tab)
        }
        tabObj.activate()
        lastTab = tabObj;
        console.log("last tab active duration: " + lastTab.getDurationSoFar())
    });
});

//paste from docs
async function getCurrentTab() {
    let queryOptions = {active: true, lastFocusedWindow: true};
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}


class TabInfo {
    constructor(tabId) {
        this.tabId = tabId;
        this.tabName = "";
        this.tabURL = "";
        this.startTime = Date.now() / 1000;
        this.totalActiveDuration = 0;
        this.active = true;
    }

    deactivate() { //tab switched away
        this.totalActiveDuration += Date.now() / 1000 - this.startTime;
        console.log(this.tabName + " deactivated")

    }

    activate() { //switch to this tab
        this.startTime = Date.now() / 1000;
        console.log(this.tabName + " activated")

    }

    getDurationSoFar() {
        return this.totalActiveDuration;
    }
}
