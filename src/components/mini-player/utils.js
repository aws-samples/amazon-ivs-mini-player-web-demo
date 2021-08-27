
const hexToRgb = (hex) => hex
  .replace(
    /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
    (m, r, g, b) => `#${r + r + g + g + b + b}`,
  )
  .substring(1)
  .match(/.{2}/g)
  .map((x) => parseInt(x, 16));

const isElementInViewport = (el, percentage = 50) => {
  const { innerHeight, innerWidth } = window; // eslint-disable-line
  const { clientHeight, clientWidth } = document.documentElement; // eslint-disable-line

  const rect = el.getBoundingClientRect();

  const offScreenTop = 0 - (rect.height * percentage) / 100;

  return (
    rect.top >= offScreenTop
    && rect.left >= 0
    && rect.bottom <= (innerHeight || clientHeight)
    && rect.right <= (innerWidth || clientWidth)
  );
};

export { hexToRgb, isElementInViewport };
