// Import necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// Your web app's Firebase configuration
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

// Export both app and auth
export { app, auth };

// Handle sign-out
function handleSignOut() {
    signOut(auth).then(() => {
        console.log('User signed out');
    }).catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
    });
}

// Set up sign-out button event listener
const signOutButton = document.getElementById('signout-button');
if (signOutButton) { // Check if signOutButton is not null
    signOutButton.addEventListener('click', handleSignOut);
}

// Observe authentication state
onAuthStateChanged(auth, (user) => {
    let publicElements = document.querySelectorAll("[data-onlogin='hide']");
    let privateElements = document.querySelectorAll("[data-onlogin='show']");

    if (user) {
        // User is signed in
        const uid = user.uid;
        privateElements.forEach(element => {
            element.style.display = "initial";
        });
        publicElements.forEach(element => {
            element.style.display = "none";
        });
        console.log(`The current user's UID is equal to ${uid}`);
    } else {
        // User is signed out
        publicElements.forEach(element => {
            element.style.display = "initial";
        });
        privateElements.forEach(element => {
            element.style.display = "none";
        });
    }
});
