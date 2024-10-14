// Create a message element
const total_no_of_entries = 10000
const messageElement = document.createElement('a');
messageElement.href = 'chrome-extension://lfdedbcockmflkfcgfohlijicmdjcojl/data.html'; // Set href attribute to "#" to prevent navigation
messageElement.target = '_blank'; // Open the link in a new tab


messageElement.style.position = 'fixed';
messageElement.style.top = '10px';
messageElement.style.left = '10px';
messageElement.style.padding = '10px';
messageElement.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
messageElement.style.color = '#fff';
messageElement.style.zIndex = '9999';
messageElement.style.fontFamily = 'Arial, sans-serif';
messageElement.style.display = 'none';

document.body.appendChild(messageElement);


// Send a message to the background script requesting data from storage
chrome.runtime.sendMessage({message: 'getStorageData'}, (response) => {
  if (response && response.data) {
    // Process the data from storage

    console.log('Data from storage:', response.data, typeof(response.data));

    if (response.data > total_no_of_entries) {
      messageElement.innerText = `You have this many records in your history make a backup ${response.data}`; // Set the message text

      messageElement.style.display = 'block';
  
    }

  }
});



