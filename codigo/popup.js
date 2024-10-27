
const switches = {
    imagens: document.getElementById('imagensSwitch'),
    nomes: document.getElementById('nomesSwitch'),
    mensagens: document.getElementById('mensagensSwitch'),
    preview: document.getElementById('previewMensagemSwitch'),
    entrada: document.getElementById('entradaTextoswitch')
};
const privacidadeTotalswitche = document.getElementById('privacidadeTotalSwitch');

const mensagem = document.getElementById('mensagem');
const pww = document.getElementById('pww');

function updateSwitches(isWhatsAppWeb, blurStates) {
    if (isWhatsAppWeb) {
        mensagem.style.display = 'none'; 
        pww.style.display = 'block'; 
        
        privacidadeTotalswitche.checked = blurStates.blurEnabled; 
        switches.nomes.checked = blurStates.blurNomesEnabled; 
        switches.mensagens.checked = blurStates.blurMensagensEnabled; 
        switches.preview.checked = blurStates.blurPreviewEnabled; 
        switches.entrada.checked = blurStates.blurEntradaEnabled; 
        switches.imagens.checked = blurStates.blurImagensEnabled; 
    } else {
        mensagem.style.display = 'block'; 
        pww.style.display = 'none'; 
    }
}

function checkIfWhatsAppWebOnPageIsLoaded(tabs) {
    const currentTab = tabs[0];
    const isWhatsAppWeb = currentTab && currentTab.url.includes("web.whatsapp.com");

    chrome.storage.local.get([
        'blurEnabled', 
        'blurNomesEnabled', 
        'blurMensagensEnabled', 
        'blurPreviewEnabled', 
        'blurEntradaEnabled', 
        'blurImagensEnabled'
    ], (data) => {
        // Default values if not set
        const blurStates = {
            blurEnabled: data.blurEnabled !== undefined ? data.blurEnabled : false,
            blurNomesEnabled: data.blurNomesEnabled !== undefined ? data.blurNomesEnabled : false,
            blurMensagensEnabled: data.blurMensagensEnabled !== undefined ? data.blurMensagensEnabled : false,
            blurPreviewEnabled: data.blurPreviewEnabled !== undefined ? data.blurPreviewEnabled : false,
            blurEntradaEnabled: data.blurEntradaEnabled !== undefined ? data.blurEntradaEnabled : false,
            blurImagensEnabled: data.blurImagensEnabled !== undefined ? data.blurImagensEnabled : false
        };

        if (data.blurEnabled === undefined) {
            chrome.storage.local.set({ blurEnabled: false }, () => {
                chrome.tabs.reload(currentTab.id); 
            });
        }

        updateSwitches(isWhatsAppWeb, blurStates);
    });
}

chrome.tabs.query({ active: true, currentWindow: true }, checkIfWhatsAppWebOnPageIsLoaded);

function handleSwitchChange() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        const isWhatsAppWeb = currentTab && currentTab.url.includes("web.whatsapp.com");

        if (isWhatsAppWeb) {
            
            if(switches.nomes.checked || switches.mensagens.checked 
                || switches.preview.checked || switches.entrada.checked || switches.imagens.checked){
                    privacidadeTotalswitche.checked = false;
            }

            const newBlurStates = {
                blurEnabled: privacidadeTotalswitche.checked, 
                blurNomesEnabled: switches.nomes.checked,
                blurMensagensEnabled: switches.mensagens.checked,
                blurPreviewEnabled: switches.preview.checked,
                blurEntradaEnabled: switches.entrada.checked,
                blurImagensEnabled: switches.imagens.checked
            };

            chrome.storage.local.set(newBlurStates, () => {
                updateSwitches(true, newBlurStates); 
                chrome.tabs.sendMessage(currentTab.id, newBlurStates);
            });
        } else {
            updateSwitches(false, {});
        }
    });
}


function handlePrivacidadeTotalSwitchChange() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        const isWhatsAppWeb = currentTab && currentTab.url.includes("web.whatsapp.com");

        if (isWhatsAppWeb) {
            
            if(privacidadeTotalswitche.checked){
                switches.nomes.checked = false; 
                switches.mensagens.checked = false; 
                switches.preview.checked = false; 
                switches.entrada.checked = false; 
                switches.imagens.checked = false; 
            }

            const newBlurStates = {
                blurEnabled: privacidadeTotalswitche.checked, 
                blurNomesEnabled: switches.nomes.checked,
                blurMensagensEnabled: switches.mensagens.checked,
                blurPreviewEnabled: switches.preview.checked,
                blurEntradaEnabled: switches.entrada.checked,
                blurImagensEnabled: switches.imagens.checked
            };

            chrome.storage.local.set(newBlurStates, () => {
                updateSwitches(true, newBlurStates); 
                chrome.tabs.sendMessage(currentTab.id, newBlurStates);
            });
        } else {
            updateSwitches(false, {});
        }
    });
}

for (const key in switches) {
    switches[key].addEventListener('change', handleSwitchChange);
}
privacidadeTotalswitche.addEventListener('change', handlePrivacidadeTotalSwitchChange);