var jsPsych = initJsPsych();

var IMG_BASE = "../img/";
var AUDIO_BASE = "../mp3/chs_sign_task_break2/";
var FALLBACK_AUDIO_BASE = "../mp3/chs_sign_task/";
var CONDITION = "prior";

var SCENES = [
  {
    scene_id: "classroom_nocats",
    scene_label: "classroom",
    image: IMG_BASE + "rbb4_rule_b_nocats.png",
    rule_target: "cat",
    rule_text: "No cats on the desk.",
    rule_question_text: "cats on the desk",
    forbidden_stickers: ["🐱", "😺"],
    prior_voice: AUDIO_BASE + "prior_classroom_nocats.mp3",
    final_voice_key: "cats"
  },
  {
    scene_id: "mountain_nofish",
    scene_label: "mountain park",
    image: IMG_BASE + "rbb4_rule_b_nofish.png",
    rule_target: "fish",
    rule_text: "No fish in the mountain.",
    rule_question_text: "fish in the mountain",
    forbidden_stickers: ["🐠", "🐟"],
    prior_voice: AUDIO_BASE + "prior_mountain_nofish.mp3",
    final_voice_key: "fish"
  },
  {
    scene_id: "underwater_nohearts",
    scene_label: "underwater scene",
    image: IMG_BASE + "rbb4_rule_b_nohearts.png",
    rule_target: "heart",
    rule_text: "No hearts underwater.",
    rule_question_text: "hearts underwater",
    forbidden_stickers: ["💙", "❤️", "💛", "💚", "💜", "🧡", "🤍"],
    prior_voice: AUDIO_BASE + "prior_underwater_nohearts.mp3",
    final_voice_key: "hearts"
  }
];

