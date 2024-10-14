document.addEventListener('DOMContentLoaded', function() {
    const copyUrlsBtn = document.getElementById('copyUrlsBtn');

    copyUrlsBtn.addEventListener('click', function() {
        chrome.storage.local.get('urls', (result) => {
            const urls = result.urls || [];
            const urlsString = JSON.stringify(urls, null, 2); // Convert to formatted JSON string
            
            // Create a textarea element to copy text to clipboard
            const textarea = document.createElement('textarea');
            textarea.value = urlsString;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px'; // Move off-screen
            document.body.appendChild(textarea);
            
            // Select and copy text to clipboard
            textarea.select();
            document.execCommand('copy');
            
            // Clean up: remove the textarea from DOM
            document.body.removeChild(textarea);
            
            console.log('Stored URLs copied to clipboard:', urls);
            alert('Stored URLs copied to clipboard!');
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const retrieveUrlsBtn = document.getElementById('retrieveUrlsBtn');
    const urlsContainer = document.getElementById('urlsContainer');

    retrieveUrlsBtn.addEventListener('click', function() {
        chrome.storage.local.get('urls', (result) => {
            const urls = result.urls || [];
            const rawUrlsText = JSON.stringify(urls, null, 2); // Convert to formatted JSON string
            
            urlsContainer.textContent = rawUrlsText; // Display raw JSON in the container
            
            console.log('Stored URLs:', urls);
        });
    });
});

document.getElementById('download-button').addEventListener('click', function() {
    const jsonDataDiv = document.getElementById('urlsContainer');
    const jsonData = JSON.parse(jsonDataDiv.textContent.trim());

    function convertJSONToCSV(JSONData) {
        let csv = '';
        const headers = Object.keys(JSONData[0]).join(',') + '\n';

        csv += headers;

        JSONData.forEach(item => {
            csv += Object.values(item).join(',') + '\n';
        });

        return csv;
    }

    const csv = convertJSONToCSV(jsonData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'data.csv';

    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(url);
});
