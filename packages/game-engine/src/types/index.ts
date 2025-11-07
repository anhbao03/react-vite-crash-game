/**
 * Game Engine Types
 */

import type { Application, Container } from 'pixi.js';

export interface GameConfig {
  width: number;
  height: number;
  backgroundColor: number;
  antialias: boolean;
  resolution: number;
  autoResize: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface GameState {
  status: 'waiting' | 'betting' | 'starting' | 'flying' | 'crashed';
  multiplier: number;
  elapsedTime: number;
  crashPoint?: number;
}

export interface GraphPoint {
  x: number;
  y: number;
  multiplier: number;
  timestamp: number;
}

export interface ParticleConfig {
  count: number;
  speed: number;
  lifetime: number;
  colors: number[];
}

export interface IScene {
  app: Application;
  container: Container;
  init(): void;
  update(delta: number): void;
  destroy(): void;
}

export interface IManager {
  init(): Promise<void>;
  destroy(): void;
}

export type EventCallback = (...args: any[]) => void;

export interface EventMap {
  [event: string]: EventCallback[];
}