var ALL_STICKERS = [
  "★", "💙", "❤️", "💛", "💚", "💜", "🧡", "🤍", "⭐", "✨", "🌟", "💫",
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

var FINAL_VOICES = {
  cats: {
    made: AUDIO_BASE + "final_made_cats.mp3",
    did: AUDIO_BASE + "final_did_cats.mp3",
    why: AUDIO_BASE + "final_why_cats.mp3",
    prediction: FALLBACK_AUDIO_BASE + "final_prediction_cats.mp3"
  },
  fish: {
    made: AUDIO_BASE + "final_made_fish.mp3",
    did: AUDIO_BASE + "final_did_fish.mp3",
    why: AUDIO_BASE + "final_why_fish.mp3",
    prediction: FALLBACK_AUDIO_BASE + "final_prediction_fish.mp3"
  },
  hearts: {
    made: AUDIO_BASE + "final_made_hearts.mp3",
    did: AUDIO_BASE + "final_did_hearts.mp3",
    why: AUDIO_BASE + "final_why_hearts.mp3",
    prediction: FALLBACK_AUDIO_BASE + "final_prediction_hearts.mp3"
  }
};

function stopCurrentAudio() {
  if (window.currentPromptAudio) {
    window.currentPromptAudio.pause();
    window.currentPromptAudio.currentTime = 0;
    window.currentPromptAudio = null;
  }
}

function playPageAudio(voiceFile) {
  stopCurrentAudio();
  if (!voiceFile) return null;

  var audio = new Audio(voiceFile);
  window.currentPromptAudio = audio;
  audio.play().catch(function() {});
  return audio;
}

function scheduleDecoratingUnlock(audio, lockToken) {
  var unlocked = false;

  function unlock() {
    if (unlocked) return;
    unlocked = true;
    if (window.unlockCurrentDecorating) {
      window.unlockCurrentDecorating(lockToken);
    }
  }

  if (!audio) {
    setTimeout(unlock, 12000);
    return;
  }

  audio.addEventListener("loadedmetadata", function() {
    var unlockMs = Math.max(3000, (audio.duration - 5.5) * 1000);
    setTimeout(unlock, unlockMs);
  });

  audio.addEventListener("timeupdate", function() {
    if (audio.duration && audio.currentTime >= audio.duration - 5.5) {
      unlock();
    }
  });

  audio.addEventListener("ended", unlock);
  setTimeout(unlock, 45000);
}

function getConditionScript(scene) {
  if (CONDITION === "prior") {
    return [
      "<span style='font-size:24px;font-weight:bold;color:#0f172a;'>Here is a drawing for you to decorate.</span>",
      "<br>",
      "Look, it is a " + scene.scene_label + ".",
      "<br><br>",
      "A bunch of kids played this game last week and decorated it.",
      "There were, like, 20 kids who played this game last week.",
      "<br><br>",
      "After these 20 kids played our game, we had to put up this sign so everyone knows this rule.",
      "Do you want to know what the sign says?",
      "<br><br>",
      "<span style='font-size:25px;font-weight:bold;color:#b91c1c;'>The sign says: " + scene.rule_text + "</span>",
      "<br><br>",
      "Okay, now you can decorate the picture. Use any stickers you want, but remember the sign:",
      "<strong>" + scene.rule_text + "</strong>",
      "Have fun!",
      "<span style='color:#674ea7;'>When you're done decorating, scroll down and click the button to go to the next page.</span>"
    ].join(" ");
  }

  return [
    "<span style='font-size:24px;font-weight:bold;color:#0f172a;'>Here is your next drawing!</span>",
    "<br>",
    "Look, it is a " + scene.scene_label + ".",
    "<br><br>",
    "You are the first kid who has ever played this game.",
    "Nobody has played this game before you.",
    "<br><br>",
    "Before anyone plays a new game, we put up the sign so everyone knows this rule.",
    "Do you want to know what the sign says?",
    "<br><br>",
    "<span style='font-size:25px;font-weight:bold;color:#b91c1c;'>The sign says: " + scene.rule_text + "</span>",
    "<br><br>",
    "Okay, now you can decorate the picture. Use any stickers you want, but remember the sign:",
    "<strong>" + scene.rule_text + "</strong>",
    "Have fun!"
  ].join(" ");
}

function makeTextPageHTML(text) {
  return [
    "<div style='width:min(900px,94vw);margin:0 auto;font-family:Arial,sans-serif;font-size:24px;line-height:1.35;'>",
    text,
    "</div>"
  ].join("");
}

function makeIntroPageHTML() {
  return [
    "<div style='width:min(900px,94vw);margin:0 auto;font-family:Arial,sans-serif;text-align:center;'>",
    "<div style='font-size:54px;margin-bottom:8px;'>🎨 ✨ 🖼️</div>",
    "<h1 style='font-size:38px;line-height:1.15;margin:0 0 14px;color:#0f172a;'>Welcome to the decorating game!</h1>",
    "<div style='font-size:25px;line-height:1.38;background:#fff7ed;border:3px solid #fbbf24;border-radius:18px;padding:18px 22px;text-align:left;'>",
    "<p style='margin:0 0 12px;'>Hi! Today we're going to play a decorating game.</p>",
    "<p style='margin:0 0 12px;'>You'll see a picture, and you can decorate it with stickers.</p>",
    "<p style='margin:0 0 12px;'>Before we start, we'll practice how to put stickers on the picture.</p>",
    "<p style='margin:0 0 12px;color:#1155cc;'>In this game, you'll click buttons at the bottom of the page to get to the next part. If you don't see the button, scroll down and look for it.</p>",
    "<p style='margin:0;color:#1155cc;'>You can draw for 10 minutes. After 10 minutes, the drawing will change, okay?</p>",
    "</div>",
    "</div>"
  ].join("");
}

function makeTrialHTML(prompt, imageUrl, options) {
  options = options || {};
  var stickerList = options.stickerList || ALL_STICKERS;
  var isPractice = options.isPractice || false;
  var isDemo = options.isDemo || false;
  var practiceText = options.practiceText || "Put one here";
  var practiceBoxColor = options.practiceBoxColor || "#2563eb";
  var practiceBoxBackground = options.practiceBoxBackground || "rgba(219,234,254,.65)";
  var scene = "";

  if (imageUrl) {
    scene = "<img src='" + imageUrl + "' style='width:100%;height:100%;object-fit:cover;display:block;'>";
  }

  var practiceBox = "";
  if (isPractice) {
    practiceBox = "<div id='practice-box' style='position:absolute;left:27%;top:25%;width:46%;height:45%;border:5px dashed " + practiceBoxColor + ";background:" + practiceBoxBackground + ";display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:bold;color:#1e3a8a;pointer-events:none;'>" + practiceText + "</div>";
  }

  var demoOverlay = "";
  if (isDemo) {
    demoOverlay = "<div id='demo-cursor' style='position:absolute;left:84%;top:28%;z-index:20;font-size:46px;transform:rotate(-20deg);pointer-events:none;filter:drop-shadow(0 2px 2px rgba(0,0,0,.3));'>👆</div>" +
      "<div id='demo-sticker' style='position:absolute;left:50%;top:48%;z-index:18;font-size:50px;transform:translate(-50%,-50%) scale(0);pointer-events:none;'>" + stickerList[0] + "</div>";
  }

  var stickerButtons = "";
  for (var i = 0; i < stickerList.length; i++) {
    var glow = isDemo && i === 0 ? "animation:pulseSticker 1s ease-in-out infinite;" : "";
    var color = stickerList[i] === "★" ? "color:#dc2626;" : "";
    stickerButtons += "<button type='button' class='sticker-choice' data-sticker='" + stickerList[i] + "' style='width:54px;height:52px;font-size:28px;margin:3px;border:2px solid #94a3b8;border-radius:8px;background:#f8fafc;cursor:pointer;" + glow + color + "'>" + stickerList[i] + "</button>";
  }

  return [
    "<style>@keyframes pulseSticker { 0%, 100% { transform:scale(1); box-shadow:0 0 0 0 rgba(37,99,235,0); } 50% { transform:scale(1.12); box-shadow:0 0 0 8px rgba(37,99,235,.25); } }</style>",
    "<div style='width:min(1120px,96vw);margin:0 auto;font-family:Arial,sans-serif;'>",
    "<div style='font-size:21px;margin:0 0 10px;line-height:1.25;background:#f8fafc;border:2px solid #cbd5e1;border-radius:12px;padding:10px 14px;color:#1f2937;'>",
    prompt,
    "</div>",
    "<div style='display:grid;grid-template-columns:minmax(0,1fr) 250px;gap:14px;align-items:start;'>",
    "<div id='decorating-stage' style='position:relative;width:100%;aspect-ratio:3 / 2;overflow:hidden;border:3px solid #1f2933;background:#f7fafc;touch-action:none;'>",
    scene,
    practiceBox,
    demoOverlay,
    "</div>",
    "<div style='padding:8px;border:2px solid #cbd5e1;border-radius:8px;background:white;display:grid;grid-template-columns:repeat(4,1fr);gap:4px;max-height:min(66vh,560px);overflow-y:auto;overscroll-behavior:contain;'>",
    stickerButtons,
    "</div>",
    "</div>",
    "<p style='font-size:15px;color:#475569;margin-top:6px;'>Click a sticker, then click the picture to place it. You can drag stickers after you place them.</p>",
    "</div>"
  ].join("");
}

function setupDemoAnimation() {
  var cursor = document.getElementById("demo-cursor");
  var sticker = document.getElementById("demo-sticker");
  var nextButton = document.getElementById("jspsych-html-button-response-button-0");

  if (nextButton) {
    nextButton.disabled = true;
    nextButton.style.display = "none";
    nextButton.textContent = "Click here to try";
  }
  if (!cursor || !sticker) return;

  setTimeout(function() {
    cursor.style.transition = "left 900ms ease, top 900ms ease, transform 150ms ease";
    cursor.style.left = "86%";
    cursor.style.top = "25%";
  }, 500);
  setTimeout(function() { cursor.style.transform = "rotate(-20deg) scale(.82)"; }, 1500);
  setTimeout(function() { cursor.style.transform = "rotate(-20deg) scale(1)"; }, 1750);
  setTimeout(function() {
    cursor.style.transition = "left 1500ms ease, top 1500ms ease, transform 150ms ease";
    cursor.style.left = "50%";
    cursor.style.top = "48%";
  }, 2200);
  setTimeout(function() { cursor.style.transform = "rotate(-20deg) scale(.82)"; }, 3800);
  setTimeout(function() {
    cursor.style.transform = "rotate(-20deg) scale(1)";
    sticker.style.transition = "transform 300ms ease";
    sticker.style.transform = "translate(-50%,-50%) scale(1)";
  }, 4050);
  setTimeout(function() {
    if (nextButton) {
      nextButton.disabled = false;
      nextButton.style.display = "inline-block";
      nextButton.style.fontSize = "32px";
      nextButton.style.fontWeight = "bold";
      nextButton.style.padding = "22px 38px";
      nextButton.style.background = "#fbbf24";
      nextButton.style.color = "#111827";
      nextButton.style.border = "5px solid #ea580c";
      nextButton.style.borderRadius = "18px";
      nextButton.style.cursor = "pointer";
      nextButton.style.boxShadow = "0 8px 0 #c2410c, 0 12px 22px rgba(0,0,0,.20)";
      nextButton.style.textTransform = "uppercase";
    }
  }, 10000);
}

function setupDecoratingTrial(options) {
  options = options || {};
  var stage = document.getElementById("decorating-stage");
  var practiceBox = document.getElementById("practice-box");
  var nextButton = document.getElementById("jspsych-html-button-response-button-0");
  var selectedSticker = null;
  var dragging = null;
  var placements = [];
  var selectionEvents = [];
  var successPlayed = false;
  var decoratingUnlocked = !options.startLocked;
  var lockToken = Date.now() + "-" + Math.random();
  var lockedOverlay = null;
  var practiceFeedback = null;

  window.currentDecorations = placements;
  window.currentSelectionEvents = selectionEvents;
  window.currentDecoratingLockToken = lockToken;

  if (options.requirePracticeSuccess && nextButton) {
    nextButton.disabled = true;
    nextButton.style.opacity = "0.45";

    practiceFeedback = document.createElement("div");
    practiceFeedback.style.position = "absolute";
    practiceFeedback.style.left = "50%";
    practiceFeedback.style.top = "9%";
    practiceFeedback.style.zIndex = "25";
    practiceFeedback.style.transform = "translateX(-50%)";
    practiceFeedback.style.padding = "10px 16px";
    practiceFeedback.style.borderRadius = "12px";
    practiceFeedback.style.background = "rgba(255,247,237,.96)";
    practiceFeedback.style.border = "3px solid #ea580c";
    practiceFeedback.style.fontSize = "22px";
    practiceFeedback.style.fontWeight = "bold";
    practiceFeedback.style.pointerEvents = "none";
    practiceFeedback.style.display = "none";
    stage.appendChild(practiceFeedback);
  }

  function getPos(event) {
    var rect = stage.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))
    };
  }

  function insidePracticeBox(pos) {
    if (!practiceBox) return true;
    var stageRect = stage.getBoundingClientRect();
    var boxRect = practiceBox.getBoundingClientRect();
    var left = (boxRect.left - stageRect.left) / stageRect.width;
    var right = (boxRect.right - stageRect.left) / stageRect.width;
    var top = (boxRect.top - stageRect.top) / stageRect.height;
    var bottom = (boxRect.bottom - stageRect.top) / stageRect.height;
    return pos.x >= left && pos.x <= right && pos.y >= top && pos.y <= bottom;
  }

  function canUnlockForPractice(sticker, pos) {
    if (!options.requirePracticeSuccess) return true;
    if (!insidePracticeBox(pos)) return false;
    if (options.requiredPracticeSticker && sticker !== options.requiredPracticeSticker) return false;
    return true;
  }

  function unlockNext() {
    if (nextButton) {
      nextButton.disabled = false;
      nextButton.style.opacity = "1";
    }
    if (practiceFeedback) {
      practiceFeedback.textContent = "Great job!";
      practiceFeedback.style.display = "block";
      practiceFeedback.style.color = "#166534";
      practiceFeedback.style.borderColor = "#16a34a";
    }
    if (options.successAudio && !successPlayed) {
      successPlayed = true;
      playPageAudio(options.successAudio);
    }
  }

  function addSticker(sticker, pos) {
    var id = "sticker-" + Date.now() + "-" + placements.length;
    var forbiddenStickers = options.forbiddenStickers || [];
    var isForbidden = forbiddenStickers.indexOf(sticker) !== -1;
    var el = document.createElement("button");

    el.type = "button";
    el.textContent = sticker;
    el.dataset.id = id;
    el.style.position = "absolute";
    el.style.left = (pos.x * 100) + "%";
    el.style.top = (pos.y * 100) + "%";
    el.style.transform = "translate(-50%, -50%)";
    el.style.border = "0";
    el.style.background = "transparent";
    el.style.fontSize = "42px";
    el.style.cursor = "grab";
    el.style.touchAction = "none";
    el.style.padding = "4px";
    if (sticker === "★") el.style.color = "#dc2626";

    stage.appendChild(el);
    placements.push({
      id: id,
      sticker: sticker,
      x: Number(pos.x.toFixed(4)),
      y: Number(pos.y.toFixed(4)),
      time_ms: Math.round(performance.now()),
      forbidden_sticker: isForbidden
    });

    if (canUnlockForPractice(sticker, pos)) unlockNext();

    el.addEventListener("pointerdown", function(event) {
      dragging = el;
      el.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
  }

  var stickerButtons = document.querySelectorAll(".sticker-choice");

  if (options.startLocked) {
    lockedOverlay = document.createElement("div");
    lockedOverlay.textContent = "Listen first";
    lockedOverlay.style.position = "absolute";
    lockedOverlay.style.left = "0";
    lockedOverlay.style.top = "0";
    lockedOverlay.style.width = "100%";
    lockedOverlay.style.height = "100%";
    lockedOverlay.style.zIndex = "30";
    lockedOverlay.style.display = "flex";
    lockedOverlay.style.alignItems = "center";
    lockedOverlay.style.justifyContent = "center";
    lockedOverlay.style.background = "rgba(255,255,255,.50)";
    lockedOverlay.style.color = "#111827";
    lockedOverlay.style.fontSize = "32px";
    lockedOverlay.style.fontWeight = "bold";
    lockedOverlay.style.pointerEvents = "auto";
    stage.appendChild(lockedOverlay);
  }

  function setStickerButtonsLocked(locked) {
    for (var b = 0; b < stickerButtons.length; b++) {
      stickerButtons[b].disabled = locked;
      stickerButtons[b].style.opacity = locked ? "0.35" : "1";
      stickerButtons[b].style.cursor = locked ? "not-allowed" : "pointer";
    }
  }

  if (options.startLocked) {
    setStickerButtonsLocked(true);
  }

  window.unlockCurrentDecorating = function(token) {
    if (token && token !== window.currentDecoratingLockToken) return;
    decoratingUnlocked = true;
    setStickerButtonsLocked(false);
    if (lockedOverlay && lockedOverlay.parentNode) {
      lockedOverlay.parentNode.removeChild(lockedOverlay);
    }
  };

  for (var i = 0; i < stickerButtons.length; i++) {
    stickerButtons[i].addEventListener("click", function() {
      if (!decoratingUnlocked) return;
      selectedSticker = this.dataset.sticker;
      if (practiceFeedback && options.requiredPracticeSticker && selectedSticker !== options.requiredPracticeSticker) {
        practiceFeedback.textContent = "Hmmm, what about the red star?";
        practiceFeedback.style.display = "block";
        practiceFeedback.style.color = "#9a3412";
        practiceFeedback.style.borderColor = "#ea580c";
      }
      selectionEvents.push({
        sticker: selectedSticker,
        time_ms: Math.round(performance.now()),
        forbidden_sticker: (options.forbiddenStickers || []).indexOf(selectedSticker) !== -1
      });
      for (var j = 0; j < stickerButtons.length; j++) stickerButtons[j].style.background = "#f8fafc";
      this.style.background = "#fde68a";
    });
  }

  stage.addEventListener("click", function(event) {
    if (!decoratingUnlocked) return;
    if (!selectedSticker) return;
    if (event.target !== stage && event.target.tagName.toLowerCase() !== "img") return;
    addSticker(selectedSticker, getPos(event));
  });

  stage.addEventListener("pointermove", function(event) {
    if (!decoratingUnlocked) return;
    if (!dragging) return;
    var pos = getPos(event);
    dragging.style.left = (pos.x * 100) + "%";
    dragging.style.top = (pos.y * 100) + "%";
    for (var i = 0; i < placements.length; i++) {
      if (placements[i].id === dragging.dataset.id) {
        placements[i].x = Number(pos.x.toFixed(4));
        placements[i].y = Number(pos.y.toFixed(4));
        placements[i].moved = true;
      }
    }
    if (canUnlockForPractice(dragging.textContent, pos)) unlockNext();
  });

  stage.addEventListener("pointerup", function() { dragging = null; });
  stage.addEventListener("pointercancel", function() { dragging = null; });

  return lockToken;
}

function makeFinalPreviewHTML() {
  var scene = window.finalScene;
  var placements = window.finalPlacements || [];
  var stickers = "";

  for (var i = 0; i < placements.length; i++) {
    var color = placements[i].sticker === "★" ? "color:#dc2626;" : "";
    stickers += [
      "<span style='position:absolute;left:",
      placements[i].x * 100,
      "%;top:",
      placements[i].y * 100,
      "%;transform:translate(-50%,-50%);font-size:42px;",
      color,
      "'>",
      placements[i].sticker,
      "</span>"
    ].join("");
  }

  return [
    "<div style='width:min(760px,90vw);margin:0 auto 18px;font-family:Arial,sans-serif;'>",
    "<div style='position:relative;width:100%;aspect-ratio:3 / 2;overflow:hidden;border:3px solid #1f2933;background:#f7fafc;pointer-events:none;'>",
    scene ? "<img src='" + scene.image + "' style='width:100%;height:100%;object-fit:cover;display:block;'>" : "",
    stickers,
    "</div>",
    "</div>"
  ].join("");
}

function makePredictionChoicesHTML(scene) {
  var buttons = "";
  for (var i = 1; i <= 10; i++) {
    buttons += [
      "<button type='button' class='prediction-choice' data-number='",
      i,
      "' style='width:64px;height:64px;margin:6px;font-size:28px;font-weight:bold;border:3px solid #2563eb;border-radius:14px;background:#dbeafe;color:#1e3a8a;cursor:pointer;'>",
      i,
      "</button>"
    ].join("");
  }

  return [
    "<div style='width:min(900px,94vw);margin:0 auto;font-family:Arial,sans-serif;font-size:24px;line-height:1.35;text-align:center;'>",
    "<p>I'm going to play this game with 10 more kids later.</p>",
    "<p>Out of 10 kids who might play later, how many do you think will put ",
    scene.rule_question_text,
    " on the picture?</p>",
    "<div style='margin-top:10px;'>",
    buttons,
    "</div>",
    "</div>"
  ].join("");
}

function setupPredictionChoices() {
  var nextButton = document.getElementById("jspsych-html-button-response-button-0");
  var buttons = document.querySelectorAll(".prediction-choice");

  window.currentPredictionResponse = null;

  if (nextButton) {
    nextButton.disabled = true;
    nextButton.style.opacity = "0.45";
  }

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function() {
      window.currentPredictionResponse = this.dataset.number;
      for (var j = 0; j < buttons.length; j++) {
        buttons[j].style.background = "#dbeafe";
        buttons[j].style.borderColor = "#2563eb";
        buttons[j].style.transform = "scale(1)";
      }
      this.style.background = "#fde68a";
      this.style.borderColor = "#ea580c";
      this.style.transform = "scale(1.08)";
      if (nextButton) {
        nextButton.disabled = false;
        nextButton.style.opacity = "1";
      }
    });
  }
}

