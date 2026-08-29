export interface Observer {
  update(value: { type: string; instance: Subject }): void;
}

export interface Subject {
  attach(key: string, observer: Observer): void;
  detach(key: string): void;
  notify(): void;
}
