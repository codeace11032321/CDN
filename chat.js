
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB2R6bNoBAdk9C4rvxDVu5ipEBLqu7JGjw",
    authDomain: "green-car-4a273.firebaseapp.com",
    projectId: "green-car-4a273",
    storageBucket: "green-car-4a273.appspot.com",
    messagingSenderId: "715460877679",
    appId: "1:715460877679:web:9596b97ab4d13555195c9a",
    measurementId: "G-9JJ02D0Q7G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

const messagesList = document.getElementById("messagesList");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");

// Sign in anonymously
signInAnonymously(auth)
    .then(() => {
        console.log("User signed in", auth.currentUser);
    })
    .catch((error) => {
        console.error("Error signing in:", error);
    });

// Function to send messages
const sendMessage = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
        console.error("User not authenticated");
        return;
    }
    

    const { uid, photoURL } = user;
    const messageText = messageInput.value.trim();
    
    if (!messageText) {
        console.error("Message input is empty");
        return;
    }

    try {
        await addDoc(collection(firestore, 'messages'), {
            text: messageText,
            createdAt: new Date(),
            uid,
            photoURL: photoURL || 'default_image_url'
        });
        messageInput.value = ''; // Clear input after sending
    } catch (error) {
        console.error("Error adding document: ", error);
    }
};

// Listen for new messages in real-time
const messagesQuery = query(collection(firestore, 'messages'), orderBy('createdAt', 'asc'), limit(25));
onSnapshot(messagesQuery, (querySnapshot) => {
    messagesList.innerHTML = ''; // Clear previous messages
    querySnapshot.forEach((doc) => {
        const msg = doc.data();
        const messageClass = msg.uid === auth.currentUser.uid ? 'sent' : 'received';
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', messageClass);
        messageElement.innerHTML = `
            <img src="${msg.photoURL || 'default_image_url'}" alt="User Avatar" style="width: 40px; height: 40px; border-radius: 50%;" />
            <p>${msg.text}</p>
        `;
        messagesList.appendChild(messageElement);
    });
    messagesList.scrollTop = messagesList.scrollHeight; // Scroll to the bottom
});

// Add event listener to the form
messageForm.addEventListener('submit', sendMessage);