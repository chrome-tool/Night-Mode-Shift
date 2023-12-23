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
    if (colorPicker.style.backgroundColor == colorVal) {
      colorPicker.classList.add("active");
    }
    colorPicker.addEventListener("click", executeDarkMode);
  }
  darkMode.addEventListener("change", executeDarkMode);
  opacity.addEventListener("change", executeDarkMode);
  function executeDarkMode(e) {
    e?.stopPropagation();
    if (e?.target?.classList?.contains("color-item")) {
      for (let colorPicker of colorPickers) {
        colorPicker.classList.remove("active");
      }
      e.target.classList.add("active");
    }
    let colorval;
    if (darkMode.checked) {
      colorval = getSelectedColor();
    } else {
      colorval = "transparent";
    }
    setDarkMode(darkMode.checked);
    setColor(colorval);
    setOpacity(opacity.value);
    chrome.tabs.query({ currentWindow: true }, async function (tabs) {
      for (var tab of tabs) {
        if (
          !tab.url ||
          tab?.url?.includes("chrome://") ||
          tab?.url?.includes("chromewebstore.google.com")
        ) {
          continue;
        }
        await chrome.scripting.executeScript({
          target: { tabId: tab.id, allFrames: true },
          function: function (darkModeVal, colorval, opacityVal) {
            let screenCoverDiv = document.getElementById("screen-cover");
            if (darkModeVal && !screenCoverDiv) {
              screenCoverDiv = document.createElement("div");
              screenCoverDiv.id = "screen-cover";
              screenCoverDiv.style.cssText =
                "transition: opacity 1s ease 0s;z-index: 999999999999;margin: 0;border-radius: 0;position: fixed;top: -10%;right: -10%;width: 120%;height: 120%;pointer-events: none;mix-blend-mode: multiply;display: block;";
              const html = document.querySelector("html");
              html.insertBefore(screenCoverDiv, document.head);
              screenCoverDiv.style.backgroundColor = colorval;
              screenCoverDiv.style.opacity = opacityVal;
            } else if (darkModeVal && screenCoverDiv) {
              screenCoverDiv.style.backgroundColor = colorval;
              screenCoverDiv.style.opacity = opacityVal;
            } else if (!darkModeVal && screenCoverDiv) {
              screenCoverDiv.remove();
            }
          },
          args: [darkMode.checked, colorval, opacity.value],
        });
      }
    });
  }

  function getSelectedColor() {
    return document.querySelector(".color-item.active")?.style?.backgroundColor;
  }
  async function getDarkMode() {
    return (await chrome.storage.local.get("darkmode")).darkmode ?? false;
  }
  function setDarkMode(darkmode) {
    chrome.storage.local.set({ darkmode: darkmode }, function () {});
  }
  async function getColor() {
    return (await chrome.storage.local.get("color")).color ?? "rgb(93, 93, 93)";
  }
  function setColor(color) {
    chrome.storage.local.set({ color: color }, function () {});
  }
  async function getOpacity() {
    return (await chrome.storage.local.get("opacity")).opacity ?? "0.5";
  }
  function setOpacity(opacity) {
    chrome.storage.local.set({ opacity: opacity }, function () {});
  }
});
