import * as PIXI from 'pixi.js';
import { GamePhase } from '../types/game';

interface GameConfig {
  width: number;
  height: number;
  backgroundColor: number;
}

const DEFAULT_CONFIG: GameConfig = {
  width: 800,
  height: 500,
  backgroundColor: 0x0f0f23
};

export class CrashGame {
  private app: PIXI.Application;
  private rocket!: PIXI.Container;
  private rocketSprite!: PIXI.Graphics;
  private flame!: PIXI.Graphics;
  private multiplierText!: PIXI.Text;
  private statusText!: PIXI.Text;
  private graphContainer!: PIXI.Container;
  private graphLine!: PIXI.Graphics;
  private graphPoints: { x: number; y: number }[] = [];
  private stars: PIXI.Graphics[] = [];
  
  private currentMultiplier: number = 1.00;
  private phase: GamePhase = 'waiting';
  private animationFrame: number = 0;
  private isInitialized: boolean = false;
  
  constructor(container: HTMLElement, config: Partial<GameConfig> = {}) {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    
    this.app = new PIXI.Application({
      width: finalConfig.width,
      height: finalConfig.height,
      backgroundColor: finalConfig.backgroundColor,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true
    });
    
    container.appendChild(this.app.view as HTMLCanvasElement);
    
    this.init();
  }
  
  private init(): void {
    this.createStars();
    this.createGraph();
    this.createRocket();
    this.createUI();
    
    // Start animation loop
    this.app.ticker.add(() => this.animate());
    
    this.isInitialized = true;
    console.log('🎮 CrashGame initialized');
  }
  
  private createStars(): void {
    const starsContainer = new PIXI.Container();
    
    for (let i = 0; i < 100; i++) {
      const star = new PIXI.Graphics();
      const size = Math.random() * 2 + 0.5;
      star.beginFill(0xffffff, Math.random() * 0.5 + 0.3);
      star.drawCircle(0, 0, size);
      star.endFill();
      
      star.x = Math.random() * this.app.screen.width;
      star.y = Math.random() * this.app.screen.height;
      
      starsContainer.addChild(star);
      this.stars.push(star);
    }
    
    this.app.stage.addChild(starsContainer);
  }
  
  private createGraph(): void {
    this.graphContainer = new PIXI.Container();
    this.graphContainer.x = 50;
    this.graphContainer.y = this.app.screen.height - 100;
    
    // Graph background
    const graphBg = new PIXI.Graphics();
    graphBg.lineStyle(1, 0x333355);
    
    // Draw grid lines
    const graphWidth = this.app.screen.width - 100;
    const graphHeight = 300;
    
    for (let i = 0; i <= 5; i++) {
      const y = -i * (graphHeight / 5);
      graphBg.moveTo(0, y);
      graphBg.lineTo(graphWidth, y);
    }
    
    for (let i = 0; i <= 10; i++) {
      const x = i * (graphWidth / 10);
      graphBg.moveTo(x, 0);
      graphBg.lineTo(x, -graphHeight);
    }
    
    this.graphContainer.addChild(graphBg);
    
    // Graph line for multiplier
    this.graphLine = new PIXI.Graphics();
    this.graphContainer.addChild(this.graphLine);
    
    this.app.stage.addChild(this.graphContainer);
  }
  
  private createRocket(): void {
    this.rocket = new PIXI.Container();
    
    // Create rocket body using graphics
    this.rocketSprite = new PIXI.Graphics();
    this.drawRocket(this.rocketSprite);
    
    // Create flame
    this.flame = new PIXI.Graphics();
    this.drawFlame(this.flame, 1);
    this.flame.y = 25;
    
    this.rocket.addChild(this.flame);
    this.rocket.addChild(this.rocketSprite);
    
    // Initial position
    this.rocket.x = 100;
    this.rocket.y = this.app.screen.height - 150;
    this.rocket.rotation = -Math.PI / 4; // 45 degrees up
    
    this.app.stage.addChild(this.rocket);
  }
  
