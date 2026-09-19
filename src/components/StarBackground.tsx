import { useEffect, useRef } from 'react';

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    class Star {
      x: number;
      y: number;
      size: number;
      baseAlpha: number;
      alpha: number;
      speedY: number;
      twinkleSpeed: number;
      twinkleVal: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.6 + 0.4;
        this.baseAlpha = Math.random() * 0.4 + 0.15;
        this.alpha = this.baseAlpha;
        this.speedY = -(Math.random() * 0.2 + 0.05);
        this.twinkleSpeed = Math.random() * 0.02 + 0.008;
        this.twinkleVal = Math.random() * Math.PI * 2;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + 10;
        this.size = Math.random() * 1.6 + 0.4;
        this.baseAlpha = Math.random() * 0.4 + 0.15;
        this.alpha = this.baseAlpha;
        this.speedY = -(Math.random() * 0.2 + 0.05);
      }

      update() {
        this.y += this.speedY;
        this.twinkleVal += this.twinkleSpeed;
        this.alpha = this.baseAlpha + Math.sin(this.twinkleVal) * 0.18;
        if (this.y < -10) {
          this.reset();
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.fillStyle = `rgba(224, 231, 255, ${Math.max(0.05, Math.min(1, this.alpha))})`;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
      }
    }

    const starCount = Math.min(65, Math.floor(window.innerWidth / 18));
    const stars: Star[] = Array.from({ length: starCount }, () => new Star());

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        star.update();
        star.draw(ctx);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none z-0 opacity-60"
        style={{
          background:
            'radial-gradient(circle, rgba(99, 102, 241, 0.14) 0%, rgba(168, 85, 247, 0.06) 40%, rgba(244, 63, 94, 0.02) 60%, transparent 75%)',
        }}
        aria-hidden="true"
      />
    </>
  );
}
