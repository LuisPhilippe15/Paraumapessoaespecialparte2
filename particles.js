const IntroFX = {
  makeStars() {
    const field = document.getElementById("starsField");

    for (let i = 0; i < 130; i++) {
      const star = document.createElement("span");
      star.className = "star-dot";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 80}%`;
      star.style.opacity = .35 + Math.random() * .65;
      star.style.transform = `scale(${.7 + Math.random() * 1.7})`;
      field.appendChild(star);
    }
  },

  canvasParticles(id, amount, palette) {
    const canvas = document.getElementById(id);
    const ctx = canvas.getContext("2d");
    const particles = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function seed() {
      particles.length = 0;

      for (let i = 0; i < amount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height + canvas.height,
          r: .8 + Math.random() * 2.8,
          vx: -.35 + Math.random() * .7,
          vy: -.18 - Math.random() * .8,
          a: .16 + Math.random() * .72,
          color: palette[Math.floor(Math.random() * palette.length)]
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -20) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.fillStyle = p.color.replace("ALPHA", p.a);
        ctx.shadowColor = p.color.replace("ALPHA", 1);
        ctx.shadowBlur = 16;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }

    resize();
    seed();
    draw();

    window.addEventListener("resize", () => {
      resize();
      seed();
    });
  },

  chapterDust() {
    const wrap = document.getElementById("chapterDust");
    if (wrap.dataset.ready === "true") return;
    wrap.dataset.ready = "true";

    for (let i = 0; i < 38; i++) {
      const p = document.createElement("span");
      p.className = "dust";
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${35 + Math.random() * 60}%`;
      wrap.appendChild(p);

      gsap.to(p, {
        x: -30 + Math.random() * 60,
        y: -40 - Math.random() * 80,
        opacity: .15 + Math.random() * .75,
        duration: 3 + Math.random() * 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 2
      });
    }
  },

  init() {
    this.makeStars();
    this.canvasParticles("introParticles", 260, ["rgba(255,211,107,ALPHA)"]);
  }
};

IntroFX.init();