  private drawRocket(graphics: PIXI.Graphics): void {
    graphics.clear();
    
    // Main body
    graphics.beginFill(0xff6b6b);
    graphics.moveTo(0, -30);
    graphics.lineTo(12, 10);
    graphics.lineTo(12, 25);
    graphics.lineTo(-12, 25);
    graphics.lineTo(-12, 10);
    graphics.closePath();
    graphics.endFill();
    
    // Window
    graphics.beginFill(0x87CEEB);
    graphics.drawCircle(0, -5, 6);
    graphics.endFill();
    
    graphics.beginFill(0xb0e0e6);
    graphics.drawCircle(0, -5, 4);
    graphics.endFill();
    
    // Fins
    graphics.beginFill(0x4a90d9);
    graphics.moveTo(-12, 15);
    graphics.lineTo(-20, 30);
    graphics.lineTo(-12, 25);
    graphics.closePath();
    graphics.endFill();
    
    graphics.beginFill(0x4a90d9);
    graphics.moveTo(12, 15);
    graphics.lineTo(20, 30);
    graphics.lineTo(12, 25);
    graphics.closePath();
    graphics.endFill();
  }
  
  private drawFlame(graphics: PIXI.Graphics, intensity: number): void {
    graphics.clear();
    
    if (intensity <= 0) return;
    
    const flameHeight = 20 + Math.random() * 10 * intensity;
    
    // Outer flame (orange)
    graphics.beginFill(0xff8c00, 0.8);
    graphics.moveTo(-8, 0);
    graphics.lineTo(0, flameHeight);
    graphics.lineTo(8, 0);
    graphics.closePath();
    graphics.endFill();
    
    // Inner flame (yellow)
    graphics.beginFill(0xffd700, 0.9);
    graphics.moveTo(-4, 0);
    graphics.lineTo(0, flameHeight * 0.7);
    graphics.lineTo(4, 0);
    graphics.closePath();
    graphics.endFill();
  }
  
  private createUI(): void {
    // Multiplier text
    this.multiplierText = new PIXI.Text('1.00x', {
      fontFamily: 'Arial, sans-serif',
      fontSize: 72,
      fontWeight: 'bold',
      fill: 0x00ff88,
      dropShadow: true,
      dropShadowColor: 0x000000,
      dropShadowBlur: 4,
      dropShadowDistance: 2
    });
    
    this.multiplierText.anchor.set(0.5);
    this.multiplierText.x = this.app.screen.width / 2;
    this.multiplierText.y = 80;
    
    this.app.stage.addChild(this.multiplierText);
    
    // Status text
    this.statusText = new PIXI.Text('WAITING FOR BETS...', {
      fontFamily: 'Arial, sans-serif',
      fontSize: 24,
      fontWeight: 'bold',
      fill: 0xffffff,
      dropShadow: true,
      dropShadowColor: 0x000000,
      dropShadowBlur: 2,
      dropShadowDistance: 1
    });
    
    this.statusText.anchor.set(0.5);
    this.statusText.x = this.app.screen.width / 2;
    this.statusText.y = 140;
    
    this.app.stage.addChild(this.statusText);
  }
  
  private animate(): void {
    this.animationFrame++;
    
    // Animate stars
    this.stars.forEach((star, i) => {
      star.alpha = 0.3 + Math.sin(this.animationFrame * 0.02 + i) * 0.2;
    });
    
    // Animate flame
    if (this.phase === 'running') {
      this.drawFlame(this.flame, 1);
      
      // Move rocket based on multiplier
      const progress = Math.min((this.currentMultiplier - 1) / 10, 1);
      this.rocket.x = 100 + progress * (this.app.screen.width - 250);
      this.rocket.y = this.app.screen.height - 150 - progress * 250;
      
      // Slight wobble
      this.rocket.rotation = -Math.PI / 4 + Math.sin(this.animationFrame * 0.1) * 0.05;
    } else if (this.phase === 'crashed') {
      this.drawFlame(this.flame, 0);
      
      // Fall animation
      this.rocket.rotation += 0.05;
      this.rocket.y += 2;
    } else {
      // Idle animation
      this.rocket.y = this.app.screen.height - 150 + Math.sin(this.animationFrame * 0.05) * 5;
      this.drawFlame(this.flame, 0.3);
    }
  }
  
