chrome.runtime.onInstalled.addListener(() => {
    // Open WhatsApp Web in a new tab
    chrome.tabs.create({ url: "https://web.whatsapp.com" }, (tab) => {
        // Define the keys and their initial values
        const defaultValues = {
            blurNomesEnabled: false,
            blurMensagensEnabled: false,
            blurPreviewEnabled: false,
            blurEntradaEnabled: false,
            blurImagensEnabled: false
        };

        // Retrieve current storage values
        chrome.storage.local.get(Object.keys(defaultValues).concat('blurEnabled'), (storedValues) => {
            // Check and set blurEnabled only if it doesn't exist
            if (storedValues.blurEnabled === undefined) {
                storedValues.blurEnabled = true; // Set to true if not already set
            }

            // Ensure other parameters are set to false if they are undefined
            for (const key in defaultValues) {
                if (storedValues[key] === undefined) {
                    storedValues[key] = defaultValues[key];
                }
            }

            // Save the updated values to storage
            chrome.storage.local.set(storedValues, () => {
                console.log("Storage initialized with default values.");
                chrome.tabs.create({ url: "https://privacidade-whatsapp-web.vercel.app/welcome" });
            });
        });
    });
});
