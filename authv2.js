<script type="module">

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

let auth; // Define auth here, we'll initialize it later

export function initializeFirebase(firebaseConfig) {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
}

export function handleSignUp(e) {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

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

export function handleSignOut() {
    signOut(auth).then(() => {
        console.log('User signed out');
    }).catch((error) => {
        console.log(error.message);
    });
}

export function setAuthStateChangeHandler() {
    onAuthStateChanged(auth, (user) => {
        let publicElements = document.querySelectorAll("[data-onlogin='hide']");
        let privateElements = document.querySelectorAll("[data-onlogin='show']");

        if (user) {
            privateElements.forEach(element => element.style.display = "initial");
            publicElements.forEach(element => element.style.display = "none");
            console.log(`The current user's UID is equal to ${user.uid}`);
        } else {
            publicElements.forEach(element => element.style.display = "initial");
            privateElements.forEach(element => element.style.display = "none");
        }
    });
}

</script>