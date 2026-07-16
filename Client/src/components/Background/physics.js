import {
  
  SPRING,
  FRICTION,
  FLOAT_AMPLITUDE,
  FLOAT_SPEED,
  CURSOR_PADDING,
  MAX_OFFSET,
} from "./constants";

import { distance } from "./utils";

export function applyFloating(particle, time) {
  const targetX =
    particle.originX +
    Math.cos(time * FLOAT_SPEED + particle.phase) *
      FLOAT_AMPLITUDE;

  const targetY =
    particle.originY +
    Math.sin(time * FLOAT_SPEED + particle.phase) *
      FLOAT_AMPLITUDE;

  particle.vx += (targetX - particle.x) * 0.01;
  particle.vy += (targetY - particle.y) * 0.01;
}

export function applyMouseForce(particle, mouse) {
  const dx = mouse.x - particle.originX;
  const dy = mouse.y - particle.originY;

  const d = distance(
    particle.originX,
    particle.originY,
    mouse.x,
    mouse.y
  );

  // Use particle.interactionRadius instead of global constant
  if (d > particle.interactionRadius || d < CURSOR_PADDING) {
    particle.targetX = particle.originX;
    particle.targetY = particle.originY;
    return;
  }

  const force = (particle.interactionRadius - d) / particle.interactionRadius;

  particle.targetX = particle.originX + dx * force * MAX_OFFSET;
  particle.targetY = particle.originY + dy * force * MAX_OFFSET;
}

export function returnHome(particle) {
  particle.vx +=
    (particle.targetX - particle.x) * SPRING;

  particle.vy +=
    (particle.targetY - particle.y) * SPRING;
}

export function applyVelocity(particle) {
  particle.vx *= FRICTION;
  particle.vy *= FRICTION;

  particle.x += particle.vx;
  particle.y += particle.vy;
}