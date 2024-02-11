document.addEventListener("DOMContentLoaded", async function () {
  const darkMode = document.getElementById("darkMode");
  const opacity = document.getElementById("opacity");
  const colorPickers = document.querySelectorAll(".color-item");
  const darkModeVal = await getDarkMode();
  const opacityVal = await getOpacity();
  const colorVal = await getColor();
  darkMode.checked = darkModeVal;
  opacity.value = opacityVal;
  for (let colorPicker of colorPickers) {
    colorPicker.classList.remove("active");
    if (colorPicker.style.backgroundColor === colorVal) {
      colorPicker.classList.add("active");
    }
    colorPicker.addEventListener("click", colorPickerSelect);
  }
  darkMode.addEventListener("change", darkModeEvent);
  opacity.addEventListener("change", darkModeEvent);
});
async function colorPickerSelect(e) {
  const colorPickers = document.querySelectorAll(".color-item");
  for (let colorPicker of colorPickers) {
    colorPicker.classList.remove("active");
  }
  e.target.classList.add("active");
  await darkModeEvent();
}
async function darkModeEvent() {
  const darkMode = document.getElementById("darkMode");
  const opacity = document.getElementById("opacity");
  const colorval = getSelectedColor() ? getSelectedColor() : "transparent";
  await setDarkMode(darkMode.checked);
  await setColor(colorval);
  await setOpacity(opacity.value);
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0].url?.startsWith("chrome://")) return;
    chrome.runtime.sendMessage({
      action: "execute",
      tabId: tabs[0].id,
    });
  });
}
function getSelectedColor() {
  return document.querySelector(".color-item.active")?.style?.backgroundColor;
}
async function getDarkMode() {
  return (await chrome.storage.local.get("darkmode")).darkmode ?? false;
}
async function setDarkMode(darkmode) {
  await chrome.storage.local.set({ darkmode: darkmode }, function () { });
}
async function getColor() {
  return (await chrome.storage.local.get("color")).color ?? "rgb(93, 93, 93)";
}
async function setColor(color) {
  await chrome.storage.local.set({ color: color }, function () { });
}
async function getOpacity() {
  return (await chrome.storage.local.get("opacity")).opacity ?? "0.5";
}
async function setOpacity(opacity) {
  await chrome.storage.local.set({ opacity: opacity }, function () { });
}