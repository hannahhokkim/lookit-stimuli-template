// RBB4/BEND emoji decoration trials.
// Assumes `const jsPsych = initJsPsych(...)` already exists in the CHS editor.
// Use `decorationTimeline` inside your larger study timeline.

const RBB4_STIM_BASE =
  "https://raw.githubusercontent.com/hannahhokkim/lookit-stimuli-template/master/";

const rbb4Img = (filename) => `${RBB4_STIM_BASE}img/${filename}`;
const rbb4Mp3 = (filename) => `${RBB4_STIM_BASE}mp3/${filename}`;

const EMOJI_STICKERS = [
  "💙", "❤️", "💛", "💚", "💜", "🧡", "🤍", "⭐", "✨", "🌟", "💫",
  "🐱", "🐶", "🐭", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐸",
  "🐵", "🐧", "🐦", "🦋", "🐞", "🐝", "🐢", "🐙", "🐠", "🐟", "🐬",
  "🦀", "🐳", "🦄", "🐴", "🐮", "🐷", "🐤", "🐣", "🦖", "🦕",
  "🌈", "☀️", "🌙", "☁️", "❄️", "⚡", "🔥", "💧", "🌊", "🍀",
  "🌸", "🌼", "🌻", "🌷", "🌹", "🌺", "🌵", "🌲", "🌳", "🍄",
  "🍎", "🍌", "🍓", "🍇", "🍉", "🍒", "🍍", "🥕", "🌽", "🍕",
  "🍔", "🍟", "🍩", "🍪", "🧁", "🍦", "🍭", "🍬",
  "⚽", "🏀", "🏈", "⚾", "🎾", "🎲", "🧩", "🎨", "🎵", "🎸",
  "🎈", "🎁", "🎉", "🏆", "👑", "💎", "🚗", "🚕", "🚙", "🚌",
  "🚒", "🚜", "🚲", "✈️", "🚀", "⛵", "🏠", "🏰", "😊", "😄",
  "😎", "🤩", "🥳", "😺", "👍", "👏"
];

