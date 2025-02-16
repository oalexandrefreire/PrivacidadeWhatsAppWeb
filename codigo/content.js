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
    const cabecalhoConversas = document.querySelectorAll('#main header');

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
    const nomes2 = document.querySelectorAll('header ._ao3e');
    const preview = document.querySelectorAll('._ak8j');
    const entrada = document.querySelectorAll('._ak1r');
    const fotos = document.querySelectorAll('._ak8h');
    const videos = document.querySelectorAll('#main video');
    const videosBase64 = document.querySelectorAll('._ahn8');

    desfocarElementos(nomes1, blurNomesEnabled);
    desfocarElementos(nomes2, blurNomesEnabled);
    desfocarElementos(mensagens1, blurMensagensEnabled);
    desfocarElementos(mensagens2, blurMensagensEnabled);
    desfocarElementos(preview, blurPreviewEnabled);
    desfocarElementos(entrada, blurEntradaEnabled);
    desfocarElementos(fotos,blurImagensEnabled);
    desfocarElementos(videos,blurImagensEnabled);
    desfocarElementos(videosBase64,blurImagensEnabled);
    desfocarElementos(fotoCabecalhoConversa,blurImagensEnabled);

    // desfoqueTotal
    desfocarElementos(listaDeConversas,blurEnabled);
    desfocarElementos(cabecalhoConversas,blurEnabled);
    desfocarElementos(mensagens,blurEnabled);
};

const adicionarDesfoqueAosElementos = (elements, enabled) => {
    elements.forEach(item => {
        if (enabled) {
            adicionarDesfoqueAoElementoEFilhos(item);
        } else {
            removerDesfoqueDoElementoEFilhos(item);
        }
    });
};

const adicionarDesfoqueAoElementoEFilhos = (element) => {
    const addBlur = (selector, className) => {
        element.querySelectorAll(selector).forEach(item => item.classList.add(className));
    };

    element.classList.add('blurred-item');
};

const removerDesfoqueDoElementoEFilhos = (elemento) => {
    const removerDesfoque = (seletor, classe) => {
        elemento.querySelectorAll(seletor).forEach(item => item.classList.remove(classe));
    };

    elemento.classList.remove('blurred-item');
};

function desfocarElementos(elementos, enabled) {

    elementos.forEach(elemento => {
        let tolerancia = 10;
        let mouseX = 0, mouseY = 0;
        
        // Só aplica desfoque inicialmente se o mouse não estiver em cima do elemento
        if (!elemento.matches(':hover')) {
            adicionarDesfoqueAosElementos([elemento], enabled);
        }

        elemento.addEventListener('mouseenter', (event) => {
            // Remove o blur assim que o mouse entra
            removerDesfoqueDoElementoEFilhos(elemento);
            mouseX = event.clientX;
            mouseY = event.clientY;
        });
        
        // mousemove: Calcula a distância entre a posição atual do mouse e a posição inicial, usando o Teorema de Pitágoras para determinar a distância (distância Euclidiana). 
        // Se a distância for maior que a tolerância definida, o blur é removido.
        elemento.addEventListener('mousemove', (event) => {
            let distancia = Math.sqrt(Math.pow(event.clientX - mouseX, 2) + Math.pow(event.clientY - mouseY, 2));
            
            if (distancia > tolerancia) {
                removerDesfoqueDoElementoEFilhos(elemento);
            }
        });

        elemento.addEventListener('mouseleave', () => {
            if (!elemento.matches(':hover')) {
                adicionarDesfoqueAosElementos([elemento], enabled);
            }
        });
    });
}

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
