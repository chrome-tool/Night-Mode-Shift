const executeDarkMode = async () => {
  const darkModeVal = await getDarkMode();
  const opacityVal = await getOpacity();
  const colorVal = await getColor();
  let screenCoverDiv = document.getElementById("screen-cover");
  if (darkModeVal && !screenCoverDiv) {
    screenCoverDiv = document.createElement("div");
    screenCoverDiv.id = "screen-cover";
    screenCoverDiv.style.cssText =
      "transition: opacity 1s ease 0s;z-index: 999999999999;margin: 0;border-radius: 0;position: fixed;top: -10%;right: -10%;width: 120%;height: 120%;pointer-events: none;mix-blend-mode: multiply;display: block;";
    const html = document.querySelector("html");
    html.insertBefore(screenCoverDiv, document.head);
    screenCoverDiv.style.backgroundColor = colorVal;
    screenCoverDiv.style.opacity = opacityVal;
  } else if (darkModeVal && screenCoverDiv) {
    screenCoverDiv.style.backgroundColor = colorVal;
    screenCoverDiv.style.opacity = opacityVal;
  } else if (!darkModeVal && screenCoverDiv) {
    screenCoverDiv.remove();
  }
};
const getDarkMode = async () => {
  return (await chrome.storage.local.get("darkmode")).darkmode ?? false;
};
const getColor = async () => {
  return (await chrome.storage.local.get("color")).color ?? "rgb(93, 93, 93)";
};
const getOpacity = async () => {
  return (await chrome.storage.local.get("opacity")).opacity ?? "0.5";
};
executeDarkMode();