const decorationStyle = `
  <style>
    .rbb4-wrap {
      width: min(1120px, 96vw);
      margin: 0 auto;
      font-family: Arial, sans-serif;
    }

    .rbb4-prompt {
      font-size: 25px;
      line-height: 1.25;
      margin: 0 0 12px;
    }

    .rbb4-workspace {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 170px;
      gap: 14px;
      align-items: start;
    }

    .rbb4-stage {
      position: relative;
      width: 100%;
      aspect-ratio: 3 / 2;
      overflow: hidden;
      border: 3px solid #1f2933;
      background: #f7fafc;
      touch-action: none;
    }

    .rbb4-scene {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      user-select: none;
      pointer-events: none;
    }

    .rbb4-practice-box {
      position: absolute;
      left: 27%;
      top: 25%;
      width: 46%;
      height: 45%;
      border: 5px dashed #2563eb;
      border-radius: 8px;
      background: rgba(219, 234, 254, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: 700;
      color: #1e3a8a;
      pointer-events: none;
    }

    .rbb4-palette {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      padding: 10px;
      border: 2px solid #cbd5e1;
      border-radius: 8px;
      background: #ffffff;
      max-height: min(66vh, 560px);
      overflow-y: auto;
      overscroll-behavior: contain;
    }

    .rbb4-sticker-choice {
      width: 66px;
      height: 58px;
      border: 2px solid #94a3b8;
      border-radius: 8px;
      background: #f8fafc;
      font-size: 31px;
      cursor: pointer;
    }

    .rbb4-sticker-choice:focus {
      outline: 4px solid #f59e0b;
      outline-offset: 2px;
    }

    .rbb4-placed {
      position: absolute;
      transform: translate(-50%, -50%);
      border: 0;
      background: transparent;
      font-size: 40px;
      line-height: 1;
      cursor: grab;
      touch-action: none;
      padding: 4px;
      user-select: none;
    }

    .rbb4-placed:active {
      cursor: grabbing;
    }

    .rbb4-note {
      margin-top: 8px;
      font-size: 18px;
      color: #475569;
    }

    .rbb4-voice-button {
      margin-left: 10px;
      min-height: 42px;
      padding: 6px 12px;
      border: 2px solid #64748b;
      border-radius: 8px;
      background: #ffffff;
      font-size: 18px;
      cursor: pointer;
    }

    .rbb4-demo-heart {
      animation: rbb4Pulse 1.1s ease-in-out infinite;
    }

    .rbb4-demo-cursor {
      position: absolute;
      left: 78%;
      top: 35%;
      z-index: 10;
      font-size: 44px;
      transform: rotate(-15deg);
      animation: rbb4CursorDemo 5.4s ease-in-out forwards;
      pointer-events: none;
      filter: drop-shadow(0 2px 2px rgba(15, 23, 42, 0.28));
    }

    .rbb4-demo-placed-heart {
      position: absolute;
      left: 50%;
      top: 48%;
      z-index: 8;
      font-size: 46px;
      transform: translate(-50%, -50%) scale(0);
      animation: rbb4HeartAppears 5.4s ease-in-out forwards;
      pointer-events: none;
    }

    @keyframes rbb4Pulse {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.0);
        transform: scale(1);
      }
      50% {
        box-shadow: 0 0 0 8px rgba(37, 99, 235, 0.25);
        transform: scale(1.08);
      }
    }

    @keyframes rbb4CursorDemo {
      0%, 14% {
        left: 78%;
        top: 35%;
        transform: rotate(-15deg) scale(1);
      }
      22% {
        left: 86%;
        top: 25%;
        transform: rotate(-15deg) scale(0.86);
      }
      30%, 46% {
        left: 86%;
        top: 25%;
        transform: rotate(-15deg) scale(1);
      }
      68% {
        left: 50%;
        top: 48%;
        transform: rotate(-15deg) scale(1);
      }
      78% {
        left: 50%;
        top: 48%;
        transform: rotate(-15deg) scale(0.86);
      }
      88%, 100% {
        left: 50%;
        top: 48%;
        transform: rotate(-15deg) scale(1);
      }
    }

    @keyframes rbb4HeartAppears {
      0%, 72% {
        transform: translate(-50%, -50%) scale(0);
      }
      82%, 100% {
        transform: translate(-50%, -50%) scale(1);
      }
    }

    @media (max-width: 760px) {
      .rbb4-workspace {
        grid-template-columns: 1fr;
      }

      .rbb4-palette {
        grid-template-columns: repeat(8, 1fr);
      }

      .rbb4-sticker-choice {
        width: 100%;
      }
    }
  </style>
`;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function makePaletteHtml(emojis) {
  return emojis
    .map(
      (emoji) =>
        `<button class="rbb4-sticker-choice" type="button" data-emoji="${escapeHtml(
          emoji
        )}" aria-label="Sticker ${escapeHtml(emoji)}">${emoji}</button>`
    )
    .join("");
}

function makeDecoratingStimulus({
  prompt,
  sceneImage,
  practice = false,
  demo = false,
  voiceFile = "",
  emojis = EMOJI_STICKERS,
}) {
  const sceneHtml = sceneImage
    ? `<img class="rbb4-scene" src="${sceneImage}" alt="">`
    : "";

  const practiceBox = practice
    ? `<div class="rbb4-practice-box" data-practice-box>Put one here</div>`
    : "";

  const demoOverlay = demo
    ? `<div class="rbb4-demo-cursor">↖</div><div class="rbb4-demo-placed-heart">💙</div>`
    : "";

  return `
    ${decorationStyle}
    <div class="rbb4-wrap">
      <p class="rbb4-prompt">${prompt}<button class="rbb4-voice-button" type="button" data-voice-file="${escapeHtml(
        voiceFile
      )}">Replay voice</button></p>
      <div class="rbb4-workspace">
        <div class="rbb4-stage" data-decoration-stage>
          ${sceneHtml}
          ${practiceBox}
          ${demoOverlay}
        </div>
        <div class="rbb4-palette" aria-label="Emoji stickers">
          ${makePaletteHtml(emojis)}
        </div>
      </div>
      <div class="rbb4-note">Click a sticker, then click the picture to place it. You can drag stickers after you place them.</div>
    </div>
  `;
}

