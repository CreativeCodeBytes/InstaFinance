document.addEventListener('DOMContentLoaded', function() {
    const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
    const periodButtons = document.querySelectorAll('.btn-group .btn');
    const tableBody = document.getElementById('tableBody');
    const logoutBtn = document.getElementById('logoutBtn');
    const homeBtn = document.getElementById('homeBtn');
    const emiForm = document.getElementById('emiForm');
    const dashboardContent = document.getElementById('dashboardContent');
    const formContent = document.getElementById('formContent');
    const penaltyContent = document.getElementById('penaltyContent');
    const totalEnquiriesContent = document.getElementById('totalEnquiriesContent');
    const downloadContent = document.getElementById('downloadContent');
    const notificationContent = document.getElementById('notificationContent');
    const superAdminTableBody = document.getElementById("superAdminTableBody");
    const superAdminPenaltyTable = document.getElementById("superAdminPenaltyTable");
    
    // Global variables
    let formData = [];
    let charts = {};
    let penaltyRules = [];
    let loanApplications = [];

    // Initialize charts object to store chart instances
    window.charts = {
        daily: null,
        weekly: null,
        monthly: null
    };

    // Load data from localStorage
    function loadPenaltyRules() {
        return JSON.parse(localStorage.getItem('penaltyRules')) || [];
    }

    function savePenaltyRules(penaltyRules) {
        localStorage.setItem('penaltyRules', JSON.stringify(penaltyRules));
    }

    function loadLoanApplications() {
        return JSON.parse(localStorage.getItem('loanApplications')) || [];
    }

    // Initialize data from localStorage
    penaltyRules = loadPenaltyRules();
    loanApplications = loadLoanApplications();

    // Sidebar navigation
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            if (this.dataset.section === 'dashboard') {
                showDashboard();
            } else if (this.dataset.section === 'form') {
                showForm();
            } else if (this.dataset.section === 'penalty') {
                showPenalty();
            } else if (this.dataset.section === 'totalEnquiries') {
                showTotalEnquiries();
            } else if (this.dataset.section === 'download') {
                showDownload();
            } else if (this.dataset.section === 'notification') {
                showNotificationSection();
            }
        });
    });

    // Period buttons (Daily, Weekly, Monthly)
    periodButtons.forEach(button => {
        button.addEventListener('click', function() {
            periodButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateTable(this.dataset.period);
        });
    });

    // Notification dropdown functionality
    const notificationDropdown = document.getElementById("notificationDropdown");
    const notificationList = document.getElementById("notificationList");
    const notificationItems = document.querySelectorAll(".notification-item");
    
    if (notificationDropdown) {
        notificationDropdown.addEventListener("click", function(event) {
            event.preventDefault();
            event.stopPropagation();
            notificationList.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", function(event) {
            if (!notificationDropdown.contains(event.target)) {
                notificationList.classList.remove('show');
            }
        });
        
        // Add click event to notification items
        notificationItems.forEach(item => {
            item.addEventListener("click", function() {
                // Navigate to Total Enquiries page
                showTotalEnquiries();
                // Hide the dropdown after clicking
                notificationList.classList.remove('show');
            });
        });
    }
    
    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                window.location.href = 'index.html';
            }
        });
    }

    // Home button
    if (homeBtn) {
        homeBtn.addEventListener('click', function() {
            showDashboard();
        });
    }

    // EMI Form submission
    if (emiForm) {
        emiForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const newData = {
                name: document.getElementById('name').value,
                amountSanctioned: document.getElementById('amount').value,
                dateOfSanctionedAmount: document.getElementById('sanctionDate').value,
                repaymentAmount: document.getElementById('repaymentAmount').value,
                repaymentDate: document.getElementById('repaymentDate').value,
                interest: document.getElementById('interest').value + '%',
                status: document.getElementById('status').value,
                emiSchedule: document.getElementById('emiSchedule').value
            };
            
            // Get existing EMI data or initialize empty array
            let emiData = JSON.parse(localStorage.getItem('emiData')) || [];
            
            // Add new data
            emiData.push(newData);
            
            // Save to localStorage
            localStorage.setItem('emiData', JSON.stringify(emiData));
            
            // Reset form
            this.reset();
            
            // Update UI
            showDashboard();
            updateSuperAdminTable();
            updateSuperAdminCharts();
            
            // Show success message (if you have a notification function)
            if (typeof showNotification === 'function') {
                showNotification('Form saved successfully!', 'success');
            } else {
                alert('Form saved successfully!');
            }
        });
    }

    // Show different sections
    function showDashboard() {
        dashboardContent.style.display = 'block';
        formContent.style.display = 'none';
        penaltyContent.style.display = 'none';
        totalEnquiriesContent.style.display = 'none';
        downloadContent.style.display = 'none';
        notificationContent.style.display = 'none';
        
        sidebarLinks.forEach(link => {
            if (link.dataset.section === 'dashboard') {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        updateSuperAdminTable();
        updateSuperAdminCharts();
    }

    function showForm() {
        dashboardContent.style.display = 'none';
        formContent.style.display = 'block';
        penaltyContent.style.display = 'none';
        totalEnquiriesContent.style.display = 'none';
        downloadContent.style.display = 'none';
        notificationContent.style.display = 'none';
    }

    function showPenalty() {
        dashboardContent.style.display = 'none';
        formContent.style.display = 'none';
        penaltyContent.style.display = 'block';
        totalEnquiriesContent.style.display = 'none';
        downloadContent.style.display = 'none';
        notificationContent.style.display = 'none';
        updateSuperAdminPenaltyTable();
    }

    function showTotalEnquiries() {
        dashboardContent.style.display = 'none';
        formContent.style.display = 'none';
        penaltyContent.style.display = 'none';
        totalEnquiriesContent.style.display = 'block';
        downloadContent.style.display = 'none';
        notificationContent.style.display = 'none';
        updateEnquiriesTable();
    }

    function showDownload() {
        dashboardContent.style.display = 'none';
        formContent.style.display = 'none';
        penaltyContent.style.display = 'none';
        totalEnquiriesContent.style.display = 'none';
        downloadContent.style.display = 'block';
        notificationContent.style.display = 'none';
        updateLoanDetailsTable();
    }

    function showNotificationSection() {
        dashboardContent.style.display = 'none';
        formContent.style.display = 'none';
        penaltyContent.style.display = 'none';
        totalEnquiriesContent.style.display = 'none';
        downloadContent.style.display = 'none';
        notificationContent.style.display = 'block';
    }

    // MAIN FUNCTION FOR PIE CHARTS - This is the key function we're updating
    function updateSuperAdminCharts() {
        const periods = ["daily", "weekly", "monthly"];
        const chartData = {
            daily: { EMIPending: 0, TotalAmountPaid: 0, EMIPaid: 0 },
            weekly: { EMIPending: 0, TotalAmountPaid: 0, EMIPaid: 0 },
            monthly: { EMIPending: 0, TotalAmountPaid: 0, EMIPaid: 0 },
        };
    
        // Get EMI data from localStorage
        const emiData = JSON.parse(localStorage.getItem("emiData")) || [];
    
        // Categorize EMI data by schedule (daily, weekly, monthly)
        emiData.forEach((item) => {
            const period = item.emiSchedule;
            if (chartData[period]) {
                if (item.status === "EMI Pending") {
                    chartData[period].EMIPending++;
                } else if (item.status === "EMI Paid") {
                    chartData[period].EMIPaid++;
                } else if (item.status === "Total Amount Paid") {
                    chartData[period].TotalAmountPaid++;
                }
            }
        });
    
        // Create or update charts for each period
        periods.forEach((period) => {
            const canvas = document.getElementById(`${period}SuperAdminChart`);
            if (!canvas) return;
    
            const ctx = canvas.getContext("2d");
    
            // Destroy existing chart if it exists
            if (window.charts[period]) {
                window.charts[period].destroy();
            }
    
            // Create new Pie Chart
            window.charts[period] = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: ["EMI Pending", "Total Amount Paid", "EMI Paid"],
                    datasets: [{
                        data: [
                            chartData[period].EMIPending, 
                            chartData[period].TotalAmountPaid, 
                            chartData[period].EMIPaid
                        ],
                        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = Math.round((value / total) * 100);
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        });
    }
    
    // Update Super Admin Table
    function updateSuperAdminTable() {
        if (!superAdminTableBody) return;
        
        const emiData = JSON.parse(localStorage.getItem("emiData")) || [];
        superAdminTableBody.innerHTML = "";

        if (emiData.length === 0) {
            superAdminTableBody.innerHTML = `<tr><td colspan="8" class="text-center">No EMI records found</td></tr>`;
            return;
        }

        emiData.forEach((item, index) => {
            if (!item.name || !item.amountSanctioned) return;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.amountSanctioned}</td>
                <td>${item.dateOfSanctionedAmount}</td>
                <td>${item.repaymentAmount}</td>
                <td>${item.repaymentDate}</td>
                <td>${item.interest || "N/A"}</td>
                <td>${item.status || "N/A"}</td>
                <td>
                    <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">Delete</button>
                </td>
            `;
            superAdminTableBody.appendChild(row);
        });

        // Attach Delete Button Functionality
        document.querySelectorAll(".delete-btn").forEach((button) => {
            button.addEventListener("click", function () {
                deleteEmiRecord(this.dataset.index);
            });
        });
    }

    // Delete EMI Record
    function deleteEmiRecord(index) {
        let emiData = JSON.parse(localStorage.getItem("emiData")) || [];
        if (confirm("Are you sure you want to delete this entry?")) {
            emiData.splice(index, 1);
            localStorage.setItem("emiData", JSON.stringify(emiData));
            
            // Update UI
            updateSuperAdminTable();
            updateSuperAdminCharts();
        }
    }

    // Update Penalty Rules Table
    function updateSuperAdminPenaltyTable() {
        if (!superAdminPenaltyTable) return;
        
        let penaltyRules = loadPenaltyRules();
        superAdminPenaltyTable.innerHTML = "";

        if (penaltyRules.length === 0) {
            superAdminPenaltyTable.innerHTML = "<tr><td colspan='7' style='text-align:center;'>No Penalty Rules Found</td></tr>";
            return;
        }

        penaltyRules.forEach((rule, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${rule.custName}</td>
                <td>${rule.ruleName}</td>
                <td>${rule.loanType}</td>
                <td>${rule.gracePeriod}</td>
                <td>${rule.penaltyRate}%</td>
                <td>₹${rule.maxPenalty}</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-rule" data-index="${index}">Delete</button>
                </td>
            `;
            superAdminPenaltyTable.appendChild(row);
        });

        document.querySelectorAll(".delete-rule").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.dataset.index;
                deletePenaltyRule(index);
            });
        });
    }

    // Delete Penalty Rule
    function deletePenaltyRule(index) {
        let penaltyRules = loadPenaltyRules();
        if (confirm("Are you sure you want to delete this rule?")) {
            penaltyRules.splice(index, 1);
            savePenaltyRules(penaltyRules);
            updateSuperAdminPenaltyTable();
        }
    }

    // Update Enquiries Table
    function updateEnquiriesTable() {
        const enquiriesTableBody = document.getElementById('enquiriesTableBody');
        if (!enquiriesTableBody) return;
        
        enquiriesTableBody.innerHTML = '';
        let loanApplications = JSON.parse(localStorage.getItem('loanApplications')) || [];
    
        loanApplications.forEach((application, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${application.name}</td>
                <td>${application.email}</td>
                <td>${application.phone}</td>
                <td>₹${application.loanAmount}</td>
                <td>${application.tenure} months</td>
                <td>${application.emiSchedule}</td>
                <td>${application.address}</td>
                <td>${application.state}</td>
                <td>${application.district}</td>
                <td>${application.town}</td>
                <td>${application.status}</td>
                <td>
                    <button class="btn btn-sm btn-primary view-application" data-index="${index}">View</button>
                    <button class="btn btn-sm btn-danger delete-application" data-index="${index}">Delete</button>
                    <button class="btn btn-sm btn-success approve-application" data-index="${index}">Approve</button>
                </td>
            `;
            enquiriesTableBody.appendChild(row);
        });
    
        // Add event listeners to buttons
        document.querySelectorAll('.view-application').forEach(btn => {
            btn.addEventListener('click', viewApplication);
        });
        document.querySelectorAll('.delete-application').forEach(btn => {
            btn.addEventListener('click', deleteApplication);
        });
        document.querySelectorAll('.approve-application').forEach(btn => {
            btn.addEventListener('click', approveApplication);
        });
    }

    // View Application Details
    function viewApplication(e) {
        const index = e.target.dataset.index;
        const application = JSON.parse(localStorage.getItem("loanApplications"))[index];
        
        // Create and show modal with application details
        // (Code for modal creation remains the same as in your original file)
    }
    
    // Delete Application
    function deleteApplication(e) {
        const index = e.target.dataset.index;
        if (confirm('Are you sure you want to delete this application?')) {
            let loanApplications = JSON.parse(localStorage.getItem('loanApplications'));
            loanApplications.splice(index, 1);
            localStorage.setItem('loanApplications', JSON.stringify(loanApplications));
            updateEnquiriesTable();
        }
    }

    // Approve Application
    function approveApplication(e) {
        const index = e.target.dataset.index;
        if (confirm('Are you sure you want to approve this application?')) {
            let loanApplications = JSON.parse(localStorage.getItem('loanApplications'));
            loanApplications[index].status = 'Approved';
            localStorage.setItem('loanApplications', JSON.stringify(loanApplications));
            updateEnquiriesTable();
        }
    }

    // Update Loan Details Table
    function updateLoanDetailsTable() {
        const loanDetailsTableBody = document.getElementById('loanDetailsTableBody');
        if (!loanDetailsTableBody) return;
        
        loanDetailsTableBody.innerHTML = '';
        const loanDetails = JSON.parse(localStorage.getItem('loanDetails')) || [];
    
        loanDetails.forEach(loan => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${loan.loanAccountNumber}</td>
                <td>${loan.name}</td>
                <td>${loan.sanctionDate}</td>
                <td>₹${loan.loanSanctionAmount}</td>
                <td>${loan.paymentDate}</td>
                <td class="loan-actions">
                    <button class="btn btn-sm btn-primary loan-view-btn" data-id="${loan.id}">View</button>
                    <button class="btn btn-sm btn-success loan-approve-btn" data-id="${loan.id}">Approve</button>
                    <button class="btn btn-sm btn-danger loan-send-btn" data-id="${loan.id}">Send</button>
                </td>
            `;
            loanDetailsTableBody.appendChild(row);
        });
    
        // Add event listeners for action buttons
        document.querySelectorAll('.loan-view-btn').forEach(btn => {
            btn.addEventListener('click', viewLoan);
        });
        document.querySelectorAll('.loan-approve-btn').forEach(btn => {
            btn.addEventListener('click', approveLoan);
        });
        document.querySelectorAll('.loan-send-btn').forEach(btn => {
            btn.addEventListener('click', sendLoanOptions);
        });
    }
    
    // Loan action functions
    function viewLoan(e) {
        const loanId = e.target.dataset.id;
        alert(`Viewing Loan Details for Account ID: ${loanId}`);
    }
    
    function approveLoan(e) {
        const loanId = e.target.dataset.id;
        alert(`Loan Approved for Account ID: ${loanId}`);
    }
    
    function sendLoanOptions(e) {
        const loanId = e.target.dataset.id;
        alert(`Sending Loan Options for Account ID: ${loanId}`);
    }

    // Listen for storage events to update charts and tables in real-time
    window.addEventListener("storage", function(event) {
        if (event.key === "emiData") {
            updateSuperAdminTable();
            updateSuperAdminCharts();
        } else if (event.key === "penaltyRules") {
            updateSuperAdminPenaltyTable();
        } else if (event.key === "loanApplications") {
            updateEnquiriesTable();
        } else if (event.key === "loanDetails") {
            updateLoanDetailsTable();
        }
    });

    // Initialize the dashboard view
    showDashboard();
    
    // Make sure charts are updated when the page loads
    updateSuperAdminCharts();
});