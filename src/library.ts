/* eslint-disable prettier/prettier */
let containerSelector: string;
let masonryContainer: HTMLElement | null;
let items: NodeListOf<ChildNode>;

const start = () => {
  if (!masonryContainer) {
    console.error("no container");
    return;
  }
  const copy = masonryContainer.cloneNode(true) as HTMLElement;
  const tempEle: ChildNode[] = [];
  for (const item of masonryContainer.children) {
    const copii = item.cloneNode(true);
    const wrapper = document.createElement("div");
    wrapper.className = "wrap";
    wrapper.append(copii);
    tempEle.push(wrapper);
  }
  masonryContainer.replaceChildren(...tempEle);

  const resizeObserver = new ResizeObserver(
    (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        const height = Math.ceil(entry.contentRect.height);
        requestAnimationFrame(() => {
          entry.target.parentElement.style.gridRow = `span ${height}`;
          // console.dir(entry.target);
        });
      }
    }
  );

  masonryContainer.childNodes.forEach((element) => {
    resizeObserver.observe(element.firstChild as Element);
    console.log(element);
  });
};

const init = (selector: string) => {
  containerSelector = selector;
  masonryContainer = document.querySelector(containerSelector);

  if (!masonryContainer) {
    console.log("höh");
    const body = document.documentElement || document.body;

    const observer = new MutationObserver((record, observer) => {
      masonryContainer = document.querySelector(containerSelector);
      console.log("obseer");
      if (masonryContainer) {
        items = masonryContainer.childNodes;
        observer.disconnect();
        console.log("disconnn");
      }
    });

    observer.observe(body, {
      childList: true,
      subtree: true,
    });
  }
  return {
    start,
  };
};
export default init;
