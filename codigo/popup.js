const toggleButton = document.getElementById('toggleBlur');
const mensagem = document.getElementById('mensagem');

function updateButton(isWhatsAppWeb, blurEnabled) {
    if (isWhatsAppWeb) {
        toggleButton.style.display = 'block'; 
        mensagem.style.display = 'none'; 
        toggleButton.textContent = blurEnabled ? 'Desativar Privacidade' : 'Ativar Privacidade';
    } else {
        toggleButton.style.display = 'none'; 
        mensagem.style.display = 'block'; 
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

        updateButton(isWhatsAppWeb, blurEnabled);
    });
}

chrome.tabs.query({ active: true, currentWindow: true }, checkIfWhatsAppWeb);

toggleButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        const isWhatsAppWeb = currentTab && currentTab.url.includes("web.whatsapp.com");

        if (isWhatsAppWeb) {
            chrome.storage.local.get('blurEnabled', (data) => {
                const blurEnabled = data.blurEnabled !== undefined ? data.blurEnabled : false; 
                const newBlurEnabled = !blurEnabled;

                chrome.storage.local.set({ blurEnabled: newBlurEnabled }, () => {
                    updateButton(true, newBlurEnabled); 
                    chrome.tabs.sendMessage(currentTab.id, { blurEnabled: newBlurEnabled });
                });
            });
        } else {
            updateButton(false);
        }
    });
});
