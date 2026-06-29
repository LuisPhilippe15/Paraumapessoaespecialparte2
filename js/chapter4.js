window.ChapterFour = {
  started: false,
  pathChosen: false,
  lilyTouched: false,

  thoughts: [
    "Algumas lembranças começam antes mesmo de existirem.",
    "Nem todo vento leva embora.",
    "Às vezes basta um instante para guardar uma noite inteira.",
    "O inesperado costuma esconder as melhores histórias.",
    "Há caminhos que ficam bonitos só porque foram escolhidos com calma.",
    "Algumas respostas chegam sem fazer barulho.",
    "Nem toda aventura precisa correr.",
    "O brilho certo aparece quando a gente olha de novo.",
    "Existem dias que parecem guardar uma promessa.",
    "Pequenas escolhas também mudam paisagens inteiras.",
    "O tempo passa diferente quando existe curiosidade.",
    "Às vezes o mapa é só uma desculpa para caminhar.",
    "O começo raramente avisa que é começo.",
    "Alguns sinais só aparecem para quem presta atenção.",
    "A beleza também gosta de se esconder em detalhes.",
    "Nem toda porta precisa ser aberta hoje.",
    "O silêncio pode estar cheio de pistas.",
    "Há lugares que parecem lembrar da gente.",
    "Toda chegada já foi uma escolha pequena.",
    "O vento sabe caminhos que ninguém desenhou.",
    "O céu muda de cor quando a história quer continuar.",
    "Algumas flores aparecem sem pedir explicação.",
    "Certas noites cabem dentro de uma única memória.",
    "Um passo leve ainda é um passo.",
    "Toda aventura guarda um momento de pausa."
  ],

  start() {
    if (this.started) return;
    this.started = true;

    this.scene = document.getElementById("chapterFour");
    this.narration = document.getElementById("choiceNarration");
    this.paths = document.querySelectorAll("[data-path]");
    this.pathMagic = document.getElementById("pathMagic");
    this.thoughtsWrap = document.getElementById("thoughts");
    this.thoughtBox = document.getElementById("thoughtBox");
    this.tree = document.getElementById("goldenTree");
    this.lily = document.getElementById("pinkLilyFinal");
    this.final = document.getElementById("choiceFinal");
    this.inventoryKey = document.getElementById("inventoryKey");

    this.makeParticles();
    this.makeThoughts();
    this.animateGarden();
    this.easterEggs();

    const tl = gsap.timeline({ defaults: { ease: "sine.inOut" } });

    tl.fromTo("#petalTransition", { opacity: 1 }, { opacity: 0, duration: 2.2 })
      .fromTo("#gardenCamera", { y: 120, scale: 1.08, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 3.2, ease: "power2.out" }, "-=1.4")
      .fromTo("#choiceTitle", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.4 }, "-=1")
      .to("#choiceTitle", { opacity: 0, y: -20, duration: 1.2, delay: 2 })
      .call(() => this.type("Existem caminhos que aparecem por acaso."))
      .to({}, { duration: 4 })
      .call(() => this.type("Existem caminhos que escolhemos seguir."))
      .to({}, { duration: 4 })
      .call(() => this.type("E existem caminhos que ficam especiais apenas por causa de quem caminha ao nosso lado."))
      .to({}, { duration: 5.5 })
      .to(this.narration, { opacity: 0, duration: 1 })
      .fromTo("#choicePaths", { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 1.2, pointerEvents: "auto" })
      .fromTo("#choiceInventory", { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 1 }, "-=0.8");

    this.paths.forEach((button) => {
      button.addEventListener("click", () => this.choosePath(button.dataset.path));
    });

    this.lily.addEventListener("click", () => this.touchLily());

    document.addEventListener("mousemove", (event) => this.petalCursor(event));
  },

  type(text) {
    this.narration.textContent = "";
    gsap.set(this.narration, { opacity: 1 });

    let i = 0;
    const timer = setInterval(() => {
      this.narration.textContent += text[i];
      i += 1;
      if (i >= text.length) clearInterval(timer);
    }, 52);
  },

  choosePath(path) {
    if (this.pathChosen) return;
    this.pathChosen = true;

    if (window.Ambient && Ambient.chime) Ambient.chime();

    gsap.to("#choicePaths", {
      opacity: 0,
      y: 30,
      duration: 0.9,
      pointerEvents: "none"
    });

    this.pathMagic.className = `path-magic ${path}-magic`;

    if (path === "flower") this.flowerPath();
    if (path === "books") this.bookPath();
    if (path === "lake") this.lakePath();
    if (path === "stars") this.starPath();

    gsap.to("#gardenCamera", {
      scale: 1.08,
      y: -60,
      duration: 4.5,
      ease: "power2.inOut"
    });

    gsap.to(this.tree, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 2,
      delay: 3.2,
      ease: "back.out(1.3)"
    });
  },

  flowerPath() {
    document.querySelectorAll(".flower").forEach((flower, index) => {
      gsap.to(flower, {
        scale: 1.45,
        opacity: 1,
        duration: 0.8,
        delay: index * 0.12,
        ease: "back.out(1.8)"
      });
    });
  },

  bookPath() {
    for (let i = 0; i < 16; i++) {
      const book = document.createElement("span");
      book.className = "flying-book";
      book.style.left = `${10 + Math.random() * 80}%`;
      book.style.top = `${45 + Math.random() * 35}%`;
      this.pathMagic.appendChild(book);

      gsap.to(book, {
        y: -80 - Math.random() * 120,
        x: -70 + Math.random() * 140,
        rotation: -25 + Math.random() * 50,
        duration: 4 + Math.random() * 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  },

  lakePath() {
    for (let i = 0; i < 18; i++) {
      const fish = document.createElement("span");
      fish.className = "light-fish";
      fish.style.left = `${Math.random() * 100}%`;
      fish.style.top = `${62 + Math.random() * 25}%`;
      this.pathMagic.appendChild(fish);

      gsap.to(fish, {
        x: -160 + Math.random() * 320,
        opacity: 0.25 + Math.random() * 0.75,
        duration: 4 + Math.random() * 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  },

  starPath() {
    for (let i = 0; i < 5; i++) {
      const constellation = document.createElement("span");
      constellation.className = "constellation";
      constellation.style.left = `${12 + Math.random() * 72}%`;
      constellation.style.top = `${12 + Math.random() * 32}%`;
      this.pathMagic.appendChild(constellation);

      gsap.fromTo(constellation, {
        opacity: 0,
        scale: 0.6
      }, {
        opacity: 1,
        scale: 1,
        duration: 1.6,
        delay: i * 0.4,
        ease: "sine.out"
      });
    }
  },

  makeThoughts() {
    const icons = ["✨", "🍃", "🌙", "☁️"];

    this.thoughts.forEach((phrase, index) => {
      const button = document.createElement("button");
      button.className = "thought-item";
      button.type = "button";
      button.textContent = icons[index % icons.length];
      button.style.left = `${8 + Math.random() * 84}%`;
      button.style.top = `${22 + Math.random() * 62}%`;

      button.addEventListener("click", () => this.showThought(phrase));
      this.thoughtsWrap.appendChild(button);

      gsap.to(button, {
        y: -8,
        duration: 2 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random()
      });
    });
  },

  showThought(text) {
    this.thoughtBox.textContent = text;

    gsap.fromTo(this.thoughtBox, {
      opacity: 0,
      y: 16
    }, {
      opacity: 1,
      y: 0,
      duration: 0.55,
      ease: "sine.out"
    });

    gsap.to(this.thoughtBox, {
      opacity: 0,
      y: -10,
      duration: 0.7,
      delay: 3.2,
      ease: "sine.inOut"
    });
  },

  touchLily() {
    if (this.lilyTouched) return;
    this.lilyTouched = true;

    if (window.Ambient && Ambient.finalSwell) Ambient.finalSwell();

    for (let i = 0; i < 90; i++) this.makePetal(window.innerWidth / 2, window.innerHeight * 0.42);

    gsap.fromTo("#heartFlash", {
      opacity: 0,
      scale: 0.2
    }, {
      opacity: 1,
      scale: 1.4,
      duration: 1.2,
      ease: "back.out(1.8)"
    });

    gsap.to("#heartFlash", {
      opacity: 0,
      scale: 0.4,
      duration: 0.6,
      delay: 1.1,
      ease: "sine.inOut"
    });

    gsap.to("#keyReveal", {
      opacity: 1,
      y: -12,
      duration: 1.2,
      delay: 1.7,
      ease: "back.out(1.4)"
    });

    gsap.to(this.inventoryKey, {
      opacity: 1,
      scale: 1.25,
      filter: "grayscale(0)",
      duration: 0.8,
      delay: 2.1,
      yoyo: true,
      repeat: 1,
      ease: "back.out(2)"
    });

    gsap.to("#gardenContinue", {
      opacity: 1,
      y: -10,
      pointerEvents: "auto",
      duration: 1,
      delay: 2.8,
      ease: "sine.out"
    });
  },

  makePetal(x, y) {
    const petal = document.createElement("span");
    petal.className = "floating-petal";
    petal.style.left = `${x}px`;
    petal.style.top = `${y}px`;
    document.body.appendChild(petal);

    gsap.to(petal, {
      x: -260 + Math.random() * 520,
      y: -180 + Math.random() * 360,
      rotation: Math.random() * 720,
      opacity: 0,
      duration: 2.4 + Math.random() * 2.6,
      ease: "power2.out",
      onComplete: () => petal.remove()
    });
  },

  petalCursor(event) {
    const button = document.getElementById("gardenContinue");
    if (!button || Number(gsap.getProperty(button, "opacity")) < 0.8) return;

    const rect = button.getBoundingClientRect();
    const near = event.clientX > rect.left - 80 && event.clientX < rect.right + 80 &&
      event.clientY > rect.top - 80 && event.clientY < rect.bottom + 80;

    if (near && Math.random() > 0.7) this.makePetal(event.clientX, event.clientY);
  },

  animateGarden() {
    gsap.to(".flower", {
      rotation: 8,
      duration: 2.6,
      repeat: -1,
      yoyo: true,
      stagger: 0.12,
      ease: "sine.inOut"
    });

    gsap.to(".garden-stream", {
      backgroundPosition: "240px 0",
      duration: 6,
      repeat: -1,
      ease: "none"
    });
  },

  easterEggs() {
    setTimeout(() => {
      gsap.to("#blueCabin", { opacity: 0.7, duration: 0.8 });
      gsap.to("#blueCabin", { opacity: 0, duration: 0.8, delay: 2.4 });
    }, 5000);

    setInterval(() => {
      gsap.fromTo("#whiteOwl", {
        x: -160,
        y: 0,
        opacity: 0
      }, {
        x: window.innerWidth + 160,
        y: -80,
        opacity: 1,
        duration: 6,
        ease: "sine.inOut"
      });
    }, 18000);
  },

  makeParticles() {
    const canvas = document.getElementById("choiceParticles");
    const ctx = canvas.getContext("2d");
    const particles = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function seed() {
      particles.length = 0;

      for (let i = 0; i < 160; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: 1 + Math.random() * 2.4,
          vx: -0.2 + Math.random() * 0.4,
          vy: -0.12 - Math.random() * 0.28,
          a: 0.12 + Math.random() * 0.45
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) p.y = canvas.height + 10;
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 220, 136, ${p.a})`;
        ctx.shadowColor = "#ffd36b";
        ctx.shadowBlur = 14;
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
  }
};