"use client";
import React, { useEffect, useRef } from "react";

export default function ParticleGlobe() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Animation values
  const angleX = useRef(0);
  const angleY = useRef(0);
  const velocityX = useRef(0.0006);
  const velocityY = useRef(0.0015);

  // Mouse interaction state
  const mouseRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;

    // Handle resizing & High-DPI support
    const handleResize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // --- Generate 3D Globe Particles ---
    const particleCount = 160;
    const globeParticles = [];
    const goldenRatioAngle = Math.PI * (3 - Math.sqrt(5)); // Golden spiral angle

    for (let i = 0; i < particleCount; i++) {
      // Fibonacci sphere algorithm
      const y = 1 - (i / (particleCount - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); // radius at height y
      const theta = goldenRatioAngle * i; // golden spiral angle increment

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Color weights and variance for premium neon blue-violet look
      const isCyan = Math.random() > 0.4;
      const pulseSpeed = 0.02 + Math.random() * 0.03;
      const pulsePhase = Math.random() * Math.PI * 2;

      globeParticles.push({
        x,
        y,
        z,
        isCyan,
        pulseSpeed,
        pulsePhase,
        size: Math.random() * 1.5 + 1.2,
      });
    }

    // --- Generate Static Background Stars ---
    const starCount = 45;
    const backgroundStars = [];
    for (let i = 0; i < starCount; i++) {
      backgroundStars.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 1.2 + 0.5,
        opacity: 0.1 + Math.random() * 0.5,
        speed: 0.0002 + Math.random() * 0.0003,
      });
    }

    // --- Generate Holographic Grid Rings (Latitude & Longitude) ---
    // We create structural rings that rotate with the globe to enhance 3D effect
    const rings = [];
    const ringPointCount = 48;

    // Create 3 Latitudinal rings (Equator and +/- 0.5 Y)
    [-0.5, 0, 0.5].forEach((yHeight) => {
      const ringRad = Math.sqrt(1 - yHeight * yHeight);
      const ringPoints = [];
      for (let j = 0; j < ringPointCount; j++) {
        const theta = (j / ringPointCount) * Math.PI * 2;
        ringPoints.push({
          x: Math.cos(theta) * ringRad,
          y: yHeight,
          z: Math.sin(theta) * ringRad,
        });
      }
      rings.push(ringPoints);
    });

    // Create 2 Longitudinal rings (X-plane and Z-plane)
    const longRingPoints1 = [];
    const longRingPoints2 = [];
    for (let j = 0; j < ringPointCount; j++) {
      const theta = (j / ringPointCount) * Math.PI * 2;
      longRingPoints1.push({
        x: Math.cos(theta),
        y: Math.sin(theta),
        z: 0,
      });
      longRingPoints2.push({
        x: 0,
        y: Math.cos(theta),
        z: Math.sin(theta),
      });
    }
    rings.push(longRingPoints1, longRingPoints2);

    // --- Mouse Listeners ---
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      mouseRef.current.targetX = mouseX;
      mouseRef.current.targetY = mouseY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const container = containerRef.current;
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    // --- Main Animation Loop ---
    let frameTime = 0;
    const render = () => {
      frameTime += 1;

      // Clear Canvas
      ctx.fillStyle = "#070b13";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      // Calculate dynamic radius to fit neatly inside the screen
      const sphereRadius = Math.min(width, height) * 0.38;

      // --- 1. Draw Radial Cyber Glow behind the globe ---
      const radialGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        sphereRadius * 1.6
      );
      radialGlow.addColorStop(0, "rgba(59, 130, 246, 0.12)"); // glowing blue
      radialGlow.addColorStop(0.5, "rgba(139, 92, 246, 0.05)"); // soft purple
      radialGlow.addColorStop(1, "rgba(7, 11, 19, 0)"); // fade out
      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sphereRadius * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // --- 2. Draw Twinkling Background Stars (Slowly Drifting) ---
      ctx.fillStyle = "#ffffff";
      backgroundStars.forEach((star) => {
        // Drift downwards
        star.y += star.speed;
        if (star.y > 1) {
          star.y = 0;
          star.x = Math.random();
        }

        const twinkle = 0.4 + Math.sin(frameTime * 0.01 + star.opacity * 100) * 0.35;
        ctx.globalAlpha = star.opacity * twinkle;
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // --- 3. Interpolate Mouse and Apply Spring Inertia ---
      const mouse = mouseRef.current;
      if (mouse.active) {
        // Interpolate mouse towards target coordinates
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;

        // Map mouse coordinates to rotation velocities (-1 to 1 range)
        const factorX = (mouse.y - centerY) / centerY;
        const factorY = (mouse.x - centerX) / centerX;

        const targetVelX = factorX * 0.005;
        const targetVelY = factorY * 0.005;

        // Smoothly accelerate rotation velocities
        velocityX.current += (targetVelX - velocityX.current) * 0.06;
        velocityY.current += (targetVelY - velocityY.current) * 0.06;
      } else {
        // Slowly decay back to ambient rotation speeds
        velocityX.current += (0.0006 - velocityX.current) * 0.03;
        velocityY.current += (0.0016 - velocityY.current) * 0.03;
      }

      // Update angles
      angleX.current += velocityX.current;
      angleY.current += velocityY.current;

      const cosX = Math.cos(angleX.current);
      const sinX = Math.sin(angleX.current);
      const cosY = Math.cos(angleY.current);
      const sinY = Math.sin(angleY.current);

      // Helper function to rotate 3D coordinates
      const rotate3D = (pt) => {
        // Rotate around Y axis
        const x1 = pt.x * cosY - pt.z * sinY;
        const z1 = pt.x * sinY + pt.z * cosY;

        // Rotate around X axis
        const y2 = pt.y * cosX - z1 * sinX;
        const z2 = pt.y * sinX + z1 * cosX;

        return { x: x1, y: y2, z: z2 };
      };

      // Helper function for perspective projection
      // D is camera distance. Larger D = flatter orthographic perspective.
      const cameraDistance = 2.4;
      const project = (pt3D) => {
        const scale = cameraDistance / (cameraDistance + pt3D.z);
        return {
          x: pt3D.x * sphereRadius * scale + centerX,
          y: pt3D.y * sphereRadius * scale + centerY,
          depth: pt3D.z, // Z is depth (-1 is closest, 1 is furthest)
          scale,
        };
      };

      // --- 4. Rotate and Project Latitudinal/Longitudinal Rings ---
      ctx.lineWidth = 1;
      rings.forEach((ringPoints, rIndex) => {
        ctx.beginPath();
        let firstPoint = true;

        // We draw the ring as a sequence of connected points
        ringPoints.forEach((pt) => {
          const rot = rotate3D(pt);
          const proj = project(rot);

          // We only draw parts of the ring that are visible or adjust opacity by depth
          // Since it's a dotted/dashed ring, let's use globalAlpha
          if (firstPoint) {
            ctx.moveTo(proj.x, proj.y);
            firstPoint = false;
          } else {
            ctx.lineTo(proj.x, proj.y);
          }
        });

        ctx.closePath();

        // Style the grid rings (very faint cyan/violet)
        const isEquator = rIndex === 1;
        ctx.strokeStyle = isEquator
          ? "rgba(6, 182, 212, 0.05)"
          : "rgba(139, 92, 246, 0.03)";
        ctx.setLineDash([2, 5]); // dotted high-tech look
        ctx.stroke();
      });
      ctx.setLineDash([]); // reset dash

      // --- 5. Rotate, Project, and Sort Particles ---
      const projectedParticles = globeParticles.map((p) => {
        const rot = rotate3D(p);
        const proj = project(rot);

        // Calculate opacity based on pulse, depth, and distance to mouse
        const pulse = Math.sin(frameTime * p.pulseSpeed + p.pulsePhase) * 0.25 + 0.75;
        // Map depth from [-1, 1] to [1, 0.1] opacity
        const depthOpacity = 0.55 + (-proj.depth * 0.45);
        
        let opacity = depthOpacity * pulse;

        // Interactive mouse connection check (distance in 2D space)
        let mouseDist = 9999;
        let isCloseToMouse = false;
        if (mouse.active) {
          const dx = proj.x - mouse.x;
          const dy = proj.y - mouse.y;
          mouseDist = Math.sqrt(dx * dx + dy * dy);
          if (mouseDist < 85 && proj.depth < 0.2) {
            isCloseToMouse = true;
            // Particles glow more and grow when hovered
            opacity = Math.min(1.0, opacity + (1 - mouseDist / 85) * 0.5);
          }
        }

        return {
          ...p,
          px: proj.x,
          py: proj.y,
          pz: proj.depth,
          scale: proj.scale,
          opacity,
          mouseDist,
          isCloseToMouse,
        };
      });

      // Sort by depth (back-to-front rendering for correct visual layering)
      projectedParticles.sort((a, b) => b.pz - a.pz);

      // --- 6. Draw Connecting Faint Constellation Lines ---
      // We only draw lines between points on the "front" half of the sphere (pz < 0.2)
      // to keep it looking clean and highly performant.
      ctx.lineWidth = 0.8;
      for (let i = 0; i < projectedParticles.length; i++) {
        const p1 = projectedParticles[i];
        if (p1.pz > 0.2) continue; // Skip particles in the background for clean visualization

        let drawnLines = 0;
        for (let j = i + 1; j < projectedParticles.length; j++) {
          const p2 = projectedParticles[j];
          if (p2.pz > 0.2) continue;
          if (drawnLines >= 3) break; // Limit lines per node for a clean constellation

          // Calculate 3D distance between points (on a unit sphere)
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = p1.z - p2.z;
          const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

          // If close in 3D space, connect them!
          if (dist3D < 0.36) {
            // Compute line opacity based on 3D distance and depth
            const lineOpacity =
              (1.0 - dist3D / 0.36) *
              0.14 *
              (0.5 + (-p1.pz * 0.25 + -p2.pz * 0.25));

            ctx.strokeStyle = p1.isCyan
              ? `rgba(6, 182, 212, ${lineOpacity})`
              : `rgba(139, 92, 246, ${lineOpacity})`;

            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
            drawnLines++;
          }
        }
      }

      // --- 7. Draw Dynamic Interactive Mouse Lines ---
      if (mouse.active) {
        projectedParticles.forEach((p) => {
          if (p.isCloseToMouse) {
            // Draw faint magnetic light lines from mouse pointer to hover particles
            const attractionOpacity = (1 - p.mouseDist / 85) * 0.15 * (1 - p.pz);
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = p.isCyan
              ? `rgba(34, 211, 238, ${attractionOpacity})`
              : `rgba(167, 139, 250, ${attractionOpacity})`;

            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p.px, p.py);
            ctx.stroke();
          }
        });
      }

      // --- 8. Render the Spherical Globe Particles ---
      projectedParticles.forEach((p) => {
        // Depth-dependent radius
        const radius = p.size * p.scale * (p.isCloseToMouse ? 1.4 : 1.0);

        // Core fill colors
        let fillStyle;
        if (p.isCyan) {
          fillStyle = `rgba(34, 211, 238, ${p.opacity})`; // Neon Cyan
        } else {
          fillStyle = `rgba(168, 85, 247, ${p.opacity})`; // Neon Violet
        }

        // Draw particle shadow blur for high-tech glow on foreground particles
        if (p.pz < -0.3) {
          ctx.shadowBlur = p.isCloseToMouse ? 15 : 6;
          ctx.shadowColor = p.isCyan
            ? "rgba(6, 182, 212, 0.8)"
            : "rgba(139, 92, 246, 0.8)";
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.arc(p.px, p.py, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Clear shadows for the next frame
      ctx.shadowBlur = 0;

      // Repeat animation loop
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full bg-[#070b13] overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}
