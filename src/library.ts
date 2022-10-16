let masonryContainer: HTMLElement;

let id = 0;

let timeoutId: number = -1;

interface MasonryItem extends HTMLElement {
    lastHeight: number;
    newHeight: number;
}

const timeoutFunc = () => {
    const items = Array.from(masonryContainer.children) as MasonryItem[];

    items.forEach((item) => {
        const firstPos = item.getBoundingClientRect();
        // const inner = wrapper.firstChild as HTMLElement;
        // const elementStyles = getComputedStyle(masonryContainer);
        // const gap = parseInt(elementStyles.getPropertyValue('--masonry-gap'));
        // console.log(gap);

        requestAnimationFrame(() => {
            if (item.lastHeight !== item.newHeight) {
                item.style.gridRow = `span ${item.newHeight}`;
            }
            item.lastHeight = item.newHeight;
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
        item.newHeight = height;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(timeoutFunc, 100);
    }
});

const start = () => {
    const elements = Array.from(masonryContainer.children) as HTMLElement[];
    elements.forEach((element) => {
        initItem(element);
    });
};

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

const init = (container: HTMLElement) => {
    masonryContainer = container;

    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
        update();
        // for (const mutation of mutationList) {
        //     if (mutation.type === 'childList') {
        //         const added = Array.from(mutation.addedNodes) as HTMLElement[];

        //         added.forEach((item) => {
        //             if (!item.classList.contains('wrap')) {
        //                 initItem(item);
        //             }
        //         });
        //         clean();
        //         // const removed = Array.from(
        //         //     mutation.removedNodes
        //         // ) as HTMLElement[];

        //         // removed.forEach((item) => {
        //         //     console.log(item);
        //         //     if (item.parentElement.classList.contains('wrap')) {
        //         //     }
        //         // });

        //         // console.log(mutation.removedNodes);
        //     }
        // }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(masonryContainer, { childList: true, subtree: true });

    console.log('init');
    return {
        start,
    };
};
export default init;
