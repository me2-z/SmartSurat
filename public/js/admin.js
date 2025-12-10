document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    const complaintsTable = document.getElementById('complaintsTable');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Check if user is logged in and is admin
    if (!user || user.role !== 'admin') {
        window.location.href = 'auth.html';
        return;
    }
    
    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('user');
            window.location.href = 'auth.html';
        });
    }
    
    // Fetch and display all complaints
    async function fetchComplaints() {
        try {
            const response = await fetch('/api/complaints');
            const complaints = await response.json();
            
            if (complaints.length === 0) {
                complaintsTable.innerHTML = '<tr><td colspan="6" class="text-center py-10">No complaints found.</td></tr>';
                return;
            }
            
            complaintsTable.innerHTML = complaints.map(complaint => `
                <tr>
                    <td>${complaint.id}</td>
                    <td>${complaint.title}</td>
                    <td>${complaint.userName}</td>
                    <td>${new Date(complaint.createdAt).toLocaleDateString()}</td>
                    <td>
                        <select class="status-select" data-id="${complaint.id}" ${complaint.status === 'resolved' ? 'disabled' : ''}>
                            <option value="pending" ${complaint.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="in-progress" ${complaint.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                            <option value="resolved" ${complaint.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                        </select>
                    </td>
                    <td>${complaint.status === 'resolved' ? '✓' : ''}</td>
                </tr>
            `).join('');
            
            // Add event listeners to status selects
            document.querySelectorAll('.status-select').forEach(select => {
                select.addEventListener('change', updateComplaintStatus);
            });
        } catch (error) {
            console.error('Error fetching complaints:', error);
            complaintsTable.innerHTML = '<tr><td colspan="6" class="text-center py-10 text-danger">Failed to load complaints.</td></tr>';
        }
    }
    
    // Update complaint status
    async function updateComplaintStatus(e) {
        const complaintId = e.target.dataset.id;
        const newStatus = e.target.value;
        
        try {
            const response = await fetch(`/api/complaints/${complaintId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            
            if (response.ok) {
                // Refresh the list
                fetchComplaints();
            } else {
                alert('Failed to update status');
                // Revert the select
                e.target.value = e.target.dataset.previousValue || 'pending';
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('An error occurred while updating status');
            // Revert the select
            e.target.value = e.target.dataset.previousValue || 'pending';
        }
    }
    
    // Initial load
    fetchComplaints();
    
    // Auto-refresh every 30 seconds
    setInterval(fetchComplaints, 30000);
});