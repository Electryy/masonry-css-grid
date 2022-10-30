type Options = {
    minWidth?: number;
    gap?: number;
    useAnimations?: boolean;
};

interface IMasonryItem extends HTMLElement {
    masonry: {
        lastHeight?: number;
        newHeight?: number;
        firstPosition?: DOMRect | null;
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

const buildGridRow = (height: number) => {
    return `span ${height + masonryOptions.gap * 2}`;
};

const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
        if (entry.borderBoxSize?.length === 0) {
            return;
        }

        const item = entry.target.parentElement as IMasonryItem;
        if (!item) {
            continue;
        }
        const height = Math.ceil(entry.borderBoxSize[0].blockSize);
        const span = buildGridRow(height);
        if (item.style.gridRow !== span) {
            item.style.gridRow = span;
        }
    }
});

const initItem = (content: HTMLElement) => {
    const item = document.createElement('div') as unknown as IMasonryItem;
    item.dataset.masonryItem = '';
    item['masonry'] = {
        firstPosition: null,
    };
    masonryContainer.insertBefore(item, content);
    item.appendChild(content);
    content.dataset.masonryItemContent = '';
    resizeObserver.observe(content);
};

const getItems = () => {
    return Array.from(masonryContainer.children) as IMasonryItem[];
};

const doAnimations = () => {
    const items = getItems();
    // console.log('doanims');

    for (const item of items) {
        if (!item.hasAttribute('data-masonry-item')) {
            continue;
        }
        if (!item.masonry) {
            item.masonry = {
                firstPosition: null,
            };
        }
        item.masonry.firstPosition = item.getBoundingClientRect();
    }
    requestAnimationFrame(() => {
        const items = getItems();

        for (const item of items) {
            if (!item.masonry.firstPosition) {
                continue;
            }

            const lastPos = item.getBoundingClientRect();
            const deltaX = item.masonry.firstPosition.left - lastPos.left;
            const deltaY = item.masonry.firstPosition.top - lastPos.top;
            const deltaW = item.masonry.firstPosition.width / lastPos.width;
            const deltaH = item.masonry.firstPosition.height / lastPos.height;

            if (deltaX > 50 || deltaY > 50) {
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
                        duration: 100,
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
    // const items = Array.from(masonryContainer.children) as IMasonryItem[];
    // const removedElements: HTMLElement[] = [];
    // let next = false;
    // for (const element of items) {
    //     if (element.children.length === 0) {
    //         element.remove();
    //         next = true;
    //     } else if (!element.hasAttribute('data-masonry-item')) {
    //         initItem(element);
    //     }
    // }
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

    const elements = Array.from(masonryContainer.children) as HTMLElement[];

    for (const element of elements) {
        initItem(element);
    }

    doAnimations();
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
    const element = document.querySelector(containerSelector) as HTMLElement;

    setContainer(element);

    if (masonryContainer) {
        return;
    }
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

    waitForContainer();

    console.log('init');
    return {
        start,
    };
};
export default init;
