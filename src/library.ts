type Options = {
    minWidth?: number;
    gap?: number;
    useAnimations?: boolean;
};

interface IMasonryItem extends HTMLElement {
    masonry: {
        lastHeight: number;
        newHeight: number;
    };
}

let masonryContainer: HTMLElement;

let containerSelector: string;

let giveUpAndExitTimeout: number = -1;

let resizeTimeoutId: number = -1;

let giveUpAndExit: boolean = false;

let masonryOptions = {
    minWidth: 200,
    useAnimations: false,
    gap: 10,
};

const setGridSpan = (item: IMasonryItem) => {
    if (item.masonry.lastHeight !== item.masonry.newHeight) {
        item.style.gridRow = `span ${
            item.masonry.newHeight + masonryOptions.gap * 2
        }`;
    }
    item.masonry.lastHeight = item.masonry.newHeight;
};

const doMasonry = () => {
    const items = Array.from(masonryContainer.children) as IMasonryItem[];

    for (const item of items) {
        if (!masonryOptions.useAnimations) {
            setGridSpan(item);
            continue;
        }

        const firstPos = item.getBoundingClientRect();

        requestAnimationFrame(() => {
            setGridSpan(item);
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
    }
};

const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
        if (entry.borderBoxSize?.length === 0) {
            return;
        }
        const height = Math.ceil(entry.borderBoxSize[0].blockSize);
        const item = entry.target.parentElement as IMasonryItem;
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
    wrapper.dataset.masonryItem = '';
    masonryContainer.insertBefore(wrapper, content);
    wrapper.appendChild(content);
    content.dataset.masonryItemContent = '';
    resizeObserver.observe(content);
};

const doAnimations = () => {
    const items = Array.from(masonryContainer.children) as IMasonryItem[];
    // console.log('doanims');

    for (const item of items) {
        if (!item.hasAttribute('data-masonry-item')) {
            console.log('eioo!');
            continue;
        }
        const firstPos = item.getBoundingClientRect();
        item.firstPos = firstPos;
    }
    requestAnimationFrame(() => {
        const items = Array.from(masonryContainer.children) as IMasonryItem[];

        for (const item of items) {
            if (!item.firstPos) {
                continue;
            }

            const lastPos = item.getBoundingClientRect();
            // console.dir(item);
            const deltaX = item.firstPos.left - lastPos.left;
            const deltaY = item.firstPos.top - lastPos.top;
            const deltaW = item.firstPos.width / lastPos.width;
            const deltaH = item.firstPos.height / lastPos.height;

            if (deltaX > 100 || deltaY > 100) {
                item.animate(
                    [
                        {
                            transformOrigin: 'top left',
                            transform: `translate(${deltaX}px, ${deltaY}px)
                            scale(${deltaW}, ${deltaH})
                            `,
                        },
                        {
                            transformOrigin: 'top left',
                            transform: 'none',
                        },
                    ],
                    {
                        duration: 500,
                        easing: 'ease',
                        fill: 'both',
                    }
                );
            }
        }
        doAnimations();
    });
};

const update = () => {
    const items = Array.from(masonryContainer.children) as IMasonryItem[];

    // const removedElements: HTMLElement[] = []

    for (const element of items) {
        if (element.children.length === 0) {
            // removedElements.push(element);
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
        grid-template-columns: repeat(auto-fit, minmax(min(${
            masonryOptions.minWidth + masonryOptions.gap
        }px, 100%), 1fr));
        margin: ${-Math.abs(masonryOptions.gap)}px
    }
    [data-masonry-item] {
        overflow: hidden;
        padding: ${masonryOptions.gap}px
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
    // doAnimations();
    const elements = Array.from(masonryContainer.children) as HTMLElement[];

    doAnimations();

    for (const element of elements) {
        initItem(element);
    }

    const containerObserver = new MutationObserver(update);

    // Start observing the target node for configured mutations
    containerObserver.observe(masonryContainer, {
        childList: true,
        subtree: true,
    });
    console.log('start');
};

const setContainer = (element: HTMLElement) => {
    if (element) {
        masonryContainer = element;
        masonryContainer.dataset.masonryContainer = '';
    }
};

const waitForContainer = () => {
    const body = document.documentElement || document.body;
    const bodyObserver = new MutationObserver((mutationList, bodyObserver) => {
        for (const mutation of mutationList) {
            if (mutation.type === 'childList') {
                const addedNodes = Array.from(
                    mutation.addedNodes
                ) as HTMLElement[];
                for (const node of addedNodes) {
                    if (node.matches(containerSelector)) {
                        setContainer(node);
                        bodyObserver.disconnect();
                        return;
                    }
                }
            }
        }
        clearTimeout(giveUpAndExitTimeout);
        giveUpAndExitTimeout = setTimeout(() => {
            console.error('Container not found');
            giveUpAndExit = true;
            bodyObserver.disconnect();
        }, 5000);
    });

    bodyObserver.observe(body, {
        childList: true,
        subtree: true,
    });
};

const init = (selector: string, options: Options) => {
    containerSelector = selector;

    const element = document.querySelector(containerSelector) as HTMLElement;

    setContainer(element);

    if (!masonryContainer) {
        waitForContainer();
    }

    console.log('init');
    return {
        start,
    };
};
export default init;
