/**
 * Rocket Entity
 * Represents the rocket sprite and its animations
 */

import * as PIXI from 'pixi.js';

export class Rocket {
  private container: PIXI.Container;
  private rocket: PIXI.Graphics;
  private flame: PIXI.Graphics;
  private trail: PIXI.Graphics[] = [];
  private isFlying = false;
  private speed = 2;
  private maxTrailLength = 20;

  constructor() {
    this.container = new PIXI.Container();
    this.rocket = this.createRocket();
    this.flame = this.createFlame();

    this.container.addChild(this.rocket);
    this.container.addChild(this.flame);
  }

  /**
   * Create rocket graphic
   */
  private createRocket(): PIXI.Graphics {
    const graphics = new PIXI.Graphics();

    // Rocket body (triangle)
    graphics.beginFill(0x667eea);
    graphics.moveTo(0, -30);
    graphics.lineTo(-15, 10);
    graphics.lineTo(15, 10);
    graphics.closePath();
    graphics.endFill();

    // Rocket window
    graphics.beginFill(0x3b82f6);
    graphics.drawCircle(0, -10, 8);
    graphics.endFill();

    // Rocket fins
    graphics.beginFill(0x4f46e5);
    graphics.moveTo(-15, 10);
    graphics.lineTo(-25, 25);
    graphics.lineTo(-10, 15);
    graphics.closePath();
    graphics.endFill();

    graphics.beginFill(0x4f46e5);
    graphics.moveTo(15, 10);
    graphics.lineTo(25, 25);
    graphics.lineTo(10, 15);
    graphics.closePath();
    graphics.endFill();

    return graphics;
  }

  /**
   * Create flame graphic
   */
  private createFlame(): PIXI.Graphics {
    const graphics = new PIXI.Graphics();

    // Main flame
    graphics.beginFill(0xfbbf24);
    graphics.moveTo(0, 10);
    graphics.lineTo(-8, 30);
    graphics.lineTo(0, 35);
    graphics.lineTo(8, 30);
    graphics.closePath();
    graphics.endFill();

    // Inner flame
    graphics.beginFill(0xf59e0b);
    graphics.moveTo(0, 15);
    graphics.lineTo(-5, 28);
    graphics.lineTo(0, 32);
    graphics.lineTo(5, 28);
    graphics.closePath();
    graphics.endFill();

    graphics.alpha = 0; // Hidden by default

    return graphics;
  }

  /**
   * Set position
   */
  public setPosition(x: number, y: number): void {
    this.container.x = x;
    this.container.y = y;
  }

  /**
   * Start flying animation
   */
  public startFlying(): void {
    this.isFlying = true;
    this.flame.alpha = 1;

    // Tilt rocket slightly
    this.container.rotation = -0.2;
  }

  /**
   * Stop flying
   */
  public stopFlying(): void {
    this.isFlying = false;
    this.flame.alpha = 0;
    this.container.rotation = 0;
  }

  /**
   * Update animation
   */
  public update(delta: number, multiplier: number): void {
    if (!this.isFlying) return;

    // Animate flame flickering
    const flameScale = 0.8 + Math.random() * 0.4;
    this.flame.scale.y = flameScale;

    // Move rocket based on multiplier
    const moveSpeed = this.speed * delta;
    this.container.y -= moveSpeed * (1 + multiplier * 0.1);
    this.container.x += moveSpeed * 0.5;

    // Slight wobble
    const wobble = Math.sin(Date.now() * 0.01) * 2;
    this.container.rotation = -0.2 + wobble * 0.02;

    // Add trail
    this.addTrailPoint();
  }

  /**
   * Add trail point
   */
  private addTrailPoint(): void {
    const trailGraphics = new PIXI.Graphics();
    trailGraphics.beginFill(0x667eea, 0.3);
    trailGraphics.drawCircle(0, 0, 5);
    trailGraphics.endFill();

    trailGraphics.x = this.container.x;
    trailGraphics.y = this.container.y + 20;

    this.trail.push(trailGraphics);

    if (this.trail.length > this.maxTrailLength) {
      const removed = this.trail.shift();
      removed?.destroy();
    }
  }

  /**
   * Explosion animation
   */
  public explode(): void {
    this.stopFlying();

    // Scale up animation
    const originalScale = this.container.scale.x;
    this.container.scale.set(originalScale * 1.5);

    setTimeout(() => {
      this.container.scale.set(originalScale);
    }, 200);

    // Fade out trail
    this.trail.forEach((trail) => {
      trail.alpha = 0.1;
    });
  }

  /**
   * Reset rocket
   */
  public reset(x: number, y: number): void {
    this.setPosition(x, y);
    this.stopFlying();
    this.container.rotation = 0;
    this.container.scale.set(1);

    // Clear trail
    this.trail.forEach((trail) => trail.destroy());
    this.trail = [];
  }

  /**
   * Get container
   */
  public getContainer(): PIXI.Container {
    return this.container;
  }

  /**
   * Get trail graphics
   */
  public getTrail(): PIXI.Graphics[] {
    return this.trail;
  }

  /**
   * Destroy rocket
   */
  public destroy(): void {
    this.trail.forEach((trail) => trail.destroy());
    this.trail = [];
    this.container.destroy({ children: true });
  }
}
