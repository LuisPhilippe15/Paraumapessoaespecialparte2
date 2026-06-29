window.TimeChapter = {
  targetState: 0,
  started: false,
  finished: false,
  requiredClocks: 4,

  start() {
    if (this.started) return;
    this.started = true;

    this.clocks = Array.from(document.querySelectorAll("[data-clock]"));
    this.speech = document.getElementById("guardianSpeech");
    this.guardian = document.getElementById("guardian");
    this.compartment = document.getElementById("secretCompartment");
    this.key = document.getElementById("goldKey");
    this.map = document.getElementById("mapPiece");
    this.followButton = document.getElementById("followJourney");

    this.createCosmicStars();
    this.prepareClocks();

    const tl = gsap.timeline({ defaults: { ease: "sine.inOut" } });

    tl.to("#cosmicStars", { opacity: 1, duration: 1.2 })
      .to("#timeVortex", { opacity: 1, scale: 1, rotation: 80, duration: 2.2, ease: "power2.inOut" })
      .to("#nebula", { opacity: 1, scale: 1.08, duration: 1.8 }, "-=1.1")
      .to("#timeTitle", { opacity: 1, duration: 1 }, "-=0.4")
      .to("#timeTitle", { opacity: 0, duration: 0.9, delay: 1.2 })
      .call(() => this.typeAndHold("Existem pessoas que mudam completamente um dia...", 3.6))
      .to({}, { duration: 4.8 })
      .call(() => this.typeAndHold("Outras conseguem mudar nossa noção de tempo.", 3.6))
      .to({}, { duration: 4.8 })
      .call(() => this.typeAndHold("Porque quando estamos vivendo algo especial...", 3.4))
      .to({}, { duration: 4.6 })
      .call(() => this.typeAndHold("...o tempo simplesmente desaparece.", 3.4))
      .to({}, { duration: 4.5 })
      .to("#timeNarration", { opacity: 0, duration: 0.8 })
      .to("#nebula, #timeVortex", { opacity: 0.2, duration: 0.8 })
      .to("#observatory", { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "power2.out" }, "-=0.2")
      .to("#guardian", { opacity: 1, y: -12, duration: 0.9, ease: "back.out(1.4)" }, "-=0.3")
      .call(() => this.speak("Você chegou exatamente na hora certa."))
      .to({}, { duration: 2.2 })
      .call(() => this.speak("Mas... será que sabe controlar o tempo?"))
      .to({}, { duration: 2 })
      .call(() => this.activateGame());
  },

  createCosmicStars() {
    const field = document.getElementById("cosmicStars");
    if (!field || field.dataset.ready === "true") return;

    field.dataset.ready = "true";

    for (let i = 0; i < 170; i++) {
      const star = document.createElement("span");
      star.className = "cosmic-dot";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.opacity = 0.25 + Math.random() * 0.75;
      star.style.transform = `scale(${0.6 + Math.random() * 2})`;
      field.appendChild(star);

      gsap.to(star, {
        x: -20 + Math.random() * 40,
        y: -20 + Math.random() * 40,
        duration: 3 + Math.random() * 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  },

  typeAndHold(text) {
    const box = document.getElementById("timeNarration");
    if (!box) return;

    box.textContent = "";
    gsap.set(box, { opacity: 1 });

    let index = 0;
    const timer = setInterval(() => {
      box.textContent += text[index];
      index += 1;

      if (index >= text.length) {
        clearInterval(timer);
      }
    }, 55);
  },

  speak(text) {
    if (!this.speech) return;

    this.speech.textContent = text;

    gsap.fromTo(this.speech, {
      opacity: 0,
      y: 12
    }, {
      opacity: 1,
      y: 0,
      duration: 0.55,
      ease: "sine.out"
    });
  },

  prepareClocks() {
    this.clocks.forEach((clock) => {
      this.renderClock(clock);

      clock.addEventListener("click", () => {
        if (clock.dataset.locked === "true" || this.finished) return;

        const next = (Number(clock.dataset.state || 0) + 1) % 4;
        clock.dataset.state = String(next);

        this.renderClock(clock);
        this.checkSync();
      });
    });
  },

  renderClock(clock) {
    const state = Number(clock.dataset.state || 0);
    const hour = clock.querySelector("i");
    const minute = clock.querySelector("b");
    const rotations = [45, 135, 225, 315];

    if (hour) {
      gsap.to(hour, {
        rotate: rotations[state],
        xPercent: -50,
        duration: 0.3,
        ease: "power2.out"
      });
    }

    if (minute) {
      gsap.to(minute, {
        rotate: rotations[(state + 1) % 4],
        xPercent: -50,
        duration: 0.3,
        ease: "power2.out"
      });
    }

    clock.classList.toggle("synced", state === this.targetState);
  },

  activateGame() {
    gsap.to(this.speech, { opacity: 0, y: 12, duration: 0.45 });

    gsap.fromTo(".mini-clock", {
      opacity: 0,
      scale: 0.7
    }, {
      opacity: 1,
      scale: 1,
      stagger: 0.08,
      duration: 0.5,
      ease: "back.out(1.7)"
    });

    this.checkSync();
  },

  checkSync() {
    if (this.finished) return;

    const correctClocks = this.clocks.filter((clock) => {
      return Number(clock.dataset.state || 0) === this.targetState;
    });

    this.clocks.forEach((clock) => {
      clock.classList.toggle("synced", Number(clock.dataset.state || 0) === this.targetState);
    });

    if (correctClocks.length >= this.requiredClocks) {
      this.finished = true;

      this.clocks.forEach((clock) => {
        clock.dataset.locked = "true";
      });

      setTimeout(() => this.complete(), 500);
    }
  },

  complete() {
    if (this.guardian) this.guardian.classList.add("smile");

    gsap.to(".gear-a", { duration: 1.1, rotate: "+=720", ease: "power2.inOut" });
    gsap.to(".gear-b", { duration: 1.1, rotate: "-=720", ease: "power2.inOut" });
    gsap.to(".gear-c", { duration: 1.1, rotate: "+=900", ease: "power2.inOut" });

    gsap.to(".observatory-ceiling i, .crystals i", {
      scale: 1.5,
      opacity: 1,
      stagger: 0.05,
      duration: 0.7,
      yoyo: true,
      repeat: 1,
      ease: "sine.inOut"
    });

    setTimeout(() => this.giveKey(), 900);
  },

  giveKey() {
    gsap.to(this.compartment, {
      opacity: 1,
      duration: 0.7,
      onStart: () => {
        this.compartment.classList.add("is-visible");
      }
    });

    gsap.fromTo(this.key, {
      opacity: 0,
      y: 80,
      scale: 0.7,
      rotation: -24
    }, {
      opacity: 1,
      y: -34,
      scale: 1,
      rotation: 0,
      duration: 0.75,
      ease: "back.out(1.5)"
    });

    gsap.to(this.key, { x: 120, rotation: 18, duration: 0.65, delay: 0.6, ease: "power2.inOut" });
    gsap.to(this.key, { opacity: 0, duration: 0.35, delay: 1.25 });

    gsap.to(this.map, {
      opacity: 1,
      scale: 1,
      y: -22,
      duration: 0.75,
      delay: 1.35,
      ease: "back.out(1.35)"
    });

    gsap.to(this.followButton, {
      opacity: 1,
      y: -10,
      duration: 0.7,
      delay: 1.8,
      pointerEvents: "auto",
      ease: "sine.out"
    });
  },

  dissolve() {
    gsap.to("#observatory, #cosmicStars, #nebula, #timeVortex", {
      opacity: 0,
      scale: 0.96,
      duration: 1.2,
      ease: "sine.inOut"
    });
  }
};