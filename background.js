const MAX_RETRIES = 5;
const RETRY_DELAY = 1000; // 1 second

// Array of URL patterns to exclude
const excludedPatterns = [
  'newtab',       // New tab
  'chrome://newtab',  // Chrome new tab
  'chrome-extension://',
  'chrome://',    // Chrome internal pages
  'wikipedia.org' // Example pattern, add more as needed
];

function isUrlExcluded(url) {
  return excludedPatterns.some(pattern => url.includes(pattern));
}

function saveTabInfo(tab, retries = 0) {
  if (isUrlExcluded(tab.url)) {
    console.log(`Excluded URL: ${tab.url}`);
    return;
  }

  if (!tab.favIconUrl && retries < MAX_RETRIES) {
    setTimeout(() => {
      chrome.tabs.get(tab.id, (updatedTab) => {
        saveTabInfo(updatedTab, retries + 1);
      });
    }, RETRY_DELAY);
    return;
  }

  const urlData = {
    url: tab.url,
    title: tab.title,
    favicon: tab.favIconUrl,
    timestamp: new Date().toLocaleString()
  };

  chrome.storage.local.get({urls: []}, (data) => {
    const urls = data.urls;
    urls.push(urlData);
    chrome.storage.local.set({urls: urls});
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    saveTabInfo(tab);
  }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // console.log(message.message)
  if (message.message === 'getStorageData') {
      

    // Retrieve data from storage
    chrome.storage.local.get('urls', (data) => {
      // Check if 'urls' data exists
      if (data.urls && data.urls.length > 0) {
          // Send the length of 'urls' data back to the content script
          sendResponse({data: data.urls.length});
      } else {
          // If 'urls' data doesn't exist, send 0 back to the content script
          sendResponse({data: 0});
      }
  });
  
    // Return true to indicate that sendResponse will be called asynchronously
    return true;
  }
});
