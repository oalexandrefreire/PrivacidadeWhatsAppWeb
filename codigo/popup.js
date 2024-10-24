const toggleSwitch = document.getElementById('switch'); 
const mensagem = document.getElementById('mensagem');
const pww = document.getElementById('pww');

function updateSwitch(isWhatsAppWeb, blurEnabled) {
    if (isWhatsAppWeb) {
        mensagem.style.display = 'none'; 
        pww.style.display = 'block'; 
        toggleSwitch.checked = blurEnabled; 
    } else {
        mensagem.style.display = 'block'; 
        pww.style.display = 'none'; 
    }
}

function checkIfWhatsAppWeb(tabs) {
    const currentTab = tabs[0];
    const isWhatsAppWeb = currentTab && currentTab.url.includes("web.whatsapp.com");

    chrome.storage.local.get('blurEnabled', (data) => {
        let blurEnabled = data.blurEnabled !== undefined ? data.blurEnabled : false; 

        if (data.blurEnabled === undefined) {
            chrome.storage.local.set({ blurEnabled: false }, () => {
                chrome.tabs.reload(currentTab.id); 
            });
        }

        updateSwitch(isWhatsAppWeb, blurEnabled);
    });
}

chrome.tabs.query({ active: true, currentWindow: true }, checkIfWhatsAppWeb);

toggleSwitch.addEventListener('change', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        const isWhatsAppWeb = currentTab && currentTab.url.includes("web.whatsapp.com");

        if (isWhatsAppWeb) {
            const newBlurEnabled = toggleSwitch.checked; 

            chrome.storage.local.set({ blurEnabled: newBlurEnabled }, () => {
                updateSwitch(true, newBlurEnabled); 
                chrome.tabs.sendMessage(currentTab.id, { blurEnabled: newBlurEnabled });
            });
        } else {
            updateSwitch(false);
        }
    });
});