let activeTabId = null;
let lastActiveTime = null;
let currentDomain = null;

chrome.tabs.onActivated.addListener(async activeInfo => {
  await trackTime();
  chrome.tabs.get(activeInfo.tabId, tab => {
    if (tab && tab.url) {
      const domain = getCleanDomain(tab.url);
      if (domain) {
        activeTabId = activeInfo.tabId;
        currentDomain = domain;
        lastActiveTime = Date.now();
      } else {
        currentDomain = null;
        lastActiveTime = null;
      }
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getDomain") {
    sendResponse({ domain: currentDomain });
  }
});

async function trackTime() {
  if (!currentDomain || !lastActiveTime) return;
  const duration = Math.floor((Date.now() - lastActiveTime) / 1000);
  if (duration < 2) return;

  console.log(`Tracking: ${currentDomain} for ${duration}s`);

  await fetch("http://localhost:5000/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain: currentDomain, duration })
  });
}

function getCleanDomain(url) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "");
    const blacklist = ["newtab", "localhost", "chrome", "chrome-extension"];
    return blacklist.some(bad => hostname.includes(bad)) ? null : hostname;
  } catch (e) {
    return null;
  }
}

