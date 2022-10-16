let masonryContainer: HTMLElement;

let id = 0;

let timeoutId: number = -1;

interface MasonryItem extends HTMLElement {
    lastHeight: number;
    newHeight: number;
}

const timeoutFunc = () => {
    const children = Array.from(masonryContainer.children) as MasonryItem[];
    children.forEach((wrapper) => {
        const firstPos = wrapper.getBoundingClientRect();
        requestAnimationFrame(() => {
            wrapper.style.gridRow = `span ${wrapper.newHeight} `;
            const lastPos = wrapper.getBoundingClientRect();
            const deltaX = firstPos.left - lastPos.left;
            const deltaY = firstPos.top - lastPos.top;
            if (deltaX === 0) {
                return;
            }
            wrapper.animate(
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
                    duration: 300,
                    easing: 'ease-in-out',
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
        const wrapper = entry.target.parentElement as MasonryItem;
        wrapper.newHeight = height;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(timeoutFunc, 1);
    }
});

const start = () => {
    const wrappers: HTMLElement[] = [];
    const children = Array.from(masonryContainer.children) as HTMLElement[];
    children.forEach((item) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'wrap';
        masonryContainer.insertBefore(wrapper, item);
        wrapper.appendChild(item);
        item.dataset.masonryid = id++ + '';
        resizeObserver.observe(item);
    });
};

const init = (container: HTMLElement) => {
    masonryContainer = container;
    console.log('init');
    return {
        start,
    };
};
export default init;
