const applyBlur = (enabled) => {
    const listItems = document.querySelectorAll('[role="listitem"]');
    
    listItems.forEach(item => {
        try {
            item.style.filter = enabled ? 'blur(5px)' : 'blur(0)';

            const images = item.querySelectorAll('img');
            images.forEach(image => {
                image.style.filter = enabled ? 'blur(5px)' : 'blur(0)';
            });

            item.addEventListener('mouseover', () => {
                item.style.filter = 'blur(0)';
                images.forEach(image => {
                    image.style.filter = 'blur(0)';
                });
            });

            item.addEventListener('mouseout', () => {
                item.style.filter = enabled ? 'blur(5px)' : 'blur(0)';
                images.forEach(image => {
                    image.style.filter = enabled ? 'blur(5px)' : 'blur(0)';
                });
            });
        } catch (error) {
            console.error("Error applying blur to item: ", error);
        }
    });
};

chrome.storage.local.get('blurEnabled', (data) => {
    let blurEnabled = data.blurEnabled;

    if (blurEnabled === undefined) {
        blurEnabled = false;
        chrome.storage.local.set({ blurEnabled });
    }

    try {
        applyBlur(blurEnabled);
    } catch (error) {
        console.error("Error applying initial blur: ", error);
    }
});

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