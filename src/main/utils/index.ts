export const degToRad = (degrees: number) => {
  return (degrees / 180) * Math.PI;
};

export const getRandomInt = (min: number = 0, max: number = 1) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomFloat = (min: number = 0, max: number = 1) => {
  return Math.random() * (max - min) + min;
};

export const getRandomNumArray = (length: number, min?: number, max?: number) => {
  return Array.from({ length }).map(() => getRandomFloat(min ?? 0, max || 1));
};

export const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
  const slope = (outMax - outMin) / (inMax - inMin);
  return (value - inMin) * slope + outMin;
};

// https://decipher.dev/30-seconds-of-typescript/docs/throttle/
export const throttle = (fn: Function, wait: number = 200) => {
  let inThrottle: boolean;
  let lastFn: ReturnType<typeof setTimeout>;
  let lastTime: number;

  return function (this: any) {
    const context = this;
    const args = arguments;

    if (!inThrottle) {
      fn.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(
        () => {
          if (Date.now() - lastTime >= wait) {
            fn.apply(context, args);
            lastTime = Date.now();
          }
        },
        Math.max(wait - (Date.now() - lastTime), 0)
      );
    }
  };
};
