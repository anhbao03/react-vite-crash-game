/**
 * Game Scene
 * Main game scene that contains all game elements
 */

import * as PIXI from 'pixi.js';
import { Rocket } from '../entities/Rocket';
import { GraphManager } from '../managers/GraphManager';
import type { GameState, IScene } from '../types';

export class GameScene implements IScene {
  public app: PIXI.Application;
  public container: PIXI.Container;

  private rocket: Rocket;
  private graphManager: GraphManager;
  private multiplierText: PIXI.Text;
  private statusText: PIXI.Text;
  private background: PIXI.Graphics;

  private currentState: GameState = {
    status: 'waiting',
    multiplier: 1.0,
    elapsedTime: 0,
  };

  constructor(app: PIXI.Application) {
    this.app = app;
    this.container = new PIXI.Container();

    // Initialize components
    this.background = new PIXI.Graphics();
    this.rocket = new Rocket();
    this.graphManager = new GraphManager(
      this.app.renderer.width,
      this.app.renderer.height
    );
    this.multiplierText = this.createMultiplierText();
    this.statusText = this.createStatusText();
  }

  /**
   * Initialize scene
   */
  public async init(): Promise<void> {
    // Create background
    this.drawBackground();
    this.container.addChild(this.background);

    // Add graph
    this.graphManager.init();
    this.container.addChild(this.graphManager.getGraphics());

    // Add rocket
    const centerX = this.app.renderer.width / 2;
    const startY = this.app.renderer.height - 100;
    this.rocket.setPosition(centerX, startY);
    this.container.addChild(this.rocket.getContainer());

    // Add UI text
    this.container.addChild(this.multiplierText);
    this.container.addChild(this.statusText);

    this.updateUI();
  }

  /**
   * Draw background
   */
  private drawBackground(): void {
    this.background.clear();
    this.background.beginFill(0x0f172a);
    this.background.drawRect(
      0,
      0,
      this.app.renderer.width,
      this.app.renderer.height
    );
    this.background.endFill();

    // Add subtle gradient
    const gradient = new PIXI.Graphics();
    gradient.beginFill(0x1e293b, 0.3);
    gradient.drawRect(
      0,
      this.app.renderer.height / 2,
      this.app.renderer.width,
      this.app.renderer.height / 2
    );
    gradient.endFill();
    this.background.addChild(gradient);
  }

  /**
   * Create multiplier text
   */
  private createMultiplierText(): PIXI.Text {
    const text = new PIXI.Text('1.00x', {
      fontFamily: 'Arial, sans-serif',
      fontSize: 72,
      fontWeight: 'bold',
      fill: 0x10b981,
      stroke: 0x000000,
      strokeThickness: 4,
      dropShadow: true,
      dropShadowColor: 0x000000,
      dropShadowBlur: 10,
      dropShadowAngle: Math.PI / 4,
      dropShadowDistance: 5,
    });

    text.anchor.set(0.5, 0.5);
    text.x = this.app.renderer.width / 2;
    text.y = 100;

    return text;
  }

  /**
   * Create status text
   */
  private createStatusText(): PIXI.Text {
    const text = new PIXI.Text('Waiting for round...', {
      fontFamily: 'Arial, sans-serif',
      fontSize: 24,
      fill: 0x94a3b8,
      stroke: 0x000000,
      strokeThickness: 2,
    });

    text.anchor.set(0.5, 0.5);
    text.x = this.app.renderer.width / 2;
    text.y = 170;

    return text;
  }

  /**
   * Update game state
   */
  public updateState(state: Partial<GameState>): void {
    this.currentState = { ...this.currentState, ...state };
    this.updateUI();
  }

  /**
   * Update UI elements
   */
  private updateUI(): void {
    // Update multiplier text
    this.multiplierText.text = `${this.currentState.multiplier.toFixed(2)}x`;

    // Update multiplier color based on value
    if (this.currentState.multiplier < 2) {
      this.multiplierText.style.fill = 0x10b981; // green
    } else if (this.currentState.multiplier < 5) {
      this.multiplierText.style.fill = 0x3b82f6; // blue
    } else if (this.currentState.multiplier < 10) {
      this.multiplierText.style.fill = 0x8b5cf6; // purple
    } else {
      this.multiplierText.style.fill = 0xec4899; // pink
    }

    // Update status text
    switch (this.currentState.status) {
      case 'waiting':
        this.statusText.text = 'Waiting for round...';
        this.statusText.style.fill = 0x94a3b8;
        break;
      case 'betting':
        this.statusText.text = 'Place your bets!';
        this.statusText.style.fill = 0x10b981;
        break;
      case 'starting':
        this.statusText.text = 'Starting...';
        this.statusText.style.fill = 0xfbbf24;
        break;
      case 'flying':
        this.statusText.text = 'FLYING!';
        this.statusText.style.fill = 0x3b82f6;
        break;
      case 'crashed':
        this.statusText.text = `CRASHED at ${this.currentState.crashPoint?.toFixed(2)}x!`;
        this.statusText.style.fill = 0xef4444;
        break;
    }
  }

  /**
   * Start flying animation
   */
  public startFlying(): void {
    this.currentState.status = 'flying';
    this.rocket.startFlying();
    this.graphManager.clear();
    this.updateUI();
  }

  /**
   * Update multiplier during flight
   */
  public updateMultiplier(multiplier: number, elapsedTime: number): void {
    this.currentState.multiplier = multiplier;
    this.currentState.elapsedTime = elapsedTime;
    this.graphManager.addPoint(multiplier, elapsedTime);
    this.updateUI();
  }

  /**
   * Crash animation
   */
  public crash(crashPoint: number): void {
    this.currentState.status = 'crashed';
    this.currentState.crashPoint = crashPoint;
    this.rocket.explode();
    this.graphManager.animateCrash();
    this.updateUI();
  }

  /**
   * Reset for new round
   */
  public reset(): void {
    const centerX = this.app.renderer.width / 2;
    const startY = this.app.renderer.height - 100;
    this.rocket.reset(centerX, startY);
    this.graphManager.clear();
    this.currentState = {
      status: 'waiting',
      multiplier: 1.0,
      elapsedTime: 0,
    };
    this.updateUI();
  }

  /**
   * Update loop
   */
  public update(delta: number): void {
    if (this.currentState.status === 'flying') {
      this.rocket.update(delta, this.currentState.multiplier);

      // Update trail positions
      const trail = this.rocket.getTrail();
      trail.forEach((trailPiece, index) => {
        trailPiece.alpha = (index / trail.length) * 0.3;
      });
    }
  }

  /**
   * Resize scene
   */
  public resize(width: number, height: number): void {
    this.drawBackground();
    this.graphManager.resize(width, height);

    // Reposition elements
    this.multiplierText.x = width / 2;
    this.statusText.x = width / 2;

    const centerX = width / 2;
    const startY = height - 100;
    this.rocket.setPosition(centerX, startY);
  }

  /**
   * Destroy scene
   */
  public destroy(): void {
    this.rocket.destroy();
    this.graphManager.destroy();
    this.container.destroy({ children: true });
  }
}
