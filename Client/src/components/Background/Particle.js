import {
  applyFloating,
  applyMouseForce,
  returnHome,
  applyVelocity,
} from "./physics";

import { MAX_RADIUS } from "./constants";
import { lerp, distance, lerpColor } from "./utils";

// 1. NEW: Add an array of vibrant colors at the top of your file
const RAINBOW_COLORS = [
  "#00ffff", // Neon Cyan
  "#ff00ff", // Neon Magenta
  "#00ff00", // Matrix Green
  "#7b68ee", // Medium Slate Blue
  "#ff1493", // Deep Pink

  "#39ff14", // Neon Lime
  "#ff3131", // Neon Red
  "#ffd300", // Neon Yellow
  "#ff6ec7", // Neon Pink
  "#00e5ff", // Electric Blue
  "#8a2be2", // Electric Violet
  "#00ffcc", // Aqua Mint
  "#ff4500", // Neon Orange
  "#adff2f", // Green Yellow
  "#cfff04", // Laser Lime
  "#ff61ef", // Bright Fuchsia
  "#18ffff", // Bright Aqua
  "#76ff03", // Neon Chartreuse
  "#00bfff", // Deep Sky Blue
  "#e100ff", // Electric Purple
  "#ff355e", // Radical Red
  "#01ffc3", // Neon Turquoise
  "#f000ff", // Hot Violet
  "#ff9f1c", // Neon Amber
  "#7df9ff", // Electric Cyan
  "#bc13fe", // Electric Purple
  "#66ff66", // Neon Mint
  "#ff007f", // Bright Rose
  "#00ffa6", // Spring Neon
  "#bfff00", // Acid Green
];

export default class Particle {
  // Added interactionRadius and initialColor parameters
  constructor(x, y, radius, interactionRadius, initialColor) {
    this.x = x;
    this.y = y;

    this.originX = x;
    this.originY = y;
    this.targetX = x;
    this.targetY = y;

    this.vx = 0;
    this.vy = 0;

    // 1. Randomize the base radius for visual depth (varies between 50% and 100% of your chosen size)
    this.baseRadius = radius * (Math.random() * 0.5 + 0.5); 
    
    // 2. Start at 0 so the existing lerp function automatically animates them growing
    this.radius = 0; 
    
    this.interactionRadius = interactionRadius; 

    this.phase = Math.random() * Math.PI * 2;

    this.color = initialColor;
    this.targetColor = initialColor;

    // 2. NEW: Track the base theme color so we can revert back to it
    this.baseColor = initialColor; 
    
    // 3. NEW: Give this specific dot a permanent random rainbow color
    this.rainbowColor = RAINBOW_COLORS[Math.floor(Math.random() * RAINBOW_COLORS.length)];
    
    // 3. Start at 0 so the existing lerp function automatically animates them fading in
    this.alpha = 0;
  }

  updateSize(mouse) {
    const d = distance(this.x, this.y, mouse.x, mouse.y);
    const activeRadius = mouse.isDown ? this.interactionRadius * 2.5 : this.interactionRadius;

    if (d < activeRadius) {
      const force = (activeRadius - d) / activeRadius;
      
      const targetRadius = this.baseRadius + force * (MAX_RADIUS - this.baseRadius);
      this.radius = lerp(this.radius, targetRadius, 0.2);

      const peakOpacity = mouse.isDown ? 1.0 : 0.85;
      
      // TWEAK 1: Remove the "0.15 +" so the alpha scales purely from 0 to peakOpacity
      const targetAlpha = force * peakOpacity; 
      this.alpha = lerp(this.alpha, targetAlpha, 0.2);

      this.targetColor = this.rainbowColor; 

      const dx = mouse.x - this.originX;
      const dy = mouse.y - this.originY;
      this.targetX = this.originX + (dx * force * 0.15); 
      this.targetY = this.originY + (dy * force * 0.15);

    } else {
      this.radius = lerp(this.radius, this.baseRadius, 0.15);
      
      // TWEAK 2: Tell the dot to fade out to exactly 0 instead of 0.15
      this.alpha = lerp(this.alpha, 0, 0.15); 
      
      this.targetColor = this.baseColor;
      this.targetX = this.originX;
      this.targetY = this.originY;
    }
  }

  draw(ctx) {
    // NEW: If the dot is practically invisible, skip all drawing math!
    if (this.alpha <= 0.01) return; 

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.globalAlpha = this.alpha; 

    if (this.color !== this.baseColor) {
      ctx.shadowBlur = this.radius * 3; 
      ctx.shadowColor = this.color;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;
    } else {
      ctx.shadowBlur = 0; 
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.globalAlpha = 1.0; 
    ctx.shadowBlur = 0; 
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  update({ ctx, mouse, time }) {
    applyFloating(this, time);
    applyMouseForce(this, mouse);
    returnHome(this);
    applyVelocity(this);

    this.updateSize(mouse);

    // This smooth color fade is powered by the lerpColor function we added to utils.js!
    if (this.color !== this.targetColor) {
      this.color = lerpColor(this.color, this.targetColor, 0.1); 
    }

    this.draw(ctx);
  }
}
