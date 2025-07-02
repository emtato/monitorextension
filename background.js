const tabMap = new Map();
let lastTab

function addTabToMap(tabId, tabObj) {
    if (tabMap.has(tabId)) {
        let inMap = tabMap.get(tabId);
        if (inMap.tabName === "") inMap.tabName = tabObj.tabName
        if (inMap.tabURL === "") inMap.tabURL = tabObj.tabURL
        inMap.totalActiveDuration = Math.max(inMap.totalActiveDuration, tabObj.totalActiveDuration);
    } else {
        tabMap.set(tabId, tabObj)
    }
}

chrome.tabs.onUpdated.addListener((tabId, changeDetails, tab) => {
        if (changeDetails.status === 'complete') {
            console.log("new tab/website created: " + tab.title);
            console.log("taburl " + tab.url)

            //console.log("activestatus " + tab.active)
            //console.log("status " + tab.status)

            let newTab = new TabInfo(tabId);
            newTab.tabName = tab.title;
            newTab.tabURL = tab.url;
            addTabToMap(newTab)
            console.log("creation date " + newtab.startTime)
        }
    }
);
chrome.tabs.onActivated.addListener(({tabId}) => { // how does this work
    chrome.tabs.get(tabId, (tab) => {
        if (lastTab !== undefined) {
            lastTab.deactivate()
        }
        console.log("tab switched to: " + tab.title);
        let tabObj = tabMap.get(tabId);
        if (!tabObj) {
            tabObj = new TabInfo(tabId);
            addTabToMap(tabObj)
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
        this.totalActiveDuration += Date.now() - this.startTime;
    }

    activate() { //switch to this tab
        this.startTime = Date.now() / 1000;
    }

    getDurationSoFar() {
        return this.totalActiveDuration;
    }
}
