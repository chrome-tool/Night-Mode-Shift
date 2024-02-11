chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0].url?.startsWith("chrome://")) return;
    execute(activeInfo.tabId);
  });

});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tab.url?.startsWith("chrome://")) return;
  if (tab.active && changeInfo.status === "complete") {
    execute(tabId);
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.action) {
    case "execute":
      execute(request.tabId);
      break;
  }
});

async function execute(tabId) {
  const darkModeVal = await getDarkMode();
  const colorval = await getColor();
  const opacityVal = await getOpacity();
  await chrome.scripting.executeScript({
    target: { tabId },
    func: function (darkModeVal, colorval, opacityVal) {
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
    args: [darkModeVal, colorval, opacityVal],
  });
}

async function getOpacity() {
  return (await chrome.storage.local.get("opacity")).opacity ?? "0.5";
}

async function getColor() {
  return (await chrome.storage.local.get("color")).color ?? "rgb(93, 93, 93)";
}

async function getDarkMode() {
  return (await chrome.storage.local.get("darkmode")).darkmode ?? false;
}