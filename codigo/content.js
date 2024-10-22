const applyBlur = (enabled) => {

    const listItems = document.querySelectorAll('[role="listitem"]');
    const amidItems = document.querySelectorAll('._amid'); 
    const messages = document.querySelectorAll('._amjv'); 

    const applyBlurToElements = (elements) => {
        elements.forEach(item => {
            item.style.filter = enabled ? 'blur(5px)' : 'blur(0)';
        });
    };

    applyBlurToElements(listItems);
    applyBlurToElements(amidItems);
    applyBlurToElements(messages);

    listItems.forEach(item => {
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

    amidItems.forEach(item => {
        item.addEventListener('mousemove', () => {
            item.style.filter = 'blur(0)';
        });
    });

    messages.forEach(message => {
        message.addEventListener('mousemove', () => {
            message.style.filter = 'blur(0)';
        });
    });
};

const observer = new MutationObserver(() => {
    chrome.storage.local.get('blurEnabled', (data) => {
        const blurEnabled = data.blurEnabled !== undefined ? data.blurEnabled : false;
        try {
            applyBlur(blurEnabled);
        } catch (error) {
            console.error("Error during mutation observation: ", error);
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.blurEnabled !== undefined) {
        try {
            applyBlur(request.blurEnabled);
            sendResponse({ status: "success" });
        } catch (error) {
            console.error("Error applying blur from message: ", error);
            sendResponse({ status: "error", message: error.message });
        }
    }
});