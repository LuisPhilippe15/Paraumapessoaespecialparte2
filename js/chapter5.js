window.ChapterFive = {
  started: false,

  compliments: [
    "Você tem um jeito de tornar as coisas mais leves.",
    "Sua presença muda o clima de um lugar sem precisar fazer esforço.",
    "Existe algo muito bonito na forma como você sorri.",
    "Sua inteligência aparece nos detalhes.",
    "Você tem uma energia que dá vontade de conhecer mais.",
    "Seu jeito tem delicadeza, mas também tem força.",
    "Você tem uma presença difícil de explicar e fácil de notar.",
    "Conversar com você parece uma daquelas partes boas do dia.",
    "Você tem uma beleza que não está só no rosto, mas no jeito.",
    "Talvez a melhor parte dessa aventura tenha sido imaginar você chegando até aqui."
  ],

  start() {
    if (this.started) return;
    this.started = true;

    this.scene = document.getElementById("chapterFive");
    this.narration = document.getElementById("villageNarration");
    this.title = document.getElementById("villageTitle");
    this.camera = document.getElementById("villageCamera");
    this.inventory = document.getElementById("villageInventory");
    this.finalArea = document.getElementById("assembledMap");
    this.finalButton = document.getElementById("readyFinalChapter");

    this.prepareScene();
    this.makeFloatingLights();
    this.animateBackground();

    const tl = gsap.timeline({ defaults: { ease: "sine.inOut" } });

    tl.set(this.scene, { opacity: 1, pointerEvents: "auto" })
      .set(this.camera, { opacity: 1, y: 0, scale: 1 })
      .to("#villageTitle", { opacity: 1, y: 0, duration: 1.2 })
      .to("#villageTitle", { opacity: 0, y: -20, duration: 1, delay: 1.8 })
      .call(() => this.type("No fim, todas as pistas levavam para a mesma descoberta."))
      .to({}, { duration: 4.3 })
      .call(() => this.type("A aventura nunca foi só sobre mapas, chaves ou estrelas."))
      .to({}, { duration: 4.5 })
      .call(() => this.type("Era sobre perceber o quanto alguém pode ser especial sem nem tentar."))
      .to({}, { duration: 5 })
      .to(this.narration, { opacity: 0, duration: 0.9 })
      .to("#villageInventory", { opacity: 1, y: 0, duration: 0.9 })
      .to(".final-compliment-card", {
        opacity: 1,
        y: 0,
        stagger: 0.16,
        duration: 0.9,
        ease: "back.out(1.4)"
      })
      .to("#finalComplimentCenter", {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "back.out(1.5)"
      }, "-=0.3")
      .call(() => this.startCompliments())
      .to("#readyFinalChapter", {
        opacity: 1,
        y: -10,
        pointerEvents: "auto",
        duration: 0.9,
        ease: "sine.out"
      }, "-=0.2");

    this.finalButton.addEventListener("click", () => this.showFinalMessage());
    document.addEventListener("mousemove", (event) => this.starCursor(event));
  },

  prepareScene() {
    const counter = document.getElementById("fragmentCounter");

    if (counter) {
      counter.style.display = "none";
    }

    document.querySelectorAll(".map-fragment").forEach((fragment) => {
      fragment.style.display = "none";
    });

    document.querySelectorAll("#villageInventory span").forEach((item) => {
      item.style.opacity = "1";
      item.style.filter = "drop-shadow(0 0 12px rgba(255, 220, 128, .8))";
    });

    this.title.innerHTML = `
      <span>Capítulo 5</span>
      <h1>O Destino da Aventura</h1>
    `;

    this.finalArea.innerHTML = `
      <div class="final-compliment-stage">
        <div class="final-compliment-card card-a">Seu sorriso</div>
        <div class="final-compliment-card card-b">Sua leveza</div>
        <div class="final-compliment-card card-c">Sua inteligência</div>
        <div class="final-compliment-card card-d">Seu jeito</div>

        <div class="final-compliment-center" id="finalComplimentCenter">
          <span>✨</span>
          <p id="complimentText">Você é o tipo de pessoa que transforma uma história simples em algo memorável.</p>
        </div>
      </div>

      <button class="story-button final-chapter-button" id="readyFinalChapter" type="button">
        Guardar esse momento
      </button>
    `;

    this.finalArea.style.opacity = "1";
    this.finalArea.style.pointerEvents = "auto";

    this.finalButton = document.getElementById("readyFinalChapter");
  },

  type(text) {
    if (!this.narration) return;

    this.narration.textContent = "";
    gsap.set(this.narration, { opacity: 1 });

    let index = 0;
    const timer = setInterval(() => {
      this.narration.textContent += text[index];
      index += 1;

      if (index >= text.length) {
        clearInterval(timer);
      }
    }, 48);
  },

  startCompliments() {
    const text = document.getElementById("complimentText");
    if (!text) return;

    let index = 0;

    const showNext = () => {
      if (index >= this.compliments.length) {
        gsap.to(text, {
          opacity: 0,
          y: -8,
          duration: 0.35,
          onComplete: () => {
            text.textContent = "😍";

            gsap.fromTo(text, {
              opacity: 0,
              y: 10,
              scale: 0.7
            }, {
              opacity: 1,
              y: 0,
              scale: 1.8,
              duration: 0.8,
              ease: "back.out(1.8)"
            });
          }
        });

        return;
      }

      gsap.to(text, {
        opacity: 0,
        y: -8,
        duration: 0.35,
        onComplete: () => {
          text.textContent = this.compliments[index];
          index += 1;

          gsap.fromTo(text, {
            opacity: 0,
            y: 10,
            scale: 1
          }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.45,
            ease: "sine.out"
          });
        }
      });

      setTimeout(showNext, 4200);
    };

    setTimeout(showNext, 4200);
  },

  makeFloatingLights() {
    if (document.querySelector(".final-light-layer")) return;

    const layer = document.createElement("div");
    layer.className = "final-light-layer";
    this.scene.appendChild(layer);

    for (let i = 0; i < 70; i++) {
      const light = document.createElement("span");
      light.className = "final-floating-light";
      light.style.left = `${Math.random() * 100}%`;
      light.style.top = `${Math.random() * 100}%`;
      light.style.animationDelay = `${Math.random() * 4}s`;
      light.style.animationDuration = `${4 + Math.random() * 5}s`;
      layer.appendChild(light);
    }
  },

  animateBackground() {
    gsap.to(".passing-cloud", {
      x: 180,
      duration: 18,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 2
    });

    gsap.to(".sky-lantern", {
      y: -90,
      opacity: 0.45,
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".paper-dragon", {
      x: 220,
      y: -70,
      rotation: 18,
      duration: 9,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  },

  starCursor(event) {
    if (!this.finalButton) return;

    const rect = this.finalButton.getBoundingClientRect();

    const near =
      event.clientX > rect.left - 90 &&
      event.clientX < rect.right + 90 &&
      event.clientY > rect.top - 90 &&
      event.clientY < rect.bottom + 90;

    if (!near || Math.random() < 0.7) return;

    const star = document.createElement("span");
    star.className = "cursor-gold-star";
    star.textContent = "✦";
    star.style.left = `${event.clientX}px`;
    star.style.top = `${event.clientY}px`;
    document.body.appendChild(star);

    gsap.to(star, {
      y: -36,
      x: -18 + Math.random() * 36,
      opacity: 0,
      scale: 0.2,
      duration: 0.9,
      ease: "sine.out",
      onComplete: () => star.remove()
    });
  },

  showFinalMessage() {
    const text = document.getElementById("complimentText");
    if (!text) return;

    gsap.to(".final-compliment-card", {
      opacity: 0,
      y: 20,
      stagger: 0.08,
      duration: 0.5
    });

    gsap.to(text, {
      opacity: 0,
      y: -8,
      duration: 0.35,
      onComplete: () => {
        text.textContent = "Se essa aventura teve magia, foi porque ela foi feita pensando em você.";

        gsap.fromTo(text, {
          opacity: 0,
          y: 12,
          scale: 1
        }, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "sine.out"
        });
      }
    });

    gsap.to(this.finalButton, {
      opacity: 0,
      pointerEvents: "none",
      duration: 0.5
    });
  }
};