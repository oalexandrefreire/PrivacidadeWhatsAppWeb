chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({ url: "https://web.whatsapp.com" }, (tab) => {
        chrome.storage.local.set({ blurEnabled: true }, () => {
            console.log("Blur enabled set to true.");
        });
    });
});