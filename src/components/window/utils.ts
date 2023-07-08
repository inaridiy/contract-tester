export const getDivPosition = (div: HTMLDivElement) => {
  const width = div.offsetWidth;
  const height = div.offsetHeight;
  const { left, top } = div.getBoundingClientRect();
  return { width, height, left, top };
};

export const listenDivPosition = (
  div: HTMLDivElement,
  callback: (position: { width: number; height: number; left: number; top: number }) => void,
) => {
  const observer = new ResizeObserver(() => {
    callback(getDivPosition(div));
  });
  observer.observe(div);
  return () => {
    observer.disconnect();
  };
};
