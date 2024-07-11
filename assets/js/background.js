import { getDarkMode, getColor, getOpacity } from "./utils.js";

class background {
  constructor() {}

  async execute(tabId) {
    const darkModeVal = await getDarkMode();
    const colorval = await getColor();
    const opacityVal = await getOpacity();
    await chrome.tabs.sendMessage(tabId, {
      action: "execute",
      params: { darkMode: darkModeVal, color: colorval, opacity: opacityVal },
    });
  }

  init() {
    chrome.tabs.onActivated.addListener((activeInfo) => {
      this.execute(activeInfo.tabId);
    });
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.execute(tabId);
    });
  }
}

new background().init();