function makeFinalQuestionTrial(questionType, buttonText) {
  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: function() {
      var scene = window.finalScene;
      var voices = FINAL_VOICES[scene.final_voice_key];
      var textByType = {
        made: "Nice decorating. Can you tell me what you made? <span style='color:#dc2626;'>Feel free to describe your work out loud!</span>",
        did: "Did you put any " + scene.rule_question_text + " on the picture? <span style='color:#dc2626;'>Feel free to answer out loud!</span>",
        why: "Why did you or didn't you put " + scene.rule_question_text + "? <span style='color:#dc2626;'>Feel free to say your reason out loud!</span>",
        prediction: "I'm going to play this game with 10 more kids later.<br><br>Out of 10 kids who might play later, how many do you think will put " + scene.rule_question_text + " on the picture?"
      };
      window.pendingFinalVoice = voices[questionType];
      if (questionType === "prediction") {
        return makeFinalPreviewHTML() + makePredictionChoicesHTML(scene);
      }
      return makeFinalPreviewHTML() + makeTextPageHTML("<p style='text-align:center;font-size:28px;'>" + textByType[questionType] + "</p>");
    },
    choices: [buttonText || "Next"],
    data: function() {
      return {
        task_part: "final_question_" + questionType,
        condition: CONDITION,
        final_scene_id: window.finalScene.scene_id,
        final_rule_text: window.finalScene.rule_text
      };
    },
    on_load: function() {
      playPageAudio(window.pendingFinalVoice);
      if (questionType === "prediction") {
        setupPredictionChoices();
      }
    },
    on_finish: function(data) {
      if (questionType === "prediction") {
        data.prediction_response = window.currentPredictionResponse;
      }
      stopCurrentAudio();
    }
  };
}

