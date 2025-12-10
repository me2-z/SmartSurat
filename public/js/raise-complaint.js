document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    const complaintForm = document.getElementById('complaintForm');
    
    // Check if user is logged in
    if (!user) {
        window.location.href = 'auth.html';
        return;
    }
    
    // Form submission
    if (complaintForm) {
        complaintForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(complaintForm);
            const complaintData = {
                title: formData.get('title'),
                description: formData.get('description'),
                userId: user.id
            };
            
            // Validation
            if (!complaintData.title || !complaintData.description) {
                alert('Please fill in all fields');
                return;
            }
            
            try {
                const response = await fetch('/api/complaints', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(complaintData)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    alert('Complaint submitted successfully!');
                    complaintForm.reset();
                    // Redirect to dashboard after 1 second
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    alert(result.error || 'Failed to submit complaint');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while submitting your complaint');
            }
        });
    }
});