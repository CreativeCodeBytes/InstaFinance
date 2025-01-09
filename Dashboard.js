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
    const enquiriesTableBody = document.getElementById('enquiriesTableBody');
    const penaltyRuleForm = document.getElementById('penaltyRuleForm');
    const penaltyRulesTable = document.getElementById('penaltyRulesTable').querySelector('tbody');
    const downloadBtn = document.getElementById('download');
    const whatsAppBtn = document.getElementById('whatsApp');
    const notificationContent = document.getElementById('notificationContent');
    const notificationForm = document.getElementById('notificationForm');
    const saveTemplateBtn = document.getElementById('saveTemplateBtn');
 
    let formData = [];
    let charts = {};
    let penaltyRules = [];
    let loanApplications = [];

    function loadLoanApplications() {
        return JSON.parse(localStorage.getItem('loanApplications')) || [];
    }

    // Load loan applications from localStorage
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
                showNotification();
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

    // Logout button
    logoutBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            // Redirect to index.html
            window.location.href = 'index.html';
        }
    });

    // Home button
    homeBtn.addEventListener('click', function() {
        showDashboard();
    });

    // Form submission
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
        formData.push(newData);
        this.reset();
        
        showDashboard();
        updateTable(document.querySelector('.btn-group .btn.active').dataset.period);
        updateCharts();
        showNotification('Form Saved successfully!');
    });

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
        updateTable(document.querySelector('.btn-group .btn.active').dataset.period);
        updateCharts();
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
        updatePenaltyRulesTable();
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
    }

    function updateTable(period) {
        tableBody.innerHTML = '';
        const filteredData = formData.filter(item => item.emiSchedule === period);

        filteredData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.amountSanctioned}</td>
                <td>${item.dateOfSanctionedAmount}</td>
                <td>${item.repaymentAmount}</td>
                <td>${item.repaymentDate}</td>
                <td>${item.interest}</td>
                <td>${item.status}</td>
                <td><button class="btn btn-sm btn-primary view-btn">View</button></td>
            `;
            tableBody.appendChild(row);
        });

        if (filteredData.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="8" class="text-center">No data available for ${period} schedule</td>
            `;
            tableBody.appendChild(row);
        }

        // Add event listeners to view buttons
        document.querySelectorAll('.view-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                showItemDetails(filteredData[index]);
            });
        });
    }

    function showItemDetails(item) {
        alert(`
            Name: ${item.name}
            Amount Sanctioned: ${item.amountSanctioned}
            Date of Sanctioned Amount: ${item.dateOfSanctionedAmount}
            Repayment Amount: ${item.repaymentAmount}
            Repayment Date: ${item.repaymentDate}
            Interest: ${item.interest}
            Status: ${item.status}
        `);
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #4CAF50;
            color: white;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            z-index: 1000;
        `;
        
        if (type === 'success') {
            notification.style.backgroundColor = '#4CAF50';
            notification.style.color = 'white';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#f44336';
            notification.style.color = 'white';
        }

        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function updateCharts() {
        const periods = ['daily', 'weekly', 'monthly'];
        const chartData = {
            daily: { EMIPending: 0, totalamountpaid: 0, paid: 0 },
            weekly: { EMIPending: 0, totalamountpaid: 0, paid: 0 },
            monthly: { EMIPending: 0, totalamountpaid: 0, paid: 0 }
        };

        formData.forEach(item => {
            const period = item.emiSchedule;
            if (item.status === 'EMI Pending') {
                chartData[period].EMIPending++;
            } else if (item.status === 'EMI Paid') {
                chartData[period].paid++;
            } else if (item.status === 'Total Amount Paid') {
                chartData[period].totalamountpaid++;
            }
        });

        periods.forEach(period => {
            const ctx = document.getElementById(`${period}Chart`).getContext('2d');
            if (charts[period]) {
                charts[period].destroy();
            }
            charts[period] = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['EMI Pending', 'Total Amount Paid', 'EMI Paid'],
                    datasets: [{
                        data: [chartData[period].EMIPending, chartData[period].totalamountpaid, chartData[period].paid],
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        });
    }

    penaltyRuleForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(penaltyRuleForm);
        const newRule = Object.fromEntries(formData.entries());
        newRule.id = Date.now(); // Use timestamp as a simple unique ID
        penaltyRules.push(newRule);
        updatePenaltyRulesTable();
        penaltyRuleForm.reset();
        showNotification('Penalty rule saved successfully!');
    });

    function updatePenaltyRulesTable() {
        penaltyRulesTable.innerHTML = '';
        penaltyRules.forEach(rule => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${rule.custName}</td>
                <td>${rule.ruleName}</td>
                <td>${rule.loanType}</td>
                <td>${rule.gracePeriod}</td>
                <td>${rule.penaltyRate}%</td>
                <td>₹${rule.maxPenalty}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-primary edit-rule" data-id="${rule.id}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-rule" data-id="${rule.id}">Delete</button>
                </td>
            `;
            penaltyRulesTable.appendChild(row);
        });

        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-rule').forEach(btn => {
            btn.addEventListener('click', editRule);
        });
        document.querySelectorAll('.delete-rule').forEach(btn => {
            btn.addEventListener('click', deleteRule);
        });
    }

    function editRule(e) {
        const ruleId = e.target.dataset.id;
        const rule = penaltyRules.find(r => r.id == ruleId);
        if (rule) {
            document.getElementById('custName').value = rule.custName;
            document.getElementById('ruleName').value = rule.ruleName;
            document.getElementById('loanType').value = rule.loanType;
            document.getElementById('gracePeriod').value = rule.gracePeriod;
            document.getElementById('penaltyRate').value = rule.penaltyRate;
            document.getElementById('maxPenalty').value = rule.maxPenalty;
            penaltyRuleForm.dataset.editId = ruleId;
            document.getElementById('submitBtn').textContent = 'Update Rule';
        }
    }

    function deleteRule(e) {
        const ruleId = e.target.dataset.id;
        if (confirm('Are you sure you want to delete this rule?')) {
            penaltyRules = penaltyRules.filter(r => r.id != ruleId);
            updatePenaltyRulesTable();
            showNotification('Penalty rule deleted successfully!');
        }
    }

    function updateEnquiriesTable() {
        enquiriesTableBody.innerHTML = '';
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
                <td>${application.nationality}</td>
                <td>${application.state}</td>
                <td>${application.pan}</td>
                <td><button class="btn btn-sm btn-primary view-application" data-index="${index}">View</button></td>
                <td><button class="btn btn-sm btn-danger delete-application" data-index="${index}">Delete</button></td>
            `;
            enquiriesTableBody.appendChild(row);
        });
        

        // Add event listeners to view buttons
        document.querySelectorAll('.view-application').forEach(btn => {
            btn.addEventListener('click', viewApplication);
        });
        document.querySelectorAll('.delete-application').forEach(btn => {
            btn.addEventListener('click', deleteApplication);
        });
    }

    function viewApplication(e) {
        const index = e.target.dataset.index;
        const application = loanApplications[index];
        alert(`
            Name: ${application.name}
            Email: ${application.email}
            Phone: ${application.phone}
            Date of Birth: ${application.dob}
            Gender: ${application.gender}
            Address: ${application.address}
            PAN: ${application.pan}
            State: ${application.state}
            Nationality: ${application.nationality}
            Loan Amount: ₹${application.loanAmount}
            Loan Tenure: ${application.tenure} months
            EMI Schedule: ${application.emiSchedule}
        `);
    }

    function deleteApplication(e) {
        const index = e.target.dataset.index;
        if (confirm('Are you sure you want to delete this application?')) {
            loanApplications.splice(index, 1);
            updateEnquiriesTable();
            // Save updated loanApplications to localStorage
            localStorage.setItem('loanApplications', JSON.stringify(loanApplications));
            showNotification('Application deleted successfully!');
        }
    }

    // Download button functionality
    downloadBtn.addEventListener('click', function() {
        const loanSanctionContent = document.getElementById('loanSanction').innerHTML;
        const blob = new Blob([loanSanctionContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'loan_sanction_letter.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // WhatsApp button functionality
    whatsAppBtn.addEventListener('click', function() {
        const message = encodeURIComponent("Your loan has been sanctioned. Please check the attached loan sanction letter for details.");
        const whatsappUrl = `https://wa.me/?text=${message}`;
        window.open(whatsappUrl, '_blank');
    });

    function showNotification() {
        dashboardContent.style.display = 'none';
        formContent.style.display = 'none';
        penaltyContent.style.display = 'none';
        totalEnquiriesContent.style.display = 'none';
        downloadContent.style.display = 'none';
        notificationContent.style.display = 'block';
    }

    // Notification form submission
    saveTemplateBtn.addEventListener('click', function() {
        const employeeName = document.getElementById('employeeName').value;
        const templateType = document.getElementById('templateType').value;
        const templateContent = document.getElementById('templateContent').value;

        if (employeeName && templateType && templateContent) {
            // Here you would typically send this data to a server
            // For this example, we'll just show a success message
            alert('Notification  saved and sent successfully!');
            notificationForm.reset();
        } else {
            showNotification('Please fill in all fields', 'error');
        }
    });


    // Initialize the dashboard view
    showDashboard();
});