/**
 * Graph Manager
 * Handles the multiplier graph rendering
 */

import * as PIXI from 'pixi.js';
import type { GraphPoint } from '../types';
import { getMultiplierColor } from '@crash-game/utils';

export class GraphManager {
  private graphics: PIXI.Graphics;
  private points: GraphPoint[] = [];
  private width: number;
  private height: number;
  private maxPoints = 100;
  private startTime = 0;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.graphics = new PIXI.Graphics();
  }

  /**
   * Initialize graph
   */
  public init(): void {
    this.clear();
  }

  /**
   * Add a new point to the graph
   */
  public addPoint(multiplier: number, elapsedTime: number): void {
    if (this.points.length === 0) {
      this.startTime = Date.now();
    }

    const point: GraphPoint = {
      x: this.mapTimeToX(elapsedTime),
      y: this.mapMultiplierToY(multiplier),
      multiplier,
      timestamp: Date.now(),
    };

    this.points.push(point);

    // Keep only recent points
    if (this.points.length > this.maxPoints) {
      this.points.shift();
    }

    this.draw();
  }

  /**
   * Draw the graph
   */
  private draw(): void {
    this.graphics.clear();

    if (this.points.length < 2) return;

    // Draw grid
    this.drawGrid();

    // Draw line with gradient effect
    this.drawLine();

    // Draw glow effect
    this.drawGlow();
  }

  /**
   * Draw background grid
   */
  private drawGrid(): void {
    const gridColor = 0x1e293b;
    const gridAlpha = 0.3;

    this.graphics.lineStyle(1, gridColor, gridAlpha);

    // Horizontal lines
    for (let i = 0; i <= 5; i++) {
      const y = (this.height / 5) * i;
      this.graphics.moveTo(0, y);
      this.graphics.lineTo(this.width, y);
    }

    // Vertical lines
    for (let i = 0; i <= 10; i++) {
      const x = (this.width / 10) * i;
      this.graphics.moveTo(x, 0);
      this.graphics.lineTo(x, this.height);
    }
  }

  /**
   * Draw the main line
   */
  private drawLine(): void {
    if (this.points.length < 2) return;

    const currentMultiplier = this.points[this.points.length - 1].multiplier;
    const color = this.parseColor(getMultiplierColor(currentMultiplier));

    this.graphics.lineStyle(3, color, 1);

    // Draw smooth curve through points
    this.graphics.moveTo(this.points[0].x, this.points[0].y);

    for (let i = 1; i < this.points.length; i++) {
      const point = this.points[i];
      this.graphics.lineTo(point.x, point.y);
    }
  }

  /**
   * Draw glow effect under the line
   */
  private drawGlow(): void {
    if (this.points.length < 2) return;

    const currentMultiplier = this.points[this.points.length - 1].multiplier;
    const color = this.parseColor(getMultiplierColor(currentMultiplier));

    this.graphics.lineStyle(0);
    this.graphics.beginFill(color, 0.1);

    this.graphics.moveTo(this.points[0].x, this.height);
    this.graphics.lineTo(this.points[0].x, this.points[0].y);

    for (let i = 1; i < this.points.length; i++) {
      const point = this.points[i];
      this.graphics.lineTo(point.x, point.y);
    }

    this.graphics.lineTo(this.points[this.points.length - 1].x, this.height);
    this.graphics.closePath();
    this.graphics.endFill();
  }

  /**
   * Map time to X coordinate
   */
  private mapTimeToX(elapsedTime: number): number {
    // Map 0-10 seconds to 0-width
    const maxTime = 10000; // 10 seconds
    return (elapsedTime / maxTime) * this.width;
  }

  /**
   * Map multiplier to Y coordinate
   */
  private mapMultiplierToY(multiplier: number): number {
    // Map 1x-10x to height-0 (inverted Y axis)
    const minMultiplier = 1;
    const maxMultiplier = 10;
    const clampedMultiplier = Math.min(multiplier, maxMultiplier);
    const normalized = (clampedMultiplier - minMultiplier) / (maxMultiplier - minMultiplier);
    return this.height - normalized * this.height;
  }

  /**
   * Parse hex color string to number
   */
  private parseColor(colorString: string): number {
    return parseInt(colorString.replace('#', '0x'));
  }

  /**
   * Animate crash effect
   */
  public animateCrash(): void {
    // Flash effect
    this.graphics.alpha = 0.5;
    setTimeout(() => {
      this.graphics.alpha = 1;
    }, 100);
  }

  /**
   * Clear the graph
   */
  public clear(): void {
    this.points = [];
    this.graphics.clear();
    this.startTime = 0;
  }

  /**
   * Resize graph
   */
  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.clear();
  }

  /**
   * Get graphics object
   */
  public getGraphics(): PIXI.Graphics {
    return this.graphics;
  }

  /**
   * Destroy manager
   */
  public destroy(): void {
    this.graphics.destroy();
  }
}
