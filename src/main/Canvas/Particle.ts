import { PARTICLE_SIZE, MOUSE_RADIUS } from './consts';

class Particle {
  private readonly ctx: CanvasRenderingContext2D | null = null;

  size: number = PARTICLE_SIZE;
  color: string = '';
  private x: number = 0;
  private y: number = 0;
  private originX: number = 0;
  private originY: number = 0;
  private initialColor: string = '';
  private dx: number = 0;
  private dy: number = 0;
  private vx: number = 0;
  private vy: number = 0;
  private force: number = 0;
  private angle: number = 0;
  private distance: number = 0;
  private friction: number = 0.4;
  private ease: number = 0.14;
  private mouse = { x: 0, y: 0 };

  constructor(x: number, y: number, color: string, ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.color = color;
    this.initialColor = color;
    this.originX = x;
    this.originY = y;
  }

  get position() {
    return { x: this.x, y: this.y };
  }

  draw() {
    if (!this.ctx) return null;

    this.ctx.save();
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.size, this.size);
    this.ctx.restore();
  }

  update(mouseX: number, mouseY: number) {
    this.mouse = { x: mouseX, y: mouseY };

    this.dx = this.mouse.x - this.x;
    this.dy = this.mouse.y - this.y;
    this.distance = Math.hypot(this.dx, this.dy);
    this.force = -MOUSE_RADIUS / this.distance;

    if (this.distance < MOUSE_RADIUS) {
      this.angle = Math.atan2(this.dy, this.dx);
      this.vx += this.force * Math.cos(this.angle);
      this.vy += this.force * Math.sin(this.angle);

      // if (this.distance < MOUSE_RADIUS * 0.6) {
      //   this.color = 'rgb(0, 166, 255)';
      // } else {
      //   this.color = this.initialColor;
      // }
    }

    if (this.mouse.x === 0 && this.mouse.y === 0) {
      this.color = this.initialColor;
    }

    this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
    this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
  }
}

export default Particle;
