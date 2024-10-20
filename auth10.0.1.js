//============================/////============================/////============================///
//                                   auth version 9 by: marjooo
//  added : email verification, onboarding function, redirect user, gated content|re-structured
//  optimization: -- closed all the function if not used to avoid wasting bandwidth on the background 
//============================/////============================/////============================///
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";

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
const firestore = getFirestore(app); // Initialize Firestore
const storage = getStorage(app); // Initialize Storage

//============================/////============================/////============================///
// Identify auth action forms
let signUpForm = document.getElementById('wf-form-signup-form');
let signInForm = document.getElementById('wf-form-signin-form');
let signOutButton = document.getElementById('signout-button');
let onboardingForm = document.getElementById('onboarding-form');
let uploaderButton = document.querySelector('[data-ms-action="profile-uploader"]');

// Create a hidden file input for image uploads
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*'; // Accept only image files
fileInput.style.display = 'none'; // Hide the input
document.body.appendChild(fileInput);

//============================/////============================///
// Assign event listeners if the elements exist
//============================/////============================///
if (fileInput) {
    fileInput.addEventListener('change', updateProfilePicture);
}
if (signUpForm) {
    signUpForm.addEventListener('submit', handleSignUp);
}
if (signInForm) {
    signInForm.addEventListener('submit', handleSignIn);
}
if (signOutButton) {
    signOutButton.addEventListener('click', handleSignOut);
}
if (onboardingForm) {
    onboardingForm.addEventListener('submit', handleOnboardingSubmit);
}
if (uploaderButton) {
    uploaderButton.addEventListener('click', () => {
        fileInput.click(); // Trigger the file input when button is clicked
    });
}




//============================/////============================///
// Function to update the profile picture URL
//============================/////============================///
async function updateProfilePicture() {
    const profileImage = document.querySelector('img[data-ms-member="profile-image"]');
    const profilePicUrlInput = document.querySelector('input[data-ms-member="profile-pic-url"]');

    if (fileInput.files.length === 0) return; // Early return if no file selected

    const file = fileInput.files[0];
    const storageRef = ref(storage, `profile_pictures/${file.name}`);

    try {
        // Upload the file
        await uploadBytes(storageRef, file);
        console.log('Uploaded a blob or file!');

        // Get the download URL
        const url = await getDownloadURL(storageRef);
        profileImage.src = url;
        profilePicUrlInput.value = url; // Update hidden input

        // Update Firestore with the new URL
        const userId = auth.currentUser.uid; // Use the actual user ID from the auth object
        await setDoc(doc(firestore, 'users', userId), { profilePicUrl: url }, { merge: true });
        console.log('Profile picture URL updated in Firestore');
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

//============================/////============================///
// Handle sign-up
//============================/////============================///
function handleSignUp(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    console.log("Email is: " + email);
    
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        console.log('User successfully created: ' + user.email);
        sendVerificationEmail(); // Send verification email after sign-up
        // Redirect to onboarding page
        window.location.href = '/app/onboarding'; // Redirect added here
    })
    .catch((error) => {
        const errorMessage = error.message;
        var errorText = document.getElementById('signup-error-message');
        console.log(errorMessage);
        if (errorText) {
            errorText.innerHTML = errorMessage;
        }
    });
}

//============================/////============================///
// Handle sign-in
//============================/////============================///
function handleSignIn(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        console.log('User logged in: ' + user.email);

        if 
        
    })
    .catch((error) => {
        const errorMessage = error.message;
        var errorText = document.getElementById('signin-error-message');
        console.log(errorMessage);
        if (errorText) {
            errorText.innerHTML = errorMessage;
        }
    });
}



//============================/////============================///
// Function to send verification email
//============================/////============================///
function sendVerificationEmail() {
    const user = auth.currentUser;
    if (user) {
        sendEmailVerification(user)
            .then(() => {
                console.log("Verification email sent!");
            })
            .catch((error) => {
                console.error("Error sending verification email:", error);
            });
    }
}




//============================/////============================///
// Function to check email verification
//============================/////============================///
function manageEmailVerification() {
    let unsubscribe;

    const checkUserVerification = (user) => {
        const modalVerification = document.getElementById("email-verification-modal");
        const isModalPresent = modalVerification !== null;

        // Truthy check for user
        if (user) {
            console.log("User signed in:", user.email);

            // Truthy check for email verification
            if (user.emailVerified) {
                console.log("Email verified. Access granted.");
                // Proceed with your function here
                proceedWithFunction();
                
                // Unsubscribe from the listener
                if (unsubscribe) {
                    unsubscribe();
                    unsubscribe = null;
                    console.log("Email verification listener removed.");
                }

                // Hide modal if present
                if (isModalPresent) {
                    modalVerification.style.visibility = "hidden";
                    modalVerification.style.display = "none";
                }
            } else {
                console.log("Email not verified. Please verify your email.");
                // Show modal if present
                if (isModalPresent) {
                    modalVerification.style.visibility = "visible";
                    modalVerification.style.display = "block";
                }
            }
        } else {
            console.log("User not signed in. Access restricted.");
        }
    };

    // Initial check on page load
    const user = auth.currentUser; // Get the current user
    if (user) {
        checkUserVerification(user); // Truthy check to avoid unnecessary checks
    }

    // Set up listener for authentication state changes
    unsubscribe = auth.onAuthStateChanged((user) => {
        checkUserVerification(user);
    });
}

// Function to handle actions when the email is verified
function proceedWithFunction() {
    // Add your code here for what should happen if the email is verified
    console.log("Proceeding with the function after email verification.");
}

// Wait for the DOM to fully load before initializing the listener
document.addEventListener("DOMContentLoaded", () => {
    manageEmailVerification();
});




//============================/////============================///
// Handle sign-out
//============================/////============================///
function handleSignOut() {
    signOut(auth).then(() => {
        console.log('User signed out');
    }).catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
    });
}

//============================/////============================///
// Handle onboarding form submission
//============================/////============================///
function handleOnboardingSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    const uid = auth.currentUser.uid; // Get the current user's UID
    handleOnboarding(uid); // Call the onboarding function
}

//============================/////============================///
// Handle onboarding profile creation
//============================/////============================///
async function handleOnboarding(uid) {
    const name = document.getElementById('onboarding-name').value; // Add name input
    const pictureUrl = document.getElementById('onboarding-picture-url').value; // Add picture URL input
    const bio = document.getElementById('onboarding-bio').value; // Add bio input

    const userProfile = {
        name: name,
        email: auth.currentUser.email, // Get the email from the current user
        pictureUrl: pictureUrl,
        bio: bio,
        createdAt: new Date(),
    };

    try {
        // Save user profile in Firestore
        await setDoc(doc(firestore, "users", uid), userProfile);
        console.log("User profile created successfully!");
    } catch (error) {
        console.error("Error creating user profile:", error);
    }
}

//============================/////============================///
// Manage user authentication state
//============================/////============================///
onAuthStateChanged(auth, (user) => {
    let publicElements = document.querySelectorAll("[data-onlogin='hide']");
    let privateElements = document.querySelectorAll("[data-onlogin='show']");

    if (user) {
        const uid = user.uid;
        privateElements.forEach(function(element) {
            element.style.display = "initial";
        });
        publicElements.forEach(function(element) {
            element.style.display = "none";
        });
        console.log(`The current user's UID is equal to ${uid}`);
        checkEmailVerification(user); // Check email verification on state change
    } else {
        publicElements.forEach(function(element) {
            element.style.display = "initial";
        });
        privateElements.forEach(function(element) {
            element.style.display = "none";
        });
    }
});
