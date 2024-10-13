const toggleButton = document.getElementById('toggleBlur');

chrome.storage.local.get('blurEnabled', (data) => {
    const blurEnabled = data.blurEnabled !== undefined ? data.blurEnabled : true;
    toggleButton.textContent = blurEnabled ? 'Desativar Privacidade' : 'Ativar Privacidade';
});

toggleButton.addEventListener('click', () => {
    chrome.storage.local.get('blurEnabled', (data) => {
        const blurEnabled = data.blurEnabled !== undefined ? data.blurEnabled : true;
        
        const newBlurEnabled = !blurEnabled;
        chrome.storage.local.set({ blurEnabled: newBlurEnabled }, () => {
            toggleButton.textContent = newBlurEnabled ? 'Desativar Privacidade' : 'Ativar Privacidade';
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { blurEnabled: newBlurEnabled });
            });
        });
    });
});
