(async () => {
    const js = chrome.runtime.getURL("assets/js/content.js");
    await import(js);
  })();
  