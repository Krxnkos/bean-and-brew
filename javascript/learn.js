async function bookCourse(courseId, sessionIndex) {
    try {
        const response = await fetch(`/course/${courseId}/book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ sessionIndex })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to book course');
        }

        alert('Course booked successfully!');
        window.location.href = '/my-bookings';
    } catch (error) {
        console.error('Booking error:', error);
        alert(error.message || 'Error booking course. Please try again.');
    }
}

async function deleteCourse(courseId) {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
        const response = await fetch(`/course/${courseId}/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            window.location.reload();
        } else {
            const data = await response.json();
            alert(data.error || 'Failed to delete course');
        }
    } catch (error) {
        console.error('Delete error:', error);
        alert('Error deleting course');
    }
}

function toggleRecurring(select) {
    const recurringOptions = document.getElementById('recurringOptions');
    const numberOfSessionsInput = document.querySelector('input[name="numberOfSessions"]');
    const frequencySelect = document.querySelector('select[name="frequency"]');
    
    if (select.value === 'recurring') {
        recurringOptions.style.display = 'block';
        numberOfSessionsInput.disabled = false;
        numberOfSessionsInput.value = '2';
        frequencySelect.disabled = false;
    } else {
        recurringOptions.style.display = 'none';
        numberOfSessionsInput.disabled = true;
        numberOfSessionsInput.value = '1';
        frequencySelect.disabled = true;
    }
}

async function addSessions(event, courseId) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const sessionType = formData.get('sessionType');

    const sessionData = {
        startDate: formData.get('startDate'),
        time: formData.get('time'),
        numberOfSessions: sessionType === 'single' ? 1 : parseInt(formData.get('numberOfSessions')),
        frequency: sessionType === 'single' ? 0 : parseInt(formData.get('frequency'))
    };

    try {
        console.log('Sending session data:', sessionData);
        const response = await fetch(`/course/${courseId}/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(sessionData)
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to add sessions');
            } else {
                throw new Error('Server error: ' + response.status);
            }
        }

        window.location.reload();
    } catch (error) {
        console.error('Add sessions error:', error);
        alert(error.message);
    }
}