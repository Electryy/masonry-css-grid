let masonryContainer: HTMLElement;

let containerSelector: string;

let initTimeoutId: number = -1;

let resizeTimeoutId: number = -1;

let giveUpAndExit: boolean = false;

interface MasonryItem extends HTMLElement {
    masonry: {
        lastHeight: number;
        newHeight: number;
    };
}

const doMasonry = () => {
    const items = Array.from(masonryContainer.children) as MasonryItem[];

    items.forEach((item) => {
        const firstPos = item.getBoundingClientRect();
        // if (item.masonry.lastHeight !== item.masonry.newHeight) {
        //     item.style.gridRow = `span ${item.masonry.newHeight}`;
        // }

        requestAnimationFrame(() => {
            if (item.masonry.lastHeight !== item.masonry.newHeight) {
                item.style.gridRow = `span ${item.masonry.newHeight}`;
            }
            item.masonry.lastHeight = item.masonry.newHeight;
            const lastPos = item.getBoundingClientRect();
            const deltaX = firstPos.left - lastPos.left;
            const deltaY = firstPos.top - lastPos.top;
            if (deltaX === 0) {
                return;
            }
            item.animate(
                [
                    {
                        transformOrigin: 'top left',
                        transform: `translate(${deltaX}px, ${deltaY}px)`,
                    },
                    {
                        transformOrigin: 'top left',
                        transform: 'none',
                    },
                ],
                {
                    duration: 100,
                    easing: 'ease',
                    fill: 'both',
                }
            );
        });
    });
};

const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
        if (entry.borderBoxSize?.length === 0) {
            return;
        }
        const height = Math.ceil(entry.borderBoxSize[0].blockSize);
        const item = entry.target.parentElement as MasonryItem;
        if (!item) {
            continue;
        }
        item.masonry = {
            newHeight: height,
            lastHeight: 0,
        };
        cancelAnimationFrame(resizeTimeoutId);
        resizeTimeoutId = requestAnimationFrame(doMasonry);
    }
});

const initItem = (content: HTMLElement) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'wrap';
    wrapper.dataset.masonryItem = '';
    masonryContainer.insertBefore(wrapper, content);
    wrapper.appendChild(content);
    content.dataset.masonryItemContent = '';
    resizeObserver.observe(content);
};

const update = () => {
    const items = Array.from(masonryContainer.children) as MasonryItem[];

    for (const element of items) {
        if (element.children.length === 0) {
            element.remove();
            continue;
        } else if (!element.hasAttribute('data-masonry-item')) {
            initItem(element);
        }
    }
};

const setStyles = () => {
    const style = document.createElement('style');
    style.innerHTML = `
    [data-masonry-container] {
        display: grid; 
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
    [data-masonry-item] {
        overflow: hidden;
    }
    `;
    //.replace(/\s/g, '')
    document.head.appendChild(style);
};

const start = () => {
    if (!masonryContainer) {
        requestAnimationFrame(() => {
            if (!giveUpAndExit) {
                console.log('not giving up');
                start();
            }
        });
        return;
    }
    setStyles();
    const elements = Array.from(masonryContainer.children) as HTMLElement[];

    elements.forEach((element) => {
        initItem(element);
    });
    const containerObserver = new MutationObserver(update);

    // Start observing the target node for configured mutations
    containerObserver.observe(masonryContainer, {
        childList: true,
        subtree: true,
    });
    console.log('start');
};

const waitAndGetContainer = () => {
    const body = document.documentElement || document.body;
    const bodyObserver = new MutationObserver((record, bodyObserver) => {
        requestAnimationFrame(() => {
            masonryContainer = document.querySelector(
                containerSelector
            ) as HTMLElement;

            console.log('obseer');
            if (masonryContainer) {
                bodyObserver.disconnect();
                console.log('ready to start');
                masonryContainer.dataset.masonryContainer = '';
                return;
            }
            clearTimeout(initTimeoutId);
            initTimeoutId = setTimeout(() => {
                console.error('Container not found');

                giveUpAndExit = true;
                bodyObserver.disconnect();
            }, 5000);
        });
    });

    bodyObserver.observe(body, {
        childList: true,
        subtree: true,
    });
};

const init = (selector: string, options: { useAnimations: boolean }) => {
    containerSelector = selector;

    masonryContainer = document.querySelector(containerSelector) as HTMLElement;
    if (!masonryContainer) {
        waitAndGetContainer();
    }

    console.log('init');
    return {
        start,
    };
};
export default init;
