
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const firebaseConfig = {
apiKey: "AIzaSyB2R6bNoBAdk9C4rvxDVu5ipEBLqu7JGjw",
authDomain: "green-car-4a273.firebaseapp.com",
projectId: "green-car-4a273",
storageBucket: "green-car-4a273.appspot.com",
messagingSenderId: "715460877679",
appId: "1:715460877679:web:9596b97ab4d13555195c9a",
measurementId: "G-9JJ02D0Q7G"
};


// Initialize Firebase and declare "global" variables. all variables declared in this section are accessible to functions that follow.
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


let signOutButton = document.getElementById('signout-button');

    
    if(typeof signOutButton !== null) {
    signOutButton.addEventListener('click', handleSignOut);
        } else {}


function handleSignOut() {
    signOut(auth).then(() => {
console.log('user signed out')
// Sign-out successful.
}).catch((error) => {
const errorMessage = error.message;
console.log(errorMessage);
// An error happened.
});

}


onAuthStateChanged(auth, (user) => {
    let publicElements = document.querySelectorAll("[data-onlogin='hide']");
    let privateElements = document.querySelectorAll("[data-onlogin='show']");

    if (user) {
    // User is signed in, see docs for a list of available properties			
    
    const uid = user.uid;
    
    privateElements.forEach(function(element) {
    element.style.display = "initial";
    });
    
    publicElements.forEach(function(element) {
    element.style.display = "none";
    });
    
    console.log(`The current user's UID is equal to ${uid}`);
    // ...
} else {
    // User is signed out
    publicElements.forEach(function(element) {
    element.style.display = "initial";
    });
    
    privateElements.forEach(function(element) {
    element.style.display = "none";
    });
    // ...
}
});
