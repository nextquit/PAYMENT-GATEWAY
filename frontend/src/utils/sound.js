// Button tap sound disabled as requested by user
export const playTapSound = () => {};
export const playClickSound = () => {};

let audioCtx = null;
function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}


export const playPaymentSuccessSound = () => {
  if (typeof window === 'undefined') return;

  // 1. Try to play custom sound file if placed in public folder (/payment_success.mp3)
  try {
    const customAudio = new Audio('/payment_success.mp3');
    customAudio.volume = 1.0;
    const playPromise = customAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try { navigator.vibrate([100, 50, 200]); } catch (e) {}
          }
        })
        .catch(() => {
          // If custom file not found, use synthesized authentic UPI chime
          synthesizeSuccessChime();
        });
      return;
    }
  } catch (e) {
    synthesizeSuccessChime();
  }
};

function synthesizeSuccessChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Joyful, authentic 4-tone ascending payment completion chime (C5 -> E5 -> G5 -> C6)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    const startTime = ctx.currentTime + 0.05;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + idx * 0.11);

      gain.gain.setValueAtTime(0, startTime + idx * 0.11);
      gain.gain.linearRampToValueAtTime(0.4, startTime + idx * 0.11 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + idx * 0.11 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + idx * 0.11);
      osc.stop(startTime + idx * 0.11 + 0.5);
    });

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate([100, 50, 200]); } catch (e) {}
    }
  } catch (e) {}
}

// ─── JUDGE FEEDBACK NOTIFICATION SOUND (true_caller.mp3) ─────────────
let feedbackAudioElement = null;
let feedbackAudioBuffer = null;
let isBufferLoading = false;
let activeBufferSource = null;
let isAudioPrimed = false;
let pendingSoundPlay = false;
let lastPlayedFeedbackSoundTime = 0;

// 1. Immediately create persistent Audio element on script load
if (typeof window !== 'undefined') {
  try {
    feedbackAudioElement = new Audio('/true_caller.mp3');
    feedbackAudioElement.preload = 'auto';
    feedbackAudioElement.volume = 1.0;
  } catch (e) {}
}

// 2. Preload and decode true_caller.mp3 into Web Audio buffer for instant background playback
export const preloadFeedbackSound = async () => {
  if (typeof window === 'undefined') return;
  try {
    if (!feedbackAudioElement) {
      feedbackAudioElement = new Audio('/true_caller.mp3');
      feedbackAudioElement.preload = 'auto';
      feedbackAudioElement.volume = 1.0;
    }
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    if (!feedbackAudioBuffer && !isBufferLoading) {
      isBufferLoading = true;
      const res = await fetch('/true_caller.mp3');
      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        feedbackAudioBuffer = await ctx.decodeAudioData(arrayBuf);
        console.log('✅ true_caller.mp3 loaded into Web Audio buffer');
      }
      isBufferLoading = false;
    }
  } catch (err) {
    isBufferLoading = false;
    console.warn('Preload true_caller note:', err);
  }
};

// Start preloading immediately on page load
if (typeof window !== 'undefined') {
  setTimeout(() => {
    preloadFeedbackSound();
  }, 100);
}

// 3. User interaction audio unlock & priming on ANY first gesture
const unlockAndPrimeAudio = () => {
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // Silently prime HTML5 audio element so browser grants background playback permission
    if (feedbackAudioElement && !isAudioPrimed) {
      feedbackAudioElement.muted = true;
      feedbackAudioElement.volume = 0;
      const primePromise = feedbackAudioElement.play();
      if (primePromise !== undefined) {
        primePromise
          .then(() => {
            feedbackAudioElement.pause();
            feedbackAudioElement.currentTime = 0;
            feedbackAudioElement.muted = false;
            feedbackAudioElement.volume = 1.0;
            isAudioPrimed = true;
            console.log('🔓 Notification audio primed & unlocked for background play');
          })
          .catch(() => {});
      }
    }

    if (!feedbackAudioBuffer) {
      preloadFeedbackSound();
    }

    // If an incoming review arrived while user was away, play now
    if (pendingSoundPlay) {
      pendingSoundPlay = false;
      playFeedbackNotificationSound();
    }
  } catch (e) {}
};

