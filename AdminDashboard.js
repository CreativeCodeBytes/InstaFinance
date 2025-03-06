// import { ChartStyle } from "@/components/ui/chart"
// import { ChartLegendContent } from "@/components/ui/chart"
// import { ChartLegend } from "@/components/ui/chart"
// import { ChartTooltipContent } from "@/components/ui/chart"
// import { ChartTooltip } from "@/components/ui/chart"
// import { ChartContainer } from "@/components/ui/chart"
// import { Chart } from "@/components/ui/chart"
// // import {
// Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle
// \
// } from "@/components/ui/chart"
document.addEventListener("DOMContentLoaded", () =>
{
  // DOM Elements
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
  const AdminPenaltyTable = document.getElementById("AdminPenaltyTable")
  const downloadContent = document.getElementById("downloadContent")
  const sanctionLettersTable = document.getElementById("sanctionLettersTable")

  // Global variables
  const formData = []
  // Store chart instances globally to be able to destroy them before recreating
  const chartInstances = {
    daily: null,
    weekly: null,
    monthly: null,
  }
  let loanApplications = []

  // Load loan applications from localStorage
  function loadLoanApplications() {
    return JSON.parse(localStorage.getItem("loanApplications")) || []
  }

  loanApplications = loadLoanApplications()

  // Check for changes in localStorage
  window.addEventListener("storage", (event) => {
    if (event.key === "penaltyRules") {
      updateAdminPenaltyTable()
    } else if (event.key === "adminSanctionData") {
      updateSanctionLettersTable()
    } else if (event.key === "loanApplications") {
      updateEnquiriesTable()
    } else if (event.key === "emiData") {
      updateTable(document.querySelector(".btn-group .btn.active").dataset.period)
      updateCharts()
    }
  })

  // Sidebar navigation
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      sidebarLinks.forEach((l) => l.classList.remove("active"))
      this.classList.add("active")

      const section = this.dataset.section
      if (section === "dashboard") {
        showDashboard()
      } else if (section === "form") {
        showForm()
      } else if (section === "penalty") {
        showPenalty()
      } else if (section === "totalEnquiries") {
        showTotalEnquiries()
      } else if (section === "download") {
        showDownload()
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

  // Notification dropdown functionality
  const notificationDropdown = document.getElementById("notificationDropdown")
  const notificationList = document.getElementById("notificationList")
  const notificationItems = document.querySelectorAll(".notification-item")

  if (notificationDropdown) {
    notificationDropdown.addEventListener("click", (event) => {
      event.preventDefault()
      event.stopPropagation()
      notificationList.classList.toggle("show")
    })

    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
      if (!notificationDropdown.contains(event.target)) {
        notificationList.classList.remove("show")
      }
    })

    // Add click event to notification items
    notificationItems.forEach((item) => {
      item.addEventListener("click", () => {
        // Navigate to Total Enquiries page
        showTotalEnquiries()
        // Hide the dropdown after clicking
        notificationList.classList.remove("show")
      })
    })
  }

  // Logout button
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to logout?")) {
        window.location.href = "index.html"
      }
    })
  }

  // Home button
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      showDashboard()
    })
  }

  // Form submission
  if (emiForm) {
    emiForm.addEventListener("submit", function (e) {
      e.preventDefault()
      const newData = {
        name: document.getElementById("name").value,
        amountSanctioned: document.getElementById("amount").value,
        dateOfSanctionedAmount: document.getElementById("sanctionDate").value,
        repaymentAmount: document.getElementById("repaymentAmount").value,
        repaymentDate: document.getElementById("repaymentDate").value,
        interest: document.getElementById("interest").value + "%",
        status: document.getElementById("status").value,
        emiSchedule: document.getElementById("emiSchedule").value,
      }
      formData.push(newData)

      // Save to localStorage for Employee Dashboard to access
      const emiData = JSON.parse(localStorage.getItem("emiData") || "[]")
      emiData.push(newData)
      localStorage.setItem("emiData", JSON.stringify(emiData))

      this.reset()

      showDashboard()
      updateTable(document.querySelector(".btn-group .btn.active").dataset.period)
      updateCharts()
      showNotification("Form saved successfully!", "success")
    })
  }

  // Show dashboard content
  function showDashboard() {
    dashboardContent.style.display = "block"
    formContent.style.display = "none"
    penaltyContent.style.display = "none"
    totalEnquiriesContent.style.display = "none"
    downloadContent.style.display = "none"

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

  // Show form content
  function showForm() {
    dashboardContent.style.display = "none"
    formContent.style.display = "block"
    penaltyContent.style.display = "none"
    totalEnquiriesContent.style.display = "none"
    downloadContent.style.display = "none"
  }

  // Show penalty content
  function showPenalty() {
    dashboardContent.style.display = "none"
    formContent.style.display = "none"
    penaltyContent.style.display = "block"
    totalEnquiriesContent.style.display = "none"
    downloadContent.style.display = "none"
    updateAdminPenaltyTable()
  }

  // Show total enquiries content
  function showTotalEnquiries() {
    dashboardContent.style.display = "none"
    formContent.style.display = "none"
    penaltyContent.style.display = "none"
    totalEnquiriesContent.style.display = "block"
    downloadContent.style.display = "none"
    updateEnquiriesTable()
  }

  // Show download content
  function showDownload() {
    dashboardContent.style.display = "none"
    formContent.style.display = "none"
    penaltyContent.style.display = "none"
    totalEnquiriesContent.style.display = "none"
    downloadContent.style.display = "block"
    updateSanctionLettersTable()
  }

  // Update table based on period
  function updateTable(period) {
    if (!tableBody) return

    tableBody.innerHTML = ""

    // Load EMI data from localStorage
    const emiData = JSON.parse(localStorage.getItem("emiData") || "[]")
    const filteredData = emiData.filter((item) => item.emiSchedule === period)

    if (filteredData.length === 0) {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td colspan="8" class="text-center">No data available for ${period} schedule</td>
      `
      tableBody.appendChild(row)
    } else {
      filteredData.forEach((item) => {
        const row = document.createElement("tr")
        row.innerHTML = `
          <td>${item.name}</td>
          <td>${item.amountSanctioned}</td>
          <td>${item.dateOfSanctionedAmount}</td>
          <td>${item.repaymentAmount}</td>
          <td>${item.repaymentDate}</td>
          <td>${item.interest}</td>
          <td>${item.status}</td>
          <td><button class="btn btn-sm btn-primary view-btn">View</button></td>
        `
        tableBody.appendChild(row)
      })

      // Add event listeners to view buttons
      document.querySelectorAll(".view-btn").forEach((btn, index) => {
        btn.addEventListener("click", () => {
          showItemDetails(filteredData[index])
        })
      })
    }
  }

  // Show item details
  function showItemDetails(item) {
    alert(`
      Name: ${item.name}
      Amount Sanctioned: ${item.amountSanctioned}
      Date of Sanctioned Amount: ${item.dateOfSanctionedAmount}
      Repayment Amount: ${item.repaymentAmount}
      Repayment Date: ${item.repaymentDate}
      Interest: ${item.interest}
      Status: ${item.status}
    `)
  }

  // Show notification
  function showNotification(message, type = "success") {
    const notification = document.createElement("div")
    notification.textContent = message
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
    `

    if (type === "success") {
      notification.style.backgroundColor = "#4CAF50"
      notification.style.color = "white"
    } else if (type === "error") {
      notification.style.backgroundColor = "#f44336"
      notification.style.color = "white"
    }

    document.body.appendChild(notification)

    // Trigger reflow to ensure the transition works
    notification.offsetHeight

    // Make the notification visible
    notification.style.opacity = "1"

    setTimeout(() => {
      notification.style.opacity = "0"
      setTimeout(() => {
        notification.remove()
      }, 300) // Wait for the fade-out transition to complete
    }, 3000)
  }

  // Update charts
  function updateCharts() {
    // Get chart data from localStorage
    const emiData = JSON.parse(localStorage.getItem("emiData") || "[]")

    // Define periods
    const periods = ["daily", "weekly", "monthly"]

    // Process data for each period
    periods.forEach((period) => {
      // Count status occurrences for this period
      const statusCounts = {
        "EMI Pending": 0,
        "EMI Paid": 0,
        "Total Amount Paid": 0,
      }

      // Filter data for this period and count statuses
      emiData
        .filter((item) => item.emiSchedule === period)
        .forEach((item) => {
          if (statusCounts.hasOwnProperty(item.status)) {
            statusCounts[item.status]++
          }
        })

      // Get the canvas element
      const canvasId = `${period}Chart`
      const canvas = document.getElementById(canvasId)

      if (!canvas) {
        console.error(`Canvas with ID ${canvasId} not found`)
        return
      }

      // Get the 2D context
      const ctx = canvas.getContext("2d")

      // Destroy existing chart if it exists
      if (chartInstances[period]) {
        chartInstances[period].destroy()
      }

      // Create new chart
      chartInstances[period] = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["EMI Pending", "EMI Paid", "Total Amount Paid"],
          datasets: [
            {
              data: [statusCounts["EMI Pending"], statusCounts["EMI Paid"], statusCounts["Total Amount Paid"]],
              backgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
              hoverBackgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                padding: 20,
                boxWidth: 12,
              },
            },
            tooltip: {
              displayColors: false,
              callbacks: {
                label: (context) => {
                  const label = context.label || ""
                  const value = context.raw || 0
                  return `${label}: ${value}`
                },
              },
            },
          },
        },
      })
    })
  }

  // Update Penalty Rules Table
  function updateAdminPenaltyTable() {
    if (!AdminPenaltyTable) return

    const penaltyRules = JSON.parse(localStorage.getItem("penaltyRules") || "[]")
    AdminPenaltyTable.innerHTML = ""

    if (penaltyRules.length === 0) {
      AdminPenaltyTable.innerHTML = "<tr><td colspan='7' style='text-align:center;'>No Penalty Rules Found</td></tr>"
      return
    }

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
          <button class="btn btn-danger btn-sm delete-rule" data-index="${index}">Delete</button>
        </td>
      `
      AdminPenaltyTable.appendChild(row)
    })

    document.querySelectorAll(".delete-rule").forEach((button) => {
      button.addEventListener("click", function () {
        const index = this.dataset.index
        deletePenaltyRule(index)
      })
    })
  }

  // Delete Penalty Rule
  function deletePenaltyRule(index) {
    const penaltyRules = JSON.parse(localStorage.getItem("penaltyRules") || "[]")
    if (confirm("Are you sure you want to delete this rule?")) {
      penaltyRules.splice(index, 1)
      localStorage.setItem("penaltyRules", JSON.stringify(penaltyRules))
      updateAdminPenaltyTable()
    }
  }

  // Update Enquiries Table
  function updateEnquiriesTable() {
    if (!enquiriesTableBody) return

    enquiriesTableBody.innerHTML = ""
    const loanApplications = JSON.parse(localStorage.getItem("loanApplications") || "[]")

    if (loanApplications.length === 0) {
      enquiriesTableBody.innerHTML = "<tr><td colspan='12' class='text-center'>No applications found</td></tr>"
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

  // View Application
  function viewApplication(e) {
    const index = e.target.dataset.index
    const application = JSON.parse(localStorage.getItem("loanApplications"))[index]

    if (!application) {
      alert("Application details not found")
      return
    }

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
                  <p><strong>Date of Birth:</strong> ${application.dob || "N/A"}</p>
                  <p><strong>Gender:</strong> ${application.gender || "N/A"}</p>
                </div>
                <div class="col-md-6">
                  <h6 class="text-primary">Address & Documents</h6>
                  <p><strong>Address Ownership:</strong> ${application.ownership || "N/A"}</p>
                  <p><strong>Address:</strong> ${application.address || "N/A"}</p>
                  <p><strong>PAN:</strong> ${application.pan || "N/A"}</p>
                  <p><strong>Aadhar:</strong> ${application.aadhar || "N/A"}</p>
                </div>

                <!-- Loan Details -->
                <div class="col-md-12">
                  <h6 class="text-success">Loan Information</h6>
                  <p><strong>Loan Amount:</strong> ₹${application.loanAmount || "N/A"}</p>
                  <p><strong>Loan Tenure:</strong> ${application.tenure || "N/A"} months</p>
                  <p><strong>EMI Schedule:</strong> ${application.emiSchedule || "N/A"}</p>
                  <p><strong>Status:</strong> <span class="badge bg-${application.status === "Approved" ? "success" : "warning"}">${application.status || "Pending"}</span></p>
                </div>

                <!-- Guarantor Details -->
                <div class="col-md-12">
                  <h4 class="text-warning text-center">Guarantor Details</h4>
                  <p><strong>Guarantor Name:</strong> ${application.refName1 || "N/A"}</p>
                  <p><strong>Contact:</strong> ${application.refContact1 || "N/A"}</p>
                  <p><strong>Address Ownership:</strong> ${application.gownership || "N/A"}</p>
                  <p><strong>Address:</strong> ${application.guarantorAddress || "N/A"}</p>
                  <p><strong>PAN:</strong> ${application.guarantorPan || "N/A"}</p>
                  <p><strong>Aadhar:</strong> ${application.guarantorAadhar || "N/A"}</p>
                </div>
                <!-- Uploaded Documents -->
                                    <div class="col-md-12">
                                        <h4 class="text-info text-center">Uploaded Documents</h4>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <h6>Photo</h6>
                                                <img src="${
                                                  application.photoUpload
                                                }" alt="Photo" class="img-fluid">
                                            </div>
                                            <div class="col-md-4">
                                                <h6>Aadhar</h6>
                                                <img src="${
                                                  application.aadharUpload
                                                }" alt="Aadhar" class="img-fluid">
                                            </div>
                                            <div class="col-md-4">
                                                <h6>PAN</h6>
                                                <img src="${
                                                  application.panUpload
                                                }" alt="PAN" class="img-fluid">
                                            </div>
                                        </div>
                                        <div class="row mt-3">
                                            <div class="col-md-6">
                                                <h6>Income Proof</h6>
                                                <img src="${
                                                  application.incomeProof
                                                }" alt="Income Proof" class="img-fluid">
                                            </div>
                                            <div class="col-md-6">
                                                <h6>Residential Proof</h6>
                                                <img src="${
                                                  application.residentialProof
                                                }" alt="Residential Proof" class="img-fluid">
                                            </div>
                                        </div>
                                    </div>
    
                                    <!-- Guarantor Documents -->
                                    < class="col-md-12 mt-4">
                                        <h4 class="text-info text-center">Guarantor Documents</h4>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <h6>Photo</h6>
                                                <img src="${
                                                  application.photoUpload2
                                                }" alt="Guarantor Photo" class="img-fluid">
                                            </div>
                                            <div class="col-md-4">
                                                <h6>Aadhar</h6>
                                                <img src="${
                                                  application.aadharUpload2
                                                }" alt="Guarantor Aadhar" class="img-fluid">
                                            </div>
                                            <div class="col-md-4">
                                                <h6>PAN</h6>
                                                <img src="${
                                                  application.panUpload2
                                                }" alt="Guarantor PAN" class="img-fluid">
                                            </div>
                                        </div>
                                        <div class="row mt-3">
                                            <div class="col-md-6">
                                                <h6>Income Proof</h6>
                                                <img src="${
                                                  application.gincomeProof
                                                }" alt="Guarantor Income Proof" class="img-fluid">
                                            </div>
                                            <div class="col-md-6">
                                                <h6>Residential Proof</h6>
                                                <img src="${
                                                  application.gresidentialProof
                                                }" alt="Guarantor Residential Proof" class="img-fluid">
                                            </div>
                                        </div>
                                    
              </div>
            </div>
          </div>
        </div>
      </div>
    `

    document.body.insertAdjacentHTML("beforeend", modalContent)
    // Declare bootstrap variable
    const bootstrap = window.bootstrap
    const modal = new bootstrap.Modal(document.getElementById("applicationModal"))
    modal.show()

    document.getElementById("applicationModal").addEventListener("hidden.bs.modal", function () {
      this.remove()
    })
  }

  // Delete Application
  function deleteApplication(e) {
    const index = e.target.dataset.index
    if (confirm("Are you sure you want to delete this application?")) {
      const loanApplications = JSON.parse(localStorage.getItem("loanApplications") || "[]")
      loanApplications.splice(index, 1)
      localStorage.setItem("loanApplications", JSON.stringify(loanApplications))
      updateEnquiriesTable()
    }
  }

  // Approve Application
  function approveApplication(e) {
    const index = e.target.dataset.index
    if (confirm("Are you sure you want to approve this application?")) {
      const loanApplications = JSON.parse(localStorage.getItem("loanApplications") || "[]")
      loanApplications[index].status = "Approved"
      localStorage.setItem("loanApplications", JSON.stringify(loanApplications))
      updateEnquiriesTable()
    }
  }

  // Update Sanction Letters Table
  function updateSanctionLettersTable() {
    if (!sanctionLettersTable) return

    sanctionLettersTable.innerHTML = ""
    const sanctionData = JSON.parse(localStorage.getItem("adminSanctionData") || "[]")

    if (sanctionData.length === 0) {
      sanctionLettersTable.innerHTML =
        '<tr><td colspan="6" class="text-center">No sanction letter data available</td></tr>'
      return
    }

    sanctionData.forEach((letter, index) => {
      const row = document.createElement("tr")
      row.innerHTML = `
      <td>${index + 1}</td>
      <td>${letter.loanAccNo}</td>
      <td>${letter.applicantName}</td>
      <td>₹${Number(letter.loanAmount).toLocaleString("en-IN")}</td>
      <td>${new Date(letter.sanctionDate).toLocaleDateString("en-IN")}</td>
      <td>
        <button class="btn btn-sm btn-info view-letter" data-index="${index}">View</button>
        <button class="btn btn-sm btn-primary download-letter" data-index="${index}">Download</button>
        <button class="btn btn-sm btn-success send-letter" data-index="${index}">Send</button>
      </td>
    `
      sanctionLettersTable.appendChild(row)
    })

    // Add event listeners to buttons
    document.querySelectorAll(".view-letter").forEach((btn, index) => {
      btn.addEventListener("click", () => viewLetter(index))
    })

    document.querySelectorAll(".download-letter").forEach((btn, index) => {
      btn.addEventListener("click", () => downloadLetter(index))
    })

    document.querySelectorAll(".send-letter").forEach((btn, index) => {
      btn.addEventListener("click", () => sendLetter(index))
    })
  }

  // View Letter
  function viewLetter(index) {
    const sanctionData = JSON.parse(localStorage.getItem("adminSanctionData") || "[]")
    const letter = sanctionData[index]

    if (!letter) {
      console.error("No letter data found")
      return
    }

    // Show letter preview in modal
    const modalBody = document.querySelector("#letterPreviewModal .modal-body")
    if (!modalBody) {
      console.error("Modal body not found")
      return
    }

    modalBody.innerHTML = `
    <div class="letter-content">
      <div class="text-center mb-4">
        <h2>LOAN SANCTION LETTER</h2>
        <h3>INSTA FINANCE</h3>
      </div>
      <div class="letter-body">
        <table class="table table-bordered">
          <tr><th>Loan Account Number</th><td>${letter.loanAccNo}</td></tr>
          <tr><th>Applicant Name</th><td>${letter.applicantName}</td></tr>
          <tr><th>Sanction Date</th><td>${new Date(letter.sanctionDate).toLocaleDateString("en-IN")}</td></tr>
          <tr><th>Loan Amount</th><td>₹${Number(letter.loanAmount).toLocaleString("en-IN")}</td></tr>
          <tr><th>EMI Amount</th><td>₹${Number(letter.emiAmount).toLocaleString("en-IN")}/month</td></tr>
          <tr><th>Loan Type</th><td>${letter.loanType}</td></tr>
          <tr><th>Tenure</th><td>${letter.tenure} years</td></tr>
          <tr><th>Interest Rate</th><td>${letter.interestRate}% per annum</td></tr>
        </table>
      </div>
    </div>
  `

    const bootstrap = window.bootstrap
    const modal = new bootstrap.Modal(document.getElementById("letterPreviewModal"))
    modal.show()

    // Add event listeners for download and WhatsApp buttons in the modal
    document.getElementById("downloadPreview").addEventListener("click", () => downloadLetter(index))
    document.getElementById("whatsAppPreview").addEventListener("click", () => sendLetter(index))
  }

  // Download Letter
  function downloadLetter(index) {
    try {
      const sanctionData = JSON.parse(localStorage.getItem("adminSanctionData") || "[]")
      const data = sanctionData[index]

      if (!data) {
        console.error("No data found for PDF generation")
        alert("Error: No data found for PDF generation")
        return
      }

      // Initialize jsPDF
      const { jsPDF } = window.jspdf
      const doc = new jsPDF()

      // Add header
      doc.setFontSize(22)
      doc.setFont("helvetica", "bold")
      doc.text("LOAN SANCTION LETTER", 105, 20, { align: "center" })

      // Add company details
      doc.setFontSize(16)
      doc.text("INSTA FINANCE", 105, 30, { align: "center" })

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text("123 Finance Street, City - 400001", 105, 35, { align: "center" })
      doc.text("Tel: +91 1234567890 | Email: contact@instafinance.com", 105, 40, { align: "center" })

      // Add letter details
      doc.setFontSize(11)
      doc.text(`Date: ${new Date(data.sanctionDate).toLocaleDateString("en-IN")}`, 20, 50)
      doc.text(`Ref No: ${data.loanAccNo}`, 20, 55)

      // Add salutation
      doc.text("To,", 20, 65)
      doc.text(`${data.applicantName}`, 20, 70)

      // Add subject
      doc.setFont("helvetica", "bold")
      doc.text("Subject: Sanction of Loan", 20, 80)
      doc.setFont("helvetica", "normal")

      // Add letter body
      doc.text("Dear Sir/Madam,", 20, 90)
      doc.text("With reference to your loan application, we are pleased to inform you that your loan", 20, 100)
      doc.text("has been sanctioned with the following terms and conditions:", 20, 105)

      // Add loan details
      let yPos = 115
      const details = [
        ["Loan Account Number", `: ${data.loanAccNo}`],
        ["Applicant Name", `: ${data.applicantName}`],
        ["Sanctioned Amount", `: ₹${Number(data.loanAmount).toLocaleString("en-IN")}`],
        ["Interest Rate", `: ${data.interestRate}% per annum`],
        ["Loan Tenure", `: ${data.tenure} years`],
        ["EMI Amount", `: ₹${Number(data.emiAmount).toLocaleString("en-IN")}/month`],
        ["Loan Type", `: ${data.loanType}`],
        ["Sanction Date", `: ${new Date(data.sanctionDate).toLocaleDateString("en-IN")}`],
      ]

      details.forEach((row) => {
        doc.text(row[0], 20, yPos)
        doc.text(row[1], 80, yPos)
        yPos += 7
      })

      // Add terms and conditions
      yPos += 10
      doc.setFont("helvetica", "bold")
      doc.text("Terms and Conditions:", 20, yPos)
      doc.setFont("helvetica", "normal")
      yPos += 7

      const terms = [
        "1. The loan amount will be disbursed after completion of all documentation.",
        "2. EMI will be deducted on the specified date of every month.",
        "3. Delay in EMI payment will attract penalty charges.",
        "4. Prepayment charges may apply as per bank norms.",
        "5. The bank reserves the right to recall the loan in case of default.",
      ]

      terms.forEach((term) => {
        doc.text(term, 20, yPos)
        yPos += 7
      })

      // Add signature
      yPos += 10
      doc.text("For INSTA FINANCE", 20, yPos)
      yPos += 10

      doc.text("Authorized Signatory", 20, yPos)

      // Add footer
      doc.setFontSize(8)
      doc.text("This is a computer generated document and does not require physical signature.", 105, 280, {
        align: "center",
      })

      // Save the PDF
      doc.save(`Loan_Sanction_Letter_${data.loanAccNo}.pdf`)
      console.log("PDF generated successfully")
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF: " + error.message)
    }
  }

  // Send Letter via WhatsApp
  function sendLetter(index) {
    const sanctionData = JSON.parse(localStorage.getItem("adminSanctionData") || "[]")
    const letter = sanctionData[index]

    if (!letter) {
      console.error("No letter data found")
      return
    }

    const message = encodeURIComponent(
      `Dear ${letter.applicantName},\n\nYour loan has been sanctioned. Amount: ₹${Number(letter.loanAmount).toLocaleString("en-IN")}\nLoan Account Number: ${letter.loanAccNo}\n\nRegards,\nInsta Finance`,
    )
    window.open(`https://wa.me/?text=${message}`, "_blank")
  }

  // Initialize the dashboard view
  showDashboard()

  // Check if we need to update the tables on page load
  if (AdminPenaltyTable) {
    updateAdminPenaltyTable()
  }

  if (sanctionLettersTable) {
    updateSanctionLettersTable()
  }

  if (enquiriesTableBody) {
    updateEnquiriesTable()
  }
}
)

