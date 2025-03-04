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
        showNotification('Form saved successfully!', 'success');
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
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        `;
        
        if (type === 'success') {
            notification.style.backgroundColor = '#4CAF50';
            notification.style.color = 'white';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#f44336';
            notification.style.color = 'white';
        }

        document.body.appendChild(notification);
        
        // Trigger reflow to ensure the transition works
        notification.offsetHeight;
        
        // Make the notification visible
        notification.style.opacity = '1';

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300); // Wait for the fade-out transition to complete
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
        showNotification('Penalty rule saved successfully!', 'success');
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
            showNotification('Penalty rule deleted successfully!', 'success');
        }
    }

    function updateEnquiriesTable() {
        const enquiriesTableBody = document.getElementById('enquiriesTableBody');
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

    // function viewApplication(e) {
    //     const index = e.target.dataset.index;
    //     const application = JSON.parse(localStorage.getItem('loanApplications'))[index];
        
    //     const modalContent = `
    //         <div class="modal fade" id="applicationModal" tabindex="-1" aria-hidden="true">
    //             <div class="modal-dialog modal-lg">
    //                 <div class="modal-content">
    //                     <div class="modal-header">
    //                         <h5 class="modal-title">Application Details</h5>
    //                         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    //                     </div>
    //                     <div class="modal-body">
    //                         <div class="row">
    //                             <div class="col-md-6">
    //                                 <p><strong>Name:</strong> ${application.name}</p>
    //                                 <p><strong>Email:</strong> ${application.email}</p>
    //                                 <p><strong>Phone:</strong> ${application.phone}</p>
    //                                 <p><strong>Date of Birth:</strong> ${application.dob}</p>
    //                                 <p><strong>Gender:</strong> ${application.gender}</p>
    //                                 <p><strong>Address:</strong> ${application.address}</p>
    //                                 <p><strong>PAN:</strong> ${application.pan}</p>
    //                                 <p><strong>Aadhar:</strong> ${application.aadhar}</p>
    //                             </div>
    //                             <div class="col-md-6">
    //                                 <p><strong>State:</strong> ${application.state}</p>
    //                                 <p><strong>District:</strong> ${application.district}</p>
    //                                 <p><strong>Town:</strong> ${application.town}</p>
    //                                 <p><strong>Loan Amount:</strong> ₹${application.loanAmount}</p>
    //                                 <p><strong>Loan Tenure:</strong> ${application.tenure} months</p>
    //                                 <p><strong>EMI Schedule:</strong> ${application.emiSchedule}</p>
    //                                 <p><strong>Status:</strong> ${application.status}</p>
    //                             </div>
    //                         </div>
    //                         <div class="row mt-3">
    //                             <div class="col-md-4">
    //                                 <h6>Photo</h6>
    //                                 <img src="${application.photoUpload}" alt="Photo" class="img-fluid">
    //                             </div>
    //                             <div class="col-md-4">
    //                                 <h6>Aadhar</h6>
    //                                 <img src="${application.aadharUpload}" alt="Aadhar" class="img-fluid">
    //                             </div>
    //                             <div class="col-md-4">
    //                                 <h6>PAN</h6>
    //                                 <img src="${application.panUpload}" alt="PAN" class="img-fluid">
    //                             </div>
    //                         </div>
    //                         <h5 style="text-center"> Guarentor Details </h5>
    //                         <div class="row">
    //                             <div class="col-md-6">
    //                                 <p><strong>Guarantor Name:</strong> ${application.refName1}</p>
    //                                 <p><strong>Guarantor Contact:</strong> ${application.refContact1}</p>
    //                                 <p><strong>Guarantor Address:</strong> ${application.guarantorAddress}</p>
    //                                 <p><strong>Guarantor Aadhar:</strong> ${application.guarantorAadhar}</p>
    //                                 <p><strong>Guarantor PAN:</strong> ${application.guarantorguarantorPan}</p>
    //                             </div>
    //                         <div class="row mt-3">
    //                             <div class="col-md-4">
    //                                 <h6>Photo</h6>
    //                                 <img src="${application.photoUpload2}" alt="Photo" class="img-fluid">
    //                             </div>
    //                             <div class="col-md-4">
    //                                 <h6>Aadhar</h6>
    //                                 <img src="${application.aadharUpload2}" alt="Aadhar" class="img-fluid">
    //                             </div>
    //                             <div class="col-md-4">
    //                                 <h6>PAN</h6>
    //                                 <img src="${application.panUpload2}" alt="PAN" class="img-fluid">
    //                             </div>
    //                             <div class="col-md-4">
    //                                 <h6>Income Proof</h6>
    //                                 <img src="${application.incomeProof}" alt="PAN" class="img-fluid">
    //                             </div>
    //                             <div class="col-md-4">
    //                                 <h6>Residential Proof Proof</h6>
    //                                 <img src="${application.residentialProof}" alt="PAN" class="img-fluid">
    //                             </div>
    //                             <h5> Applicant Signature </h5>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     `;

    //     document.body.insertAdjacentHTML('beforeend', modalContent);
    //     const modal = new bootstrap.Modal(document.getElementById('applicationModal'));
    //     modal.show();

    //     document.getElementById('applicationModal').addEventListener('hidden.bs.modal', function () {
    //         this.remove();
    //     });
    // }


    // just

    function viewApplication(e) {
        const index = e.target.dataset.index
        const application = JSON.parse(localStorage.getItem("loanApplications"))[index]
    
        const modalContent = `
            <div class="modal fade" id="applicationModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content shadow-lg">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">Application Details</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row g-3">
                                    <!-- Personal Details -->
                                    <div class="col-md-6">
                                        <h6 class="text-primary">Personal Details</h6>
                                        <p><strong>Name:</strong> ${application.name}</p>
                                        <p><strong>Email:</strong> ${application.email}</p>
                                        <p><strong>Phone:</strong> ${application.phone}</p>
                                        <p><strong>Date of Birth:</strong> ${application.dob}</p>
                                        <p><strong>Gender:</strong> ${application.gender}</p>
                                    </div>
                                    <div class="col-md-6">
                                        <h6 class="text-primary">Address & Documents</h6>
                                        <p><strong>Address Ownership:</strong> ${application.ownership}</p>
                                        <p><strong>Address:</strong> ${application.address}</p>
                                        <p><strong>PAN:</strong> ${application.pan}</p>
                                        <p><strong>Aadhar:</strong> ${application.aadhar}</p>
                                    </div>
                                    
                                    <!-- Loan Details -->
                                    <div class="col-md-12">
                                        <h6 class="text-success">Loan Information</h6>
                                        <p><strong>Loan Amount:</strong> ₹${application.loanAmount}</p>
                                        <p><strong>Loan Tenure:</strong> ${application.tenure} months</p>
                                        <p><strong>EMI Schedule:</strong> ${application.emiSchedule}</p>
                                        <p><strong>Status:</strong> <span class="badge bg-${application.status === "Approved" ? "success" : "danger"}">${application.status}</span></p>
                                    </div>
        
                                    <!-- Guarantor Details -->
                                    <div class="col-md-12">
                                        <h4 class="text-warning text-center">Guarantor Details</h4>
                                        <p><strong>Guarantor Name:</strong> ${application.refName1}</p>
                                        <p><strong>Contact:</strong> ${application.refContact1}</p>
                                        <p><strong>Address Ownership:</strong> ${application.gownership}</p>
                                        <p><strong>Address:</strong> ${application.guarantorAddress}</p>
                                        <p><strong>PAN:</strong> ${application.guarantorPan}</p>
                                        <p><strong>Aadhar:</strong> ${application.guarantorAadhar}</p>
                                    </div>
        
                                    <!-- Uploaded Documents -->
                                    <div class="col-md-12">
                                        <h4 class="text-info text-center">Uploaded Documents</h4>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <h6>Photo</h6>
                                                <img src="${application.photoUpload}" alt="Photo" class="img-fluid">
                                            </div>
                                            <div class="col-md-4">
                                                <h6>Aadhar</h6>
                                                <img src="${application.aadharUpload}" alt="Aadhar" class="img-fluid">
                                            </div>
                                            <div class="col-md-4">
                                                <h6>PAN</h6>
                                                <img src="${application.panUpload}" alt="PAN" class="img-fluid">
                                            </div>
                                        </div>
                                        <div class="row mt-3">
                                            <div class="col-md-6">
                                                <h6>Income Proof</h6>
                                                <img src="${application.incomeProof}" alt="Income Proof" class="img-fluid">
                                            </div>
                                            <div class="col-md-6">
                                                <h6>Residential Proof</h6>
                                                <img src="${application.residentialProof}" alt="Residential Proof" class="img-fluid">
                                            </div>
                                        </div>
                                    </div>
    
                                    <!-- Guarantor Documents -->
                                    <div class="col-md-12 mt-4">
                                        <h4 class="text-info text-center">Guarantor Documents</h4>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <h6>Photo</h6>
                                                <img src="${application.photoUpload2}" alt="Guarantor Photo" class="img-fluid">
                                            </div>
                                            <div class="col-md-4">
                                                <h6>Aadhar</h6>
                                                <img src="${application.aadharUpload2}" alt="Guarantor Aadhar" class="img-fluid">
                                            </div>
                                            <div class="col-md-4">
                                                <h6>PAN</h6>
                                                <img src="${application.panUpload2}" alt="Guarantor PAN" class="img-fluid">
                                            </div>
                                        </div>
                                        <div class="row mt-3">
                                            <div class="col-md-6">
                                                <h6>Income Proof</h6>
                                                <img src="${application.gincomeProof}" alt="Guarantor Income Proof" class="img-fluid">
                                            </div>
                                            <div class="col-md-6">
                                                <h6>Residential Proof</h6>
                                                <img src="${application.gresidentialProof}" alt="Guarantor Residential Proof" class="img-fluid">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    
        document.body.insertAdjacentHTML("beforeend", modalContent)
        const modal = new bootstrap.Modal(document.getElementById("applicationModal"))
        modal.show()
    
        document.getElementById("applicationModal").addEventListener("hidden.bs.modal", function () {
          this.remove()
        })
      }
    
    // Function to create clickable image section
    function generateImageSection(title, imgSrc) {
        return imgSrc ? `
            <div class="col-md-4">
                <h6>${title}</h6>
                <img src="${imgSrc}" alt="${title}" class="img-thumbnail" onclick="showImage('${imgSrc}')">
            </div>
        ` : '';
    }
    
    // Function to display images in full screen
    function showImage(src) {
        const imageModal = document.createElement('div');
        imageModal.innerHTML = `
            <div class="modal fade" id="imageModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body text-center">
                            <img src="${src}" class="img-fluid">
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(imageModal);
        const modal = new bootstrap.Modal(document.getElementById('imageModal'));
        modal.show();
    
        document.getElementById('imageModal').addEventListener('hidden.bs.modal', function () {
            this.remove();
        });
    }
    // just 

    function deleteApplication(e) {
        const index = e.target.dataset.index;
        if (confirm('Are you sure you want to delete this application?')) {
            let loanApplications = JSON.parse(localStorage.getItem('loanApplications'));
            loanApplications.splice(index, 1);
            localStorage.setItem('loanApplications', JSON.stringify(loanApplications));
            updateEnquiriesTable();
        }
    }

    function approveApplication(e) {
        const index = e.target.dataset.index;
        if (confirm('Are you sure you want to approve this application?')) {
            let loanApplications = JSON.parse(localStorage.getItem('loanApplications'));
            loanApplications[index].status = 'Approved';
            localStorage.setItem('loanApplications', JSON.stringify(loanApplications));
            updateEnquiriesTable();
        }
    }

    // Download button functionality
    downloadBtn.addEventListener('click', function() {
        // Create a new jsPDF instance
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add company logo
        const logoImg = new Image();
        logoImg.src = 'Logo.png'; // Replace with the actual path to your logo
        doc.addImage(logoImg, 'PNG', 10, 10, 30, 30);

    // Add company name
        doc.setFontSize(30);
        doc.setFont("helvetica", "bold");
        doc.text("Insta Finance", 70, 25);
    
        // Get the content of the loan sanction letter
        const loanSanctionContent = document.getElementById('loanSanction');
    
        // Set font size and type
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
    
        // Split the content into lines that fit within the PDF width
        const lines = doc.splitTextToSize(loanSanctionContent.innerText, 180);
    
        // Add content to PDF
        let yPos = 110;
    lines.forEach(term => {
        const lines = doc.splitTextToSize(term, 180);
        lines.forEach(line => {
            if (yPos > 280) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(line, 14, yPos);
            yPos += 5;
        });
        yPos += 5;
        });
    
        // Save the PDF
        doc.save('loan_sanction_letter.pdf');
    });

    // WhatsApp button functionality
    whatsAppBtn.addEventListener('click', function() {
        const message = encodeURIComponent("Your loan has been sanctioned. Please check the attached loan sanction letter for details.");
        const whatsappUrl = `https://wa.me/?text=${message}`;
        window.open(whatsappUrl, '_blank');
    });

    function showNotificationSection() {
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
            showNotification('Notification saved and sent successfully!', 'success');
            notificationForm.reset();
        } else {
            showNotification('Please fill in all fields', 'error');
        }
    });

    // Initialize the dashboard view
    showDashboard();
});