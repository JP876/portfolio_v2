export interface Observer<T> {
  update(value: T): void;
}

export interface Subject<T> {
  attach(key: string, observer: Observer<T>): void;
  detach(key: string): void;
  notify(): void;
}