var introTrial = {
  type: jsPsychHtmlButtonResponse,
  stimulus: makeIntroPageHTML(),
  choices: ["Start practice"],
  data: { task_part: "intro", condition: CONDITION },
  on_load: function() { playPageAudio(AUDIO_BASE + "intro.mp3"); },
  on_finish: function() { stopCurrentAudio(); }
};

var demoTrial = {
  type: jsPsychHtmlButtonResponse,
  stimulus: makeTrialHTML("Watch first. I'm going to click the blue heart, and then I'm going to put it in the blue box.<br><br>See? First click the sticker, then click where you want to put it. When you're ready to practice, click the button that tells you to try.", null, {
    isPractice: true,
    isDemo: true,
    stickerList: ["💙"],
    practiceText: "Blue box",
    practiceBoxColor: "#2563eb",
    practiceBoxBackground: "rgba(219,234,254,.65)"
  }),
  choices: ["Click here to try"],
  data: { task_part: "demo", condition: CONDITION },
  on_load: function() {
    playPageAudio(AUDIO_BASE + "demo_blue_heart.mp3");
    setupDemoAnimation();
  },
  on_finish: function() { stopCurrentAudio(); }
};

var practiceBlueTrial = {
  type: jsPsychHtmlButtonResponse,
  stimulus: makeTrialHTML("Now you try. Click the blue heart, and put it inside the blue box.", null, {
    isPractice: true,
    stickerList: ["💙"],
    practiceText: "Blue box",
    practiceBoxColor: "#2563eb",
    practiceBoxBackground: "rgba(219,234,254,.65)"
  }),
  choices: ["Next"],
  data: { task_part: "practice_blue", condition: CONDITION },
  on_load: function() {
    playPageAudio(FALLBACK_AUDIO_BASE + "practice_blue_heart.mp3");
    setupDecoratingTrial({
      requirePracticeSuccess: true,
      requiredPracticeSticker: "💙",
      successAudio: AUDIO_BASE + "good_job_blue.mp3"
    });
  },
  on_finish: function(data) {
    data.placements = JSON.stringify(window.currentDecorations || []);
    data.selection_events = JSON.stringify(window.currentSelectionEvents || []);
    stopCurrentAudio();
  }
};

