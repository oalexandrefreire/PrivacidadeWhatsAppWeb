chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({ url: "https://web.whatsapp.com" }, (tab) => {
        const defaultValues = {
            blurNomesEnabled: false,
            blurMensagensEnabled: false,
            blurPreviewEnabled: false,
            blurEntradaEnabled: false,
            blurImagensEnabled: false
        };

        chrome.storage.local.get(Object.keys(defaultValues).concat('blurEnabled'), (storedValues) => {
            if (storedValues.blurEnabled === undefined) {
                storedValues.blurEnabled = true; 
            }

            for (const key in defaultValues) {
                if (storedValues[key] === undefined) {
                    storedValues[key] = defaultValues[key];
                }
            }

            chrome.storage.local.set(storedValues, () => {
                console.log("Storage initialized with default values.");
                chrome.tabs.create({ url: "https://privacidade-whatsapp-web.vercel.app/welcome.html" });
            });
        });
    });
});
