chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.query({
    windowId: chrome.windows.WINDOW_ID_CURRENT,
    url: '*://*.strava.com/*'
  }, tabs => {
    if (tabs && tabs.length) {
      // try to find a dashboard tab first, falling back to the first strava tab
      const dashboards = tabs.filter(tab => tab.url.indexOf('dashboard') >= 0);
      const targetTab = dashboards.length ? dashboards[0] : tabs[0];

      chrome.tabs.highlight({
        windowId: targetTab.windowId,
        tabs: targetTab.index
      });
    } else {
      window.open('https://www.strava.com/dashboard');
    }
  });
});
