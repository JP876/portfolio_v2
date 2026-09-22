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

  #getTheme(): typeof INITIAL_THEME {
    const styles = getComputedStyle(document.documentElement);

    return {
      white: styles.getPropertyValue('--clr-white'),
      black: styles.getPropertyValue('--clr-black'),
      grey: {
        100: styles.getPropertyValue('--clr-grey-100'),
        200: styles.getPropertyValue('--clr-grey-200'),
        300: styles.getPropertyValue('--clr-grey-300'),
        400: styles.getPropertyValue('--clr-grey-400'),
        500: styles.getPropertyValue('--clr-grey-500'),
        600: styles.getPropertyValue('--clr-grey-600'),
        700: styles.getPropertyValue('--clr-grey-700'),
        800: styles.getPropertyValue('--clr-grey-800'),
        900: styles.getPropertyValue('--clr-grey-900'),
      },
      primary: {
        extraLight: styles.getPropertyValue('--background-extra-light'),
        light: styles.getPropertyValue('--background-light'),
        main: styles.getPropertyValue('--background-main'),
        dark: styles.getPropertyValue('--background-dark'),
        extraDark: styles.getPropertyValue('--background-extra-dark'),
      },
      secondary: {
        extraLight: styles.getPropertyValue('--background-accent-extra-light'),
        light: styles.getPropertyValue('--background-accent-light'),
        main: styles.getPropertyValue('--background-accent-main'),
        dark: styles.getPropertyValue('--background-accent-dark'),
        extraDark: styles.getPropertyValue('--background-accent-extra-dark'),
      },
      fontFamily: {
        body: styles.getPropertyValue('--ff-body').split(',')[0].slice(1, -1),
        heading: styles.getPropertyValue('--ff-heading').split(',')[0].slice(1, -1),
      },
    };
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
