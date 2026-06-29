window.chapterOneFinished = false;

window.ChapterOne = {
  total: 9,
  collected: 0,
  started: false,
  boxOpened: false,

  init() {
    if (this.started) return;
    this.started = true;

    this.stars = document.querySelectorAll("[data-star]");
    this.counter = document.getElementById("starCounter");
    this.count = document.getElementById("starCount");
    this.ending = document.getElementById("chapterOneEnding");
    this.box = document.getElementById("firstBox");
    this.paper = document.getElementById("firstPaper");
    this.continueButton = document.getElementById("continueToLanterns");

    this.initChameleon();
    this.initStars();
    this.initBox();
  },

  initChameleon() {
    const chameleon = document.getElementById("chameleon");
    const eyes = document.querySelectorAll(".chameleon-eye i");
    const sleepZ = document.getElementById("sleepZ");
    let sleepTimer = null;

    const wake = () => {
      if (!chameleon) return;

      clearTimeout(sleepTimer);
      chameleon.classList.remove("sleeping");

      if (sleepZ) {
        gsap.killTweensOf(sleepZ);
        gsap.to(sleepZ, { opacity: 0, y: 0, duration: 0.25 });
      }

      sleepTimer = setTimeout(() => {
        chameleon.classList.add("sleeping");

        if (sleepZ) {
          gsap.to(sleepZ, {
            opacity: 1,
            y: -18,
            duration: 1.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
        }
      }, 4200);
    };

    window.addEventListener("mousemove", (event) => {
      wake();

      eyes.forEach((eye) => {
        const rect = eye.parentElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);

        eye.style.transform = `translate(${Math.cos(angle) * 4}px, ${Math.sin(angle) * 4}px)`;
      });
    });

    setInterval(() => {
      if (!chameleon || chameleon.classList.contains("sleeping")) return;

      gsap.to(".chameleon-eye", {
        height: 4,
        y: 8,
        duration: 0.08,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut"
      });
    }, 2800);

    wake();
  },

  initStars() {
    this.stars.forEach((star) => {
      star.dataset.collected = "false";

      gsap.to(star, {
        y: -8,
        duration: 1.8 + Math.random(),
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: Math.random()
      });
    });

    document.addEventListener("pointerdown", (event) => {
      const chapter = document.getElementById("chapterOne");

      if (!chapter || !chapter.classList.contains("is-active")) return;

      const star = this.getNearestStar(event.clientX, event.clientY);

      if (star) {
        this.collect(star);
      }
    }, true);

    window.addEventListener("mousemove", (event) => {
      document.querySelectorAll(".near-star").forEach((star) => {
        if (star.dataset.collected === "true") return;

        const rect = star.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);

        gsap.to(star, {
          opacity: distance < 170 ? 1 : 0,
          scale: distance < 170 ? 1 : 0.75,
          duration: 0.35,
          ease: "sine.out"
        });
      });
    });
  },

  getNearestStar(x, y) {
    let selectedStar = null;
    let selectedDistance = Infinity;

    this.stars.forEach((star) => {
      if (star.dataset.collected === "true") return;

      const rect = star.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(x - centerX, y - centerY);

      if (distance < 110 && distance < selectedDistance) {
        selectedStar = star;
        selectedDistance = distance;
      }
    });

    return selectedStar;
  },

  collect(star) {
    if (!star || star.dataset.collected === "true") return;

    star.dataset.collected = "true";

    if (window.Ambient && Ambient.chime) {
      Ambient.chime();
    }

    this.collected += 1;
    this.count.textContent = this.collected;

    const starRect = star.getBoundingClientRect();
    const counterRect = this.counter.getBoundingClientRect();

    const flyingStar = document.createElement("span");
    flyingStar.className = "flying-star";
    flyingStar.textContent = "★";
    flyingStar.style.left = `${starRect.left + starRect.width / 2}px`;
    flyingStar.style.top = `${starRect.top + starRect.height / 2}px`;
    document.body.appendChild(flyingStar);

    gsap.to(star, {
      opacity: 0,
      scale: 0,
      duration: 0.25,
      ease: "sine.inOut"
    });

    gsap.to(flyingStar, {
      left: counterRect.left + counterRect.width / 2,
      top: counterRect.top + counterRect.height / 2,
      scale: 0.25,
      opacity: 0,
      duration: 0.9,
      ease: "power2.inOut",
      onComplete: () => flyingStar.remove()
    });

    gsap.fromTo(this.counter, {
      scale: 1.12
    }, {
      scale: 1,
      duration: 0.35,
      ease: "back.out(2)"
    });

    if (this.collected >= this.total) {
      setTimeout(() => this.complete(), 900);
    }
  },

  complete() {
    window.chapterOneFinished = true;

    const chameleon = document.getElementById("chameleon");

    if (chameleon) {
      chameleon.classList.add("happy");
    }

    gsap.to(".chapter-one-title, #starCounter, .collect-star, .leaf, .butterfly, .firefly", {
      opacity: 0,
      duration: 1.1,
      ease: "sine.inOut"
    });

    gsap.to(this.ending, {
      opacity: 1,
      duration: 1.2,
      ease: "sine.inOut",
      onStart: () => {
        this.ending.classList.add("is-visible");
      },
      onComplete: () => {
        setTimeout(() => this.openBox(), 900);
      }
    });

    gsap.fromTo(this.box, {
      y: 80,
      scale: 0.86,
      opacity: 0
    }, {
      y: 30,
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: "power2.out"
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

    gsap.to("#firstBox .box-lid", {
      rotateX: -72,
      y: -28,
      duration: 0.8,
      ease: "power2.inOut"
    });

    gsap.to(this.box, {
      y: 90,
      opacity: 0,
      duration: 0.8,
      delay: 0.35,
      ease: "sine.inOut",
      pointerEvents: "none"
    });

    gsap.to(this.paper, {
      opacity: 1,
      scale: 1,
      y: -24,
      duration: 1.1,
      delay: 0.55,
      ease: "back.out(1.4)"
    });

    gsap.to(this.continueButton, {
      opacity: 1,
      y: -8,
      duration: 0.9,
      delay: 1.2,
      ease: "sine.out",
      pointerEvents: "auto"
    });
  }
};