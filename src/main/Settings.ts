import type { Observer, Subject } from './types';

const INITIAL_THEME = {
  fontFamily: {
    body: '',
    heading: '',
  },
  white: '',
  black: '',
  grey: {
    100: '',
    200: '',
    300: '',
    400: '',
    500: '',
    600: '',
    700: '',
    800: '',
    900: '',
  },
  primary: {
    extraLight: '',
    light: '',
    main: '',
    dark: '',
    extraDark: '',
  },
  secondary: {
    extraLight: '',
    light: '',
    main: '',
    dark: '',
    extraDark: '',
  },
};

type styleKeys = {
  background: string[];
  grey: string[];
};

class Settings implements Subject {
  static #instance: Settings | null = null;
  mode: 'light' | 'dark' = 'light';
  theme: typeof INITIAL_THEME = this.#getTheme();
  #observers = new Map<string, Observer>();

  private constructor() {}

  static get instance() {
    if (!Settings.#instance) {
      Settings.#instance = new Settings();
    }
    return Settings.#instance;
  }

  #getTheme() {
    const styles = getComputedStyle(document.documentElement);
    const theme: typeof INITIAL_THEME = {
      ...INITIAL_THEME,
      white: styles.getPropertyValue('--clr-white'),
      black: styles.getPropertyValue('--clr-black'),
      fontFamily: {
        body: styles.getPropertyValue('--ff-body').split(',')[0].slice(1, -1),
        heading: styles.getPropertyValue('--ff-heading').split(',')[0].slice(1, -1),
      },
    };

    const keys = Object.values(styles)
      .filter((key) => key.startsWith('--'))
      .reduce((acc, key) => {
        if (key.startsWith('--background')) {
          return { ...acc, background: [...(acc.background || []), key] };
        } else if (key.startsWith('--clr-grey')) {
          return { ...acc, grey: [...(acc.grey || []), key] };
        }
        return acc;
      }, {} as styleKeys);

    for (const key of keys.grey) {
      const split = key.split('-');
      const lastValue = +split[split.length - 1] as keyof (typeof INITIAL_THEME)['grey'];
      theme.grey[lastValue] = styles.getPropertyValue(key);
    }

    for (const key of keys.background) {
      const split = key.split('-');

      if (key.includes('accent')) {
        const lastValue = split
          .slice(-2)
          .filter((v) => v !== 'accent')
          .map((v, i) => (i > 0 ? v.charAt(0).toUpperCase() + v.slice(1) : v))
          .join('') as keyof (typeof INITIAL_THEME)['secondary'];
        theme.secondary[lastValue] = styles.getPropertyValue(key);
      } else {
        const lastValue = split
          .slice(-2)
          .filter((v) => v !== 'background')
          .map((v, i) => (i > 0 ? v.charAt(0).toUpperCase() + v.slice(1) : v))
          .join('') as keyof (typeof INITIAL_THEME)['primary'];
        theme.primary[lastValue] = styles.getPropertyValue(key);
      }
    }

    return theme;
  }

  attach(key: string, observer: Observer) {
    this.#observers.set(key, observer);
  }

  detach(key: string) {
    if (this.#observers.has(key)) {
      this.#observers.delete(key);
    }
  }

  notify() {
    for (const value of this.#observers.values()) {
      value.update({ type: 'settings', instance: this });
    }
  }
}

export default Settings;
