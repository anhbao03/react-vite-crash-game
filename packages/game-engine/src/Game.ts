/**
 * Main Game Class
 * Manages PixiJS application and game scenes
 */

import * as PIXI from 'pixi.js';
import { GameScene } from './scenes/GameScene';
import type { GameConfig, GameState } from './types';

export class Game {
  private app: PIXI.Application;
  private gameScene: GameScene | null = null;
  private container: HTMLElement;
  private config: GameConfig;
  private resizeObserver: ResizeObserver | null = null;

  constructor(container: HTMLElement, config: Partial<GameConfig> = {}) {
    this.container = container;
    this.config = {
      width: config.width || 800,
      height: config.height || 600,
      backgroundColor: config.backgroundColor || 0x0f172a,
      antialias: config.antialias !== undefined ? config.antialias : true,
      resolution: config.resolution || window.devicePixelRatio || 1,
      autoResize: config.autoResize !== undefined ? config.autoResize : true,
    };

    // Initialize PixiJS Application (v7 constructor)
    this.app = new PIXI.Application({
      width: this.config.width,
      height: this.config.height,
      backgroundColor: this.config.backgroundColor,
      antialias: this.config.antialias,
      resolution: this.config.resolution,
    });
  }

  /**
   * Initialize the game
   */
  public async init(): Promise<void> {
    try {
      // Append canvas to container
      this.container.appendChild(this.app.view as HTMLCanvasElement);

      // Create and initialize game scene
      this.gameScene = new GameScene(this.app);
      await this.gameScene.init();
      this.app.stage.addChild(this.gameScene.container);

      // Setup resize handling
      if (this.config.autoResize) {
        this.setupResize();
      }

      // Start game loop
      this.app.ticker.add((delta: number) => this.update(delta));

      console.log('✅ Game initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize game:', error);
      throw error;
    }
  }

  /**
   * Update loop
   */
  private update(delta: number): void {
    if (this.gameScene) {
      this.gameScene.update(delta);
    }
  }

  /**
   * Update game state
   */
  public updateGameState(state: Partial<GameState>): void {
    if (this.gameScene) {
      this.gameScene.updateState(state);
    }
  }

  /**
   * Start flying animation
   */
  public startFlying(): void {
    if (this.gameScene) {
      this.gameScene.startFlying();
    }
  }

  /**
   * Update multiplier during flight
   */
  public updateMultiplier(multiplier: number, elapsedTime: number): void {
    if (this.gameScene) {
      this.gameScene.updateMultiplier(multiplier, elapsedTime);
    }
  }

  /**
   * Trigger crash animation
   */
  public crash(crashPoint: number): void {
    if (this.gameScene) {
      this.gameScene.crash(crashPoint);
    }
  }

  /**
   * Reset for new round
   */
  public reset(): void {
    if (this.gameScene) {
      this.gameScene.reset();
    }
  }

  /**
   * Setup responsive resize
   */
  private setupResize(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
    });
    this.resizeObserver.observe(this.container);
  }

  /**
   * Resize game canvas
   */
  private resize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.app.renderer.resize(width, height);

    if (this.gameScene) {
      this.gameScene.resize(width, height);
    }
  }

  /**
   * Destroy and cleanup
   */
  public destroy(): void {
    console.log('🧹 Destroying game...');

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.gameScene) {
      this.gameScene.destroy();
      this.gameScene = null;
    }

    this.app.destroy(true, {
      children: true,
      texture: true,
      baseTexture: true,
    });

    const canvas = this.app.view as HTMLCanvasElement;
    if (this.container.contains(canvas)) {
      this.container.removeChild(canvas);
    }
  }

  /**
   * Get canvas element
   */
  public getCanvas(): HTMLCanvasElement {
    return this.app.view as HTMLCanvasElement;
  }

  /**
   * Get app dimensions
   */
  public getDimensions(): { width: number; height: number } {
    return {
      width: this.app.renderer.width,
      height: this.app.renderer.height,
    };
  }
}
