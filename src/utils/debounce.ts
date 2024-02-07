export const debounce = (callback: Function, ms: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      callback(args);
    }, ms);
  };
}
