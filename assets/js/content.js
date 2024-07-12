function getDarkMode() {
  return window.localStorage.getItem("darkMode") === "true";
}
function getColor() {
  return window.localStorage.getItem("color") ?? "rgb(93, 93, 93)";
}
function getOpacity() {
  return window.localStorage.getItem("opacity") ?? "0.5";
}
function setDarkMode(darkMode) {
  return window.localStorage.setItem("darkMode", darkMode);
}
function setColor(color) {
  return window.localStorage.setItem("color", color);
}
function setOpacity(opacity) {
  return window.localStorage.setItem("opacity", opacity);
}

chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.action === "execute") {
    const { darkMode, color, opacity } = request.params;
    setDarkMode(darkMode);
    setColor(color);
    setOpacity(opacity);
    excute();
  }
});

function excute() {
  let screenCoverDiv = document.getElementById("screen-cover");
  if (!screenCoverDiv) {
    screenCoverDiv = document.createElement("div");
    screenCoverDiv.id = "screen-cover";
    screenCoverDiv.style.cssText =
      "z-index: 2147483646;margin: 0;border-radius: 0;position: fixed;top: -10%;right: -10%;width: 120%;height: 120%;pointer-events: none;mix-blend-mode: multiply;display: block;opacity: 0;";
    document.documentElement.appendChild(screenCoverDiv);
  }

  const darkModeVal = getDarkMode();
  const colorval = getColor();
  const opacityVal = getOpacity();
  if (darkModeVal) {
    screenCoverDiv.style.backgroundColor = colorval;
    screenCoverDiv.style.opacity = opacityVal;
    screenCoverDiv.style.display = "block";
  } else {
    screenCoverDiv.style.display = "none";
  }
}
(function () {
  excute();
})();
