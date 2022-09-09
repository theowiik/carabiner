import { NodeX } from "../pages";

export interface IBulletPointService {
  get(): Promise<NodeX[] | null>;
  save(nodes: NodeX[]): void;
}

export class LocalStorageRepository implements IBulletPointService {
   private SAVED_KEY: string = 'wasd';

  save(nodes: NodeX[]): void {
    localStorage.setItem(this.SAVED_KEY, JSON.stringify(nodes));
  }

  public get(): Promise<NodeX[] | null> {
    const saved = localStorage.getItem(this.SAVED_KEY);

    return Promise.resolve(this.parse(saved));
  }

  private parse(str: string | null): NodeX[] | null {
    if (str === null) return null;

    return JSON.parse(str);
  }
}
