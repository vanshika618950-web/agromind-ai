import React, { useEffect, useRef } from 'react';

export const Hero3DScene = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates with smooth lerp
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Generate 3D holographic particles (spores, water droplets, atmospheric data)
    const particleCount = 75;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 800 + 100, // 3D depth
        size: Math.random() * 2.5 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4 - 0.2, // slight upward float
        alpha: Math.random() * 0.7 + 0.3,
        color: i % 3 === 0 ? '#4ade80' : i % 3 === 1 ? '#06b6d4' : '#a3e635',
      });
    }

    // 3D Neural Farmland Plant Geometry Nodes
    const plantNodes = [
      { x: 0, y: 120, z: 0 },
      { x: -35, y: 70, z: 20 },
      { x: 40, y: 65, z: -20 },
      { x: -60, y: 10, z: 40 },
      { x: 65, y: 5, z: -35 },
      { x: -20, y: -40, z: 30 },
      { x: 25, y: -45, z: -25 },
      { x: 0, y: -90, z: 10 },
      { x: -10, y: -130, z: 0 },
      { x: 10, y: -140, z: -10 },
    ];

    let angle = 0;

    const render = () => {
      // Smooth mouse lerping for cinematic camera motion
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const offsetX = (mouse.x - width / 2) * 0.08;
      const offsetY = (mouse.y - height / 2) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Atmospheric Radial Light Halo
      const gradient = ctx.createRadialGradient(
        width / 2 + offsetX * 1.5,
        height * 0.45 + offsetY * 1.5,
        50,
        width / 2,
        height * 0.5,
        Math.max(width, height) * 0.6
      );
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.14)');
      gradient.addColorStop(0.3, 'rgba(6, 182, 212, 0.06)');
      gradient.addColorStop(0.7, 'rgba(2, 22, 12, 0.25)');
      gradient.addColorStop(1, 'rgba(1, 9, 4, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Render 3D Floating Bio-particles with depth projection
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around bounds
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // 3D perspective projection factor
        const scale = 500 / (500 + p.z);
        const projX = (p.x - width / 2 + offsetX * (p.z / 300)) * scale + width / 2;
        const projY = (p.y - height / 2 + offsetY * (p.z / 300)) * scale + height / 2;
        const radius = p.size * scale;

        ctx.beginPath();
        ctx.arc(projX, projY, Math.max(0.8, radius), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * scale;
        ctx.shadowBlur = 8 * scale;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 3. Render 3D Holographic Sprout/Neural Crop in Background
      angle += 0.008;
      const centerX = width * 0.5 + offsetX * 0.5;
      const centerY = height * 0.52 + offsetY * 0.5;
      const rotY = Math.sin(angle) * 0.4;
      const rotX = Math.cos(angle * 0.7) * 0.15;

      const projectedNodes = plantNodes.map((n) => {
        // Rotate in 3D space
        const x1 = n.x * Math.cos(rotY) + n.z * Math.sin(rotY);
        const z1 = -n.x * Math.sin(rotY) + n.z * Math.cos(rotY);

        const y2 = n.y * Math.cos(rotX) - z1 * Math.sin(rotX);
        const z2 = n.y * Math.sin(rotX) + z1 * Math.cos(rotX);

        const fov = 400;
        const scale = fov / (fov + z2 + 200);
        return {
          px: centerX + x1 * scale * 1.8,
          py: centerY + y2 * scale * 1.8,
          scale,
        };
      });

      // Connect holographic stems with glowing green veins
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.28)';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#22c55e';

      for (let i = 0; i < projectedNodes.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(projectedNodes[i].px, projectedNodes[i].py);
        ctx.lineTo(projectedNodes[i + 1].px, projectedNodes[i + 1].py);
        ctx.stroke();
      }

      // Draw glowing bio-digital nodes
      projectedNodes.forEach((node, idx) => {
        ctx.beginPath();
        ctx.arc(node.px, node.py, 3.5 * node.scale, 0, Math.PI * 2);
        ctx.fillStyle = idx % 2 === 0 ? '#4ade80' : '#22d3ee';
        ctx.globalAlpha = 0.85;
        ctx.fill();
      });

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 w-full h-full"
    />
  );
};

export default Hero3DScene;