var practiceRedTrial = {
  type: jsPsychHtmlButtonResponse,
  stimulus: makeTrialHTML("Let's try again. Now try to find the red star, click it, and put it inside the red box.", null, {
    isPractice: true,
    stickerList: ALL_STICKERS,
    practiceText: "Red box",
    practiceBoxColor: "#dc2626",
    practiceBoxBackground: "rgba(254,226,226,.70)"
  }),
  choices: ["Next"],
  data: { task_part: "practice_red", condition: CONDITION },
  on_load: function() {
    playPageAudio(FALLBACK_AUDIO_BASE + "practice_red_star.mp3");
    setupDecoratingTrial({
      requirePracticeSuccess: true,
      requiredPracticeSticker: "★",
      successAudio: AUDIO_BASE + "good_job_red.mp3"
    });
  },
  on_finish: function(data) {
    data.placements = JSON.stringify(window.currentDecorations || []);
    data.selection_events = JSON.stringify(window.currentSelectionEvents || []);
    stopCurrentAudio();
  }
};

var realGameIntroTrial = {
  type: jsPsychHtmlButtonResponse,
  stimulus: makeTextPageHTML("<p>Now we're going to play the real decorating game.</p><p>Remember, you can decorate the picture however you want.</p><p style='color:#674ea7;'>Once you're done decorating, click the button to go to the next page.</p>"),
  choices: ["Start"],
  data: { task_part: "real_game_intro", condition: CONDITION },
  on_load: function() { playPageAudio(AUDIO_BASE + "real_game_intro.mp3"); },
  on_finish: function() { stopCurrentAudio(); }
};

