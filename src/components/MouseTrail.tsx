"use client";

import { useEffect, useRef } from "react";

const MouseTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const pointsRef = useRef<Array<{ x: number; y: number; life: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };

      pointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        life: 1,
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw points
      pointsRef.current.forEach((point, index) => {
        point.life -= 0.02;

        if (point.life <= 0) {
          pointsRef.current.splice(index, 1);
          return;
        }

        ctx.beginPath();
        ctx.arc(point.x, point.y, point.life * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(57, 255, 19, ${point.life * 0.5})`;
        ctx.fill();
      });

      // Draw lines between points
      ctx.beginPath();
      ctx.moveTo(pointsRef.current[0]?.x || 0, pointsRef.current[0]?.y || 0);
      pointsRef.current.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.strokeStyle = "rgba(57, 255, 19, 0.1)";
      ctx.stroke();

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default MouseTrail;
