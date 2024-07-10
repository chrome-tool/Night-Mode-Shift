export async function getDarkMode() {
  return (await chrome.storage.local.get("darkmode")).darkmode ?? false;
}
export async function setDarkMode(darkmode) {
  await chrome.storage.local.set({ darkmode: darkmode }, function () {});
}
export async function getColor() {
  return (await chrome.storage.local.get("color")).color ?? "rgb(93, 93, 93)";
}
export async function setColor(color) {
  await chrome.storage.local.set({ color: color }, function () {});
}
export async function getOpacity() {
  return (await chrome.storage.local.get("opacity")).opacity ?? "0.5";
}
export async function setOpacity(opacity) {
  await chrome.storage.local.set({ opacity: opacity }, function () {});
}

export const createScreenCover = () => {
  let screenCoverDiv = document.getElementById("screen-cover");
  if (!screenCoverDiv) {
    screenCoverDiv = document.createElement("div");
    screenCoverDiv.id = "screen-cover";
    screenCoverDiv.style.cssText =
      "transition: opacity 1s ease 0s;z-index: 999999999999;margin: 0;border-radius: 0;position: fixed;top: -10%;right: -10%;width: 120%;height: 120%;pointer-events: none;mix-blend-mode: multiply;display: none;";
    const html = document.querySelector("html");
    html.insertBefore(screenCoverDiv, document.head);
  }
};
