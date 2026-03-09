import { Observable } from '@/core';
import type { MemoryGamePayload } from '../types';

export class GameState {
  private readonly payload: MemoryGamePayload;
  public markedGarbage$: Observable<Set<string>>;

  constructor(payload: MemoryGamePayload) {
    this.payload = payload;
    this.markedGarbage$ = new Observable(new Set());
  }

  public getPayload(): MemoryGamePayload {
    return this.payload;
  }

  public isRoot(objectId: string): boolean {
    return this.payload.rootIds.includes(objectId);
  }

  public toggleMark(objectId: string): void {
    if (this.isRoot(objectId)) return;

    const current = this.markedGarbage$.value;
    const newSet = new Set(current);
    if (newSet.has(objectId)) {
      newSet.delete(objectId);
    } else {
      newSet.add(objectId);
    }
    this.markedGarbage$.set(newSet);
  }

  public getMarked(): string[] {
    return [...this.markedGarbage$.value];
  }

  public reset(): void {
    this.markedGarbage$.set(new Set());
  }
}
