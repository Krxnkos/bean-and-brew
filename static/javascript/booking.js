document.getElementById('bookingForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const messageElement = document.getElementById('bookingMessage');
    
    try {
        const response = await fetch('/booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                location: document.getElementById('location').value,
                date: document.getElementById('date').value,
                time: document.getElementById('time').value,
                guests: document.getElementById('guests').value
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Booking failed');
        }

        messageElement.textContent = 'Booking successful!';
        messageElement.style.color = 'green';
        messageElement.style.display = 'block';
        
        event.target.reset();
    } catch (error) {
        messageElement.textContent = error.message;
        messageElement.style.color = 'red';
        messageElement.style.display = 'block';
    }
});