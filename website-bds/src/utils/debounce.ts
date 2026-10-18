export function debounce<A extends unknown[]>(fn: (...args: A) => void, ms = 500) {
  let t: number | undefined;
  return (...args: A) => {
    window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), ms);
  };
}
