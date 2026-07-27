import { PARTICLE_SIZE } from './consts';
import { MOUSE_RADIUS } from './consts';

class Particle {
  private readonly ctx: CanvasRenderingContext2D | null = null;

  private x: number = 0;
  private y: number = 0;
  private originX: number = 0;
  private originY: number = 0;
  private color: string = '';
  private size: number = PARTICLE_SIZE;
  private dx: number = 0;
  private dy: number = 0;
  private vx: number = 0;
  private vy: number = 0;
  private force: number = 0;
  private angle: number = 0;
  private distance: number = 0;
  private friction: number = 0.4;
  private ease: number = 0.14;
  private mouse: { x: number; y: number } = { x: 0, y: 0 };

  constructor(x: number, y: number, color: string, ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.color = color;
    this.originX = x;
    this.originY = y;
  }

  draw() {
    if (!this.ctx) return null;

    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  update(x: number, y: number) {
    this.mouse = { x, y };
    this.dx = this.mouse.x - this.x;
    this.dy = this.mouse.y - this.y;
    this.distance = this.dx * this.dx + this.dy * this.dy;
    this.force = -MOUSE_RADIUS / this.distance;

    if (this.distance < MOUSE_RADIUS) {
      this.angle = Math.atan2(this.dy, this.dx);
      this.vx += this.force * Math.cos(this.angle);
      this.vy += this.force * Math.sin(this.angle);
    }

    this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
    this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
  }
}

export default Particle;
