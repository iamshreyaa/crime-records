// Function to fetch assigned cases
async function fetchAssignedCases() {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/crimes/assigned-cases', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
        const cases = await response.json();
        const assignedCasesList = document.getElementById('assignedCasesList');
        assignedCasesList.innerHTML = ''; // Clear existing list

        cases.forEach(crime => {
            const li = document.createElement('li');
            li.textContent = `ID: ${crime.crime_id}, Title: ${crime.title}, Description: ${crime.description}, Location: ${crime.location}`;
            assignedCasesList.appendChild(li);
        });
    } else {
        console.error('Error fetching assigned cases:', response.statusText);
    }
}

// Function to add a new crime
document.getElementById('addCrimeButton').addEventListener('click', async () => {
    const title = document.getElementById('newCrimeTitle').value;
    const description = document.getElementById('newCrimeDescription').value;
    const location = document.getElementById('newCrimeLocation').value;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('http://localhost:3000/api/crimes/add-crime', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description, location })
        });

        if (response.ok) {
            alert('Crime added successfully!');
            // Clear the input fields
            document.getElementById('newCrimeTitle').value = '';
            document.getElementById('newCrimeDescription').value = '';
            document.getElementById('newCrimeLocation').value = '';
            fetchAssignedCases(); // Refresh the assigned cases
        } else {
            const data = await response.json();
            alert(data.error || 'Failed to add crime!');
        }
    } catch (error) {
        console.error('Error adding crime:', error);
        alert('Server error. Please try again later.');
    }
});

// Function to update an existing crime
document.getElementById('updateCrimeButton').addEventListener('click', async () => {
    const crimeId = document.getElementById('updateCrimeId').value;
    const title = document.getElementById('updateCrimeTitle').value;
    const description = document.getElementById('updateCrimeDescription').value;
    const location = document.getElementById('updateCrimeLocation').value;
    const token = localStorage.getItem('token');

    // Prepare the body to only include fields that are provided
    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (location) updateFields.location = location;

    try {
        const response = await fetch(`http://localhost:3000/api/crimes/update-crime/${crimeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateFields) // Send only the fields that are provided
        });

        const updateMessage = document.getElementById('updateMessage');
        if (response.ok) {
            updateMessage.textContent = 'Crime updated successfully!';
            updateMessage.style.color = 'green'; // Change text color to green
            // Clear the input fields
            document.getElementById('updateCrimeId').value = '';
            document.getElementById('updateCrimeTitle').value = '';
            document.getElementById('updateCrimeDescription').value = '';
            document.getElementById('updateCrimeLocation').value = '';
            fetchAssignedCases(); // Refresh the assigned cases
        } else {
            const data = await response.json();
            updateMessage.textContent = data.error || 'Failed to update crime!';
            updateMessage.style.color = 'red'; // Change text color to red
        }
    } catch (error) {
        console.error('Error updating crime:', error);
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

// Fetch assigned cases on page load
fetchAssignedCases();