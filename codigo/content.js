const applyBlur = ({
    blurEnabled,
    blurNomesEnabled,
    blurMensagensEnabled,
    blurPreviewEnabled,
    blurEntradaEnabled,
    blurImagensEnabled
}) => {

    const listaDeConversas = document.querySelectorAll('[role="listitem"]');
    const mensagens = document.querySelectorAll('._amjv');
    const cabecalhoConversas = document.querySelectorAll('._amid');

    let fotoCabecalhoConversa = [];
    mensagens.forEach(element => {
        const images = element.querySelectorAll('img');
        fotoCabecalhoConversa.push(...images);
    });
    cabecalhoConversas.forEach(element => {
        const images = element.querySelectorAll('img');
        fotoCabecalhoConversa.push(...images);
    });

    //mensagens parcialmente desfocadas
    const mensagens1 = document.querySelectorAll('.message-in');
    const mensagens2 = document.querySelectorAll('.message-out');

    const nomes1 = document.querySelectorAll('._ak8q');
    const nomes2 = document.querySelectorAll('._amig');

    const preview = document.querySelectorAll('._ak8j');
    const entrada = document.querySelectorAll('._ak1r');
    const fotos = document.querySelectorAll('._ak8h');

    desfocarNomes(nomes1, nomes2, blurNomesEnabled);
    //desfocarMensagens(mensagens, blurMensagensEnabled);
    desfocarMensagens(mensagens1, blurMensagensEnabled);
    desfocarMensagens(mensagens2, blurMensagensEnabled);
    desfocarPreview(preview, blurPreviewEnabled);
    desfocarEntrada(entrada, blurEntradaEnabled);
    desfocarFotos(fotos, blurImagensEnabled);
    desfocarFotosCabecalhoConversa(fotoCabecalhoConversa, blurImagensEnabled);
    desfoqueTotal(listaDeConversas, cabecalhoConversas, mensagens, blurEnabled);
};

function desfoqueTotal(listaDeConversas, cabecalhoConversas, mensagens, enabled)
{
    desfocarListaDeConversasCompletamente(listaDeConversas, enabled);
    desfocarCabecalhoConversasCompletamente(cabecalhoConversas, enabled);
    desfocarMensagens(mensagens, enabled);
}

function desfocarMensagens(mensagens, enabled)
{
    applyBlurToElements(mensagens, enabled);
    mensagens.forEach(message => {
        message.addEventListener('mousemove', () => {
            message.style.filter = 'blur(0)';
        });
    });
}

function desfocarListaDeConversasCompletamente(listaDeConversas, enabled){

    applyBlurToElements(listaDeConversas, enabled);

    listaDeConversas.forEach(item => {
        try {
            const images = item.querySelectorAll('img');
            images.forEach(image => {
                image.style.filter = enabled ? 'blur(5px)' : 'blur(0)';
            });

            item.addEventListener('mousemove', () => {
                item.style.filter = 'blur(0)';
                images.forEach(image => {
                    image.style.filter = 'blur(0)';
                });
            });
        } catch (error) {
            console.error("Error applying blur to item: ", error);
        }
    });
}

function desfocarCabecalhoConversasCompletamente(cabecalhoConversas, enabled)
{
    applyBlurToElements(cabecalhoConversas, enabled);
    cabecalhoConversas.forEach(item => {
        item.addEventListener('mousemove', () => {
            item.style.filter = 'blur(0)';
        });
    });
}

function desfocarNomes(nomes1, nomes2, enabled)
{
    applyBlurToElements(nomes1, enabled);
    nomes1.forEach(nome => {
        nome.addEventListener('mousemove', () => {
            nome.style.filter = 'blur(0)';
        });
    });

    applyBlurToElements(nomes2, enabled);
    nomes2.forEach(nome => {
        nome.addEventListener('mousemove', () => {
            nome.style.filter = 'blur(0)';
        });
    });
}

function desfocarPreview(preview, enabled){
    applyBlurToElements(preview, enabled);
    preview.forEach(item => {
        item.addEventListener('mousemove', () => {
            item.style.filter = 'blur(0)';
        });
    });
}

function desfocarEntrada(entrada, enabled){
    applyBlurToElements(entrada, enabled);
    entrada.forEach(item => {
        item.addEventListener('mousemove', () => {
            item.style.filter = 'blur(0)';
        });
    });
}

function desfocarFotos(fotos, enabled){

    applyBlurToElements(fotos, enabled);
    fotos.forEach(item => {
        item.addEventListener('mousemove', () => {
            item.style.filter = 'blur(0)';
        });
    });
}

function desfocarFotosCabecalhoConversa(fotoCabecalhoConversa, enabled){
    applyBlurToElements(fotoCabecalhoConversa, enabled);
    fotoCabecalhoConversa.forEach(item => {
        item.addEventListener('mousemove', () => {
            item.style.filter = 'blur(0)';
        });
    });
}

const applyBlurToElements = (elements, enabled) => {
    elements.forEach(item => {
        item.style.filter = enabled ? 'blur(7px)' : 'blur(0)';
    });
};

const observer = new MutationObserver(() => {
    chrome.storage.local.get(['blurEnabled', 'blurNomesEnabled', 'blurMensagensEnabled', 'blurPreviewEnabled', 'blurEntradaEnabled', 'blurImagensEnabled'], (data) => {
        const blurEnabled = data.blurEnabled !== undefined ? data.blurEnabled : false;
        const blurNomesEnabled = data.blurNomesEnabled !== undefined ? data.blurNomesEnabled : false;
        const blurMensagensEnabled = data.blurMensagensEnabled !== undefined ? data.blurMensagensEnabled : false;
        const blurPreviewEnabled = data.blurPreviewEnabled !== undefined ? data.blurPreviewEnabled : false;
        const blurEntradaEnabled = data.blurEntradaEnabled !== undefined ? data.blurEntradaEnabled : false;
        const blurImagensEnabled = data.blurImagensEnabled !== undefined ? data.blurImagensEnabled : false;

        try {
            applyBlur({
                blurEnabled,
                blurNomesEnabled,
                blurMensagensEnabled,
                blurPreviewEnabled,
                blurEntradaEnabled,
                blurImagensEnabled
            });
        } catch (error) {
            console.error("Error during mutation observation: ", error);
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    try {
        
        const {
            blurEnabled,
            blurNomesEnabled,
            blurMensagensEnabled,
            blurPreviewEnabled,
            blurEntradaEnabled,
            blurImagensEnabled
        } = request;

        applyBlur({
            blurEnabled: blurEnabled !== undefined ? blurEnabled : false,
            blurNomesEnabled: blurNomesEnabled !== undefined ? blurNomesEnabled : false,
            blurMensagensEnabled: blurMensagensEnabled !== undefined ? blurMensagensEnabled : false,
            blurPreviewEnabled: blurPreviewEnabled !== undefined ? blurPreviewEnabled : false,
            blurEntradaEnabled: blurEntradaEnabled !== undefined ? blurEntradaEnabled : false,
            blurImagensEnabled: blurImagensEnabled !== undefined ? blurImagensEnabled : false
        });

        sendResponse({ status: "success" }); 
    } catch (error) {
        console.error("Error applying blur from message: ", error); 
        sendResponse({ status: "error", message: error.message }); 
    }
});
