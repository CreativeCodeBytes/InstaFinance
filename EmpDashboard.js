

document.addEventListener("DOMContentLoaded", () => {
  const sidebarLinks = document.querySelectorAll(".sidebar .nav-link")
  const periodButtons = document.querySelectorAll(".btn-group .btn")
  const tableBody = document.getElementById("tableBody")
  const logoutBtn = document.getElementById("logoutBtn")
  const homeBtn = document.getElementById("homeBtn")
  const emiForm = document.getElementById("emiForm")
  const dashboardContent = document.getElementById("dashboardContent")
  const formContent = document.getElementById("formContent")
  const penaltyContent = document.getElementById("penaltyContent")
  const totalEnquiriesContent = document.getElementById("totalEnquiriesContent")
  const enquiriesTableBody = document.getElementById("enquiriesTableBody")
  const penaltyRuleForm = document.getElementById("penaltyRuleForm")
  const penaltyRulesTable = document.getElementById("penaltyRulesTable").querySelector("tbody")
  const downloadBtn = document.getElementById("download")
  const whatsAppBtn = document.getElementById("whatsApp")
  const notificationContent = document.getElementById("notificationContent")
  const notificationForm = document.getElementById("notificationForm")
  const saveTemplateBtn = document.getElementById("saveTemplateBtn")
  const downloadContent = document.getElementById("downloadContent")
  const sanctionLetterForm = document.getElementById('sanctionLetterForm')

  const charts = {}
  const penaltyRules = []
  let sanctionLetters = []

  // Load existing sanction letters
  const savedLetters = localStorage.getItem('sanctionLetters');
  if (savedLetters) {
      sanctionLetters = JSON.parse(savedLetters);
      updateSanctionLettersTable();
  }

  // Sanction Letter Form Handler
  if (sanctionLetterForm) {
      sanctionLetterForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          const formData = {
              loanAccNo: document.getElementById('loanAccNo').value,
              applicantName: document.getElementById('applicantName').value,
              sanctionDate: document.getElementById('sanctionDate').value,
              loanAmount: document.getElementById('loanAmount').value,
              emiAmount: document.getElementById('emiAmount').value,
              loanType: document.getElementById('loanType').value,
              tenure: document.getElementById('tenure').value,
              interestRate: document.getElementById('interestRate').value
          };
          
          sanctionLetters.push(formData);
          localStorage.setItem('sanctionLetters', JSON.stringify(sanctionLetters));
          updateSanctionLettersTable();
          this.reset();
          alert('Sanction Letter generated successfully!');
      });
  }

  // Sanction Letter Functions
  function updateSanctionLettersTable() {
      const tableBody = document.getElementById('sanctionLettersTable');
      if (!tableBody) return;
      
      tableBody.innerHTML = '';
      
      sanctionLetters.forEach((letter, index) => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${index + 1}</td>
              <td>${letter.loanAccNo}</td>
              <td>${letter.applicantName}</td>
              <td>₹${Number(letter.loanAmount).toLocaleString('en-IN')}</td>
              <td>${new Date(letter.sanctionDate).toLocaleDateString('en-IN')}</td>
              <td>
                  <button class="btn btn-info btn-sm view-letter" data-index="${index}">View</button>
                  <button class="btn btn-primary btn-sm download-letter" data-index="${index}">Download</button>
                  <button class="btn btn-success btn-sm send-letter" data-index="${index}">Send</button>
              </td>
          `;
          tableBody.appendChild(row);
      });

      // Add event listeners to buttons
      document.querySelectorAll('.view-letter').forEach(btn => {
          btn.addEventListener('click', viewSanctionLetter);
      });
      
      document.querySelectorAll('.download-letter').forEach(btn => {
          btn.addEventListener('click', downloadSanctionLetter);
      });
      
      document.querySelectorAll('.send-letter').forEach(btn => {
          btn.addEventListener('click', sendSanctionLetter);
      });
  }

  function viewSanctionLetter(e) {
      const index = e.target.dataset.index;
      const letter = sanctionLetters[index];
      showLetterPreview(letter);
  }

  function showLetterPreview(data) {
      const modal = new bootstrap.Modal(document.getElementById('letterPreviewModal'));
      const modalBody = document.querySelector('#letterPreviewModal .modal-body');
      
      modalBody.innerHTML = generateLetterHTML(data);
      modal.show();
  }

  function generateLetterHTML(data) {
      return `
          <div class="letter-content">
              <div class="text-center mb-4">
                  <h2>LOAN SANCTION LETTER</h2>
                  <h3>INSTA FINANCE</h3>
              </div>
              <div class="letter-body">
                  <table class="table table-bordered">
                      <tr>
                          <th>Loan Approved By</th>
                          <td>INSTA FINANCE</td>
                      </tr>
                      <tr>
                          <th>Loan Account Number</th>
                          <td>${data.loanAccNo}</td>
                      </tr>
                      <tr>
                          <th>Applicant Name</th>
                          <td>${data.applicantName}</td>
                      </tr>
                      <tr>
                          <th>Sanction Date</th>
                          <td>${new Date(data.sanctionDate).toLocaleDateString('en-IN')}</td>
                      </tr>
                      <tr>
                          <th>Loan Amount</th>
                          <td>₹${Number(data.loanAmount).toLocaleString('en-IN')}</td>
                      </tr>
                      <tr>
                          <th>EMI Amount</th>
                          <td>₹${Number(data.emiAmount).toLocaleString('en-IN')}/month</td>
                      </tr>
                      <tr>
                          <th>Loan Type</th>
                          <td>${data.loanType}</td>
                      </tr>
                      <tr>
                          <th>Tenure</th>
                          <td>${data.tenure} years</td>
                      </tr>
                      <tr>
                          <th>Interest Rate</th>
                          <td>${data.interestRate}% per annum</td>
                      </tr>
                  </table>
              </div>
          </div>
      `;
  }
  function downloadSanctionLetter(e) {
    try {
        const index = typeof e === 'object' ? e.target.dataset.index : e;
        const data = sanctionLetters[index];
        
        if (!data) {
            console.error('No data found for PDF generation');
            alert('Error: No data found for PDF generation');
            return;
        }

        // Initialize jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add header
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('LOAN SANCTION LETTER', 105, 20, { align: 'center' });

        // Add company details
        doc.setFontSize(16);
        doc.text('INSTA FINANCE', 105, 30, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('123 Finance Street, City - 400001', 105, 35, { align: 'center' });
        doc.text('Tel: +91 1234567890 | Email: contact@instafinance.com', 105, 40, { align: 'center' });

        // Add letter details
        doc.setFontSize(11);
        doc.text(`Date: ${new Date(data.sanctionDate).toLocaleDateString('en-IN')}`, 20, 50);
        doc.text(`Ref No: ${data.loanAccNo}`, 20, 55);

        // Add salutation
        doc.text('To,', 20, 65);
        doc.text(`${data.applicantName}`, 20, 70);

        // Add subject
        doc.setFont('helvetica', 'bold');
        doc.text('Subject: Sanction of Loan', 20, 80);
        doc.setFont('helvetica', 'normal');

        // Add letter body
        doc.text('Dear Sir/Madam,', 20, 90);
        doc.text('With reference to your loan application, we are pleased to inform you that your loan', 20, 100);
        doc.text('has been sanctioned with the following terms and conditions:', 20, 105);

        // Add loan details
        let yPos = 115;
        const details = [
            ['Loan Account Number', `: ${data.loanAccNo}`],
            ['Applicant Name', `: ${data.applicantName}`],
            ['Sanctioned Amount', `: ₹${Number(data.loanAmount).toLocaleString('en-IN')}`],
            ['Interest Rate', `: ${data.interestRate}% per annum`],
            ['Loan Tenure', `: ${data.tenure} years`],
            ['EMI Amount', `: ₹${Number(data.emiAmount).toLocaleString('en-IN')}/month`],
            ['Loan Type', `: ${data.loanType}`],
            ['Sanction Date', `: ${new Date(data.sanctionDate).toLocaleDateString('en-IN')}`]
        ];

        details.forEach(row => {
            doc.text(row[0], 20, yPos);
            doc.text(row[1], 80, yPos);
            yPos += 7;
        });

        // Add terms and conditions
        yPos += 10;
        doc.setFont('helvetica', 'bold');
        doc.text('Terms and Conditions:', 20, yPos);
        doc.setFont('helvetica', 'normal');
        yPos += 7;

        const terms = [
            '1. The loan amount will be disbursed after completion of all documentation.',
            '2. EMI will be deducted on the specified date of every month.',
            '3. Delay in EMI payment will attract penalty charges.',
            '4. Prepayment charges may apply as per bank norms.',
            '5. The bank reserves the right to recall the loan in case of default.'
        ];

        terms.forEach(term => {
            doc.text(term, 20, yPos);
            yPos += 7;
        });

        // Add signature
        yPos += 10;
        doc.text('For INSTA FINANCE', 20, yPos);
        yPos += 10;
        doc.text('Authorized Signatory', 20, yPos);

        // Add footer
        doc.setFontSize(8);
        doc.text('This is a computer generated document and does not require physical signature.', 105, 280, { align: 'center' });

        // Save the PDF
        doc.save(`Loan_Sanction_Letter_${data.loanAccNo}.pdf`);
        console.log('PDF generated successfully');

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF: ' + error.message);
    }
}

// Also update the form submission handler to ensure data is properly captured
// Update the form submission handler
if (document.getElementById('sanctionLetterForm')) {
  document.getElementById('sanctionLetterForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      try {
          const formData = {
              loanAccNo: document.getElementById('loanAccNo').value,
              applicantName: document.getElementById('applicantName').value,
              sanctionDate: document.getElementById('sanctionDate').value,
              loanAmount: document.getElementById('loanAmount').value,
              emiAmount: document.getElementById('emiAmount').value,
              loanType: document.getElementById('loanType').value,
              tenure: document.getElementById('tenure').value,
              interestRate: document.getElementById('interestRate').value
          };

          // Debug log
          console.log('Form Data:', formData);

          // Store in sanctionLetters array
          sanctionLetters.push(formData);
          
          // Save to localStorage
          localStorage.setItem('sanctionLetters', JSON.stringify(sanctionLetters));
          
          // Update table
          updateSanctionLettersTable();
          
          // Reset form
          this.reset();
          
          // Show success message
          alert('Sanction Letter generated successfully!');

      } catch (error) {
          console.error('Error in form submission:', error);
          alert('Error generating sanction letter: ' + error.message);
      }
  });
}

  function sendSanctionLetter(e) {
      const index = e.target.dataset.index;
      const letter = sanctionLetters[index];
      const message = encodeURIComponent(
          `Dear ${letter.applicantName},\n\nYour loan has been sanctioned. Amount: ₹${Number(letter.loanAmount).toLocaleString('en-IN')}\nLoan Account Number: ${letter.loanAccNo}\n\nRegards,\nInsta Finance`
      );
      window.open(`https://wa.me/?text=${message}`, '_blank');
  }

  // End of Sanction Letter Functions

  // Sidebar navigation
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      sidebarLinks.forEach((l) => l.classList.remove("active"))
      this.classList.add("active")

      if (this.dataset.section === "dashboard") {
        showDashboard()
      } else if (this.dataset.section === "form") {
        showForm()
      } else if (this.dataset.section === "penalty") {
        showPenalty()
      } else if (this.dataset.section === "totalEnquiries") {
        showTotalEnquiries()
      } else if (this.dataset.section === "download") {
        showDownload()
      } else if (this.dataset.section === "notification") {
        showNotificationSection()
      }
    })
  })

  // Period buttons (Daily, Weekly, Monthly)
  periodButtons.forEach((button) => {
    button.addEventListener("click", function () {
      periodButtons.forEach((b) => b.classList.remove("active"))
      this.classList.add("active")
      updateTable(this.dataset.period)
    })
  })

  // Logout button
  logoutBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to logout?")) {
      // Redirect to index.html
      window.location.href = "index.html"
    }
  })

  // Home button
  homeBtn.addEventListener("click", () => {
    showDashboard()
  })

  function showDashboard() {
    dashboardContent.style.display = "block"
    formContent.style.display = "none"
    penaltyContent.style.display = "none"
    totalEnquiriesContent.style.display = "none"
    downloadContent.style.display = "none"
    notificationContent.style.display = "none"
    sidebarLinks.forEach((link) => {
      if (link.dataset.section === "dashboard") {
        link.classList.add("active")
      } else {
        link.classList.remove("active")
      }
    })
    updateTable(document.querySelector(".btn-group .btn.active").dataset.period)
    updateCharts()
  }

  function showForm() {
    dashboardContent.style.display = "none"
    formContent.style.display = "block"
    penaltyContent.style.display = "none"
    totalEnquiriesContent.style.display = "none"
    downloadContent.style.display = "none"
    notificationContent.style.display = "none"
  }

  function showPenalty() {
    dashboardContent.style.display = "none"
    formContent.style.display = "none"
    penaltyContent.style.display = "block"
    totalEnquiriesContent.style.display = "none"
    downloadContent.style.display = "none"
    notificationContent.style.display = "none"
    updatePenaltyRulesTable()
  }

  function showTotalEnquiries() {
    dashboardContent.style.display = "none"
    formContent.style.display = "none"
    penaltyContent.style.display = "none"
    totalEnquiriesContent.style.display = "block"
    downloadContent.style.display = "none"
    notificationContent.style.display = "none"
    updateEnquiriesTable()
  }

  function showDownload() {
    dashboardContent.style.display = "none"
    formContent.style.display = "none"
    penaltyContent.style.display = "none"
    totalEnquiriesContent.style.display = "none"
    downloadContent.style.display = "block"
    notificationContent.style.display = "none"
  }

  function loadLoanApplications() {
    return JSON.parse(localStorage.getItem("loanApplications")) || []
  }

  // Add a new function to load EMI data separately
  function loadEmiData() {
    return JSON.parse(localStorage.getItem("emiData")) || []
  }

  function saveLoanApplications(data) {
    localStorage.setItem("loanApplications", JSON.stringify(data))
    window.dispatchEvent(new Event("storage"))
  }

  // Modify the save function to save EMI data separately
  function saveEmiData(emiData) {
    localStorage.setItem("emiData", JSON.stringify(emiData))
    window.dispatchEvent(new Event("storage")) // ✅ Sync Data with SuperAdmin
}

  // Update the updateTable function to use EMI data
  function updateTable() {
    const emiData = loadEmiData()
    tableBody.innerHTML = ""

    if (emiData.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" class="text-center">No data available</td></tr>`
      return
    }

    emiData.forEach((item, index) => {
      if (!item.name || !item.amountSanctioned || !item.dateOfSanctionedAmount) return

      const row = document.createElement("tr")
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
          `
      tableBody.appendChild(row)
    })

    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", function () {
        deleteEmiData(this.dataset.index)
      })
    })
  }

  // Update the delete function to use EMI data
  function deleteEmiData(index) {
    const emiData = loadEmiData()
    if (confirm("Are you sure you want to delete this entry?")) {
      emiData.splice(index, 1)
      saveEmiData(emiData)
      updateTable()
      updateCharts()
    }
  }

  // Update the updateCharts function to use EMI data
  function updateCharts() {
    const periods = ["daily", "weekly", "monthly"]
    const chartData = {
      daily: { EMIPending: 0, TotalAmountPaid: 0, EMIPaid: 0 },
      weekly: { EMIPending: 0, TotalAmountPaid: 0, EMIPaid: 0 },
      monthly: { EMIPending: 0, TotalAmountPaid: 0, EMIPaid: 0 },
    }

    const emiData = loadEmiData()

    emiData.forEach((item) => {
      const period = item.emiSchedule
      if (chartData[period]) {
        if (item.status === "EMI Pending") {
          chartData[period].EMIPending++
        } else if (item.status === "EMI Paid") {
          chartData[period].EMIPaid++
        } else if (item.status === "Total Amount Paid") {
          chartData[period].TotalAmountPaid++
        }
      }
    })

    periods.forEach((period) => {
      const canvas = document.getElementById(`${period}Chart`)
      if (!canvas) return

      const ctx = canvas.getContext("2d")

      if (charts[period]) {
        charts[period].destroy()
      }

      charts[period] = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["EMI Pending", "Total Amount Paid", "EMI Paid"],
          datasets: [
            {
              data: [chartData[period].EMIPending, chartData[period].TotalAmountPaid, chartData[period].EMIPaid],
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      })
    })
  }

  // Update the EMI form submission to save to EMI data
  emiForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const emiData = loadEmiData()

    const name = document.getElementById("name").value.trim()
    const amountSanctioned = document.getElementById("amount").value.trim()
    const dateOfSanctionedAmount = document.getElementById("sanctionDate").value.trim()
    const repaymentAmount = document.getElementById("repaymentAmount").value.trim()
    const repaymentDate = document.getElementById("repaymentDate").value.trim()
    const interest = document.getElementById("interest").value.trim()
    const status = document.getElementById("status").value.trim()
    const emiSchedule = document.getElementById("emiSchedule").value.trim()

    if (
      !name ||
      !amountSanctioned ||
      !dateOfSanctionedAmount ||
      !repaymentAmount ||
      !repaymentDate ||
      !interest ||
      !status ||
      !emiSchedule
    ) {
      alert("⚠️ Please fill in all required fields correctly!")
      return
    }

    const newData = {
      name,
      amountSanctioned,
      dateOfSanctionedAmount,
      repaymentAmount,
      repaymentDate,
      interest: interest + "%",
      status,
      emiSchedule,
    }

    emiData.push(newData)
    saveEmiData(emiData)
    
    updateTable()
    updateCharts()
    emiForm.reset()
    alert("✅ EMI form saved successfully!")
  })

  function deleteLoanApplication(index) {
    const loanApplications = loadLoanApplications()
    if (confirm("Are you sure you want to delete this entry?")) {
      loanApplications.splice(index, 1)
      saveLoanApplications(loanApplications)
      updateTable()
      updateCharts()
    }
  }

  updateTable()
  updateCharts()






  

  //penalty start
  let editIndex = null // Track the index of the rule being edited

  function loadPenaltyRules() {
    return JSON.parse(localStorage.getItem("penaltyRules")) || []
  }

  function savePenaltyRules(penaltyRules) {
    localStorage.setItem("penaltyRules", JSON.stringify(penaltyRules))
    window.dispatchEvent(new Event("storage")) // ✅ Sync Data with SuperAdmin
  }

  function updatePenaltyRulesTable() {
    const penaltyRules = loadPenaltyRules()
    penaltyRulesTable.innerHTML = ""

    penaltyRules.forEach((rule, index) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${rule.custName}</td>
                <td>${rule.ruleName}</td>
                <td>${rule.loanType}</td>
                <td>${rule.gracePeriod}</td>
                <td>${rule.penaltyRate}%</td>
                <td>₹${rule.maxPenalty}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-rule" data-index="${index}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-rule" data-index="${index}">Delete</button>
                </td>
            `
      penaltyRulesTable.appendChild(row)
    })

    // Add event listeners for edit & delete buttons
    document.querySelectorAll(".edit-rule").forEach((button) => {
      button.addEventListener("click", function () {
        const index = this.dataset.index
        editPenaltyRule(index)
      })
    })

    document.querySelectorAll(".delete-rule").forEach((button) => {
      button.addEventListener("click", function () {
        const index = this.dataset.index
        deletePenaltyRule(index)
      })
    })
  }

  function editPenaltyRule(index) {
    const penaltyRules = loadPenaltyRules()
    const rule = penaltyRules[index]

    document.getElementById("custName").value = rule.custName
    document.getElementById("ruleName").value = rule.ruleName
    document.getElementById("loanType").value = rule.loanType
    document.getElementById("gracePeriod").value = rule.gracePeriod
    document.getElementById("penaltyRate").value = rule.penaltyRate
    document.getElementById("maxPenalty").value = rule.maxPenalty

    editIndex = index
    document.getElementById("submitBtn").textContent = "Update Rule"
  }

  function deletePenaltyRule(index) {
    const penaltyRules = loadPenaltyRules()
    if (confirm("Are you sure you want to delete this rule?")) {
      penaltyRules.splice(index, 1)
      savePenaltyRules(penaltyRules)
      updatePenaltyRulesTable()
    }
  }

  penaltyRuleForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const penaltyRules = loadPenaltyRules()

    const newRule = {
      custName: document.getElementById("custName").value,
      ruleName: document.getElementById("ruleName").value,
      loanType: document.getElementById("loanType").value,
      gracePeriod: document.getElementById("gracePeriod").value,
      penaltyRate: document.getElementById("penaltyRate").value,
      maxPenalty: document.getElementById("maxPenalty").value,
    }

    if (editIndex !== null) {
      penaltyRules[editIndex] = newRule // Update existing rule
      editIndex = null
      document.getElementById("submitBtn").textContent = "Save Rule"
    } else {
      penaltyRules.push(newRule) // Add new rule
    }

    savePenaltyRules(penaltyRules)
    updatePenaltyRulesTable()
    penaltyRuleForm.reset()
  })

  window.addEventListener("storage", (event) => {
    if (event.key === "penaltyRules") {
      updatePenaltyRulesTable()
    }
  })

  updatePenaltyRulesTable()

  // Update the updateEnquiriesTable function to only show loan applications
  function updateEnquiriesTable() {
    const enquiriesTableBody = document.getElementById("enquiriesTableBody")
    enquiriesTableBody.innerHTML = ""
    const loanApplications = JSON.parse(localStorage.getItem("loanApplications")) || []

    if (loanApplications.length === 0) {
      enquiriesTableBody.innerHTML = `<tr><td colspan="12" class="text-center">No data available</td></tr>`
      return
    }

    loanApplications.forEach((application, index) => {
      const row = document.createElement("tr")
      row.innerHTML = `
              <td>${application.name || "N/A"}</td>
              <td>${application.email || "N/A"}</td>
              <td>${application.phone || "N/A"}</td>
              <td>₹${application.loanAmount || "N/A"}</td>
              <td>${application.tenure || "N/A"} months</td>
              <td>${application.emiSchedule || "N/A"}</td>
              <td>${application.address || "N/A"}</td>
              <td>${application.state || "N/A"}</td>
              <td>${application.district || "N/A"}</td>
              <td>${application.town || "N/A"}</td>
              <td>${application.status || "Pending"}</td>
              <td>
                  <button class="btn btn-sm btn-primary view-application" data-index="${index}">View</button>
                  <button class="btn btn-sm btn-danger delete-application" data-index="${index}">Delete</button>
                  <button class="btn btn-sm btn-success approve-application" data-index="${index}">Approve</button>
              </td>
          `
      enquiriesTableBody.appendChild(row)
    })

    // Add event listeners to buttons
    document.querySelectorAll(".view-application").forEach((btn) => {
      btn.addEventListener("click", viewApplication)
    })
    document.querySelectorAll(".delete-application").forEach((btn) => {
      btn.addEventListener("click", deleteApplication)
    })
    document.querySelectorAll(".approve-application").forEach((btn) => {
      btn.addEventListener("click", approveApplication)
    })
  }

  function viewApplication(e) {
    const index = e.target.dataset.index
    const application = JSON.parse(localStorage.getItem("loanApplications"))[index]

    // Create a more flexible modal that works with both data structures
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
                                    <p><strong>Name:</strong> ${application.name || "N/A"}</p>
                                    <p><strong>Email:</strong> ${application.email || "N/A"}</p>
                                    <p><strong>Phone:</strong> ${application.phone || "N/A"}</p>
                                </div>
                                
                                <!-- Loan Details -->
                                <div class="col-md-6">
                                    <h6 class="text-success">Loan Information</h6>
                                    <p><strong>Loan Amount:</strong> ₹${application.loanAmount || application.amountSanctioned || "N/A"}</p>
                                    <p><strong>Loan Tenure:</strong> ${application.tenure || "12"} months</p>
                                    <p><strong>EMI Schedule:</strong> ${application.emiSchedule || "N/A"}</p>
                                    <p><strong>Status:</strong> <span class="badge bg-${application.status === "Approved" ? "success" : "warning"}">${application.status || "Pending"}</span></p>
                                    ${application.repaymentAmount ? `<p><strong>Repayment Amount:</strong> ₹${application.repaymentAmount}</p>` : ""}
                                    ${application.repaymentDate ? `<p><strong>Repayment Date:</strong> ${application.repaymentDate}</p>` : ""}
                                    ${application.interest ? `<p><strong>Interest:</strong> ${application.interest}</p>` : ""}
                                </div>

                                <!-- Address Details (if available) -->
                                ${
                                  application.address
                                    ? `
                                <div class="col-md-12">
                                    <h6 class="text-primary">Address Details</h6>
                                    <p><strong>Address:</strong> ${application.address || "N/A"}</p>
                                    <p><strong>State:</strong> ${application.state || "N/A"}</p>
                                    <p><strong>District:</strong> ${application.district || "N/A"}</p>
                                    <p><strong>Town:</strong> ${application.town || "N/A"}</p>
                                </div>
                                `
                                    : ""
                                }
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

  function deleteApplication(e) {
    const index = e.target.dataset.index
    if (confirm("Are you sure you want to delete this application?")) {
      const loanApplications = JSON.parse(localStorage.getItem("loanApplications"))
      loanApplications.splice(index, 1)
      localStorage.setItem("loanApplications", JSON.stringify(loanApplications))
      updateEnquiriesTable()
    }
  }

  function approveApplication(e) {
    const index = e.target.dataset.index
    if (confirm("Are you sure you want to approve this application?")) {
      const loanApplications = JSON.parse(localStorage.getItem("loanApplications"))
      loanApplications[index].status = "Approved"
      localStorage.setItem("loanApplications", JSON.stringify(loanApplications))
      updateEnquiriesTable()
    }
  }

  // Download button functionality
  // downloadBtn.addEventListener("click", () => {
  //   // Create a new jsPDF instance
  //   const { jsPDF } = window.jspdf
  //   const doc = new jsPDF()

  //   // Add company logo
  //   const logoImg = new Image()
  //   logoImg.src = "Logo.png" // Replace with the actual path to your logo
  //   doc.addImage(logoImg, "PNG", 10, 10, 30, 30)

  //   // Add company name
  //   doc.setFontSize(30)
  //   doc.setFont("helvetica", "bold")
  //   doc.text("Insta Finance", 70, 25)

  //   // Get the content of the loan sanction letter
  //   const loanSanctionContent = document.getElementById("loanSanction")

  //   // Set font size and type
  //   doc.setFontSize(12)
  //   doc.setFont("helvetica", "normal")

  //   // Split the content into lines that fit within the PDF width
  //   const lines = doc.splitTextToSize(loanSanctionContent.innerText, 180)

  //   // Add content to PDF
  //   let yPos = 110
  //   lines.forEach((term) => {
  //     const lines = doc.splitTextToSize(term, 180)
  //     lines.forEach((line) => {
  //       if (yPos > 280) {
  //         doc.addPage()
  //         yPos = 20
  //       }
  //       doc.text(line, 14, yPos)
  //       yPos += 5
  //     })
  //     yPos += 5
  //   })

  //   // Save the PDF
  //   doc.save("loan_sanction_letter.pdf")
  // })

  // WhatsApp button functionality
  whatsAppBtn.addEventListener("click", () => {
    const message = encodeURIComponent(
      "Your loan has been sanctioned. Please check the attached loan sanction letter for details.",
    )
    const whatsappUrl = `https://wa.me/?text=${message}`
    window.open(whatsappUrl, "_blank")
  })

  function showNotificationSection() {
    dashboardContent.style.display = "none"
    formContent.style.display = "none"
    penaltyContent.style.display = "none"
    totalEnquiriesContent.style.display = "none"
    downloadContent.style.display = "none"
    notificationContent.style.display = "block"
  }

  // Notification form submission
  saveTemplateBtn.addEventListener("click", () => {
    const employeeName = document.getElementById("employeeName").value
    const templateType = document.getElementById("templateType").value
    const templateContent = document.getElementById("templateContent").value

    if (employeeName && templateType && templateContent) {
      // Here you would typically send this data to a server
      // For this example, we'll just show a success message
      showNotification("Notification saved and sent successfully!", "success")
      notificationForm.reset()
    } else {
      showNotification("Please fill in all fields", "error")
    }
  })

  // Function to show notification
  function showNotification(message, type) {
    alert(message)
  }

  // Initialize the dashboard view
  showDashboard()
})

