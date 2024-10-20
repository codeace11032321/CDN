//============================/////============================/////============================///
//                                   auth version 9 by: marjooo
//  added : email verification, onboarding function, redirect user, gated content|re-structured
//  optimization: -- closed all the function if not used to avoid wasting bandwidth on the background 
//============================/////============================/////============================///
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
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
// Check and add event listeners if elements exist
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
    
    // Setup submit button listener for onboarding form
    document.addEventListener('DOMContentLoaded', function () {
        const submitButton = document.getElementById('onboarding-submit');
        if (submitButton) {
            submitButton.addEventListener('click', handleOnboardingSubmit);
        }
    });
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
        window.location.href = `/app/onboarding?authtoken=${userCredential.user.refreshToken}`;
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

//============================/////============================///
// add notificataion later!!

            if (!user.emailVerified) {
                console.log("Email not verified. Redirecting to email verification...");
                // Optionally show a message to the user
                return; // Prevent further execution
            }
            

            if (user.emailVerified) {
                console.log("Email verified. Access granted.");
                window.location.href = '/';
            } else {
                console.log("Email not verified.");
                const uid = user.uid;

                // Retrieve user profile from Firestore to check if name exists
                getDoc(doc(firestore, "users", uid)).then((docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const userProfile = docSnapshot.data();
                        if (!userProfile.name) {
                            window.location.href = '/app/onboarding'; // Redirect to onboarding if name is not set
                        } else {
                            window.location.href = '/app/verification'; // Redirect to verification if name exists
                        }
                    } else {
                        // If the user profile doesn't exist, redirect to onboarding
                        window.location.href = '/app/onboarding';
                    }
                });
            }

            // This part may be redundant due to the previous logic
            if (currentPath !== '/app/verification') {
                window.location.href = '/app/verification';
            } else {
                console.log("Modal not available. Skipping email verification UI.");
            }
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

//future update!! : add a notification when the email is verified
//============================/////============================///
function checkEmailVerification(user) {
    const modalVerification = document.getElementById("email-verification-modal");

    // Function to check the email verification status
    function checkVerification() {
        if (modalVerification) {
            if (!user.emailVerified) {
                console.log("Email not verified. Please verify your email.");
                modalVerification.style.visibility = "visible";
                modalVerification.style.display = "block";
            } else {
                modalVerification.style.visibility = "hidden";
                modalVerification.style.display = "none"; 
                console.log("Email verified. Access granted.");
                unsubscribe(); // Stop listening when verified
            }
        }
    }

    // Listener function
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
            // Reload user data to get the updated email verification status
            await currentUser.reload();
            checkVerification();
        }
    });

    // Initial check
    checkVerification(user);
}



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
async function handleOnboardingSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    // Parse the URL for the auth token
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('authtoken');

    if (!authToken) {
        console.error("No auth token found in the URL.");
        return; // Prevent further execution
    }

    const uid = auth.currentUser?.uid; // Avoid errors
    if (uid) {
        await handleOnboarding(uid); // Call the onboarding function
    } else {
        console.error("User is not authenticated");
    }
}





//============================/////============================///
// Handle onboarding profile creation
//============================/////============================///
async function handleOnboarding(uid) {
    const name = document.getElementById('onboarding-name').value;
    const pictureUrlInput = document.getElementById('onboarding-picture-url');
    const bio = document.getElementById('onboarding-bio').value;

    const docSnapshot = await getDoc(doc(firestore, "users", uid));

    let pictureUrl = "";

    if (docSnapshot.exists()) {
        const userProfile = docSnapshot.data();
        pictureUrl = userProfile.profilePicUrl;

        // Redirect to home if userProfile is present
        window.location.href = "/";
        return;
    }

    console.log("Please complete the onboarding process");

    if (!pictureUrl) {
        pictureUrl = pictureUrlInput.value;
    }

    const userProfile = {
        name: name,
        email: auth.currentUser.email,
        pictureUrl: pictureUrl,
        bio: bio,
        createdAt: new Date(),
    };

    try {
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
        
        // Check email verification
        checkEmailVerification(user);
    } else {
        publicElements.forEach(function(element) {
            element.style.display = "initial";
        });
        privateElements.forEach(function(element) {
            element.style.display = "none";
        });
    }
});
