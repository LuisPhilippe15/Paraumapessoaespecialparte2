const introScene = document.getElementById("introScene");
const chapterOne = document.getElementById("chapterOne");
const chapterTwo = document.getElementById("chapterTwo");
const chapterThree = document.getElementById("chapterThree");
const chapterFour = document.getElementById("chapterFour");
const chapterFive = document.getElementById("chapterFive");
const whiteFlash = document.getElementById("whiteFlash");

let chapterOneStarted = false;
let chapterTwoStarted = false;
let chapterThreeStarted = false;
let chapterFourStarted = false;
let chapterFiveStarted = false;

function showOnly(scene) {
  if (!scene) return;

  document.querySelectorAll(".scene").forEach((item) => {
    item.classList.remove("is-active");
    item.style.opacity = "";
    item.style.pointerEvents = "";
  });

  scene.classList.add("is-active");

  gsap.set(scene, {
    opacity: 1,
    pointerEvents: "auto"
  });
}

function transitionTo(scene, callback) {
  if (!scene) return;

  gsap.to(whiteFlash, {
    opacity: 1,
    duration: 0.7,
    ease: "sine.inOut",
    onComplete: () => {
      showOnly(scene);

      gsap.to(whiteFlash, {
        opacity: 0,
        duration: 1,
        ease: "sine.inOut",
        onComplete: () => {
          if (callback) callback();
        }
      });
    }
  });
}

function runIntro() {
  gsap.to("#introCamera", {
    scale: 1.07,
    duration: 8,
    delay: 0.8,
    ease: "sine.inOut"
  });

  const tl = gsap.timeline({ defaults: { ease: "sine.inOut" } });

  tl.to(".stars-field", { opacity: 1, duration: 1.4, delay: 0.5 })
    .to(".moon", { opacity: 1, scale: 1, duration: 1.1 }, "-=0.5")
    .to("#introParticles", { opacity: 1, duration: 1.2 }, "-=0.4")
    .to(".forest-layer", { opacity: 1, duration: 1.1 }, "-=0.8")
    .to("#introLine1", { opacity: 1, y: -8, duration: 0.8 }, "-=0.2")
    .to("#introLine1", { opacity: 0, y: -28, duration: 0.8, delay: 0.9 })
    .to("#introLine2", { opacity: 1, y: -8, duration: 0.8 })
    .to("#introLine2", { opacity: 0, y: -28, duration: 0.8, delay: 0.9 })
    .to("#introLine3", { opacity: 1, y: -8, duration: 0.8 })
    .to("#introLine3", { opacity: 0, y: -28, duration: 0.8, delay: 0.9 })
    .to(".tower", {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.6,
      ease: "power2.out"
    })
    .to("#windowGlow", { opacity: 1, duration: 0.55 })
    .to("#windowGlow", { opacity: 0.15, duration: 0.3, delay: 0.25 })
    .to("#windowGlow", { opacity: 1, duration: 0.5, delay: 0.2 })
    .to("#startAdventure", {
      opacity: 1,
      y: -10,
      duration: 0.8,
      pointerEvents: "auto",
      ease: "sine.out"
    });
}

function enterChapterOne() {
  if (chapterOneStarted) return;
  chapterOneStarted = true;

  gsap.to("#startAdventure", {
    opacity: 0,
    y: 14,
    duration: 0.35,
    pointerEvents: "none",
    ease: "sine.inOut"
  });

  const tl = gsap.timeline();

  tl.to("#introCamera", {
    scale: 2.6,
    y: "22%",
    duration: 2.2,
    ease: "power2.inOut"
  })
    .to(whiteFlash, { opacity: 1, duration: 0.55 }, "-=0.3")
    .call(() => {
      showOnly(chapterOne);

      if (window.IntroFX && IntroFX.chapterDust) {
        IntroFX.chapterDust();
      }

      if (window.ChapterOne && ChapterOne.init) {
        ChapterOne.init();
      }
    })
    .to(whiteFlash, { opacity: 0, duration: 0.9 })
    .from(".chapter-one-title span", { opacity: 0, y: 18, duration: 0.7 }, "-=0.4")
    .from(".chapter-one-title h1", { opacity: 0, y: 24, duration: 0.8 }, "-=0.35")
    .from(".chapter-one-title p", { opacity: 0, y: 18, duration: 0.8 }, "-=0.35")
    .from("#chameleon", { opacity: 0, y: 60, scale: 0.85, duration: 1, ease: "back.out(1.5)" }, "-=0.2")
    .from("#starCounter", { opacity: 0, y: -16, duration: 0.6 }, "-=0.7")
    .from(".collect-star", { opacity: 0, scale: 0, stagger: 0.06, duration: 0.55, ease: "back.out(1.8)" }, "-=0.3");
}

function enterChapterTwo() {
  if (!window.chapterOneFinished || chapterTwoStarted) return;
  chapterTwoStarted = true;

  transitionTo(chapterTwo, () => {
    if (window.LanternChapter && LanternChapter.start) {
      LanternChapter.start();
    }
  });
}

function enterChapterThree() {
  if (!window.chapterTwoFinished || chapterThreeStarted) return;
  chapterThreeStarted = true;

  transitionTo(chapterThree, () => {
    if (window.TimeChapter && TimeChapter.start) {
      TimeChapter.start();
    }
  });
}

function enterChapterFour() {
  if (!window.TimeChapter || !TimeChapter.finished || chapterFourStarted) return;
  chapterFourStarted = true;

  if (TimeChapter.dissolve) {
    TimeChapter.dissolve();
  }

  transitionTo(chapterFour, () => {
    if (window.ChapterFour && ChapterFour.start) {
      ChapterFour.start();
    }
  });
}

function enterChapterFive() {
  if (!window.ChapterFour || !ChapterFour.lilyTouched || chapterFiveStarted) return;
  chapterFiveStarted = true;

  transitionTo(chapterFive, () => {
    if (window.ChapterFive && ChapterFive.start) {
      ChapterFive.start();
    }
  });
}

function bindButton(id, callback) {
  const button = document.getElementById(id);
  if (!button) return;

  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    callback();
  });

  document.addEventListener("pointerdown", (event) => {
    const rect = button.getBoundingClientRect();

    const clicked =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (clicked) {
      event.preventDefault();
      event.stopPropagation();
      callback();
    }
  }, true);
}

bindButton("startAdventure", enterChapterOne);
bindButton("continueToLanterns", enterChapterTwo);
bindButton("continueToTime", enterChapterThree);
bindButton("followJourney", enterChapterFour);
bindButton("gardenContinue", enterChapterFive);

runIntro();