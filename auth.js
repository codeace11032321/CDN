<script>

//identify auth action forms
    let signUpForm = document.getElementById('wf-form-signup-form');
    let signInForm = document.getElementById('wf-form-signin-form');
    let signOutButton = document.getElementById('signout-button');
    
   
    //assign event listeners, if the elements exist
    if(typeof(signUpForm) !== null) {
      signUpForm.addEventListener('submit', handleSignUp, true)
      } else {  };
      
     if(typeof(signInForm) !== null) {
      signInForm.addEventListener('submit', handleSignIn, true)
      } else {};
      
      if(typeof signOutButton !== null) {
        signOutButton.addEventListener('click', handleSignOut);
           } else {}
    
    //handle signUp
    function handleSignUp(e) {
        e.preventDefault();
        e.stopPropagation();
        
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      
      console.log("email is " + email);
      console.log("password is " + password + ". Now sending to firebase.");
      
      createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log('user successfully created: ' + user.email)
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      var errorText = document.getElementById('signup-error-message');
      console.log(errorMessage);
      errorText.innerHTML = errorMessage;
      // ..
    });
  
    };
  
      //handle signIn
    
    function handleSignIn(e) {
        e.preventDefault();
        e.stopPropagation();
        
      const email = document.getElementById('signin-email').value;
      const password = document.getElementById('signin-password').value;
      
      signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log('user logged in: ' + user.email);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      var errorText = document.getElementById('signin-error-message');
      console.log(errorMessage);
      errorText.innerHTML = errorMessage;
      
    });
    }
    
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
</script>