const STRAVA_URL_PATTERN = '*://*.strava.com/*';
const STRAVA_DASHBOARD_URL = 'https://www.strava.com/dashboard';

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.query({
    windowId: chrome.windows.WINDOW_ID_CURRENT,
    url: STRAVA_URL_PATTERN
  }, tabs => {
    if (tabs && tabs.length) {
      // if the active tab is on strava, reload the page instead of switching tabs
      const activeTab = getActiveTab(tabs);
      if (activeTab) {
        return chrome.tabs.update(activeTab.id, { url: STRAVA_DASHBOARD_URL });
      }

      // try to find a dashboard tab first, falling back to the first strava tab
      const dashboards = tabs.filter(tab => tab.url.indexOf('dashboard') >= 0);
      const targetTab = dashboards.length ? dashboards[0] : tabs[0];

      // switch to strava tab
      chrome.tabs.highlight({
        windowId: targetTab.windowId,
        tabs: targetTab.index
      });
    } else {
      // open a new strava tab
      window.open(STRAVA_DASHBOARD_URL);
    }
  });
});

function getActiveTab(tabs) {
  const activeTabs = tabs.filter(tab => tab.active);
  return activeTabs && activeTabs.length && activeTabs[0];
}
