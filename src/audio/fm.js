let ctx = null;
let carrier = null;
let mod = null;
let modGain = null;
let jitterTimer = null;

export function startFM({ carrierHz = 10000, modHz = 3000, index = 3000 } = {}) {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();

  carrier = ctx.createOscillator();
  carrier.type = 'sine';
  carrier.frequency.value = carrierHz;

  mod = ctx.createOscillator();
  mod.type = 'sine';
  mod.frequency.value = modHz;

  modGain = ctx.createGain();
  modGain.gain.value = index;

  mod.connect(modGain);
  modGain.connect(carrier.frequency);

  const outGain = ctx.createGain();
  outGain.gain.value = 0.1; // keep it low for safety

  carrier.connect(outGain).connect(ctx.destination);
  carrier.start(); mod.start();
}

export function stopFM() {
  try { carrier && carrier.stop(); } catch {}
  try { mod && mod.stop(); } catch {}
  carrier = null; mod = null; modGain = null;
}

export function startJitter({ minModHz=2500, maxModHz=3500, minIndex=2500, maxIndex=3500, periodMs=1000 }={}) {
  stopJitter();
  jitterTimer = setInterval(() => {
    if (!mod || !modGain) return;
    const newF = rand(minModHz, maxModHz);
    const newI = rand(minIndex, maxIndex);
    mod.frequency.setTargetAtTime(newF, ctx.currentTime, 0.05);
    modGain.gain.setTargetAtTime(newI, ctx.currentTime, 0.05);
  }, periodMs);
}
export function stopJitter() {
  if (jitterTimer) clearInterval(jitterTimer);
  jitterTimer = null;
}

function rand(min, max) { return Math.random() * (max - min) + min; }

