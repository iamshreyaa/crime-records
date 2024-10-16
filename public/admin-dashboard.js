// Fetch all crimes
async function fetchCrimes() {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/crimes/all-crimes', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const crimes = await response.json();
    const crimeList = document.getElementById('crimeList');

    crimeList.innerHTML = ''; // Clear the existing list

    crimes.forEach(crime => {
        const li = document.createElement('li');
        li.textContent = `ID: ${crime.crime_id}, Title: ${crime.title}, Description: ${crime.description}`;
        crimeList.appendChild(li);
    });
}

// Delete crime
document.getElementById('deleteCrimeButton').addEventListener('click', async () => {
    const crimeId = document.getElementById('deleteCrimeId').value;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:3000/api/crimes/delete-crime/${crimeId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert('Crime deleted successfully');
            fetchCrimes(); // Refresh the crime list
        } else {
            const data = await response.json();
            alert(data.error || 'Failed to delete crime!');
        }
    } catch (error) {
        console.error('Error deleting crime:', error);
        alert('Server error. Please try again later.');
    }
});

// Assign crime to officer
document.getElementById('assignCrimeButton').addEventListener('click', async () => {
    const crimeId = document.getElementById('assignCrimeId').value;
    const userId = document.getElementById('assignUserId').value;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('http://localhost:3000/api/crimes/assign-crime', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ crime_id: crimeId, user_id: userId })
        });

        if (response.ok) {
            alert('Crime assigned successfully');
            // Optionally refresh the list of crimes or assigned cases here
        } else {
            const data = await response.json();
            alert(data.error || 'Failed to assign crime!');
        }
    } catch (error) {
        console.error('Error assigning crime:', error);
        alert('Server error. Please try again later.');
    }
});

// Function to handle logout
document.getElementById('logoutButton').addEventListener('click', () => {
    // Clear the token from local storage
    localStorage.removeItem('token');
    // Redirect to the login page
    window.location.href = 'login.html'; // Update the URL to your actual login page
});

// Fetch crimes on page load
fetchCrimes();