  public updateMultiplier(multiplier: number): void {
    this.currentMultiplier = multiplier;
    this.multiplierText.text = `${multiplier.toFixed(2)}x`;
    
    // Update color based on multiplier
    if (multiplier >= 10) {
      this.multiplierText.style.fill = 0xffd700; // Gold
    } else if (multiplier >= 5) {
      this.multiplierText.style.fill = 0xff8c00; // Orange
    } else if (multiplier >= 2) {
      this.multiplierText.style.fill = 0x00ff88; // Green
    } else {
      this.multiplierText.style.fill = 0xffffff; // White
    }
    
    // Update graph
    this.updateGraph(multiplier);
  }
  
  private updateGraph(multiplier: number): void {
    const graphWidth = this.app.screen.width - 100;
    const graphHeight = 300;
    
    // Add point
    const x = (this.graphPoints.length / 200) * graphWidth;
    const y = -Math.min((multiplier - 1) / 9, 1) * graphHeight;
    this.graphPoints.push({ x, y });
    
    // Redraw line
    this.graphLine.clear();
    this.graphLine.lineStyle(3, 0x00ff88);
    
    if (this.graphPoints.length > 0) {
      this.graphLine.moveTo(0, 0);
      this.graphPoints.forEach(point => {
        this.graphLine.lineTo(point.x, point.y);
      });
    }
  }
  
  public setPhase(phase: GamePhase, data?: { countdown?: number; crashPoint?: number }): void {
    this.phase = phase;
    
    switch (phase) {
      case 'waiting':
        this.statusText.text = 'WAITING FOR BETS...';
        this.statusText.style.fill = 0xffffff;
        this.multiplierText.text = '1.00x';
        this.multiplierText.style.fill = 0xffffff;
        this.resetRocket();
        this.graphPoints = [];
        this.graphLine.clear();
        break;
        
      case 'starting':
        this.statusText.text = `STARTING IN ${data?.countdown || 3}...`;
        this.statusText.style.fill = 0xffd700;
        break;
        
      case 'running':
        this.statusText.text = 'TO THE MOON! 🚀';
        this.statusText.style.fill = 0x00ff88;
        break;
        
      case 'crashed':
        this.statusText.text = `CRASHED @ ${data?.crashPoint?.toFixed(2)}x 💥`;
        this.statusText.style.fill = 0xff4757;
        this.multiplierText.style.fill = 0xff4757;
        break;
    }
  }
  
  public updateCountdown(countdown: number): void {
    if (this.phase === 'starting' || this.phase === 'waiting') {
      this.statusText.text = this.phase === 'starting' 
        ? `STARTING IN ${countdown}...` 
        : `NEXT ROUND IN ${countdown}...`;
    }
  }
  
  private resetRocket(): void {
    this.rocket.x = 100;
    this.rocket.y = this.app.screen.height - 150;
    this.rocket.rotation = -Math.PI / 4;
    this.currentMultiplier = 1.00;
  }
  
  public resize(width: number, height: number): void {
    this.app.renderer.resize(width, height);
    
    // Reposition UI elements
    this.multiplierText.x = width / 2;
    this.statusText.x = width / 2;
    
    // Update graph position
    this.graphContainer.y = height - 100;
  }
  
  public destroy(): void {
    this.app.destroy(true, { children: true, texture: true, baseTexture: true });
    console.log('🎮 CrashGame destroyed');
  }
}
