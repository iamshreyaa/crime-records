// // Register Form Submission
// document.getElementById('register-form')?.addEventListener('submit', async (event) => {
//     event.preventDefault();
    
//     const username = document.getElementById('username').value;
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     try {
//         const response = await fetch('/officers/register', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ username, email, password })
//         });

//         const data = await response.json();
//         alert(data.message || data.error);
//         if (response.ok) {
//             window.location.href = 'login.html'; // Redirect to login page
//         }
//     } catch (error) {
//         console.error('Registration error:', error);
//     }
// });

// // Login Form Submission
// document.getElementById('login-form')?.addEventListener('submit', async (event) => {
//     event.preventDefault();
    
//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;

//     try {
//         const response = await fetch('/officers/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ username, password })
//         });

//         const data = await response.json();
//         alert(data.message || data.error);
//         if (response.ok) {
//             // Store the token in localStorage or sessionStorage
//             localStorage.setItem('token', data.token);
//             window.location.href = '/dashboard.html'; // Change to your dashboard page
//         }
//     } catch (error) {
//         console.error('Login error:', error);
//     }
// });

// // Example of using the token in a protected route
// async function fetchProtectedData() {
//     const token = localStorage.getItem('token');

//     const response = await fetch('/officers/protected', {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${token}` // Send the token in the authorization header
//         }
//     });

//     const data = await response.json();
//     console.log(data);
// }

// // Call this function to test fetching protected data
// // fetchProtectedData();


// // Register Form Submission
// document.getElementById('registerForm')?.addEventListener('submit', async (event) => {
//     event.preventDefault();
    
//     const username = document.getElementById('regUsername').value; // Ensure ID matches your HTML
//     const email = document.getElementById('regEmail').value; // Ensure ID matches your HTML
//     const password = document.getElementById('regPassword').value; // Ensure ID matches your HTML
//     const role = document.getElementById('role').value; // Ensure ID matches your HTML

//     try {
//         const response = await fetch('http://localhost:3000/api/register', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ username, email, password, role })
//         });
    
//         // Check if response is OK (status in the range 200-299)
//         if (!response.ok) {
//             const errorData = await response.text(); // Get the response as text
//             throw new Error(errorData); // Throw an error with the response text
//         }
    
//         const data = await response.json();
//         alert(data.message || data.error);
//         if (response.ok) {
//             window.location.href = 'login.html';
//         }
//     } catch (error) {
//         console.error('Registration error:', error);
//         alert('Registration failed! Please try again.'); // Display error to user
//     }
    
// });

// // Login Form Submission
// document.getElementById('loginForm')?.addEventListener('submit', async (event) => {
//     event.preventDefault();
    
//     const username = document.getElementById('username').value; // Ensure ID matches your HTML
//     const password = document.getElementById('password').value; // Ensure ID matches your HTML

//     try {
//         const response = await fetch('http://localhost:3000/login', { // Use your API endpoint
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ username, password })
//         });

//         const data = await response.json();
//         alert(data.message || data.error); // Inform the user of success or failure
//         if (response.ok) {
//             localStorage.setItem('token', data.token); // Store the token in localStorage
//             window.location.href = 'index.html'; // Redirect to your dashboard or main page
//         }
//     } catch (error) {
//         console.error('Login error:', error);
//         alert('Login failed! Please check your credentials and try again.'); // Provide user feedback on error
//     }
// });

// // Example of using the token in a protected route
// async function fetchProtectedData() {
//     const token = localStorage.getItem('token');

//     const response = await fetch('http://localhost:3000/protected', { // Use your protected route
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${token}` // Send the token in the authorization header
//         }
//     });

//     const data = await response.json();
//     console.log(data);
// }

// // Call this function to test fetching protected data
// // fetchProtectedData();


// Select forms and error message elements from the HTML
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');


//login
document.getElementById('loginForm')?.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent page refresh
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        console.log('Server response:', data); // Check what the server returns

        if (response.ok) {
            console.log('Login successful. Token:', data.token, 'Role:', data.role);

            // Store token and redirect based on role
            localStorage.setItem('token', data.token);

            if (data.role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else if (data.role === 'officer') {
                window.location.href = 'officer-dashboard.html';
            } else {
                alert('Unauthorized role!'); // Handle unexpected roles
            }
        } else {
            loginError.textContent = data.error || 'Login failed!';
        }
    } catch (error) {
        console.error('Login error:', error); // Log errors to console
        loginError.textContent = 'Server error. Try again later.';
    }
});


// Handle Registration
registerForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('regUsername').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const role = document.getElementById('role').value;

  try {
    const res = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Registration successful!'); 
      window.location.href = 'login.html'; // Redirect to login page
    } else {
      registerError.textContent = data.error || 'Registration failed!'; // Display registration error
    }
  } catch (error) {
    console.error('Registration error:', error);
    registerError.textContent = 'Server error. Please try again later.';
  }
});

// Example of using token to fetch protected data
async function fetchProtectedData() {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch('http://localhost:3000/api/protected', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Send token in Authorization header
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Protected data:', data);
    } else {
      console.error('Failed to fetch protected data');
    }
  } catch (error) {
    console.error('Error fetching protected data:', error);
  }
}

// Uncomment the line below to test fetching protected data
// fetchProtectedData();
