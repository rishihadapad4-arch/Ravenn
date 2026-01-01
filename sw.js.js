// PWA Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

// Firebase Config (Replace with your own from Firebase Console)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// App State
let currentUser = null;
const chatRef = database.ref('messages'); // Real-time messages

// DOM Elements
const loginPage = document.getElementById('login-page');
const chatPage = document.getElementById('chat-page');
const loginForm = document.getElementById('login-form');
const chatMessages = document.getElementById('chat-messages');
const messageForm = document.getElementById('message-form');
const backBtn = document.getElementById('back-btn');

// Event Listeners
loginForm.addEventListener('submit', handleLogin);
backBtn.addEventListener('click', () => showPage(loginPage));
messageForm.addEventListener('submit', sendMessage);

// Listen for real-time messages
chatRef.on('child_added', (snapshot) => {
    const message = snapshot.val();
    renderMessage(message);
    scrollToBottom(); // Smooth scroll on new message
});

// Functions
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const inviteCode = document.getElementById('invite-code').value;
    if (inviteCode.startsWith('RAVEN')) {
        currentUser = username;
        showPage(chatPage);
        loadMessages(); // Load existing messages
    } else {
        alert('Invalid invite code.');
    }
}

function sendMessage(e) {
    e.preventDefault();
    const text = document.getElementById('message-input').value;
    const message = { user: currentUser, text, timestamp: Date.now() };
    chatRef.push(message); // Send to Firebase
    document.getElementById('message-input').value = '';
}

function loadMessages() {
    chatRef.once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            renderMessage(childSnapshot.val());
        });
        scrollToBottom();
    });
}

function renderMessage(msg) {
    const div = document.createElement('div');
    div.className = 'message';
    div.innerHTML = `<strong>${msg.user}:</strong> ${msg.text}`;
    chatMessages.appendChild(div);
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    page.classList.add('active');
}