import type { Observer, Subject } from './types';

class Settings implements Subject {
  static #instance: Settings | null = null;
  mode: 'light' | 'dark' = 'light';
  #observers = new Map<string, Observer>();

  private constructor() {}

  static get instance() {
    if (!Settings.#instance) {
      Settings.#instance = new Settings();
    }
    return Settings.#instance;
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
