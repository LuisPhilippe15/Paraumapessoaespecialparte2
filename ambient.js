window.Ambient = {
  ensure() {},
  startCrickets() {},
  fadeOut() {},
  startLanternMusic() {},
  swellLanterns() {},
  startTimeMusic() {},
  finalSwell() {},
  chime() {}
};

document.querySelectorAll("audio, video").forEach((media) => {
  media.pause();
  media.muted = true;
  media.volume = 0;
});