chrome.runtime.sendMessage({ type: "getDomain" }, response => {
  document.getElementById("domain").innerText = "Current: " + response.domain;
});

function openDashboard() {
  chrome.tabs.create({ url: "http://localhost:5000/dashboard" });
}
