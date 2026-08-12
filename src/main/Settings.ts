class Settings {
  static #instance: Settings | null = null;
  theme: 'light' | 'dark' = 'light';

  private constructor() {}

  static get instance() {
    if (!Settings.#instance) {
      Settings.#instance = new Settings();
    }
    return Settings.#instance;
  }
}

export default Settings;
