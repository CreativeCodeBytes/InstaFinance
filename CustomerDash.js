// Sample user data (In real application, this would come from a backend)
const validUser = {
    username: "vikas",
    password: "patil123",
    fullName: "Vikas Patil"
};

document.getElementById('customerLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple authentication
    if (username === validUser.username && password === validUser.password) {
        // Show dashboard and hide login form
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        
        // Set welcome message
        document.getElementById('welcomeMessage').innerHTML = `<i class="fas fa-user-circle me-2"></i>Welcome ${validUser.fullName}`;
    } else {
        alert('Invalid credentials. Please try again.');
    }
});

function logout() {
    // Hide dashboard and show login form
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    
    // Clear form fields
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function toggleNotifications() {
    const panel = document.getElementById('notificationPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function selectPaymentMethod(element) {
    // Remove selected class from all options
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    // Add selected class to clicked option
    element.classList.add('selected');
}

function processPayment() {
    // Simulate payment processing
    alert('Payment processed successfully!');
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
    modal.hide();
    // Update EMI status (in real application, this would be handled by backend)
    location.reload();
}

// Close notification panel when clicking outside
document.addEventListener('click', function(event) {
    const panel = document.getElementById('notificationPanel');
    const notificationBtn = event.target.closest('.notification-badge');
    
    if (!notificationBtn && panel.style.display === 'block') {
        panel.style.display = 'none';
    }
});