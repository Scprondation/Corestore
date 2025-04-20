import { auth, database } from './firebase.js';

// Initialize chat
function initChat() {
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    
    // Load previous messages
    database.ref('chat').limitToLast(50).on('value', snapshot => {
        const messages = snapshot.val();
        chatMessages.innerHTML = '';
        
        if (!messages) return;
        
        Object.keys(messages).forEach(key => {
            const message = messages[key];
            appendMessage(message);
        });
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
    
    // Send message
    function sendMessage() {
        const user = auth.currentUser;
        const text = messageInput.value.trim();
        
        if (!user || !text) return;
        
        const message = {
            text: text,
            userName: user.displayName,
            userPhoto: user.photoURL,
            userId: user.uid,
            timestamp: Date.now()
        };
        
        database.ref('chat').push(message)
            .then(() => {
                messageInput.value = '';
            })
            .catch(error => {
                console.error('Error sending message:', error);
                alert('Error sending message. Please try again.');
            });
    }
    
    // Send on button click
    sendButton.addEventListener('click', sendMessage);
    
    // Send on Enter key
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Append message to DOM
    function appendMessage(message) {
        const messageDiv = document.createElement('div');
        const user = auth.currentUser;
        
        messageDiv.className = user && user.uid === message.userId ? 'message user' : 'message other';
        messageDiv.innerHTML = `
            <div class="message-info">
                <span>${message.userName}</span>
                <span>${new Date(message.timestamp).toLocaleTimeString()}</span>
            </div>
            <p>${message.text}</p>
        `;
        
        chatMessages.appendChild(messageDiv);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initChat);