function mapResponse(normalizedInput){

  let responseMapping;

  if(normalizedInput.includes('env')){
    responseMapping = env;
  }
  else if(normalizedInput.includes('link')){
    responseMapping = link;
  }
  else if(normalizedInput.includes('jenkins')){
    responseMapping = jenkins;
  }
  else if(normalizedInput.includes('linux')){
    responseMapping = linux;
  }
  else if(normalizedInput.includes('docker')){
    responseMapping = docker;
  }
  else if(normalizedInput.includes('spectra')){
    responseMapping = spectra;
  }
  else if(normalizedInput.includes('rra')){
    responseMapping = rra;
  }
  else if(normalizedInput.includes('signals')){
    responseMapping = signals;
  }
  else if(normalizedInput.includes('ortl')){
    responseMapping = ortl;
  }
  else if(normalizedInput.includes('approvals')){
    responseMapping = approvals;
  }
  else if(normalizedInput.includes('notes')){
    responseMapping = notes;
  }
  else {
    responseMapping = gen;
  }

  return responseMapping;
}



function getResponse(input) {
  const normalizedInput = input.toLowerCase().trim();

  const responseMappings = mapResponse(normalizedInput);

  if(normalizedInput.includes('rra')){
    return responseMappings;
  }


  //first check if exact match is found
  for (const mapping of responseMappings) {
    for (const question of mapping.questions) {
      if (normalizedInput === question.toLowerCase()) {
        const randomIndex = Math.floor(Math.random() * mapping.responses.length);
        return mapping.responses[randomIndex];
      }
    }
  }

  // Then check for partial match
  for (const mapping of responseMappings) {
    for (const question of mapping.questions) {
      if (normalizedInput.includes(question.toLowerCase())) {
        const randomIndex = Math.floor(Math.random() * mapping.responses.length);
        return mapping.responses[randomIndex];
      }
    }
  }

  return "Sorry, I don't understand that.";
}



/** ================================================================================ */

// Define standard responses


// Function to send a message
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (message) {
        displayMessage('You', message);
        const response = getResponse(message.toLowerCase());
        displayMessage('Bot', response);
        input.value = '';
        //saveChat(message, response);
    }
}



// Function to display a message in the chat area
function displayMessage(sender, message) {
    const chatArea = document.getElementById('chatArea');
    const messageDiv = document.createElement('div');
    
    messageDiv.innerHTML = `${message}`;
   
    if(message.length < 100){
        messageDiv.style.width = `${message.length}%`;
    }

    if(Array.isArray(message)){
      const data = generateHTMLFromArray(message);
      messageDiv.style.width = `100%`;
       messageDiv.innerHTML = data;
    }
   
    else if(typeof message == 'object'){
      let html = '<ul>';
            for (const key in message) {
                if (message.hasOwnProperty(key)) {
                    html += `<li><strong>${key}:</strong> ${message[key]}</li>`;
                }
            }
            html += '</ul>';
      messageDiv.innerHTML = html;      
    }

    else if(typeof message == 'string' && message.includes('https')){
      messageDiv.innerHTML = `<a href=${message} target='_blank'>${message}</a>`;
    }

    
    
    //messageDiv.innerHTML = `<u><strong>${sender}</strong></u><br> <span class='messageText'>${message}</span>`;
    
    const messageRow = document.createElement('div');
    messageRow.className = 'message-row';
    
    if(sender.includes('You')){
        messageDiv.className = 'message';
        messageRow.classList.add('message-right');
    } else{
        messageDiv.className = 'message-plain';
    }

    if(message.includes('1234.')){
      messageDiv.classList.add('message-command');
    }
   
    //messageDiv.classList.add('copy-container');

    messageRow.appendChild(messageDiv);
    
    chatArea.appendChild(messageRow);
    chatArea.scrollTop = chatArea.scrollHeight; // Scroll to the bottom
}

// Function to save chat history by date
function saveChat(userMessage, botResponse) {
    const now = new Date();
    const dateString = now.toISOString().split('T')[0];
    let chatHistory = localStorage.getItem(dateString);
    chatHistory = chatHistory ? JSON.parse(chatHistory) : [];
    chatHistory.push({ user: userMessage, bot: botResponse });
    localStorage.setItem(dateString, JSON.stringify(chatHistory));
    updateChatHistory();
}

// Function to update the chat history sidebar
function updateChatHistory() {
    const sidebar = document.getElementById('chatHistory');
    sidebar.innerHTML = ''; // Clear previous history
    const today = new Date().toISOString().split('T')[0];
    const history = JSON.parse(localStorage.getItem(today) || '[]');
    history.forEach(entry => {
        const dateDiv = document.createElement('div');
        dateDiv.className = 'chat-entry';
        dateDiv.innerHTML = `<strong>User:</strong> ${entry.user} <br><strong>Bot:</strong> ${entry.bot}`;
        sidebar.appendChild(dateDiv);
    });
}

// Initialize chat history on page load
//window.onload = updateChatHistory;

// Add event listener to handle Enter key press
document.getElementById('messageInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default action (new line)
        sendMessage();
    }
});


function copyToClipboard(text) {
  // Create a temporary textarea element
  const textarea = document.createElement('textarea');
  textarea.value = text; // Set the value to the text to be copied
  document.body.appendChild(textarea); // Append the textarea to the body
  textarea.select(); // Select the text
  document.execCommand('copy'); // Execute the copy command
  document.body.removeChild(textarea); // Remove the textarea from the body
}

