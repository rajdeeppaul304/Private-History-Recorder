document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('urls', (data) => {
    const urls = data.urls || [];
    const urlList = document.getElementById('urlList');
    
    // Reverse the array to show the latest entries first
    urls.reverse().forEach((entry) => {
      const listItem = document.createElement('li');

      if (entry.favicon) {
        const favicon = document.createElement('img');
        favicon.src = entry.favicon;
        favicon.width = 16;
        favicon.height = 16;
        listItem.appendChild(favicon);
      }

      const link = document.createElement('a');
      link.href = entry.url;
      link.textContent = entry.title || entry.url;
      link.target = '_blank';
      listItem.appendChild(link);

      const timestamp = document.createElement('span');
      timestamp.textContent = ` - ${entry.timestamp}`;
      listItem.appendChild(timestamp);

      urlList.appendChild(listItem);
    });
  });

  // document.getElementById('viewData').addEventListener('click', () => {
  //   chrome.storage.local.get('urls', (data) => {
  //     console.log('Stored URLs:', data.urls);
  //   });
  // });

  // document.getElementById('clearData').addEventListener('click', () => {
  //   chrome.storage.local.remove('urls', () => {
  //     console.log('Data cleared');
  //     document.getElementById('urlList').innerHTML = '';
  //   });
  // });

  document.getElementById('downloadCSV').addEventListener('click', () => {
    chrome.storage.local.get('urls', (data) => {
      const urls = data.urls || [];
      const csvContent = "data:text/csv;charset=utf-8," 
        + "URL,Title,Favicon,Timestamp\n"
        + urls.map(e => `${e.url},${e.title || ''},${e.favicon || ''},${e.timestamp}`).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'browsing_data.csv');
      document.body.appendChild(link); // Required for Firefox
      link.click();
      document.body.removeChild(link);
    });
  });
});


// document.addEventListener('DOMContentLoaded', () => {
//   // Check storage periodically for the flag
//   console.log("my lasagna")
//   alert("hihih")
//   setInterval(() => {
//     chrome.storage.local.get('showPopup', (data) => {
//       if (data.showPopup) {
//         // Show your popup here
//         alert('You have reached 10,000 entries!');
        
//         // Clear the flag after showing the popup
//         chrome.storage.local.remove('showPopup');
//       }
//     });
//   }, 1000); // Check every 1 second (adjust as needed)
// });

