
// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

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

// Handle Sign Up
export function handleSignUp(e) {
    e.preventDefault();
    
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    console.log("email is " + email);
    console.log("password is " + password + ". Now sending to Firebase.");
    
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('User successfully created: ' + user.email);
        })
        .catch((error) => {
            const errorMessage = error.message;
            var errorText = document.getElementById('signup-error-message');
            console.log(errorMessage);
            errorText.innerHTML = errorMessage;
        });
}

// Handle Sign In
export function handleSignIn(e) {
    e.preventDefault();
    
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('User logged in: ' + user.email);
        })
        .catch((error) => {
            const errorMessage = error.message;
            var errorText = document.getElementById('signin-error-message');
            console.log(errorMessage);
            errorText.innerHTML = errorMessage;
        });
}

// Handle Sign Out
export function handleSignOut() {
    signOut(auth).then(() => {
        console.log('User signed out');
    }).catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
    });
}

// Authentication State Observer
export function observeAuthState() {
    onAuthStateChanged(auth, (user) => {
        let publicElements = document.querySelectorAll("[data-onlogin='hide']");
        let privateElements = document.querySelectorAll("[data-onlogin='show']");

        if (user) {
            const uid = user.uid;
            privateElements.forEach(element => {
                element.style.display = "initial";
            });
            publicElements.forEach(element => {
                element.style.display = "none";
            });
            console.log(`The current user's UID is equal to ${uid}`);
        } else {
            publicElements.forEach(element => {
                element.style.display = "initial";
            });
            privateElements.forEach(element => {
                element.style.display = "none";
            });
        }
    });
}
