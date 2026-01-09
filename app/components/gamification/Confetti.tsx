'use client';

import { useEffect, useRef, useState } from 'react';

interface ConfettiPiece {
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  speedX: number;
  speedY: number;
  rotationSpeed: number;
  shape: 'square' | 'circle' | 'star';
}

interface ConfettiProps {
  active: boolean;
  duration?: number;
  colors?: string[];
  className?: string;
}

export function Confetti({
  active,
  duration = 5000,
  colors = ['#22d3ee', '#a855f7', '#ff00aa', '#ffd700', '#22c55e', '#ef4444'],
  className = '',
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!active) return;
    setIsRunning(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces: ConfettiPiece[] = [];
    const pieceCount = 150;

    // Create confetti pieces
    for (let i = 0; i < pieceCount; i++) {
      const shapes: ('square' | 'circle' | 'star')[] = ['square', 'circle', 'star'];
      pieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 100,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
        speedX: (Math.random() - 0.5) * 5,
        speedY: Math.random() * 3 + 2,
        rotationSpeed: (Math.random() - 0.5) * 10,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }

    const drawStar = (x: number, y: number, size: number, rotation: number, color: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const point = i === 0 ? 'moveTo' : 'lineTo';
        ctx[point](Math.cos(angle) * size, Math.sin(angle) * size);
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    };

    const drawPiece = (piece: ConfettiPiece) => {
      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate((piece.rotation * Math.PI) / 180);

      switch (piece.shape) {
        case 'square':
          ctx.fillStyle = piece.color;
          ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
          break;
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, piece.size / 2, 0, Math.PI * 2);
          ctx.fillStyle = piece.color;
          ctx.fill();
          break;
        case 'star':
          drawStar(0, 0, piece.size / 2, 0, piece.color);
          break;
      }

      ctx.restore();
    };

    let animationId: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > duration) {
        cancelAnimationFrame(animationId);
        setIsRunning(false);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pieces.forEach((piece) => {
        piece.y += piece.speedY;
        piece.x += piece.speedX;
        piece.rotation += piece.rotationSpeed;

        // Add gravity
        piece.speedY += 0.05;

        // Add some wind resistance
        piece.speedX *= 0.99;

        drawPiece(piece);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [active, colors, duration]);

  if (!isRunning && !active) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-50 ${className}`}
    />
  );
}
