const hairStrand = document.getElementById("hairStrand");

let startTime = null;

function animateHair(timestamp) {
  if (!startTime) {
    startTime = timestamp;
  }

  const elapsed = (timestamp - startTime) / 1000;

  const waveOne = Math.sin(elapsed * 1.4) * 16;
  const waveTwo = Math.cos(elapsed * 1.1) * 14;
  const waveThree = Math.sin(elapsed * 1.7) * 12;

  const path = `
    M20 45
    C120 ${28 + waveOne}, 210 ${62 - waveTwo}, 300 ${45 + waveThree}
    C390 ${20 + waveTwo}, 455 ${68 - waveOne}, 500 ${35 + waveThree}
  `;

  hairStrand.setAttribute("d", path);

  requestAnimationFrame(animateHair);
}

requestAnimationFrame(animateHair);