// Global listeners for early gestures so audio is primed long before review arrives
if (typeof window !== 'undefined') {
  const unlockEvents = ['click', 'touchstart', 'pointerdown', 'keydown', 'scroll', 'mousemove'];
  unlockEvents.forEach((evt) => {
    window.addEventListener(evt, unlockAndPrimeAudio, { passive: true });
  });

  // When tab is focused or visible
  window.addEventListener('focus', unlockAndPrimeAudio);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      unlockAndPrimeAudio();
    }
  });
}

// Cancel any pending sound (e.g. when user clicks on Feedbacks button to view reviews)
export const cancelPendingFeedbackSound = () => {
  pendingSoundPlay = false;
};

// 4. Main ringtone playback function
export const playFeedbackNotificationSound = () => {
  if (typeof window === 'undefined') return;

  const now = Date.now();
  // Prevent duplicate trigger within 2.5 seconds
  if (now - lastPlayedFeedbackSoundTime < 2500) {
    return;
  }

  console.log('🎵 Playing Judge Feedback Ringtone: /true_caller.mp3');

  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try { navigator.vibrate([200, 100, 200, 100, 300]); } catch (e) {}
  }

  // Stop any previously playing sound instance
  if (activeBufferSource) {
    try {
      activeBufferSource.stop();
      activeBufferSource.disconnect();
    } catch (e) {}
    activeBufferSource = null;
  }
  if (feedbackAudioElement) {
    try {
      feedbackAudioElement.pause();
      feedbackAudioElement.currentTime = 0;
    } catch (e) {}
  }

  let played = false;

  // Attempt 1: Web Audio Buffer Source (Plays instantly without element lag)
  try {
    const ctx = getAudioContext();
    if (ctx) {
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      if (feedbackAudioBuffer) {
        const source = ctx.createBufferSource();
        source.buffer = feedbackAudioBuffer;
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(1.0, ctx.currentTime);
        source.connect(gainNode);
        gainNode.connect(ctx.destination);

        activeBufferSource = source;
        source.onended = () => {
          if (activeBufferSource === source) {
            activeBufferSource = null;
          }
        };

        source.start(0);
        played = true;
        pendingSoundPlay = false;
        lastPlayedFeedbackSoundTime = now;
        console.log('🔊 true_caller.mp3 playing via Web Audio API');
      }
    }
  } catch (e) {
    console.warn('Web Audio buffer playback note:', e);
  }

  // Attempt 2: HTML5 Audio instance
  if (!played) {
    try {
      if (!feedbackAudioElement) {
        feedbackAudioElement = new Audio('/true_caller.mp3');
        feedbackAudioElement.preload = 'auto';
      }
      feedbackAudioElement.muted = false;
      feedbackAudioElement.volume = 1.0;
      feedbackAudioElement.currentTime = 0;

      const playPromise = feedbackAudioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            played = true;
            pendingSoundPlay = false;
            lastPlayedFeedbackSoundTime = now;
            console.log('🔊 true_caller.mp3 playing via HTML5 Audio');
          })
          .catch((err) => {
            console.warn('HTML5 Audio play restricted by browser policy:', err);
            pendingSoundPlay = true;
            synthesizeNotificationChime();
          });
      }
    } catch (e) {
      console.warn('HTML5 Audio error:', e);
      pendingSoundPlay = true;
      synthesizeNotificationChime();
    }
  }

  if (!feedbackAudioBuffer) {
    preloadFeedbackSound();
  }
};

function synthesizeNotificationChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // High-pitched pleasant dual bell chime (F6 -> A6)
    const notes = [1396.91, 1760.00];
    const startTime = ctx.currentTime + 0.04;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + idx * 0.14);

      gain.gain.setValueAtTime(0, startTime + idx * 0.14);
      gain.gain.linearRampToValueAtTime(0.4, startTime + idx * 0.14 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + idx * 0.14 + 0.42);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + idx * 0.14);
      osc.stop(startTime + idx * 0.14 + 0.48);
    });

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate([100, 50, 150]); } catch (e) {}
    }
  } catch (e) {}
}

export const initGlobalTapSound = () => {
  return () => {};
};
