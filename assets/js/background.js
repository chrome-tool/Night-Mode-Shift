import {
  getDarkMode,
  getColor,
  getOpacity,
  createScreenCover,
} from "./utils.js";

class background {
  constructor() {}

  async execute() {
    const darkModeVal = await getDarkMode();
    const colorval = await getColor();
    const opacityVal = await getOpacity();
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (
      tabs.length === 0 ||
      tabs[0].url?.startsWith("chrome://") ||
      tabs[0].url?.startsWith("https://chromewebstore.google.com")
    )
      return undefined;
    const tabId = tabs[0].id;
    await chrome.scripting.executeScript({
      target: { tabId },
      func: function (darkModeVal, colorval, opacityVal) {
        let screenCoverDiv = document.getElementById("screen-cover");
        if (!screenCoverDiv) {
          screenCoverDiv = document.createElement("div");
          screenCoverDiv.id = "screen-cover";
          screenCoverDiv.style.cssText =
            "transition: opacity 1s ease 0s;z-index: 999999999999;margin: 0;border-radius: 0;position: fixed;top: -10%;right: -10%;width: 120%;height: 120%;pointer-events: none;mix-blend-mode: multiply;display: block;";
          const html = document.querySelector("html");
          html.insertBefore(screenCoverDiv, document.head);
          screenCoverDiv.style.backgroundColor = colorval;
          screenCoverDiv.style.opacity = opacityVal;
        }
        if (darkModeVal) {
          screenCoverDiv.style.backgroundColor = colorval;
          screenCoverDiv.style.opacity = opacityVal;
          screenCoverDiv.style.display = "block";
        } else {
          screenCoverDiv.style.display = "none";
        }
      },
      args: [darkModeVal, colorval, opacityVal],
    });
  }

  init() {
    chrome.tabs.onActivated.addListener((activeInfo) => {
      this.execute();
    });
    chrome.runtime.onMessage.addListener((request) => {
      if (request.action === "execute") {
        this.execute();
      }
    });
  }
}

new background().init();