function playPromptAudio(voiceFile) {
  if (!voiceFile) return;
  if (window.rbb4PromptAudio) {
    window.rbb4PromptAudio.pause();
  }

  const audio = new Audio(voiceFile);
  window.rbb4PromptAudio = audio;
  audio.play().catch(() => {
    const button = document.querySelector("[data-voice-file]");
    if (button) button.style.background = "#fde68a";
  });
}

function wireVoiceButton() {
  const button = document.querySelector("[data-voice-file]");
  if (!button) return;

  button.addEventListener("click", () => {
    playPromptAudio(button.dataset.voiceFile);
  });
}

function wireDecorationTrial({ requirePracticeBox = false } = {}) {
  const stage = document.querySelector("[data-decoration-stage]");
  const practiceBox = document.querySelector("[data-practice-box]");
  const nextButton = document.querySelector("#jspsych-html-button-response-button-0");
  const placements = [];
  let selectedEmoji = null;
  let draggingSticker = null;

  window.rbb4CurrentPlacements = placements;

  if (requirePracticeBox && nextButton) {
    nextButton.disabled = true;
    nextButton.style.opacity = "0.45";
  }

  const stageRectPosition = (clientX, clientY) => {
    const rect = stage.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    return { x, y };
  };

  const isInsidePracticeBox = ({ x, y }) => {
    if (!practiceBox) return true;
    const stageRect = stage.getBoundingClientRect();
    const boxRect = practiceBox.getBoundingClientRect();
    const boxLeft = (boxRect.left - stageRect.left) / stageRect.width;
    const boxRight = (boxRect.right - stageRect.left) / stageRect.width;
    const boxTop = (boxRect.top - stageRect.top) / stageRect.height;
    const boxBottom = (boxRect.bottom - stageRect.top) / stageRect.height;

    return x >= boxLeft && x <= boxRight && y >= boxTop && y <= boxBottom;
  };

  const unlockNext = () => {
    if (!nextButton) return;
    nextButton.disabled = false;
    nextButton.style.opacity = "1";
  };

  const addSticker = (emoji, position) => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `sticker-${Date.now()}-${placements.length}`;

    const sticker = document.createElement("button");
    sticker.type = "button";
    sticker.className = "rbb4-placed";
    sticker.textContent = emoji;
    sticker.dataset.stickerId = id;
    sticker.style.left = `${position.x * 100}%`;
    sticker.style.top = `${position.y * 100}%`;
    stage.appendChild(sticker);

    placements.push({
      id,
      emoji,
      x: Number(position.x.toFixed(4)),
      y: Number(position.y.toFixed(4)),
      time_ms: Math.round(performance.now()),
    });

    if (!requirePracticeBox || isInsidePracticeBox(position)) {
      unlockNext();
    }

    sticker.addEventListener("pointerdown", (event) => {
      draggingSticker = sticker;
      sticker.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
  };

  document.querySelectorAll(".rbb4-sticker-choice").forEach((button) => {
    button.addEventListener("click", () => {
      selectedEmoji = button.dataset.emoji;
      document
        .querySelectorAll(".rbb4-sticker-choice")
        .forEach((choice) => (choice.style.background = "#f8fafc"));
      button.style.background = "#fde68a";
    });
  });

  stage.addEventListener("click", (event) => {
    if (!selectedEmoji || event.target.classList.contains("rbb4-placed")) {
      return;
    }

    addSticker(selectedEmoji, stageRectPosition(event.clientX, event.clientY));
  });

  stage.addEventListener("pointermove", (event) => {
    if (!draggingSticker) return;
    const position = stageRectPosition(event.clientX, event.clientY);
    draggingSticker.style.left = `${position.x * 100}%`;
    draggingSticker.style.top = `${position.y * 100}%`;

    const placement = placements.find(
      (item) => item.id === draggingSticker.dataset.stickerId
    );
    if (placement) {
      placement.x = Number(position.x.toFixed(4));
      placement.y = Number(position.y.toFixed(4));
      placement.moved = true;
    }

    if (!requirePracticeBox || isInsidePracticeBox(position)) {
      unlockNext();
    }
  });

  stage.addEventListener("pointerup", () => {
    draggingSticker = null;
  });

  stage.addEventListener("pointercancel", () => {
    draggingSticker = null;
  });
}

const emojiDemoTrial = {
  type: jsPsychHtmlButtonResponse,
  stimulus: makeDecoratingStimulus({
    practice: true,
    demo: true,
    voiceFile: rbb4Mp3("rbb4_voice_demo.mp3"),
    prompt:
      "Let's practice! Watch how to click the blue heart and put it in the blue box.",
    emojis: ["💙"],
  }),
  choices: ["Now you try"],
  trial_duration: 7000,
  data: {
    task_part: "emoji_demo",
  },
  on_load: () => {
    wireVoiceButton();
    playPromptAudio(rbb4Mp3("rbb4_voice_demo.mp3"));
  },
};

const emojiPracticeTrial = {
  type: jsPsychHtmlButtonResponse,
  stimulus: makeDecoratingStimulus({
    practice: true,
    voiceFile: rbb4Mp3("rbb4_voice_practice.mp3"),
    prompt:
      "Now you try! Click the blue heart, then click inside the blue box to put it there.",
    emojis: ["💙"],
  }),
  choices: ["Next"],
  data: {
    task_part: "emoji_practice",
  },
  on_load: () => {
    wireVoiceButton();
    playPromptAudio(rbb4Mp3("rbb4_voice_practice.mp3"));
    wireDecorationTrial({ requirePracticeBox: true });
  },
  on_finish: (data) => {
    data.placements = JSON.stringify(window.rbb4CurrentPlacements || []);
  },
};

const decorationScenes = [
  {
    scene_id: "classroom_nocats",
    rule_target: "cat",
    scene_image: rbb4Img("rbb4_rule_b_nocats.png"),
    voice_file: rbb4Mp3("rbb4_voice_classroom.mp3"),
    prompt: "Decorate this classroom with any stickers you want.",
  },
  {
    scene_id: "mountain_nofish",
    rule_target: "fish",
    scene_image: rbb4Img("rbb4_rule_b_nofish.png"),
    voice_file: rbb4Mp3("rbb4_voice_mountain.mp3"),
    prompt: "Decorate this mountain park with any stickers you want.",
  },
  {
    scene_id: "underwater_nohearts",
    rule_target: "heart",
    scene_image: rbb4Img("rbb4_rule_b_nohearts.png"),
    voice_file: rbb4Mp3("rbb4_voice_underwater.mp3"),
    prompt: "Decorate this underwater scene with any stickers you want.",
  },
];

function makeMainDecorationTrial(scene) {
  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: makeDecoratingStimulus({
      prompt: scene.prompt,
      sceneImage: scene.scene_image,
      voiceFile: scene.voice_file,
    }),
    choices: ["Next"],
    trial_duration: 10 * 60 * 1000,
    data: {
      task_part: "emoji_decoration",
      scene_id: scene.scene_id,
      rule_target: scene.rule_target,
      scene_image: scene.scene_image,
      voice_file: scene.voice_file,
    },
    on_load: () => {
      wireVoiceButton();
      playPromptAudio(scene.voice_file);
      wireDecorationTrial();
    },
    on_finish: (data) => {
      data.placements = JSON.stringify(window.rbb4CurrentPlacements || []);
      data.timed_out = data.response === null;
    },
  };
}

const mainDecorationTrials = jsPsych.randomization
  .shuffle(decorationScenes)
  .map(makeMainDecorationTrial);

const decorationTimeline = [
  emojiDemoTrial,
  emojiPracticeTrial,
  ...mainDecorationTrials,
];
