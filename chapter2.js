window.chapterTwoFinished = false;

window.LanternChapter = {
  total: 8,
  collected: 0,
  active: false,
  started: false,
  boxOpened: false,

  start() {
    if (this.started) return;
    this.started = true;

    this.lanterns = document.querySelectorAll("[data-lantern]");
    this.counter = document.getElementById("lanternCounter");
    this.count = document.getElementById("lanternCount");
    this.ripples = document.getElementById("ripples");
    this.reflections = document.getElementById("reflections");
    this.autoLanterns = document.getElementById("autoLanterns");
    this.ending = document.getElementById("lanternEnding");
    this.box = document.getElementById("secondBox");
    this.paper = document.getElementById("secondPaper");
    this.continueButton = document.getElementById("continueToTime");

    IntroFX.canvasParticles("lanternParticles", 120, ["rgba(255,213,107,ALPHA)"]);
    this.nature();
    this.easterEggs();
    this.initBox();

    const tl = gsap.timeline({ defaults: { ease: "sine.inOut" } });

    tl.to(".sunset-orange", { opacity: 1, duration: 3.4 })
      .to(".sunset-pink", { opacity: 1, duration: 3.4 }, "-=1.8")
      .to(".sunset-blue", { opacity: 0.72, duration: 4.2 }, "-=1.8")
      .to(".volumetric", { opacity: 0.72, duration: 4 }, "-=5")
      .to("#lakeCamera", { y: 0, scale: 1, duration: 7, ease: "power2.inOut" }, "-=6")
      .to("#lanternTitle", { opacity: 1, duration: 1.6 }, "-=1.4")
      .to("#lanternTitle", { opacity: 0, duration: 1.4, delay: 2.2 })
      .call(() => this.type("Existem momentos que iluminam mais do que qualquer estrela."))
      .to({}, { duration: 4.8 })
      .call(() => this.type("Mas apenas quem observa com atenção consegue encontrá-los."))
      .to({}, { duration: 5 })
      .to("#lanternNarration", { opacity: 0, duration: 1 })
      .to(this.counter, { opacity: 1, duration: 0.8 }, "-=0.5")
      .to(this.lanterns, {
        opacity: 1,
        stagger: 0.16,
        duration: 1.2,
        ease: "sine.out",
        onComplete: () => {
          this.active = true;
        }
      }, "-=0.3");

    this.lanterns.forEach((lantern, index) => {
      gsap.to(lantern, {
        y: -5 - Math.random() * 8,
        x: -5 + Math.random() * 10,
        rotation: -2 + Math.random() * 4,
        duration: 2.4 + index * 0.15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });

    window.addEventListener("mousemove", (event) => this.near(event));
    window.addEventListener("touchmove", (event) => {
      const touch = event.touches[0];
      if (touch) this.near(touch);
    });
  },

  type(text) {
    const box = document.getElementById("lanternNarration");
    box.textContent = "";
    gsap.set(box, { opacity: 1 });

    let i = 0;
    const timer = setInterval(() => {
      box.textContent += text[i];
      i += 1;
      if (i >= text.length) clearInterval(timer);
    }, 54);
  },

  near(event) {
    if (!this.active) return;

    this.lanterns.forEach((lantern) => {
      if (lantern.dataset.lit === "true") return;

      const rect = lantern.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);

      if (distance < 115) {
        this.light(lantern);
      }
    });
  },

  light(lantern) {
    if (!this.active || lantern.dataset.lit === "true") return;

    lantern.dataset.lit = "true";
    lantern.classList.add("is-lit");

    if (window.Ambient && Ambient.chime) {
      Ambient.chime();
    }

    this.collected += 1;
    this.count.textContent = this.collected;

    this.reflection(lantern);
    this.ripple(lantern);
    this.burst(lantern);

    const driftX = -80 + Math.random() * 160;
    const rise = 210 + Math.random() * 170;
    const duration = 5.4 + Math.random() * 3;

    gsap.to(lantern, {
      y: `-=${rise}`,
      x: `+=${driftX}`,
      scale: 0.72 + Math.random() * 0.24,
      rotation: -9 + Math.random() * 18,
      duration,
      ease: "sine.inOut"
    });

    gsap.to(lantern, {
      opacity: 0,
      duration: 1.2,
      delay: duration - 1.2,
      ease: "sine.inOut"
    });

    if (this.collected >= this.total) {
      this.active = false;
      setTimeout(() => this.complete(), 1600);
    }
  },

  reflection(lantern) {
    const rect = lantern.getBoundingClientRect();
    const el = document.createElement("span");

    el.className = "reflection";
    el.style.left = `${rect.left + rect.width / 2 - 22}px`;
    el.style.top = `${window.innerHeight * 0.63}px`;
    this.reflections.appendChild(el);

    gsap.fromTo(el, { opacity: 0, scaleY: 0.8 }, {
      opacity: 1,
      scaleY: 1.4,
      duration: 0.8,
      ease: "sine.out"
    });

    gsap.to(el, {
      opacity: 0,
      y: 40,
      duration: 4,
      delay: 0.8,
      ease: "sine.inOut",
      onComplete: () => el.remove()
    });
  },

  ripple(lantern) {
    const rect = lantern.getBoundingClientRect();
    const el = document.createElement("span");

    el.className = "ripple";
    el.style.left = `${rect.left + rect.width / 2 - 9}px`;
    el.style.top = `${window.innerHeight * 0.63}px`;
    this.ripples.appendChild(el);

    gsap.to(el, {
      scaleX: 7,
      scaleY: 4,
      opacity: 0,
      duration: 1.8,
      ease: "sine.out",
      onComplete: () => el.remove()
    });
  },

  burst(target) {
    const rect = target.getBoundingClientRect();

    for (let i = 0; i < 14; i++) {
      const p = document.createElement("span");
      p.className = "burst";
      p.style.left = `${rect.left + rect.width / 2}px`;
      p.style.top = `${rect.top + rect.height / 2}px`;
      document.body.appendChild(p);

      gsap.to(p, {
        x: -40 + Math.random() * 80,
        y: -70 - Math.random() * 90,
        opacity: 0,
        scale: 0.2 + Math.random(),
        duration: 1.1 + Math.random(),
        ease: "power2.out",
        onComplete: () => p.remove()
      });
    }
  },

  nature() {
    gsap.to(".lake-leaf-a", { x: 240, y: 24, rotation: 24, duration: 13, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".lake-leaf-b", { x: -180, y: 18, rotation: -20, duration: 15, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".lake-leaf-c", { x: -260, y: 30, rotation: 18, duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });
  },

  easterEggs() {
    setInterval(() => {
      gsap.fromTo("#comet", { opacity: 0, x: 0, y: 0, rotation: 18 }, {
        opacity: 1,
        x: window.innerWidth * 1.3,
        y: 180,
        duration: 2.5,
        ease: "power2.in",
        onComplete: () => gsap.set("#comet", { opacity: 0 })
      });
    }, 15000);

    setInterval(() => {
      if (Math.random() > 0.35) return;

      gsap.fromTo("#shootingStar", { opacity: 0, x: 0, y: 0, rotation: 22 }, {
        opacity: 1,
        x: window.innerWidth * 1.2,
        y: 230,
        duration: 1.4,
        ease: "power3.in",
        onComplete: () => gsap.set("#shootingStar", { opacity: 0 })
      });
    }, 22000);

    setInterval(() => {
      const owl = document.getElementById("owl");
      owl.classList.add("blink");
      setTimeout(() => owl.classList.remove("blink"), 180);
    }, 3600);
  },

  complete() {
    window.chapterTwoFinished = true;

    if (window.Ambient && Ambient.swellLanterns) {
      Ambient.swellLanterns();
    }

    gsap.to(".sunset-blue", { opacity: 1, duration: 4, ease: "sine.inOut" });
    gsap.to(".volumetric", { opacity: 1, duration: 3 });
    gsap.to(this.counter, { opacity: 0, duration: 1 });

    this.releaseSky();

    gsap.to("#lakeCamera", {
      y: -130,
      scale: 1.16,
      duration: 7,
      ease: "power2.inOut"
    });

    setTimeout(() => this.explode(), 5200);
    setTimeout(() => this.showBox(), 7600);
  },

  releaseSky() {
    if (!this.autoLanterns) {
      this.autoLanterns = document.getElementById("autoLanterns");
    }

    for (let i = 0; i < 140; i++) {
      const lantern = document.createElement("span");
      lantern.className = "auto-lantern";
      lantern.style.left = `${Math.random() * 100}%`;
      lantern.style.top = `${74 + Math.random() * 32}%`;
      lantern.style.transform = `scale(${0.45 + Math.random() * 0.95})`;
      this.autoLanterns.appendChild(lantern);

      gsap.to(lantern, {
        y: -window.innerHeight * (0.9 + Math.random() * 0.8),
        x: -120 + Math.random() * 240,
        opacity: 0.15 + Math.random() * 0.85,
        duration: 7 + Math.random() * 9,
        delay: Math.random() * 2,
        ease: "sine.inOut"
      });
    }
  },

  explode() {
    const x = window.innerWidth * 0.52;
    const y = window.innerHeight * 0.26;

    for (let i = 0; i < 90; i++) {
      const p = document.createElement("span");
      p.className = "burst";
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      document.body.appendChild(p);

      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 190;

      gsap.to(p, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        scale: 0.3 + Math.random() * 1.3,
        duration: 1.8 + Math.random() * 1.8,
        ease: "power2.out",
        onComplete: () => p.remove()
      });
    }

    if (window.Ambient && Ambient.chime) {
      Ambient.chime();
    }
  },

  showBox() {
    gsap.to(this.ending, {
      opacity: 1,
      duration: 1.5,
      ease: "sine.inOut",
      onStart: () => {
        this.ending.classList.add("is-visible");
      },
      onComplete: () => {
        setTimeout(() => this.openBox(), 900);
      }
    });

    gsap.fromTo(this.box, {
      opacity: 0,
      y: 80,
      scale: 0.72
    }, {
      opacity: 1,
      y: 24,
      scale: 1,
      duration: 1.4,
      ease: "back.out(1.4)"
    });
  },

  initBox() {
    if (!this.box) return;

    this.box.addEventListener("pointerdown", () => {
      this.openBox();
    });
  },

  openBox() {
    if (this.boxOpened) return;
    if (!this.ending || !this.ending.classList.contains("is-visible")) return;

    this.boxOpened = true;

    if (window.Ambient && Ambient.chime) {
      Ambient.chime();
    }

    gsap.to("#secondBox .box-lid", {
      rotateX: -72,
      y: -28,
      duration: 0.8,
      ease: "power2.inOut"
    });

    gsap.to(this.box, {
      y: 96,
      opacity: 0,
      duration: 0.9,
      delay: 0.35,
      ease: "sine.inOut",
      pointerEvents: "none"
    });

    gsap.to(this.paper, {
      opacity: 1,
      scale: 1,
      y: -34,
      duration: 1.1,
      delay: 0.55,
      ease: "back.out(1.35)"
    });

    gsap.to(this.continueButton, {
      opacity: 1,
      y: -10,
      duration: 1,
      delay: 1.25,
      ease: "sine.out",
      pointerEvents: "auto"
    });
  }
};