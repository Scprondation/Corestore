import { auth, provider } from './firebase.js';

// DOM elements
const authButton = document.getElementById('auth-button');
const logoutButton = document.getElementById('logout-btn');
const userInfoDiv = document.getElementById('user-info');
const adminSection = document.getElementById('admin-section');

// Check auth state
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in
        authButton.textContent = user.displayName;
        authButton.classList.add('user-authenticated');
        
        // Show user info in settings
        if (userInfoDiv) {
            userInfoDiv.innerHTML = `
                <img src="${user.photoURL}" alt="Profile Picture" class="user-avatar">
                <p>${user.displayName}</p>
                <p>${user.email}</p>
            `;
        }
        
        // Check if user is admin
        checkAdminStatus(user.uid);
        
        // Enable chat if on chat page
        if (document.getElementById('message-input')) {
            document.getElementById('message-input').disabled = false;
            document.getElementById('send-button').disabled = false;
        }
    } else {
        // User is signed out
        authButton.textContent = 'Sign In with Google';
        authButton.classList.remove('user-authenticated');
        
        if (userInfoDiv) {
            userInfoDiv.innerHTML = '<p>Not signed in</p>';
        }
        
        if (adminSection) {
            adminSection.classList.add('hidden');
        }
        
        // Disable chat if on chat page
        if (document.getElementById('message-input')) {
            document.getElementById('message-input').disabled = true;
            document.getElementById('send-button').disabled = true;
        }
    }
});

// Sign in with Google
if (authButton) {
    authButton.addEventListener('click', () => {
        if (authButton.classList.contains('user-authenticated')) {
            // User is already signed in, maybe show profile dropdown
            return;
        }
        
        auth.signInWithPopup(provider)
            .then(result => {
                // User signed in
                console.log('User signed in:', result.user);
            })
            .catch(error => {
                console.error('Sign in error:', error);
            });
    });
}

// Sign out
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        auth.signOut()
            .then(() => {
                console.log('User signed out');
            })
            .catch(error => {
                console.error('Sign out error:', error);
            });
    });
}

// Check if user is admin
function checkAdminStatus(userId) {
    const database = firebase.database();
    database.ref('admins/' + userId).once('value')
        .then(snapshot => {
            if (snapshot.exists() && snapshot.val().isAdmin) {
                if (adminSection) {
                    adminSection.classList.remove('hidden');
                }
            }
        })
        .catch(error => {
            console.error('Admin check error:', error);
        });
}