var allFinishedTrial = {
  type: jsPsychHtmlButtonResponse,
  stimulus: [
    "<div style='width:min(760px,92vw);margin:0 auto;font-family:Arial,sans-serif;text-align:center;'>",
    "<div style='font-size:72px;margin-bottom:14px;' aria-hidden='true'>🎉</div>",
    "<h1 style='font-size:48px;line-height:1.15;margin:0;color:#0f172a;'>All finished!</h1>",
    "</div>"
  ].join(""),
  choices: [],
  trial_duration: 1000,
  data: { task_part: "all_finished", condition: CONDITION }
};

function makeSceneTrial(scene, isFinalScene) {
  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: makeTrialHTML(getConditionScript(scene), scene.image, { stickerList: ALL_STICKERS }),
    choices: ["Next"],
    trial_duration: 10 * 60 * 1000,
    data: {
      task_part: "main_decoration",
      condition: CONDITION,
      scene_id: scene.scene_id,
      scene_label: scene.scene_label,
      rule_target: scene.rule_target,
      rule_text: scene.rule_text,
      rule_question_text: scene.rule_question_text,
      forbidden_stickers: JSON.stringify(scene.forbidden_stickers),
      scene_image: scene.image,
      is_final_scene: isFinalScene
    },
    on_load: function() {
      var lockToken = setupDecoratingTrial({
        forbiddenStickers: scene.forbidden_stickers,
        startLocked: true
      });
      var audio = playPageAudio(scene.prior_voice);
      scheduleDecoratingUnlock(audio, lockToken);
    },
    on_finish: function(data) {
      var placements = window.currentDecorations || [];
      var selectionEvents = window.currentSelectionEvents || [];
      var forbiddenPlacements = placements.filter(function(p) { return p.forbidden_sticker; });
      var stage = document.getElementById("decorating-stage");

      data.placements = JSON.stringify(placements);
      data.selection_events = JSON.stringify(selectionEvents);
      data.num_placements = placements.length;
      data.num_forbidden_placements = forbiddenPlacements.length;
      data.placed_forbidden_sticker = forbiddenPlacements.length > 0;
      data.timed_out = data.response === null;

      if (isFinalScene) {
        window.finalScene = scene;
        window.finalPlacements = JSON.parse(JSON.stringify(placements));
      }

      stopCurrentAudio();
      window.currentDecoratingLockToken = null;
    }
  };
}

var shuffledScenes = jsPsych.randomization.shuffle(SCENES);
var timeline = [introTrial, demoTrial, practiceBlueTrial, practiceRedTrial, realGameIntroTrial];

for (var s = 0; s < shuffledScenes.length; s++) {
  timeline.push(makeSceneTrial(shuffledScenes[s], s === shuffledScenes.length - 1));
}

timeline.push(makeFinalQuestionTrial("made", "Next"));
timeline.push(makeFinalQuestionTrial("did", "Next"));
timeline.push(makeFinalQuestionTrial("why", "Next"));
timeline.push(makeFinalQuestionTrial("prediction", "Finish"));
timeline.push(allFinishedTrial);

jsPsych.run(timeline);
