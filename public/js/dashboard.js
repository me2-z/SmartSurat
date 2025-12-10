document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    const userInfo = document.getElementById('userInfo');
    const complaintsContainer = document.getElementById('complaintsContainer');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Check if user is logged in
    if (!user) {
        window.location.href = 'auth.html';
        return;
    }
    
    // Display user info
    if (userInfo) {
        userInfo.textContent = user.name;
    }
    
    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('user');
            window.location.href = 'auth.html';
        });
    }
    
    // Fetch and display complaints
    async function fetchComplaints() {
        try {
            const response = await fetch(`/api/complaints/user/${user.id}`);
            const complaints = await response.json();
            
            if (complaints.length === 0) {
                complaintsContainer.innerHTML = '<p class="text-center py-10">No complaints found. <a href="raise-complaint.html" class="text-accent hover:underline">Raise a new complaint</a></p>';
                return;
            }
            
            complaintsContainer.innerHTML = complaints.map(complaint => `
                <div class="complaint-card fade-in">
                    <h3 class="complaint-title">${complaint.title}</h3>
                    <p class="complaint-desc">${complaint.description}</p>
                    <div class="complaint-meta">
                        <span>${new Date(complaint.createdAt).toLocaleDateString()}</span>
                        <span class="status-badge status-${complaint.status}">${complaint.status}</span>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error fetching complaints:', error);
            complaintsContainer.innerHTML = '<p class="text-center py-10 text-danger">Failed to load complaints. Please try again later.</p>';
        }
    }
    
    // Initial load
    fetchComplaints();
    
    // Auto-refresh every 30 seconds
    setInterval(fetchComplaints, 30000);
});