import { useEffect, useRef, useState } from "react";

function ParticalAnimation() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : true
  );

  useEffect(() => {
    // Listen for dark mode class changes on <html>
    const observer = new MutationObserver(() => {
      const currentDark = document.documentElement.classList.contains("dark");
      setIsDark(currentDark);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // If not dark mode, do not run the canvas animation loop
    if (!isDark) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let isVisible = !document.hidden;

    // Viewport dimensions
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Mouse tracking with smooth lerp
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      active: false,
      radius: 140,
    };

    // Dark mode cosmic starlight color palette
    const colors = {
      stars: [
        "rgba(255, 255, 255, ", // Pure radiant starlight
        "rgba(224, 242, 254, ", // Ice cyan
        "rgba(254, 240, 138, ", // Warm gold
        "rgba(233, 213, 255, ", // Soft lavender
        "rgba(214, 211, 209, ", // Silver stone
      ],
      glow: "rgba(255, 255, 255, 0.4)",
      constellation: "rgba(200, 225, 255, ",
      meteorHead: "rgba(255, 255, 255, 1)",
      meteorTail: "rgba(147, 197, 253, 0)",
      meteorGlow: "rgba(191, 219, 254, 0.8)",
    };

    // Dynamic Star Population
    const starCount = Math.max(60, Math.min(130, Math.floor((width * height) / 11000)));
    const stars = [];

    const initStars = () => {
      stars.length = 0;
      for (let i = 0; i < starCount; i++) {
        // Layer 1: 60% distant micro-stars, Layer 2: 25% mid glowing, Layer 3: 15% prominent diamond sparkles
        const rand = Math.random();
        let layer = 1;
        let radius = 0.6 + Math.random() * 0.7;
        let isDiamond = false;
        let baseAlpha = 0.2 + Math.random() * 0.35;

        if (rand > 0.85) {
          layer = 3;
          radius = 0.8 + Math.random() * 0.5; // smaller, delicate sparkle
          isDiamond = true;
          baseAlpha = 0.5 + Math.random() * 0.35;
        } else if (rand > 0.6) {
          layer = 2;
          radius = 0.9 + Math.random() * 0.6;
          baseAlpha = 0.3 + Math.random() * 0.35;
        }

        const colorIndex = Math.floor(Math.random() * colors.stars.length);

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          originX: Math.random() * width,
          originY: Math.random() * height,
          radius,
          layer,
          isDiamond,
          baseAlpha,
          alpha: baseAlpha,
          twinkleSpeed: 0.01 + Math.random() * 0.025 * layer,
          twinklePhase: Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.5) * 0.12 * (layer * 0.6),
          vy: (Math.random() - 0.5) * 0.12 * (layer * 0.6),
          colorIndex,
          sparkleRotation: Math.random() * Math.PI,
          sparkleRotationSpeed: (Math.random() - 0.5) * 0.008,
        });
      }
    };

    // Shooting Stars / Meteors Manager (Rare Celestial Events)
    const meteors = [];
    let nextMeteorTime = Date.now() + 8000 + Math.random() * 8000; // First meteor in 8-16s

    const spawnMeteor = () => {
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.3; // ~45 deg diagonal
      const speed = 14 + Math.random() * 10;
      const length = 140 + Math.random() * 110;
      const startX = Math.random() * width * 1.1;
      const startY = -40 + Math.random() * (height * 0.3);

      meteors.push({
        x: startX,
        y: startY,
        length,
        speed,
        angle,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        tailDx: Math.cos(angle) * length,
        tailDy: Math.sin(angle) * length,
        thickness: 1.2 + Math.random() * 1.4,
        progress: 0,
        maxLife: 55 + Math.floor(Math.random() * 30),
      });

      // Rare interval: Next meteor in 16 to 32 seconds
      nextMeteorTime = Date.now() + 16000 + Math.random() * 16000;
    };

    // Rare & Randomized Cosmic Infalling Matter Streams into Gargantua
    const infallingStreams = [];
    let nextInfallTime = Date.now() + 1500;

    const spawnInfallStream = () => {
      const baseAngle = Math.random() * Math.PI * 2;
      const outerR = 55 + Math.random() * 45;
      const speed = 0.007 + Math.random() * 0.007;
      const spiralTightness = 2.4 + Math.random() * 1.6;
      const spiralDir = Math.random() > 0.4 ? 1 : -1;
      const isCyan = Math.random() > 0.65;

      infallingStreams.push({
        baseAngle,
        outerR,
        speed,
        progress: 0,
        spiralTightness: spiralTightness * spiralDir,
        tailLength: 0.08 + Math.random() * 0.05,
        isCyan,
      });

      // Rare random intervals: Next spontaneous infall in 3 to 7 seconds
      nextInfallTime = Date.now() + 3000 + Math.random() * 4000;
    };

    // Resize Handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      initStars();
    };

    handleResize();

    // Mouse Listeners on window
    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    // Visibility Listener
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Draw 4-point diamond starburst flare (Delicate, celestial jewel sparkle)
    const drawDiamondSparkle = (ctx, x, y, size, alpha, colorPrefix, rotation) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      const rayLength = size * 2.4;
      const rayWidth = size * 0.42;

      // Outer ethereal starlight halo
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rayLength * 1.2);
      grad.addColorStop(0, `${colorPrefix}${alpha * 0.85})`);
      grad.addColorStop(0.5, `${colorPrefix}${alpha * 0.2})`);
      grad.addColorStop(1, `${colorPrefix}0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, rayLength * 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Vertical diamond spike
      ctx.fillStyle = `${colorPrefix}${alpha * 0.95})`;
      ctx.beginPath();
      ctx.moveTo(0, -rayLength);
      ctx.quadraticCurveTo(rayWidth * 0.28, 0, 0, rayLength);
      ctx.quadraticCurveTo(-rayWidth * 0.28, 0, 0, -rayLength);
      ctx.fill();

      // Horizontal diamond spike
      ctx.beginPath();
      ctx.moveTo(-rayLength, 0);
      ctx.quadraticCurveTo(0, rayWidth * 0.28, rayLength, 0);
      ctx.quadraticCurveTo(0, -rayWidth * 0.28, -rayLength, 0);
      ctx.fill();

      // Core stellar point
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.55, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();

      ctx.restore();
    };

    // ==========================================
    // 1. CELESTIAL DISTANT "GARGANTUA" GRAVITATIONAL LENSING SINGULARITY
    // Deep-space supermassive singularity that exerts subtle gravitational effects across the cosmos:
    // - Proportional wide-span miniature accretion disk (aspect ratio ~4.5:1)
    // - Ethereal incandescent horseshoe gravitational lensing dome arched over event horizon
    // - Razor-sharp white-hot Einstein photon ring & pure abyss black shadow
    // - Approaching Doppler beaming hotspot (incandescent starlight white-gold)
    // - Spacetime metric curvature ripples expanding outward towards the solar system
    // - Infalling relativistic matter stream drawn from the deep cosmos
    // ==========================================
    const drawGargantuaSingularity = (ctx, cx, cy, time, parallaxX, parallaxY, infallingStreams = []) => {
      const px = cx + parallaxX * 0.12 + Math.sin(time * 0.00018) * 2;
      const py = cy + parallaxY * 0.12 + Math.cos(time * 0.00025) * 2;
      const shadowR = 6.5; // Distant Event Horizon Radius (Miniature far-away singularity)
      const diskOutX = 36; // Wide horizontal accretion disk span (72px total width)
      const diskOutY = 5.2; // Horizontal disk perspective tilt
      const archHeight = 15; // Height of top gravitational lensing dome
      const archBaseX = 16.5; // Width where upper arch meets mid-disk
      const tilt = -0.10; // Subtle cinematic inclination angle

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(tilt);

      // 1. Spacetime Gravitational Ripples (Metric Perturbations reaching towards solar system)
      for (let w = 0; w < 4; w++) {
        const waveProgress = ((time * 0.0003) + (w * 0.25)) % 1;
        const waveRadius = shadowR * 2 + waveProgress * 280;
        const waveAlpha = Math.max(0, (1 - waveProgress) * 0.14);

        ctx.beginPath();
        ctx.arc(0, 0, waveRadius, 0, Math.PI * 2);
        const waveGrad = ctx.createRadialGradient(0, 0, waveRadius * 0.92, 0, 0, waveRadius);
        waveGrad.addColorStop(0, `rgba(245, 158, 11, 0)`);
        waveGrad.addColorStop(0.7, `rgba(245, 158, 11, ${waveAlpha})`);
        waveGrad.addColorStop(1, `rgba(147, 197, 253, ${waveAlpha * 0.6})`);
        ctx.strokeStyle = waveGrad;
        ctx.lineWidth = 0.65;
        ctx.stroke();
      }

      // 2. Rare & Spontaneous Omnidirectional Infalling Cosmic Matter Streams
      ctx.save();
      for (let s = infallingStreams.length - 1; s >= 0; s--) {
        const stream = infallingStreams[s];
        stream.progress += stream.speed;

        if (stream.progress >= 1) {
          infallingStreams.splice(s, 1);
          continue;
        }

        const innerR = shadowR * 1.15;
        const currR = stream.outerR * (1 - Math.pow(stream.progress, 1.4)) + innerR * Math.pow(stream.progress, 1.4);
        const spiralAngle = stream.baseAngle + Math.pow(stream.progress, 1.6) * stream.spiralTightness;
        const currX = Math.cos(spiralAngle) * currR;
        const currY = Math.sin(spiralAngle) * (currR * 0.42);

        const tailProgress = Math.max(0, stream.progress - stream.tailLength);
        const tailR = stream.outerR * (1 - Math.pow(tailProgress, 1.4)) + innerR * Math.pow(tailProgress, 1.4);
        const tailAngle = stream.baseAngle + Math.pow(tailProgress, 1.6) * stream.spiralTightness;
        const tailX = Math.cos(tailAngle) * tailR;
        const tailY = Math.sin(tailAngle) * (tailR * 0.42);

        const streamAlpha = Math.sin(stream.progress * Math.PI) * (0.38 + stream.progress * 0.58);
        const isHot = stream.progress > 0.55;

        // Draw Infalling Plasma Filament Streak
        const streamGrad = ctx.createLinearGradient(tailX, tailY, currX, currY);
        streamGrad.addColorStop(0, "rgba(254, 240, 138, 0)");
        streamGrad.addColorStop(0.5, stream.isCyan ? `rgba(147, 197, 253, ${streamAlpha * 0.5})` : `rgba(254, 240, 138, ${streamAlpha * 0.5})`);
        streamGrad.addColorStop(1, isHot ? `rgba(255, 255, 255, ${streamAlpha * 0.95})` : `rgba(254, 240, 138, ${streamAlpha * 0.8})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = streamGrad;
        ctx.lineWidth = 0.5 + stream.progress * 0.65;
        ctx.stroke();

        // Infalling Starlight Quanta Point
        const particleSize = 0.5 + stream.progress * 0.65;
        ctx.beginPath();
        ctx.arc(currX, currY, particleSize, 0, Math.PI * 2);
        ctx.fillStyle = isHot ? `rgba(255, 255, 255, ${streamAlpha})` : `rgba(254, 240, 138, ${streamAlpha * 0.9})`;
        ctx.fill();
      }
      ctx.restore();

      // 3. Relativistic Thermal Plasma Bloom & Volumetric Gravitational Flare
      const flareGrad = ctx.createRadialGradient(0, 0, shadowR * 0.5, 0, 0, diskOutX * 1.4);
      flareGrad.addColorStop(0, "rgba(254, 240, 138, 0.28)");
      flareGrad.addColorStop(0.2, "rgba(245, 158, 11, 0.15)");
      flareGrad.addColorStop(0.5, "rgba(180, 83, 9, 0.05)");
      flareGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = flareGrad;
      ctx.beginPath();
      ctx.arc(0, 0, diskOutX * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // 4. REAR ACCRETION DISK (Horizontal Plane Behind Black Hole)
      ctx.save();
      const rearDiskGrad = ctx.createLinearGradient(-diskOutX, 0, diskOutX, 0);
      rearDiskGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
      rearDiskGrad.addColorStop(0.18, "rgba(254, 240, 138, 0.78)"); // Approaching flank
      rearDiskGrad.addColorStop(0.5, "rgba(245, 158, 11, 0.62)");
      rearDiskGrad.addColorStop(0.82, "rgba(180, 83, 9, 0.32)");
      rearDiskGrad.addColorStop(1, "rgba(120, 53, 15, 0)");

      // Rear striated disk bands
      for (let b = 0; b < 2; b++) {
        const rScale = 1 - b * 0.14;
        ctx.beginPath();
        ctx.ellipse(0, 0, diskOutX * rScale, diskOutY * rScale, 0, Math.PI, 2 * Math.PI);
        ctx.strokeStyle = rearDiskGrad;
        ctx.lineWidth = 1.8 - b * 0.5;
        ctx.stroke();
      }
      ctx.restore();

      // 5. UPPER GRAVITATIONAL LENSING DOME (The Iconic Interstellar Horseshoe Arch)
      ctx.save();
      const upperArchGrad = ctx.createLinearGradient(-archBaseX * 1.1, 0, archBaseX * 1.1, 0);
      upperArchGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
      upperArchGrad.addColorStop(0.12, "rgba(255, 255, 255, 0.98)"); // Blazing white-gold Doppler hotspot
      upperArchGrad.addColorStop(0.32, "rgba(254, 240, 138, 0.92)");
      upperArchGrad.addColorStop(0.6, "rgba(245, 158, 11, 0.75)");
      upperArchGrad.addColorStop(0.85, "rgba(217, 119, 6, 0.38)");
      upperArchGrad.addColorStop(1, "rgba(146, 64, 14, 0)");

      // Filled Horseshoe Lensing Arch
      ctx.beginPath();
      ctx.moveTo(-archBaseX, -1);
      ctx.bezierCurveTo(
        -archBaseX * 0.85, -archHeight * 1.25,
        archBaseX * 0.85, -archHeight * 1.25,
        archBaseX, -1
      );
      ctx.bezierCurveTo(
        archBaseX * 0.45, -shadowR * 1.18,
        -archBaseX * 0.45, -shadowR * 1.18,
        -archBaseX, -1
      );
      ctx.closePath();
      ctx.fillStyle = upperArchGrad;
      ctx.fill();

      // Incandescent Upper Caustic Boundary (Inner rim white-hot flare)
      ctx.beginPath();
      ctx.bezierCurveTo(
        -archBaseX * 0.45, -shadowR * 1.14,
        archBaseX * 0.45, -shadowR * 1.14,
        archBaseX * 0.75, -shadowR * 0.5
      );
      ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
      ctx.lineWidth = 0.9;
      ctx.stroke();
      ctx.restore();

      // 6. SUBTLE LOWER GRAVITATIONAL CAUSTIC
      ctx.save();
      const subCausticGrad = ctx.createLinearGradient(-shadowR * 1.4, 0, shadowR * 1.4, 0);
      subCausticGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
      subCausticGrad.addColorStop(0.3, "rgba(254, 240, 138, 0.45)");
      subCausticGrad.addColorStop(0.7, "rgba(245, 158, 11, 0.28)");
      subCausticGrad.addColorStop(1, "rgba(180, 83, 9, 0)");

      ctx.beginPath();
      ctx.bezierCurveTo(
        -shadowR * 1.2, shadowR * 1.15,
        shadowR * 1.2, shadowR * 1.15,
        shadowR * 1.4, shadowR * 0.6
      );
      ctx.strokeStyle = subCausticGrad;
      ctx.lineWidth = 0.75;
      ctx.stroke();
      ctx.restore();

      // 7. THE EVENT HORIZON (Pure Abyss Shadow - Spherical Black Void)
      ctx.beginPath();
      ctx.arc(0, 0, shadowR, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fill();

      // Razor-Sharp Relativistic Photon Ring (Light trapped in unstable orbit)
      const photonGrad = ctx.createLinearGradient(-shadowR, 0, shadowR, 0);
      photonGrad.addColorStop(0, "rgba(255, 255, 255, 0.98)");
      photonGrad.addColorStop(0.35, "rgba(254, 240, 138, 0.92)");
      photonGrad.addColorStop(0.7, "rgba(245, 158, 11, 0.58)");
      photonGrad.addColorStop(1, "rgba(180, 83, 9, 0.2)");

      ctx.beginPath();
      ctx.arc(0, 0, shadowR + 0.3, 0, Math.PI * 2);
      ctx.strokeStyle = photonGrad;
      ctx.lineWidth = 0.85;
      ctx.stroke();

      // 8. FRONT EQUATORIAL ACCRETION DISK (The Grand Blade of Fire)
      ctx.save();
      const frontBladeGrad = ctx.createLinearGradient(-diskOutX * 1.1, 0, diskOutX * 1.1, 0);
      frontBladeGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
      frontBladeGrad.addColorStop(0.15, "rgba(255, 255, 255, 0.98)"); // Left Doppler Hotspot
      frontBladeGrad.addColorStop(0.32, "rgba(254, 240, 138, 0.95)");
      frontBladeGrad.addColorStop(0.55, "rgba(245, 158, 11, 0.85)");
      frontBladeGrad.addColorStop(0.8, "rgba(217, 119, 6, 0.42)");
      frontBladeGrad.addColorStop(1, "rgba(120, 53, 15, 0)");

      // A. Outer Diffuse Gas Disk (Front)
      ctx.beginPath();
      ctx.ellipse(0, 0, diskOutX, diskOutY, 0, 0, Math.PI);
      ctx.strokeStyle = frontBladeGrad;
      ctx.lineWidth = 3.6;
      ctx.stroke();

      // B. Mid Dense Relativistic Plasma Stream (Front)
      const midStreamGrad = ctx.createLinearGradient(-diskOutX * 0.85, 0, diskOutX * 0.85, 0);
      midStreamGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
      midStreamGrad.addColorStop(0.18, "rgba(255, 255, 255, 1)");
      midStreamGrad.addColorStop(0.45, "rgba(254, 243, 199, 0.98)");
      midStreamGrad.addColorStop(0.75, "rgba(245, 158, 11, 0.7)");
      midStreamGrad.addColorStop(1, "rgba(180, 83, 9, 0)");

      ctx.beginPath();
      ctx.ellipse(0, 0, diskOutX * 0.82, diskOutY * 0.72, 0, 0, Math.PI);
      ctx.strokeStyle = midStreamGrad;
      ctx.lineWidth = 1.7;
      ctx.stroke();

      // C. Brilliant White-Hot ISCO Caustic Filament (Cutting directly in front of shadow)
      const iscoGrad = ctx.createLinearGradient(-diskOutX * 0.65, 0, diskOutX * 0.65, 0);
      iscoGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
      iscoGrad.addColorStop(0.2, "rgba(255, 255, 255, 1)");
      iscoGrad.addColorStop(0.6, "rgba(255, 255, 255, 0.95)");
      iscoGrad.addColorStop(0.85, "rgba(254, 240, 138, 0.6)");
      iscoGrad.addColorStop(1, "rgba(245, 158, 11, 0)");

      ctx.beginPath();
      ctx.ellipse(0, 0, diskOutX * 0.64, diskOutY * 0.48, 0, 0, Math.PI);
      ctx.strokeStyle = iscoGrad;
      ctx.lineWidth = 0.85;
      ctx.stroke();

      // 9. Relativistic Keplerian Orbiting Plasma Wisps (Living matter flow)
      for (let p = 0; p < 5; p++) {
        const pSpeed = time * 0.0016 * (1 + (p % 3) * 0.35);
        const pAngle = (pSpeed + (p * Math.PI * 0.35)) % (Math.PI * 2);
        const pRadius = shadowR * 1.25 + ((p * 3.6) % (diskOutX - shadowR * 1.25));
        const pxPos = Math.cos(pAngle) * pRadius;
        const pyPos = Math.sin(pAngle) * (pRadius * (diskOutY / diskOutX));

        if (pyPos >= -shadowR * 0.2 || pxPos < -shadowR || pxPos > shadowR) {
          const isApproaching = pxPos < 0;
          const pAlpha = isApproaching ? 0.95 : 0.35;
          const pSize = 0.6 + (p % 2) * 0.3;

          ctx.beginPath();
          ctx.arc(pxPos, pyPos, pSize, 0, Math.PI * 2);
          ctx.fillStyle = isApproaching ? `rgba(255, 255, 255, ${pAlpha})` : `rgba(251, 191, 36, ${pAlpha})`;
          ctx.fill();
        }
      }

      ctx.restore();
      ctx.restore();
    };

    // ==========================================
    // 2. DISTANT THEME-ALIGNED GAS GIANT ("AETHERIS-IX" / FAR AWAY ICE GIANT)
    // Reimagined as a distant, majestic jewel in Spread's royal amethyst, cosmic indigo, and ice-cyan aesthetic
    // Features: Zonal banded gas dynamics, hexagonal polar vortex, Cassini division crystal ice rings,
    // planetary cast shadows on rings, ring cast shadows on sphere, and distant companion moon.
    // ==========================================
    const drawRingedPlanet = (ctx, cx, cy, radius, time, parallaxX, parallaxY) => {
      const px = cx + parallaxX * 0.18 + Math.sin(time * 0.0003) * 2.5;
      const py = cy + parallaxY * 0.18 + Math.cos(time * 0.0004) * 2;
      const tilt = -0.38; // ~-22 deg axial tilt
      const ringOuterR = radius * 2.3;
      const ringInnerR = radius * 1.28;
      const cassiniR = radius * 1.82;
      const ringMinorRatio = 0.30;

      ctx.save();

      // 1. Theme-Aligned Cosmic Amethyst & Cyan Plasma Corona
      const corona = ctx.createRadialGradient(px, py, radius * 0.75, px, py, radius * 2.2);
      corona.addColorStop(0, "rgba(168, 85, 247, 0.22)"); // Royal violet
      corona.addColorStop(0.35, "rgba(56, 189, 248, 0.12)"); // Electric cyan
      corona.addColorStop(0.7, "rgba(99, 102, 241, 0.05)"); // Cosmic indigo
      corona.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = corona;
      ctx.beginPath();
      ctx.arc(px, py, radius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // 2. Back Half of Multi-Tier Striated Ice Rings (PI to 2*PI)
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(tilt);

      // Translucent Crepe Ring C (Back - Cosmic Indigo)
      ctx.beginPath();
      ctx.ellipse(0, 0, ringInnerR * 1.08, ringInnerR * 1.08 * ringMinorRatio, 0, Math.PI, 2 * Math.PI);
      ctx.strokeStyle = "rgba(129, 140, 248, 0.22)";
      ctx.lineWidth = radius * 0.14;
      ctx.stroke();

      // Dense Radiant Ring B (Back - Crystalline Frost & Pale Violet)
      ctx.beginPath();
      ctx.ellipse(0, 0, (ringInnerR + cassiniR) * 0.5, (ringInnerR + cassiniR) * 0.5 * ringMinorRatio, 0, Math.PI, 2 * Math.PI);
      ctx.strokeStyle = "rgba(224, 231, 255, 0.58)";
      ctx.lineWidth = (cassiniR - ringInnerR) * 0.82;
      ctx.stroke();

      // Outer Ring A with Encke Gap (Back - Soft Amethyst Lavender)
      ctx.beginPath();
      ctx.ellipse(0, 0, (cassiniR + ringOuterR) * 0.5, (cassiniR + ringOuterR) * 0.5 * ringMinorRatio, 0, Math.PI, 2 * Math.PI);
      ctx.strokeStyle = "rgba(192, 132, 252, 0.45)";
      ctx.lineWidth = (ringOuterR - cassiniR) * 0.8;
      ctx.stroke();

      // Cassini Division Dark Gap (Back)
      ctx.beginPath();
      ctx.ellipse(0, 0, cassiniR, cassiniR * ringMinorRatio, 0, Math.PI, 2 * Math.PI);
      ctx.strokeStyle = "rgba(6, 6, 14, 0.95)";
      ctx.lineWidth = Math.max(1.2, radius * 0.08);
      ctx.stroke();

      // Realistic Planet Sphere Cast Shadow onto the Back Rings
      const shadowW = radius * 1.02;
      const shadowH = ringOuterR * ringMinorRatio * 1.05;
      const ringShadowGrad = ctx.createRadialGradient(
        radius * 0.1,
        -shadowH * 0.5,
        radius * 0.2,
        radius * 0.35,
        -shadowH * 0.5,
        shadowW * 1.2
      );
      ringShadowGrad.addColorStop(0, "rgba(4, 4, 10, 0.96)");
      ringShadowGrad.addColorStop(0.65, "rgba(4, 4, 10, 0.85)");
      ringShadowGrad.addColorStop(1, "rgba(4, 4, 10, 0)");

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, -ringOuterR * ringMinorRatio * 1.1, ringOuterR * 1.1, ringOuterR * ringMinorRatio * 1.1);
      ctx.clip();
      ctx.fillStyle = ringShadowGrad;
      ctx.beginPath();
      ctx.ellipse(radius * 0.15, -shadowH * 0.55, shadowW * 0.75, shadowH * 0.75, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.restore();

      // 3. Planet Sphere Body (3D Spherical Atmosphere with Cosmic Violet & Ice Cyan Bands)
      const sunX = px - radius * 0.45;
      const sunY = py - radius * 0.45;

      const sphereGrad = ctx.createRadialGradient(
        sunX,
        sunY,
        radius * 0.08,
        px,
        py,
        radius * 1.06
      );
      sphereGrad.addColorStop(0, "rgba(224, 242, 254, 1)"); // Sunlit crystalline ice frost
      sphereGrad.addColorStop(0.22, "rgba(147, 197, 253, 0.98)"); // Pale celestial cyan
      sphereGrad.addColorStop(0.52, "rgba(139, 92, 246, 0.95)"); // Royal amethyst violet
      sphereGrad.addColorStop(0.78, "rgba(79, 70, 229, 0.92)"); // Deep cosmic indigo terminator
      sphereGrad.addColorStop(0.95, "rgba(30, 27, 75, 0.98)"); // Night hemisphere
      sphereGrad.addColorStop(1, "rgba(6, 6, 18, 1)");

      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();

      // Zonal Cloud Bands & Swirling Storm Eddies (Clipped to Sphere)
      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.clip();

      ctx.translate(px, py);
      ctx.rotate(tilt * 0.4);

      // Micro-Zonal Cloud Belts in Theme Palette
      const bands = [
        { y: -0.65, h: 0.12, col: "rgba(109, 40, 217, 0.28)" }, // Deep violet
        { y: -0.48, h: 0.14, col: "rgba(186, 230, 253, 0.22)" }, // Ice cyan
        { y: -0.30, h: 0.16, col: "rgba(124, 58, 237, 0.30)" }, // Royal purple
        { y: -0.10, h: 0.18, col: "rgba(224, 231, 255, 0.22)" }, // Frost lavender
        { y: 0.12, h: 0.20, col: "rgba(79, 70, 229, 0.32)" }, // Cosmic indigo
        { y: 0.36, h: 0.18, col: "rgba(167, 139, 250, 0.26)" }, // Light amethyst
        { y: 0.58, h: 0.22, col: "rgba(67, 56, 202, 0.36)" }, // Deep midnight indigo
      ];

      bands.forEach((b) => {
        ctx.fillStyle = b.col;
        ctx.fillRect(-radius, radius * b.y, radius * 2, radius * b.h);
      });

      // Great Aetherial Cyan Storm Vortex (Anticyclone Oval)
      const stormX = -radius * 0.22 + Math.sin(time * 0.0003) * 1.5;
      const stormY = radius * 0.24;
      const stormGrad = ctx.createRadialGradient(stormX, stormY, 1, stormX, stormY, radius * 0.26);
      stormGrad.addColorStop(0, "rgba(224, 242, 254, 0.85)");
      stormGrad.addColorStop(0.35, "rgba(56, 189, 248, 0.65)"); // Electric cyan
      stormGrad.addColorStop(0.75, "rgba(168, 85, 247, 0.38)"); // Amethyst aura
      stormGrad.addColorStop(1, "rgba(109, 40, 217, 0)");

      ctx.fillStyle = stormGrad;
      ctx.beginPath();
      ctx.ellipse(stormX, stormY, radius * 0.26, radius * 0.14, 0.15, 0, Math.PI * 2);
      ctx.fill();

      // Polar Hexagonal Plasma Vortex (North Pole - Electric cyan & violet)
      ctx.save();
      ctx.translate(0, -radius * 0.84);
      ctx.rotate(time * 0.0006);
      ctx.fillStyle = "rgba(56, 189, 248, 0.48)";
      ctx.beginPath();
      for (let h = 0; h < 6; h++) {
        const hexAngle = (h * Math.PI) / 3;
        const hx = Math.cos(hexAngle) * radius * 0.24;
        const hy = Math.sin(hexAngle) * radius * 0.13;
        if (h === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Realistic Cast Shadow of the Rings across the sunlit globe face
      ctx.fillStyle = "rgba(6, 6, 16, 0.7)";
      ctx.fillRect(-radius, -radius * 0.05, radius * 2, radius * 0.18);

      ctx.restore();

      // 4. Front Half of Multi-Tier Rings (0 to PI)
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(tilt);

      // Translucent Crepe Ring C (Front - Cosmic Indigo)
      ctx.beginPath();
      ctx.ellipse(0, 0, ringInnerR * 1.08, ringInnerR * 1.08 * ringMinorRatio, 0, 0, Math.PI);
      ctx.strokeStyle = "rgba(129, 140, 248, 0.35)";
      ctx.lineWidth = radius * 0.14;
      ctx.stroke();

      // Dense Radiant Ring B (Front - Crystalline Frost Silver & Pale Cyan)
      ctx.beginPath();
      ctx.ellipse(0, 0, (ringInnerR + cassiniR) * 0.5, (ringInnerR + cassiniR) * 0.5 * ringMinorRatio, 0, 0, Math.PI);
      ctx.strokeStyle = "rgba(224, 231, 255, 0.88)";
      ctx.lineWidth = (cassiniR - ringInnerR) * 0.82;
      ctx.stroke();

      // Ring Inner Starlight Edge (Micro-ice reflection)
      ctx.beginPath();
      ctx.ellipse(0, 0, ringInnerR + 1.5, (ringInnerR + 1.5) * ringMinorRatio, 0, 0, Math.PI);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
      ctx.lineWidth = Math.max(0.7, radius * 0.05);
      ctx.stroke();

      // Outer Ring A with Encke Division (Front - Amethyst & Cyan ice)
      ctx.beginPath();
      ctx.ellipse(0, 0, (cassiniR + ringOuterR) * 0.5, (cassiniR + ringOuterR) * 0.5 * ringMinorRatio, 0, 0, Math.PI);
      ctx.strokeStyle = "rgba(192, 132, 252, 0.72)";
      ctx.lineWidth = (ringOuterR - cassiniR) * 0.8;
      ctx.stroke();

      // Cassini Division Dark Gap (Front)
      ctx.beginPath();
      ctx.ellipse(0, 0, cassiniR, cassiniR * ringMinorRatio, 0, 0, Math.PI);
      ctx.strokeStyle = "rgba(6, 6, 14, 0.98)";
      ctx.lineWidth = Math.max(1.2, radius * 0.08);
      ctx.stroke();

      // Subtle Orbital Beacon in Cassini Gap
      const stationAngle = (time * 0.00045) % Math.PI;
      const stationX = Math.cos(stationAngle) * cassiniR;
      const stationY = Math.sin(stationAngle) * cassiniR * ringMinorRatio;

      ctx.beginPath();
      ctx.arc(stationX, stationY, Math.max(1.2, radius * 0.08), 0, Math.PI * 2);
      ctx.fillStyle = "rgba(56, 189, 248, 0.95)";
      ctx.fill();

      ctx.restore();

      // 5. Terraformed Companion Moon ("Titanis-IV")
      const moonAngle = time * 0.00065;
      const moonDistX = radius * 2.8;
      const moonDistY = radius * 0.92;
      const moonX = px + Math.cos(moonAngle) * moonDistX;
      const moonY = py + Math.sin(moonAngle) * moonDistY;
      const moonR = Math.max(1.8, radius * 0.10);

      // Moon Starlight Atmosphere Glow
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(192, 132, 252, 0.28)";
      ctx.fill();

      // Moon Rocky Body with 3D spherical shade
      const moonGrad = ctx.createRadialGradient(
        moonX - moonR * 0.4,
        moonY - moonR * 0.4,
        0,
        moonX,
        moonY,
        moonR
      );
      moonGrad.addColorStop(0, "rgba(224, 231, 255, 1)");
      moonGrad.addColorStop(0.7, "rgba(139, 92, 246, 0.9)");
      moonGrad.addColorStop(1, "rgba(30, 27, 75, 1)");

      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.fillStyle = moonGrad;
      ctx.fill();

      ctx.restore();
    };

    // ==========================================
    // 3. BLADE RUNNER 2049 & PROMETHEUS ALIEN HOMEWORLD ("PLANET GENESIS / NOVA PRIME")
    // Features: Spherical Rayleigh scattering limb, continental shelf elevation, dynamic cloud drop-shadows,
    // Blade Runner monolithic stepped pyramids, subtle city light network, and segmented orbital space elevator ring.
    // ==========================================
    // ==========================================
    // 3. BLADE RUNNER 2049 & PROMETHEUS ALIEN HOMEWORLD ("PLANET GENESIS" / BLUE PLANET)
    // Features: Spherical Rayleigh scattering limb, continental shelf elevation, dynamic cloud drop-shadows,
    // Blade Runner monolithic stepped pyramids, vertical atmospheric laser comms spires, stratosphere sky-lanes,
    // and segmented orbital space elevator ring.
    // ==========================================
    const drawGenesisWorld = (ctx, cx, cy, radius, time, parallaxX, parallaxY) => {
      const px = cx + parallaxX * 0.35 + Math.cos(time * 0.00025) * 4;
      const py = cy + parallaxY * 0.35 + Math.sin(time * 0.00035) * 4;

      ctx.save();

      // 1. Rayleigh Scattering Atmospheric Limb & Multi-Layer Plasma Shield
      const shieldGlow = ctx.createRadialGradient(px, py, radius * 0.82, px, py, radius * 2.2);
      shieldGlow.addColorStop(0, "rgba(34, 211, 238, 0.45)"); // Electric cyan Rayleigh glow
      shieldGlow.addColorStop(0.32, "rgba(168, 85, 247, 0.25)"); // Violet ionosphere
      shieldGlow.addColorStop(0.68, "rgba(14, 116, 144, 0.09)");
      shieldGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = shieldGlow;
      ctx.beginPath();
      ctx.arc(px, py, radius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // 2. Base Deep Ocean Sphere (Lambertian 3D Spherical Falloff)
      const sunX = px - radius * 0.42;
      const sunY = py - radius * 0.42;

      const oceanGrad = ctx.createRadialGradient(
        sunX,
        sunY,
        radius * 0.06,
        px,
        py,
        radius * 1.06
      );
      oceanGrad.addColorStop(0, "rgba(56, 189, 248, 1)"); // Sunlit tropical ocean
      oceanGrad.addColorStop(0.24, "rgba(14, 116, 144, 0.98)"); // Deep azure
      oceanGrad.addColorStop(0.55, "rgba(15, 23, 42, 0.96)"); // Abyssal trench / twilight
      oceanGrad.addColorStop(0.82, "rgba(6, 10, 26, 0.98)"); // Night hemisphere
      oceanGrad.addColorStop(1, "rgba(2, 4, 15, 1)");

      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fillStyle = oceanGrad;
      ctx.fill();

      // 3. Terrain, Weather Systems & Alien Megacity Grid (Clipped to Globe)
      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.clip();

      // Continental Landmasses with Coastal Lagoon Gradient
      // Continent A: Northern Emerald Landmass
      const cont1Grad = ctx.createLinearGradient(px - radius * 0.5, py - radius * 0.4, px + radius * 0.2, py);
      cont1Grad.addColorStop(0, "rgba(52, 211, 153, 0.72)"); // Emerald coastal shelf
      cont1Grad.addColorStop(0.5, "rgba(13, 148, 136, 0.65)"); // Deep rainforest canopy
      cont1Grad.addColorStop(1, "rgba(15, 118, 110, 0.5)");

      ctx.fillStyle = cont1Grad;
      ctx.beginPath();
      ctx.ellipse(px - radius * 0.22, py - radius * 0.18, radius * 0.52, radius * 0.38, 0.35, 0, Math.PI * 2);
      ctx.fill();

      // Continent B: Equatorial Archipelago
      const cont2Grad = ctx.createLinearGradient(px, py, px + radius * 0.6, py + radius * 0.5);
      cont2Grad.addColorStop(0, "rgba(45, 212, 191, 0.68)");
      cont2Grad.addColorStop(0.6, "rgba(4, 120, 87, 0.6)");
      cont2Grad.addColorStop(1, "rgba(6, 78, 59, 0.45)");

      ctx.fillStyle = cont2Grad;
      ctx.beginPath();
      ctx.ellipse(px + radius * 0.16, py + radius * 0.26, radius * 0.55, radius * 0.32, -0.22, 0, Math.PI * 2);
      ctx.fill();

      // Cloud Altitude Drop Shadows (Dark semi-transparent offset shadows cast onto terrain/ocean)
      ctx.fillStyle = "rgba(2, 6, 23, 0.35)";
      ctx.beginPath();
      ctx.ellipse(px - radius * 0.08 + 2.5, py - radius * 0.26 + 2.5, radius * 0.68, radius * 0.15, -0.16, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(px + radius * 0.12 + 2.5, py + radius * 0.08 + 2.5, radius * 0.72, radius * 0.17, 0.22, 0, Math.PI * 2);
      ctx.fill();

      // High-Altitude Swirling Weather Systems & White Cloud Decks
      ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
      ctx.beginPath();
      ctx.ellipse(px - radius * 0.08, py - radius * 0.26, radius * 0.68, radius * 0.15, -0.16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(240, 249, 255, 0.58)";
      ctx.beginPath();
      ctx.ellipse(px + radius * 0.12, py + radius * 0.08, radius * 0.72, radius * 0.17, 0.22, 0, Math.PI * 2);
      ctx.fill();

      // Swirling Cyclonic Storm Eye Vortex
      const stormEyeX = px + radius * 0.32;
      const stormEyeY = py - radius * 0.12;
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.beginPath();
      ctx.arc(stormEyeX, stormEyeY, radius * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(14, 116, 144, 0.85)";
      ctx.beginPath();
      ctx.arc(stormEyeX, stormEyeY, radius * 0.04, 0, Math.PI * 2);
      ctx.fill();

      // Polar Auroral Plasma Curtains (North Pole Ribbon)
      const auroraPulse = Math.sin(time * 0.0018);
      ctx.fillStyle = `rgba(52, 211, 153, ${0.48 + auroraPulse * 0.22})`;
      ctx.beginPath();
      ctx.ellipse(px, py - radius * 0.88, radius * 0.52, radius * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();

      // Night Hemisphere Terminator Shadow Overlay (Curved Penumbra)
      const shadowGrad = ctx.createLinearGradient(
        px - radius * 0.55,
        py - radius * 0.55,
        px + radius * 0.72,
        py + radius * 0.72
      );
      shadowGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
      shadowGrad.addColorStop(0.38, "rgba(0, 0, 0, 0.1)");
      shadowGrad.addColorStop(0.72, "rgba(4, 6, 20, 0.85)");
      shadowGrad.addColorStop(1, "rgba(2, 4, 15, 0.98)");

      ctx.fillStyle = shadowGrad;
      ctx.fillRect(px - radius, py - radius, radius * 2, radius * 2);

      // ==========================================
      // BLADE RUNNER 2049 MONOLITHIC MEGAPOLIS & STRATOSPHERE SKY-LANES
      // Stepped pyramid citadels, vertical laser spires, and high-velocity transit packets
      // ==========================================
      const gridPulse = 0.88 + Math.sin(time * 0.0022) * 0.12;
      const streamTime = (time * 0.0016) % 1;

      // Blade Runner Megacity Monoliths (Tyrell/Wallace Pyramidal Citadels)
      const nodes = [
        { x: px + radius * 0.26, y: py + radius * 0.16, color: "rgba(34, 211, 238, ", size: 1.8, isPyramid: true },
        { x: px + radius * 0.38, y: py + radius * 0.22, color: "rgba(251, 191, 36, ", size: 2.2, isPyramid: true },
        { x: px + radius * 0.20, y: py + radius * 0.32, color: "rgba(34, 211, 238, ", size: 1.6, isPyramid: false },
        { x: px + radius * 0.44, y: py + radius * 0.38, color: "rgba(168, 85, 247, ", size: 2.4, isPyramid: true },
        { x: px + radius * 0.14, y: py + radius * 0.48, color: "rgba(251, 191, 36, ", size: 1.7, isPyramid: false },
        { x: px + radius * 0.56, y: py + radius * 0.28, color: "rgba(34, 211, 238, ", size: 2.0, isPyramid: true },
        { x: px + radius * 0.36, y: py + radius * 0.54, color: "rgba(52, 211, 153, ", size: 1.9, isPyramid: false },
        { x: px + radius * 0.48, y: py + radius * 0.58, color: "rgba(251, 191, 36, ", size: 1.6, isPyramid: false },
      ];

      // Draw Grid Transit Sky-Lanes & Interconnected Conduits
      ctx.lineWidth = 0.95;
      for (let n = 0; n < nodes.length; n++) {
        for (let m = n + 1; m < nodes.length; m++) {
          const n1 = nodes[n];
          const n2 = nodes[m];
          const dist = Math.hypot(n2.x - n1.x, n2.y - n1.y);

          if (dist < radius * 0.35) {
            ctx.strokeStyle = `rgba(56, 189, 248, ${gridPulse * 0.35})`;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();

            // High-speed light packet / Spinner transit convoy
            const packetX = n1.x + (n2.x - n1.x) * streamTime;
            const packetY = n1.y + (n2.y - n1.y) * streamTime;
            ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
            ctx.beginPath();
            ctx.arc(packetX, packetY, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Draw Monolithic Stepped Pyramids & Vertical Comms Pillars
      nodes.forEach((node, idx) => {
        const nodePulse = Math.sin(time * 0.003 + idx * 1.2) * 0.25 + 0.75;

        // Monolith Step Pyramid base
        if (node.isPyramid) {
          ctx.fillStyle = `${node.color}${gridPulse * nodePulse * 0.7})`;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y - node.size * 1.4);
          ctx.lineTo(node.x + node.size * 1.3, node.y + node.size * 1.1);
          ctx.lineTo(node.x - node.size * 1.3, node.y + node.size * 1.1);
          ctx.closePath();
          ctx.fill();
        }

        // Core metropolis beacon
        ctx.fillStyle = `${node.color}${gridPulse * nodePulse * 0.98})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();

        // City aura glow
        ctx.fillStyle = `${node.color}${gridPulse * nodePulse * 0.38})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Vertical Atmospheric Laser Comms Spire (Blade Runner high-power orbital broadcast)
        if (idx % 2 === 0) {
          const spireHeight = radius * 0.28;
          const laserGrad = ctx.createLinearGradient(node.x, node.y, node.x + spireHeight * 0.4, node.y - spireHeight);
          laserGrad.addColorStop(0, `${node.color}0.85)`);
          laserGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.6)");
          laserGrad.addColorStop(1, `${node.color}0)`);

          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(node.x + spireHeight * 0.4, node.y - spireHeight);
          ctx.strokeStyle = laserGrad;
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }
      });

      ctx.restore();

      // ==========================================
      // 4. EQUATORIAL ORBITAL RING MEGASTRUCTURE & SPACE ELEVATORS
      // ==========================================
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(-0.35); // Tilted orbital plane

      const orbRingR = radius * 1.48;
      const orbRingMinor = radius * 0.44;

      // Back half of orbital megastructure ring (PI to 2*PI)
      ctx.beginPath();
      ctx.ellipse(0, 0, orbRingR, orbRingMinor, 0, Math.PI, 2 * Math.PI);
      ctx.strokeStyle = "rgba(34, 211, 238, 0.28)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Front half of orbital megastructure ring (0 to PI)
      ctx.beginPath();
      ctx.ellipse(0, 0, orbRingR, orbRingMinor, 0, 0, Math.PI);
      ctx.strokeStyle = "rgba(34, 211, 238, 0.72)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Orbital Ring Solar Array / Docking Stations
      for (let s = 0; s < 4; s++) {
        const sAngle = (time * 0.00065 + s * (Math.PI / 2)) % (Math.PI * 2);
        if (sAngle >= 0 && sAngle <= Math.PI) {
          const sx = Math.cos(sAngle) * orbRingR;
          const sy = Math.sin(sAngle) * orbRingMinor;

          // Docking beacon
          ctx.beginPath();
          ctx.arc(sx, sy, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
          ctx.fill();

          ctx.beginPath();
          ctx.arc(sx, sy, 5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(34, 211, 238, 0.45)";
          ctx.fill();
        }
      }

      // Space Elevator Laser Tether Beams (Connecting orbital ring to planetary surface)
      const elevatorAngle = 0.58;
      const eRingX = Math.cos(elevatorAngle) * orbRingR;
      const eRingY = Math.sin(elevatorAngle) * orbRingMinor;
      const eTetherGrad = ctx.createLinearGradient(0, 0, eRingX, eRingY);
      eTetherGrad.addColorStop(0, "rgba(34, 211, 238, 0.85)");
      eTetherGrad.addColorStop(0.6, "rgba(168, 85, 247, 0.55)");
      eTetherGrad.addColorStop(1, "rgba(255, 255, 255, 0.98)");

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(eRingX, eRingY);
      ctx.strokeStyle = eTetherGrad;
      ctx.lineWidth = 1.1;
      ctx.stroke();

      ctx.restore();

      // 5. Razor-Sharp Sunlit Atmospheric Crescent Rim
      const rimGrad = ctx.createRadialGradient(
        sunX,
        sunY,
        radius * 0.92,
        sunX,
        sunY,
        radius * 1.06
      );
      rimGrad.addColorStop(0, "rgba(186, 230, 253, 0.95)");
      rimGrad.addColorStop(0.45, "rgba(56, 189, 248, 0.55)");
      rimGrad.addColorStop(1, "rgba(56, 189, 248, 0)");

      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.strokeStyle = rimGrad;
      ctx.lineWidth = 2.6;
      ctx.stroke();

      ctx.restore();
    };

    // -------------------------------------------------------------------------
    // 4. THE INTERSTELLAR ODYSSEY: THE ENDURANCE & COOPER'S RANGER DESCENT
    // Delicate, movie-accurate miniature scale & ultra-slow cinematic deep-space transit
    // 1. Endurance (12-module gravity ring) + docked Ranger cross deep space (180s cycle)
    // 2. Endurance enters smooth stable holding orbit safely circulating Gargantua
    // 3. Cooper's Ranger detaches, fires retro-thrusters, and plunges into the black hole
    // -------------------------------------------------------------------------

    // Helper: Draw movie-accurate Cooper's Ranger spacecraft (Miniature Lifting-Body Wedge)
    const drawCooperRanger = (ctx, x, y, angle, alpha, throttle = 1.0, heatFactor = 0.0, isDetached = false, time = 0) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha;

      // A. Twin Aerospike Main Rocket Exhausts (Rear: -X direction)
      if (throttle > 0.05) {
        const flameLen = (isDetached ? 7 : 4) * throttle + Math.sin(time * 0.015) * 1.2;
        
        // Twin micro engine nozzles at (-2.5, -0.75) and (-2.5, 0.75)
        for (const engineY of [-0.75, 0.75]) {
          const flameGrad = ctx.createLinearGradient(0, engineY, -flameLen, engineY);
          if (heatFactor > 0.4) {
            // Gravitational redshift heating flame
            flameGrad.addColorStop(0, "rgba(255, 255, 255, 0.98)");
            flameGrad.addColorStop(0.35, "rgba(251, 191, 36, 0.95)");
            flameGrad.addColorStop(1, "rgba(239, 68, 68, 0)");
          } else {
            // Standard high-impulse electric cyan plasma flame
            flameGrad.addColorStop(0, "rgba(255, 255, 255, 0.98)");
            flameGrad.addColorStop(0.3, "rgba(56, 189, 248, 0.95)");
            flameGrad.addColorStop(0.75, "rgba(168, 85, 247, 0.45)");
            flameGrad.addColorStop(1, "rgba(37, 99, 235, 0)");
          }

          ctx.beginPath();
          ctx.moveTo(-2.5, engineY - 0.45);
          ctx.lineTo(-2.5 - flameLen, engineY);
          ctx.lineTo(-2.5, engineY + 0.45);
          ctx.closePath();
          ctx.fillStyle = flameGrad;
          ctx.fill();
        }
      }

      // B. Black Carbon-Carbon Thermal Heat Shield (Underside & Wing Chines)
      ctx.beginPath();
      ctx.moveTo(3.8, 0); // Sharp nose probe
      ctx.lineTo(1.0, -2.1); // Starboard chine edge
      ctx.lineTo(-2.2, -2.1); // Starboard wing trailing edge
      ctx.lineTo(-2.7, -1.1); // Starboard engine shroud
      ctx.lineTo(-2.2, 0); // Center aft notch
      ctx.lineTo(-2.7, 1.1); // Port engine shroud
      ctx.lineTo(-2.2, 2.1); // Port wing trailing edge
      ctx.lineTo(1.0, 2.1); // Port chine edge
      ctx.closePath();
      ctx.fillStyle = "rgba(15, 23, 42, 0.98)"; // Deep charcoal black heat shield
      ctx.fill();

      // C. Upper Titanium Composite Hull (White Faceted Aerodynamic Shell)
      const rVal = Math.floor(248 + heatFactor * (255 - 248));
      const gVal = Math.floor(250 - heatFactor * 60);
      const bVal = Math.floor(252 - heatFactor * 150);

      ctx.beginPath();
      ctx.moveTo(3.4, 0); // Upper nose
      ctx.lineTo(0.8, -1.7); // Upper starboard facet
      ctx.lineTo(-1.9, -1.7);
      ctx.lineTo(-2.4, -0.8);
      ctx.lineTo(-2.0, 0);
      ctx.lineTo(-2.4, 0.8);
      ctx.lineTo(-1.9, 1.7);
      ctx.lineTo(0.8, 1.7); // Upper port facet
      ctx.closePath();
      ctx.fillStyle = `rgb(${rVal}, ${gVal}, ${bVal})`;
      ctx.fill();

      // D. Central Longitudinal Keel Spine
      ctx.beginPath();
      ctx.moveTo(3.0, 0);
      ctx.lineTo(-2.0, 0);
      ctx.strokeStyle = "rgba(100, 116, 139, 0.45)";
      ctx.lineWidth = 0.4;
      ctx.stroke();

      // E. Angular Faceted Cockpit Canopy (Cooper's Flight Deck)
      ctx.beginPath();
      ctx.moveTo(2.0, 0);
      ctx.lineTo(1.0, -0.7);
      ctx.lineTo(0.4, -0.7);
      ctx.lineTo(0.2, 0);
      ctx.lineTo(0.4, 0.7);
      ctx.lineTo(1.0, 0.7);
      ctx.closePath();
      ctx.fillStyle = "rgba(251, 191, 36, 0.95)"; // Gold anti-glare visor
      ctx.fill();

      // Cockpit Window Glass Glint
      ctx.beginPath();
      ctx.moveTo(1.5, 0);
      ctx.lineTo(0.8, -0.45);
      ctx.lineTo(0.5, 0);
      ctx.closePath();
      ctx.fillStyle = "rgba(224, 242, 254, 0.9)";
      ctx.fill();

      // F. Navigation Strobes (Aviation Strobe Flashes when detached)
      if (isDetached) {
        const strobe = (time % 1600) / 1600;
        if (strobe < 0.15) {
          ctx.beginPath();
          ctx.arc(0.8, -2.1, 0.7, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(52, 211, 153, 1)"; // Starboard green
          ctx.fill();

          ctx.beginPath();
          ctx.arc(0.8, 2.1, 0.7, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(248, 113, 113, 1)"; // Port red
          ctx.fill();
        }
      }

      ctx.restore();
    };

    // Helper: Draw movie-accurate Endurance Mothership (12-Module Centrifugal Gravity Ring)
    const drawEnduranceMothership = (ctx, x, y, angle, alpha, time, isDocked, isBurn) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha;

      const ringRadius = 5.6;
      const spinAngle = time * 0.00035; // Slow, tranquil centrifugal wheel rotation

      // A. Thruster Plume from Main Drive Engine Modules
      if (isBurn) {
        const flameLen = 6 + Math.sin(time * 0.012) * 1.5;
        const mainFlameGrad = ctx.createLinearGradient(0, 0, -flameLen - ringRadius, 0);
        mainFlameGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        mainFlameGrad.addColorStop(0.3, "rgba(56, 189, 248, 0.9)");
        mainFlameGrad.addColorStop(0.7, "rgba(168, 85, 247, 0.4)");
        mainFlameGrad.addColorStop(1, "rgba(37, 99, 235, 0)");

        ctx.beginPath();
        ctx.moveTo(-ringRadius, -1.3);
        ctx.lineTo(-ringRadius - flameLen, 0);
        ctx.lineTo(-ringRadius, 1.3);
        ctx.closePath();
        ctx.fillStyle = mainFlameGrad;
        ctx.fill();
      }

      // B. Structural Circular Ring Truss (Double titanium guidelines)
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRadius, ringRadius * 0.72, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(203, 213, 225, 0.65)";
      ctx.lineWidth = 0.6;
      ctx.stroke();

      // C. 4 Rigid Structural Cross-Spoke Girders
      for (let s = 0; s < 4; s++) {
        const sAngle = spinAngle + (s * Math.PI) / 2;
        const sx = Math.cos(sAngle) * ringRadius;
        const sy = Math.sin(sAngle) * ringRadius * 0.72;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = "rgba(148, 163, 184, 0.55)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // D. 12 Distinct Modular Box Units (Habitats, Labs, Cryo Pods, Fuel Tanks)
      for (let m = 0; m < 12; m++) {
        const modAngle = spinAngle + (m * Math.PI * 2) / 12;
        const mx = Math.cos(modAngle) * ringRadius;
        const my = Math.sin(modAngle) * ringRadius * 0.72;

        ctx.save();
        ctx.translate(mx, my);
        ctx.rotate(modAngle);

        const isHab = m % 3 === 0; // Primary white habitat/bridge pods
        const isEngine = m % 3 === 1; // Engine/cargo modules

        // Module Box Body
        ctx.fillStyle = isHab
          ? "rgba(248, 250, 252, 0.98)" // Clean white habitat pod
          : isEngine
          ? "rgba(148, 163, 184, 0.95)" // Slate engine/cargo module
          : "rgba(203, 213, 225, 0.95)"; // Titanium cryo/lab module
        ctx.fillRect(-1.1, -0.65, 2.2, 1.3);

        // Solar Radiator Panel on Top of Module
        ctx.fillStyle = "rgba(30, 41, 59, 0.85)";
        ctx.fillRect(-0.8, -0.45, 1.6, 0.9);

        ctx.restore();
      }

      // E. Central Cylindrical Docking Hub
      ctx.beginPath();
      ctx.arc(0, 0, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(226, 232, 240, 0.98)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, 0.8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(51, 65, 85, 0.95)";
      ctx.fill();

      // High-Gain Antenna & Central Optical Navigation Strobe
      ctx.beginPath();
      ctx.arc(0, 0, 0.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 1)";
      ctx.fill();

      // F. Docked Ranger Craft inside the Hub (Only when docked!)
      if (isDocked) {
        // Cooper's Ranger docked securely facing forward
        drawCooperRanger(ctx, 2.0, 0, 0, 1.0, 0.0, 0.0, false, time);
      } else {
        // Open Docking Clamp Ring (Visible after Cooper's detachment)
        ctx.beginPath();
        ctx.arc(2.0, 0, 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.85)";
        ctx.lineWidth = 0.45;
        ctx.stroke();
      }

      ctx.restore();
    };

    // Helper: Compute complete Interstellar Voyage kinematic state
    const getInterstellarVoyageState = (startX, startY, endX, endY, time) => {
      // 180-second ultra-slow, deep-space cinematic storytelling cycle (3 full minutes)
      const CYCLE_DURATION = 180000;
      const rawProgress = (time % CYCLE_DURATION) / CYCLE_DURATION;

      // Orbital parameters for Endurance parking orbit around Gargantua
      const orbRadiusX = 46;
      const orbRadiusY = 26;
      const orbTilt = -0.22; // subtle orbital inclination angle

      // Geodesic Transit Arc (Genesis to Gargantua orbit insertion threshold)
      const dx = endX - startX;
      const dy = endY - startY;

      const p0 = { x: startX + 26, y: startY - 22 };
      const p1 = { x: startX + dx * 0.28, y: startY + dy * 0.78 };
      const p2 = { x: startX + dx * 0.72, y: startY + dy * 0.98 };
      const p3 = {
        x: endX + Math.cos(Math.PI - 0.35) * orbRadiusX * Math.cos(orbTilt) - Math.sin(Math.PI - 0.35) * orbRadiusY * Math.sin(orbTilt),
        y: endY + Math.cos(Math.PI - 0.35) * orbRadiusX * Math.sin(orbTilt) + Math.sin(Math.PI - 0.35) * orbRadiusY * Math.cos(orbTilt),
      };

      // Helper: Evaluate cubic bezier position
      const getBezierPos = (u) => {
        const mu = 1 - u;
        const mu2 = mu * mu;
        const mu3 = mu2 * mu;
        const u2 = u * u;
        const u3 = u2 * u;

        const x = mu3 * p0.x + 3 * mu2 * u * p1.x + 3 * mu * u2 * p2.x + u3 * p3.x;
        const y = mu3 * p0.y + 3 * mu2 * u * p1.y + 3 * mu * u2 * p2.y + u3 * p3.y;
        return { x, y };
      };

      // Helper: Evaluate tangent velocity vector on transit curve
      const getBezierTangent = (u) => {
        const mu = 1 - u;
        const tDx =
          3 * mu * mu * (p1.x - p0.x) +
          6 * mu * u * (p2.x - p1.x) +
          3 * u * u * (p3.x - p2.x);
        const tDy =
          3 * mu * mu * (p1.y - p0.y) +
          6 * mu * u * (p2.y - p1.y) +
          3 * u * u * (p3.y - p2.y);
        return { dx: tDx, dy: tDy, angle: Math.atan2(tDy, tDx) };
      };

      // Helper: Calculate Endurance orbit position and velocity angle around Gargantua
      const getEnduranceOrbitState = (orbAngle) => {
        const lx = orbRadiusX * Math.cos(orbAngle);
        const ly = orbRadiusY * Math.sin(orbAngle);

        const x = endX + lx * Math.cos(orbTilt) - ly * Math.sin(orbTilt);
        const y = endY + lx * Math.sin(orbTilt) + ly * Math.cos(orbTilt);

        const vlx = -orbRadiusX * Math.sin(orbAngle);
        const vly = orbRadiusY * Math.cos(orbAngle);

        const vx = vlx * Math.cos(orbTilt) - vly * Math.sin(orbTilt);
        const vy = vlx * Math.sin(orbTilt) + vly * Math.cos(orbTilt);

        return { x, y, angle: Math.atan2(vy, vx) };
      };

      let enduranceX = 0;
      let enduranceY = 0;
      let enduranceAngle = 0;
      let enduranceAlpha = 1.0;
      let isDocked = true;
      let isBurn = true;

      if (rawProgress < 0.52) {
        // --- PHASE A: TRANQUIL, ULTRA-SLOW DEEP SPACE TRANSIT ---
        const u = Math.pow(rawProgress / 0.52, 0.96);
        const pos = getBezierPos(u);
        const tangent = getBezierTangent(u);

        enduranceX = pos.x;
        enduranceY = pos.y;
        enduranceAngle = tangent.angle;
        isDocked = true;
        isBurn = true;

        if (rawProgress < 0.03) {
          enduranceAlpha = rawProgress / 0.03;
        }
      } else {
        // --- PHASE B: STABLE PARKING ORBIT AROUND GARGANTUA ---
        const orbT = (rawProgress - 0.52) / 0.42;
        const orbAngle = Math.PI - 0.35 + orbT * 2.2 * Math.PI;
        const state = getEnduranceOrbitState(orbAngle);

        enduranceX = state.x;
        enduranceY = state.y;
        enduranceAngle = state.angle;
        isBurn = rawProgress > 0.92;

        if (rawProgress >= 0.60) {
          isDocked = false;
        }

        if (rawProgress > 0.94) {
          enduranceAlpha = Math.max(0, (1 - rawProgress) / 0.06);
        }
      }

      // Detached Cooper Ranger State
      let podState = { active: false, x: 0, y: 0, angle: 0, alpha: 0, infallProgress: 0, heatFactor: 0 };
      if (rawProgress >= 0.60 && rawProgress <= 0.88) {
        const infallProgress = (rawProgress - 0.60) / 0.28;
        const detachOrbAngle = Math.PI - 0.35 + ((0.60 - 0.52) / 0.42) * 2.2 * Math.PI;
        
        const currentRadius = orbRadiusX * (1 - Math.pow(infallProgress, 1.25));
        const currentAngle = detachOrbAngle + infallProgress * 3.2 * Math.PI;

        const lx = currentRadius * Math.cos(currentAngle);
        const ly = (currentRadius * (orbRadiusY / orbRadiusX)) * Math.sin(currentAngle);

        const podX = endX + lx * Math.cos(orbTilt) - ly * Math.sin(orbTilt);
        const podY = endY + lx * Math.sin(orbTilt) + ly * Math.cos(orbTilt);

        const vlx = -currentRadius * Math.sin(currentAngle) - (orbRadiusX * 1.25 * Math.pow(infallProgress, 0.25)) * Math.cos(currentAngle);
        const vly = (currentRadius * (orbRadiusY / orbRadiusX)) * Math.cos(currentAngle);
        const vx = vlx * Math.cos(orbTilt) - vly * Math.sin(orbTilt);
        const vy = vlx * Math.sin(orbTilt) + vly * Math.cos(orbTilt);
        const podHeading = Math.atan2(vy, vx);

        let podAlpha = 1.0;
        if (infallProgress > 0.85) {
          podAlpha = Math.max(0, (1 - infallProgress) / 0.15);
        }

        podState = {
          active: true,
          x: podX,
          y: podY,
          angle: podHeading,
          alpha: podAlpha,
          infallProgress,
          heatFactor: infallProgress,
          detachOrbAngle,
          orbRadiusX,
          orbRadiusY,
          orbTilt,
        };
      }

      return {
        rawProgress,
        p0, p1, p2, p3,
        getBezierPos,
        getBezierTangent,
        orbRadiusX, orbRadiusY, orbTilt,
        endurance: {
          x: enduranceX,
          y: enduranceY,
          angle: enduranceAngle,
          alpha: enduranceAlpha,
          isDocked,
          isBurn,
        },
        pod: podState,
      };
    };

    const drawInterstellarVoyage = (
      ctx,
      startX,
      startY,
      endX,
      endY,
      time,
      parallaxX,
      parallaxY,
      voyageState
    ) => {
      const { rawProgress, p0, p1, p2, p3, getBezierPos, orbRadiusX, orbRadiusY, orbTilt, endurance, pod } = voyageState;

      // 1. DRAW CELESTIAL ORBITAL TRANSIT & HOLDING ROUTES (HUD Navigation)
      ctx.save();
      // Transit Arc Ribbon
      const routeGrad = ctx.createLinearGradient(p0.x, p0.y, p3.x, p3.y);
      routeGrad.addColorStop(0, "rgba(56, 189, 248, 0.08)");
      routeGrad.addColorStop(0.5, "rgba(168, 85, 247, 0.06)");
      routeGrad.addColorStop(1, "rgba(251, 191, 36, 0.09)");

      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
      ctx.strokeStyle = routeGrad;
      ctx.lineWidth = 0.75;
      ctx.setLineDash([3, 11]);
      ctx.lineDashOffset = -time * 0.003;
      ctx.stroke();

      // Gargantua Stable Holding Orbit Ring (Where Endurance circulates)
      ctx.beginPath();
      ctx.ellipse(endX, endY, orbRadiusX, orbRadiusY, orbTilt, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.07)";
      ctx.lineWidth = 0.65;
      ctx.setLineDash([2, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Waypoint calculation nodes along transit path
      const waypoints = [0.25, 0.55, 0.85];
      for (let w = 0; w < waypoints.length; w++) {
        const wp = waypoints[w];
        const wPos = getBezierPos(wp);
        const wpPulse = 0.22 + 0.18 * Math.sin(time * 0.001 + w * 1.8);

        ctx.beginPath();
        ctx.arc(wPos.x, wPos.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 242, 254, ${wpPulse * 0.9})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(wPos.x, wPos.y, 3.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${wpPulse * 0.3})`;
        ctx.lineWidth = 0.45;
        ctx.stroke();
      }
      ctx.restore();

      // Parallax offset coordinates
      const drawEndX = endurance.x + parallaxX * 0.4;
      const drawEndY = endurance.y + parallaxY * 0.4;

      // 2. SPACECRAFT RELATIVISTIC GRAVITATIONAL LENSING & SPACETIME METRIC RIPPLES
      if (endurance.alpha > 0.05) {
        ctx.save();
        ctx.translate(drawEndX, drawEndY);

        // A. Refractive Gravitational Lensing Aura (Soft spacetime bending glow)
        const warpRadius = 22;
        const warpGlow = ctx.createRadialGradient(0, 0, 2, 0, 0, warpRadius);
        warpGlow.addColorStop(0, `rgba(186, 230, 253, ${endurance.alpha * 0.14})`);
        warpGlow.addColorStop(0.45, `rgba(147, 197, 253, ${endurance.alpha * 0.06})`);
        warpGlow.addColorStop(1, "rgba(56, 189, 248, 0)");
        
        ctx.beginPath();
        ctx.arc(0, 0, warpRadius, 0, Math.PI * 2);
        ctx.fillStyle = warpGlow;
        ctx.fill();

        // B. Alcubierre Spacetime Metric Wavefront Ripples (Concentric warping fields)
        for (let r = 0; r < 3; r++) {
          const ripPhase = (time * 0.0012 + r * 0.33) % 1;
          const ripRadius = 7 + ripPhase * 18;
          const ripAlpha = (1 - ripPhase) * endurance.alpha * 0.16;

          ctx.beginPath();
          ctx.arc(0, 0, ripRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(56, 189, 248, ${ripAlpha})`;
          ctx.lineWidth = 0.55;
          ctx.stroke();
        }

        ctx.restore();
      }

      // 3. ION PROPULSION WAKE PARTICLES (In transit)
      if (endurance.alpha > 0.05 && rawProgress < 0.52) {
        ctx.save();
        for (let k = 1; k <= 5; k++) {
          const wakeU = (rawProgress / 0.52) - k * 0.0025;
          if (wakeU > 0) {
            const wakePos = getBezierPos(wakeU);
            const wakeAge = k / 5;
            const wakeAlpha = endurance.alpha * (1 - wakeAge) * 0.3;
            const wakeR = 0.9 + k * 0.45;

            ctx.beginPath();
            ctx.arc(wakePos.x + parallaxX * 0.4, wakePos.y + parallaxY * 0.4, wakeR, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(56, 189, 248, ${wakeAlpha})`;
            ctx.fill();
          }
        }
        ctx.restore();
      }

      // 4. RENDER MOTHERSHIP: THE ENDURANCE (12-Module Centrifugal Gravity Ring)
      if (endurance.alpha > 0.005) {
        drawEnduranceMothership(ctx, drawEndX, drawEndY, endurance.angle, endurance.alpha, time, endurance.isDocked, endurance.isBurn);
      }

      // 5. DETACHED COOPER'S RANGER PLUNGING INTO GARGANTUA EVENT HORIZON
      if (pod.active) {
        const podX = pod.x + parallaxX * 0.4;
        const podY = pod.y + parallaxY * 0.4;

        // Infalling Gravitational Geodesic Trail
        ctx.save();
        ctx.beginPath();
        const trailSteps = 16;
        for (let t = 0; t <= trailSteps; t++) {
          const histT = Math.max(0, pod.infallProgress - (t / trailSteps) * 0.18);
          const histR = pod.orbRadiusX * (1 - Math.pow(histT, 1.25));
          const histA = pod.detachOrbAngle + histT * 3.2 * Math.PI;
          const hlx = histR * Math.cos(histA);
          const hly = (histR * (pod.orbRadiusY / pod.orbRadiusX)) * Math.sin(histA);
          const hx = endX + hlx * Math.cos(pod.orbTilt) - hly * Math.sin(pod.orbTilt) + parallaxX * 0.4;
          const hy = endY + hlx * Math.sin(pod.orbTilt) + hly * Math.cos(pod.orbTilt) + parallaxY * 0.4;

          if (t === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.strokeStyle = `rgba(251, 191, 36, ${pod.alpha * 0.3})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();
        ctx.restore();

        // Localized Gravitational Infall Distortion Bubble around Ranger
        ctx.save();
        ctx.translate(podX, podY);
        const podWarpGlow = ctx.createRadialGradient(0, 0, 1, 0, 0, 14);
        podWarpGlow.addColorStop(0, `rgba(254, 240, 138, ${pod.alpha * 0.2})`);
        podWarpGlow.addColorStop(1, "rgba(245, 158, 11, 0)");
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fillStyle = podWarpGlow;
        ctx.fill();
        ctx.restore();

        // Render Cooper's Ranger with Relativistic Redshift & Event Horizon Glow
        drawCooperRanger(ctx, podX, podY, pod.angle, pod.alpha, 1.2, pod.heatFactor, true, time);

        // Relativistic Tesseract Light Lattice & Singularity Flash (s > 0.82)
        if (pod.infallProgress > 0.82) {
          const flashPulse = Math.sin(((pod.infallProgress - 0.82) / 0.18) * Math.PI);
          ctx.save();
          ctx.translate(podX, podY);
          
          // Tesseract luminous lattice grid
          ctx.strokeStyle = `rgba(254, 240, 138, ${flashPulse * 0.75})`;
          ctx.lineWidth = 0.5;
          const boxS = 5 * flashPulse;
          ctx.strokeRect(-boxS, -boxS, boxS * 2, boxS * 2);

          // Brilliant White Singularity Flash
          ctx.beginPath();
          ctx.arc(0, 0, 6 * flashPulse, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${flashPulse * 0.9})`;
          ctx.fill();
          ctx.restore();
        }
      }
    };

    let lastTime = performance.now();

    // Main Animation Loop
    const animate = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Smooth mouse easing
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // Parallax center offset
      const parallaxX = (mouse.x - width / 2) * 0.03;
      const parallaxY = (mouse.y - height / 2) * 0.03;

      // Check for Rare Infalling Cosmic Stream Spawn
      if (Date.now() > nextInfallTime) {
        spawnInfallStream();
      }

      // 1. Interstellar "Gargantua" Singularity (Tucked into top-right vista above mascot circle)
      const singularityX = Math.min(width - 80, width * 0.86);
      const singularityY = Math.max(110, Math.min(170, height * 0.16));
      drawGargantuaSingularity(ctx, singularityX, singularityY, currentTime, parallaxX, parallaxY, infallingStreams);

      // 2. Distant Royal Amethyst Ringed Gas Giant ("Aetheris-IX" / Far Away Ice Giant)
      const ringedRadius = Math.max(12, Math.min(16, width * 0.012));
      const ringedX = Math.max(65, width * 0.075);
      const ringedY = Math.max(90, Math.min(150, height * 0.14));
      drawRingedPlanet(ctx, ringedX, ringedY, ringedRadius, currentTime, parallaxX, parallaxY);

      // 3. Blade Runner / Prometheus Alien Homeworld ("Planet Genesis" / Blue Planet - Restored to original position & size)
      const genesisRadius = Math.max(28, Math.min(38, width * 0.030));
      const genesisX = Math.max(85, width * 0.11);
      const genesisY = Math.min(height * 0.70, 680);
      drawGenesisWorld(ctx, genesisX, genesisY, genesisRadius, currentTime, parallaxX, parallaxY);

      // Compute Kinematic State for Interstellar Voyage & Metric Distortion Field
      const voyageState = getInterstellarVoyageState(genesisX, genesisY, singularityX, singularityY, currentTime);

      // 4. Interstellar Long Journey Voyage (The Odyssey from Planet Genesis to Gargantua)
      drawInterstellarVoyage(ctx, genesisX, genesisY, singularityX, singularityY, currentTime, parallaxX, parallaxY, voyageState);

      // Check for Meteor Spawn
      if (Date.now() > nextMeteorTime) {
        spawnMeteor();
      }

      // Active Spacecraft Positions for Dynamic Gravitational Lensing
      const shipLensingX = voyageState.endurance.x + parallaxX * 0.4;
      const shipLensingY = voyageState.endurance.y + parallaxY * 0.4;
      const podLensingX = voyageState.pod.x + parallaxX * 0.4;
      const podLensingY = voyageState.pod.y + parallaxY * 0.4;

      // 5. Update and Draw Stars & Constellations (with Dynamic Multi-Body Gravitational Lensing)
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Organic twinkle phase oscillation
        star.twinklePhase += star.twinkleSpeed;
        const twinkleFactor = Math.sin(star.twinklePhase);
        star.alpha = Math.max(0.08, star.baseAlpha + twinkleFactor * (star.baseAlpha * 0.5));

        // Subtle ambient drifting
        star.x += star.vx;
        star.y += star.vy;

        // Wrap around boundaries
        if (star.x < -20) star.x = width + 20;
        if (star.x > width + 20) star.x = -20;
        if (star.y < -20) star.y = height + 20;
        if (star.y > height + 20) star.y = -20;

        // Apply Layered 3D Parallax offset
        const rawX = star.x + parallaxX * star.layer;
        const rawY = star.y + parallaxY * star.layer;

        let drawX = rawX;
        let drawY = rawY;
        let starAlpha = star.alpha;

        // A. Gargantua Singularity Gravitational Lensing
        const dxG = rawX - singularityX;
        const dyG = rawY - singularityY;
        const distG = Math.sqrt(dxG * dxG + dyG * dyG);

        if (distG < 320 && distG > 12) {
          const lensFactor = (1 - distG / 320) * 3.8;
          drawX += (dxG / distG) * lensFactor;
          drawY += (dyG / distG) * lensFactor;
          starAlpha = Math.min(1, starAlpha + (1 - distG / 320) * 0.22);
        }

        // B. Traveling Spacecraft Relativistic Gravitational Lensing & Metric Warp
        if (voyageState.endurance.alpha > 0.1) {
          const dxShip = rawX - shipLensingX;
          const dyShip = rawY - shipLensingY;
          const distShip = Math.sqrt(dxShip * dxShip + dyShip * dyShip);

          if (distShip < 85 && distShip > 2.0) {
            const shipLensFactor = Math.pow(1 - distShip / 85, 1.8) * 4.6 * voyageState.endurance.alpha;
            // Radial light deflection away from warp displacement envelope
            drawX += (dxShip / distShip) * shipLensFactor;
            drawY += (dyShip / distShip) * shipLensFactor;
            // Relativistic starlight magnification & Doppler scintillation
            starAlpha = Math.min(1, starAlpha + (1 - distShip / 85) * 0.42 * voyageState.endurance.alpha);
          }
        }

        // C. Detached Cooper Ranger Infalling Gravitational Lensing
        if (voyageState.pod.active && voyageState.pod.alpha > 0.1) {
          const dxPod = rawX - podLensingX;
          const dyPod = rawY - podLensingY;
          const distPod = Math.sqrt(dxPod * dxPod + dyPod * dyPod);

          if (distPod < 55 && distPod > 2.0) {
            const podLensFactor = Math.pow(1 - distPod / 55, 1.8) * 3.8 * voyageState.pod.alpha;
            drawX += (dxPod / distPod) * podLensFactor;
            drawY += (dyPod / distPod) * podLensFactor;
            starAlpha = Math.min(1, starAlpha + (1 - distPod / 55) * 0.45 * voyageState.pod.alpha);
          }
        }

        // Sparkle rotation for diamond stars
        if (star.isDiamond) {
          star.sparkleRotation += star.sparkleRotationSpeed;
        }

        const colorPrefix = colors.stars[star.colorIndex];

        // Draw Star
        if (star.isDiamond) {
          drawDiamondSparkle(
            ctx,
            drawX,
            drawY,
            star.radius,
            starAlpha,
            colorPrefix,
            star.sparkleRotation
          );
        } else if (star.layer === 2) {
          // Mid layer: Circle with subtle aura
          ctx.beginPath();
          ctx.arc(drawX, drawY, star.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `${colorPrefix}${starAlpha * 0.25})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(drawX, drawY, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `${colorPrefix}${starAlpha})`;
          ctx.fill();
        } else {
          // Micro background star
          ctx.beginPath();
          ctx.arc(drawX, drawY, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `${colorPrefix}${starAlpha})`;
          ctx.fill();
        }

        // Constellation Interaction with Mouse & Nearby Stars (Idea Networks)
        if (mouse.active) {
          const dxMouse = drawX - mouse.x;
          const dyMouse = drawY - mouse.y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

          if (distMouse < mouse.radius) {
            // Draw delicate line to mouse
            const lineAlpha = (1 - distMouse / mouse.radius) * 0.22;
            ctx.beginPath();
            ctx.moveTo(drawX, drawY);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `${colors.constellation}${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();

            // Connect nearby stars that are also within range
            for (let j = i + 1; j < stars.length; j++) {
              const otherStar = stars[j];
              const otherDrawX = otherStar.x + parallaxX * otherStar.layer;
              const otherDrawY = otherStar.y + parallaxY * otherStar.layer;

              const dx2 = drawX - otherDrawX;
              const dy2 = drawY - otherDrawY;
              const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

              if (dist2 < 85) {
                const linkAlpha = (1 - dist2 / 85) * (1 - distMouse / mouse.radius) * 0.18;
                ctx.beginPath();
                ctx.moveTo(drawX, drawY);
                ctx.lineTo(otherDrawX, otherDrawY);
                ctx.strokeStyle = `${colors.constellation}${linkAlpha})`;
                ctx.lineWidth = 0.65;
                ctx.stroke();
              }
            }
          }
        }
      }

      // Update and Draw Meteors
      for (let m = meteors.length - 1; m >= 0; m--) {
        const meteor = meteors[m];
        meteor.progress++;

        meteor.x += meteor.dx;
        meteor.y += meteor.dy;

        const tailX = meteor.x - meteor.tailDx;
        const tailY = meteor.y - meteor.tailDy;

        // Fade in rapidly, then smoothly fade out
        let meteorAlpha = 1;
        if (meteor.progress < 10) {
          meteorAlpha = meteor.progress / 10;
        } else {
          meteorAlpha = Math.max(0, 1 - (meteor.progress - 10) / (meteor.maxLife - 10));
        }

        if (meteorAlpha > 0) {
          ctx.save();
          // Draw Glowing Streak Line
          const grad = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
          grad.addColorStop(0, `rgba(255, 255, 255, ${meteorAlpha * 0.95})`);
          grad.addColorStop(0.25, `rgba(186, 230, 253, ${meteorAlpha * 0.6})`);
          grad.addColorStop(1, `rgba(147, 197, 253, 0)`);

          ctx.beginPath();
          ctx.moveTo(meteor.x, meteor.y);
          ctx.lineTo(tailX, tailY);
          ctx.strokeStyle = grad;
          ctx.lineWidth = meteor.thickness;
          ctx.lineCap = "round";
          ctx.stroke();

          // Draw Glowing Meteor Head
          const headGlow = ctx.createRadialGradient(
            meteor.x,
            meteor.y,
            0,
            meteor.x,
            meteor.y,
            meteor.thickness * 4
          );
          headGlow.addColorStop(0, `rgba(255, 255, 255, ${meteorAlpha})`);
          headGlow.addColorStop(0.5, `rgba(125, 211, 252, ${meteorAlpha * 0.6})`);
          headGlow.addColorStop(1, "rgba(255, 255, 255, 0)");

          ctx.fillStyle = headGlow;
          ctx.beginPath();
          ctx.arc(meteor.x, meteor.y, meteor.thickness * 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }

        if (meteor.progress >= meteor.maxLife || meteor.x > width + 200 || meteor.y > height + 200) {
          meteors.splice(m, 1);
        }
      }

      if (isVisible) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isDark]);

  if (!isDark) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-700 opacity-100"
      aria-hidden="true"
    >
      {/* Deep Space Interstellar Nebula Glows in Dark Mode */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full bg-amber-500/6 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-[32rem] h-[32rem] rounded-full bg-purple-600/8 blur-[150px] pointer-events-none" />

      {/* Performant Celestial Cosmos Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
      />
    </div>
  );
}

export default ParticalAnimation;
