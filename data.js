// data.js
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get('urls', (data) => {
        const urls = data.urls || [];
        const urlList = document.getElementById('urlList');


        function renderUrls(filteredUrls) {
          urlList.innerHTML = ''; // Clear previous list
          
          // Function to format dates for display
          function formatDate(dateString) {
              const parts = dateString.split('/');
              const formattedDate = new Date(`${parts[1]}/${parts[0]}/${parts[2]}`);
              return formattedDate.toDateString(); // Format as desired
          }
      
          // Group URLs by date
          const groupedUrls = {};
          filteredUrls.forEach((entry, index) => {
              const date = formatDate(entry.timestamp);
              if (!groupedUrls[date]) {
                  groupedUrls[date] = [];
              }
              // Store both the entry and its original index
              groupedUrls[date].push({ ...entry, originalIndex: index });
          });
          
          // Sort grouped URLs by date in ascending order
          const sortedDates = Object.keys(groupedUrls).sort((a, b) => {
              // Sort by date in descending order (newest to oldest)
              return new Date(b) - new Date(a);
          });
      
          // Render each group under separate divs in reversed order
          sortedDates.forEach((date) => {
              const groupDiv = document.createElement('div');
              groupDiv.classList.add('url-group');
              
              const groupHeader = document.createElement('h2');
              groupHeader.textContent = date;
              groupDiv.appendChild(groupHeader);
              const hrElement = document.createElement('hr');

              // Append the horizontal line after the h2 header
              groupDiv.appendChild(hrElement);
              // Reverse the order of entries within each date group
              groupedUrls[date].reverse().forEach((entry) => {
                  const listItem = document.createElement('li');
          

          
                  const checkbox = document.createElement('input');
                  checkbox.type = 'checkbox';
                  checkbox.value = entry.originalIndex; // Use the original index
                  listItem.appendChild(checkbox);
                  
                  const [date, fullTime] = entry.timestamp.split(' '); // Split into date and time parts
                  const [hoursPart, minutesPart] = fullTime.split(':').slice(0, 2)

                  const timestamp = document.createElement('span');
                  timestamp.innerHTML = `${hoursPart + ":" + minutesPart}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp`; // Add non-breaking spaces
                  listItem.appendChild(timestamp);
                  

                  if (entry.favicon) {
                    const favicon = document.createElement('img');
                    favicon.src = entry.favicon;
                    favicon.width = 24;
                    favicon.height = 24;
                    listItem.appendChild(favicon);
                }
          
                  const indexLabel = document.createElement('span');
                  indexLabel.textContent = `Index: ${entry.originalIndex}`; // Display original index
                  listItem.appendChild(indexLabel);
          
                  const link = document.createElement('a');
                  link.href = entry.url;
                  link.textContent = entry.title || entry.url;
                  link.target = '_blank';
                  listItem.appendChild(link);
          

          
                  groupDiv.appendChild(listItem);
              });
              
              urlList.appendChild(groupDiv);
          });
      }
      
      
      
      
      
        renderUrls(urls);

        document.getElementById('searchInput').addEventListener('input', () => {
            const searchQuery = document.getElementById('searchInput').value.toLowerCase();
            const filteredUrls = urls.filter(entry => entry.url.toLowerCase().includes(searchQuery) || (entry.title && entry.title.toLowerCase().includes(searchQuery)));
            
            // Reverse the filteredUrls again before rendering
            renderUrls(filteredUrls.reverse());
        });
        document.getElementById('deleteSelected').addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('#urlList input[type="checkbox"]:checked');
            const indicesToDelete = Array.from(checkboxes).map(checkbox => parseInt(checkbox.value));
        
            chrome.storage.local.get('urls', (data) => {
              const urls = data.urls || [];
              const updatedUrls = urls.filter((url, index) => !indicesToDelete.includes(index));
              chrome.storage.local.set({ urls: updatedUrls }, () => {
                console.log('Selected records deleted');
                location.reload(); // Refresh the page to reflect changes
              });
            });
          });
        
          document.getElementById('deleteRange').addEventListener('click', () => {
            const startInput = document.getElementById('startInput').value;
            const endInput = document.getElementById('endInput').value;
        
            if (!startInput || !endInput) {
              console.log('Please provide both start and end indices');
              return;
            }
        
            const start = parseInt(startInput);
            const end = parseInt(endInput);
        
            if (isNaN(start) || isNaN(end)) {
              console.log('Invalid range');
              return;
            }
        
            chrome.storage.local.get('urls', (data) => {
              const urls = data.urls || [];
              const updatedUrls = urls.filter((url, index) => index < start || index > end);
              chrome.storage.local.set({ urls: updatedUrls }, () => {
                console.log('Records in the specified range deleted');
                location.reload(); // Refresh the page to reflect changes
              });
            });
          });
    });

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


  document.getElementById('clearData').addEventListener('click', () => {
    chrome.storage.local.remove('urls', () => {
      console.log('Data cleared');
      document.getElementById('urlList').innerHTML = '';
    });
  });



