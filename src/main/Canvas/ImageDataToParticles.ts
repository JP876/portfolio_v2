import { PARTICLE_SIZE } from './consts';
import Particle from './Particle';

type ImageDataToParticlesOptionsType = {
  size?: number;
};

class ImageDataToParticles {
  static get(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    imageData: ImageDataArray,
    options?: ImageDataToParticlesOptionsType
  ) {
    const particles = [];
    const size = options?.size || PARTICLE_SIZE;

    for (let y = 0; y < canvas.height; y += size) {
      for (let x = 0; x < canvas.width; x += size) {
        const index = (y * canvas.width + x) * 4;
        const alpha = imageData[index + 3];

        if (alpha === 0) continue;

        const r = imageData[index + 0];
        const g = imageData[index + 1];
        const b = imageData[index + 2];
        const color = `rgba(${r},${g},${b},${alpha})`;

        particles.push(new Particle(x, y, color, ctx));
      }
    }

    return particles;
  }
}

export default ImageDataToParticles;
