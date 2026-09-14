const $ = document;

// - Get Element From DOM
// * Video
const videoContainer = $.querySelector(".video"); // ✅
const video = $.querySelector("video"); // ✅

// * Options
// ! فعلا فقط sizeButton نوشته خواهد شد
const menuButton = $.querySelector("#menuButton"); // ! مانده
const chatButton = $.querySelector("#chatButton"); // ! مانده
const sizeButton = $.querySelector("#sizeButton"); // ✅

// * Control
const backwardButton = $.querySelector("#backwardButton"); // ✅
const playerButton = $.querySelector("#playerButton"); // ✅
const forwardButton = $.querySelector("#forwardButton"); // ✅

// * Footer
const videoTitle = $.querySelector(".video__title"); // ! مانده
const videoCaption = $.querySelector(".video__caption"); // ! مانده
const videoCurrentTime = $.querySelector(".video__currenttime"); // ✅
const videoDuration = $.querySelector(".video__duration"); // ✅
const videoTimeLine = $.querySelector(".video__timeline"); // ✅

// - Variable
let cursorTimeout;

// - Functions

// * Video
const callTimeout = () => {
  cursorTimeout = setTimeout(() => {
    hideConsole();
  }, 2000);
};

const hideConsole = () => {
  const isPaused = video.paused;

  if (isPaused) {
    videoContainer.classList.remove("video--active");
  } else {
    videoContainer.classList.add("video--active");
  }
  clearTimeout(cursorTimeout);
};
const showConsole = () => {
  videoContainer.classList.remove("video--active");
  document.body.removeAttribute("style");
};
const cursorMove = () => {
  clearTimeout(cursorTimeout);
  showConsole();
  callTimeout();
};
const toggleConsole = (e) => {
  if (e.target.tagName !== "BUTTON" && e.target.tagName !== "INPUT") {
    videoContainer.classList.toggle("video--active");
    clearTimeout(cursorTimeout);
    callTimeout();
  }
};
const videoExitFullscreen = () => {
  if (!$.fullscreenElement) {
    const buttonData = sizeButton.dataset;
    buttonData.size = "auto";
    sizeButton.innerHTML = `<i class="fas fa-expand"></i>`;
  }
};

// * Options
const changeSize = () => {
  const buttonData = sizeButton.dataset;

  if (buttonData.size === "auto") {
    videoContainer.requestFullscreen();
    sizeButton.innerHTML = `<i class="fas fa-compress"></i>`;
    buttonData.size = "full";
  } else {
    $.exitFullscreen();
    videoExitFullscreen();
  }
};

// * Control
const backwardTime = () => (video.currentTime -= 10);
const toggleVideoPlayer = () => {
  const isPaused = video.paused;
  if (isPaused) {
    video.play();
    playerButton.innerHTML = `<i class="fas fa-pause"></i>`;
    callTimeout();
  } else {
    video.pause();
    playerButton.innerHTML = `<i class="fas fa-play"></i>`;
  }
};
const forwardTime = () => (video.currentTime += 10);

// * Footer
const setVideoDuration = () => {
  const duration = video.duration;
  videoTimeLine.setAttribute("max", duration);

  let s = Math.floor(duration % 60);
  let m = Math.floor(duration / 60);
  let h = Math.floor(m / 60);

  s < 10 ? (s = `0${s}`) : "";
  m < 10 ? (m = `0${m}`) : "";

  let textDuration;

  if (h) {
    videoCurrentTime.innerText = "0:00:00";
    textDuration = `${h}:${m}:${s}`;
  } else {
    videoCurrentTime.innerText = "0:00";
    m = +m;
    textDuration = `${m}:${s}`;
  }

  videoDuration.innerHTML = textDuration;
};
const autoUpdateCurrentTime = () => {
  const currentTime = video.currentTime;

  let s = Math.floor(currentTime % 60);
  let m = Math.floor(currentTime / 60);
  let h = Math.floor(m / 60);

  s < 10 ? (s = `0${s}`) : "";
  m < 10 ? (m = `0${m}`) : "";

  let textCurrentTime;
  if (h) {
    textCurrentTime = `${h}:${m}:${s}`;
  } else {
    m = +m;
    textCurrentTime = `${m}:${s}`;
  }
  videoCurrentTime.innerText = textCurrentTime;
  videoTimeLine.value = currentTime;
  updateLineTime();
};
const updateLineTime = () => {
  const { currentTime, duration } = video;
  const percent = (currentTime / duration) * 100;

  videoTimeLine.style.cssText = `--range: ${percent}%;`;
};
const updateCurrentTime = () => {
  video.currentTime = +videoTimeLine.value;
  updateLineTime();
};

// * Events

// - Video
videoContainer.addEventListener("mouseenter", showConsole);
videoContainer.addEventListener("mouseleave", hideConsole);
videoContainer.addEventListener("mousemove", cursorMove);
videoContainer.addEventListener("click", toggleConsole);
videoContainer.addEventListener("fullscreenchange", videoExitFullscreen);

video.addEventListener("loadedmetadata", setVideoDuration);
video.addEventListener("timeupdate", autoUpdateCurrentTime);

// - Options
sizeButton.addEventListener("click", changeSize);

// - Control
backwardButton.addEventListener("click", backwardTime);
playerButton.addEventListener("click", toggleVideoPlayer);
forwardButton.addEventListener("click", forwardTime);

// - Footer
videoTimeLine.addEventListener("input", updateCurrentTime);
