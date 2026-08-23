// cursor.js - Fading Sword Blade Trail with Inactivity Shrink
(function () {
  const style = document.createElement('style');
  style.textContent = `
    html, body, a, button, select, input, .menu-item {
      cursor: none !important;
    }
    #cursor-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 999999;
    }
  `;
  document.head.appendChild(style);

  window.addEventListener('DOMContentLoaded', () => {
    let canvas = document.getElementById('cursor-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'cursor-canvas';
      document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    const soulImg = new Image();
    soulImg.src = '../assets/redSoul.webp';

    let mouseX = -100;
    let mouseY = -100;
    let lastMoveTime = Date.now();
    const history = [];
    const maxPoints = 24;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      lastMoveTime = Date.now();

      history.unshift({ x: mouseX, y: mouseY });
      if (history.length > maxPoints) {
        history.pop();
      }
    });

    function renderCursor() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const idleTime = Date.now() - lastMoveTime;
      
      // Gradually trim the tail points when idle
      if (idleTime > 100 && history.length > 0) {
        history.pop();
      }

      // Render the sword blade trail
      if (history.length > 1) {
        for (let i = 0; i < history.length - 1; i++) {
          const p1 = history[i];     // Near soul
          const p2 = history[i + 1]; // Toward tail tip

          // 0 = at soul, 1 = at tail tip
          const ratio = i / history.length;

          // Alpha fades from soul (near 1.0) down to 0.0 at the tip
          const baseAlpha = Math.max(0, 1 - ratio);
          
          // Shrink opacity faster if inactive
          const activityFade = Math.max(0, 1 - (idleTime / 300));
          const finalAlpha = baseAlpha * activityFade;

          if (finalAlpha <= 0) continue;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);

          // White to light grey blade shade
          const shade = Math.floor(180 + (75 * ratio)); 
          ctx.strokeStyle = `rgba(${shade}, ${shade}, ${shade}, ${finalAlpha})`;
          
          // Taper width from thick near soul to narrow tip
          ctx.lineWidth = Math.max(1, 8 * (1 - ratio));
          ctx.lineCap = 'square';
          ctx.stroke();
          ctx.restore();

          // Pixel crossguard near the soul head
          if (i === 1 && finalAlpha > 0.1) {
            const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            ctx.save();
            ctx.translate(p1.x, p1.y);
            ctx.rotate(angle + Math.PI / 2);
            ctx.fillStyle = `rgba(200, 200, 200, ${finalAlpha})`;
            ctx.fillRect(-6, -2, 12, 4);
            ctx.restore();
          }
        }
      }

      // Render the Red Soul at pointer position
      if (soulImg.complete && soulImg.naturalWidth !== 0 && mouseX >= 0) {
        const size = 18;
        ctx.drawImage(soulImg, mouseX - size / 2, mouseY - size / 2, size, size);
      }

      requestAnimationFrame(renderCursor);
    }

    renderCursor();
  });
})();