// import { Chart } from "@/components/ui/chart"
document.addEventListener("DOMContentLoaded", () => {
  const sidebarLinks = document.querySelectorAll(".sidebar .nav-link");
  const periodButtons = document.querySelectorAll(".btn-group .btn");
  const tableBody = document.getElementById("tableBody");
  const logoutBtn = document.getElementById("logoutBtn");
  const homeBtn = document.getElementById("homeBtn");
  const emiForm = document.getElementById("emiForm");
  const dashboardContent = document.getElementById("dashboardContent");
  const formContent = document.getElementById("formContent");
  const penaltyContent = document.getElementById("penaltyContent");
  const totalEnquiriesContent = document.getElementById(
    "totalEnquiriesContent"
  );
  const downloadContent = document.getElementById("downloadContent");
  const notificationContent = document.getElementById("notificationContent");
  const superAdminTableBody = document.getElementById("superAdminTableBody");
  const superAdminPenaltyTable = document.getElementById(
    "superAdminPenaltyTable"
  );

  // Global variables
  const formData = [];
  const charts = {};
  let penaltyRules = [];
  let loanApplications = [];

  // Initialize charts object to store chart instances
  window.charts = {
    daily: null,
    weekly: null,
    monthly: null,
  };

  // Load data from localStorage
  function loadPenaltyRules() {
    return JSON.parse(localStorage.getItem("penaltyRules")) || [];
  }

  function savePenaltyRules(penaltyRules) {
    localStorage.setItem("penaltyRules", JSON.stringify(penaltyRules));
  }

  function loadLoanApplications() {
    return JSON.parse(localStorage.getItem("loanApplications")) || [];
  }

  // Initialize data from localStorage
  penaltyRules = loadPenaltyRules();
  loanApplications = loadLoanApplications();

  // Sidebar navigation
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      sidebarLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");

      if (this.dataset.section === "dashboard") {
        showDashboard();
      } else if (this.dataset.section === "form") {
        showForm();
      } else if (this.dataset.section === "penalty") {
        showPenalty();
      } else if (this.dataset.section === "totalEnquiries") {
        showTotalEnquiries();
      } else if (this.dataset.section === "download") {
        showDownload();
      } else if (this.dataset.section === "notification") {
        showNotificationSection();
      }
    });
  });

  // Period buttons (Daily, Weekly, Monthly)
  periodButtons.forEach((button) => {
    button.addEventListener("click", function () {
      periodButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      updateTable(this.dataset.period);
    });
  });

  // Notification dropdown functionality
  const notificationDropdown = document.getElementById("notificationDropdown");
  const notificationList = document.getElementById("notificationList");
  const notificationItems = document.querySelectorAll(".notification-item");

  if (notificationDropdown) {
    notificationDropdown.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      notificationList.classList.toggle("show");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
      if (!notificationDropdown.contains(event.target)) {
        notificationList.classList.remove("show");
      }
    });

    // Add click event to notification items
    notificationItems.forEach((item) => {
      item.addEventListener("click", () => {
        // Navigate to Total Enquiries page
        showTotalEnquiries();
        // Hide the dropdown after clicking
        notificationList.classList.remove("show");
      });
    });
  }

  // Logout button
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to logout?")) {
        window.location.href = "index.html";
      }
    });
  }

  // Home button
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      showDashboard();
    });
  }

  // EMI Form submission
  if (emiForm) {
    emiForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const newData = {
        name: document.getElementById("name").value,
        amountSanctioned: document.getElementById("amount").value,
        dateOfSanctionedAmount: document.getElementById("sanctionDate").value,
        repaymentAmount: document.getElementById("repaymentAmount").value,
        repaymentDate: document.getElementById("repaymentDate").value,
        interest: document.getElementById("interest").value + "%",
        status: document.getElementById("status").value,
        emiSchedule: document.getElementById("emiSchedule").value,
      };

      // Get existing EMI data or initialize empty array
      const emiData = JSON.parse(localStorage.getItem("emiData")) || [];

      // Add new data
      emiData.push(newData);

      // Save to localStorage
      localStorage.setItem("emiData", JSON.stringify(emiData));

      // Reset form
      this.reset();

      // Update UI
      showDashboard();
      updateSuperAdminTable();
      updateSuperAdminCharts();

      // Show success message (if you have a notification function)
      if (typeof showNotification === "function") {
        showNotification("Form saved successfully!", "success");
      } else {
        alert("Form saved successfully!");
      }
    });
  }

  // Show different sections
  function showDashboard() {
    dashboardContent.style.display = "block";
    formContent.style.display = "none";
    penaltyContent.style.display = "none";
    totalEnquiriesContent.style.display = "none";
    downloadContent.style.display = "none";
    notificationContent.style.display = "none";

    sidebarLinks.forEach((link) => {
      if (link.dataset.section === "dashboard") {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    updateSuperAdminTable();
    updateSuperAdminCharts();
  }

  function showForm() {
    dashboardContent.style.display = "none";
    formContent.style.display = "block";
    penaltyContent.style.display = "none";
    totalEnquiriesContent.style.display = "none";
    downloadContent.style.display = "none";
    notificationContent.style.display = "none";
  }

  function showPenalty() {
    dashboardContent.style.display = "none";
    formContent.style.display = "none";
    penaltyContent.style.display = "block";
    totalEnquiriesContent.style.display = "none";
    downloadContent.style.display = "none";
    notificationContent.style.display = "none";
    updateSuperAdminPenaltyTable();
  }

  function showTotalEnquiries() {
    dashboardContent.style.display = "none";
    formContent.style.display = "none";
    penaltyContent.style.display = "none";
    totalEnquiriesContent.style.display = "block";
    downloadContent.style.display = "none";
    notificationContent.style.display = "none";
    updateEnquiriesTable();
  }

  function showDownload() {
    dashboardContent.style.display = "none";
    formContent.style.display = "none";
    penaltyContent.style.display = "none";
    totalEnquiriesContent.style.display = "none";
    downloadContent.style.display = "block";
    notificationContent.style.display = "none";
    updateLoanDetailsTable();
    updateSuperAdminSanctionDataTable(); // Add this line
  }

  function showNotificationSection() {
    dashboardContent.style.display = "none";
    formContent.style.display = "none";
    penaltyContent.style.display = "none";
    totalEnquiriesContent.style.display = "none";
    downloadContent.style.display = "none";
    notificationContent.style.display = "block";
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
          datasets: [
            {
              data: [
                chartData[period].EMIPending,
                chartData[period].TotalAmountPaid,
                chartData[period].EMIPaid,
              ],
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || "";
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value} (${percentage}%)`;
                },
              },
            },
          },
        },
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
    const emiData = JSON.parse(localStorage.getItem("emiData")) || [];
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

    const penaltyRules = loadPenaltyRules();
    superAdminPenaltyTable.innerHTML = "";

    if (penaltyRules.length === 0) {
      superAdminPenaltyTable.innerHTML =
        "<tr><td colspan='7' style='text-align:center;'>No Penalty Rules Found</td></tr>";
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

    document.querySelectorAll(".delete-rule").forEach((button) => {
      button.addEventListener("click", function () {
        const index = this.dataset.index;
        deletePenaltyRule(index);
      });
    });
  }

  // Delete Penalty Rule
  function deletePenaltyRule(index) {
    const penaltyRules = loadPenaltyRules();
    if (confirm("Are you sure you want to delete this rule?")) {
      penaltyRules.splice(index, 1);
      savePenaltyRules(penaltyRules);
      updateSuperAdminPenaltyTable();
    }
  }

  // Update Enquiries Table
  function updateEnquiriesTable() {
    const enquiriesTableBody = document.getElementById("enquiriesTableBody");
    if (!enquiriesTableBody) return;

    enquiriesTableBody.innerHTML = "";
    const loanApplications =
      JSON.parse(localStorage.getItem("loanApplications")) || [];

    loanApplications.forEach((application, index) => {
      const row = document.createElement("tr");
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
                      <button class="btn btn-sm btn-success approve-application" data-index="${index}">Payment</button>
                  </td>
              `;
      enquiriesTableBody.appendChild(row);
    });

    // Add event listeners to buttons
    document.querySelectorAll(".view-application").forEach((btn) => {
      btn.addEventListener("click", viewApplication);
    });
    document.querySelectorAll(".delete-application").forEach((btn) => {
      btn.addEventListener("click", deleteApplication);
    });
    // document.querySelectorAll(".approve-application").forEach((btn) => {
    //   btn.addEventListener("click", approveApplication);
    // });
  }

  // View Application Details
  function viewApplication(e) {
    const index = e.target.dataset.index;
    const application = JSON.parse(localStorage.getItem("loanApplications"))[
      index
    ];

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


    document.body.insertAdjacentHTML("beforeend", modalContent);
    const modal = new bootstrap.Modal(
      document.getElementById("applicationModal")
    );
    modal.show();

    document
      .getElementById("applicationModal")
      .addEventListener("hidden.bs.modal", function () {
        this.remove();
      });
  }

  // Delete Application
  function deleteApplication(e) {
    const index = e.target.dataset.index;
    if (confirm("Are you sure you want to delete this application?")) {
      const loanApplications = JSON.parse(
        localStorage.getItem("loanApplications")
      );
      loanApplications.splice(index, 1);
      localStorage.setItem(
        "loanApplications",
        JSON.stringify(loanApplications)
      );
      updateEnquiriesTable();
    }
  }

  // Approve Application
  function approveApplication(e) {
    const index = e.target.dataset.index;
    if (confirm("Are you sure you want to approve this application?")) {
      const loanApplications = JSON.parse(
        localStorage.getItem("loanApplications")
      );
      loanApplications[index].status = "Approved";
      localStorage.setItem(
        "loanApplications",
        JSON.stringify(loanApplications)
      );
      updateEnquiriesTable();
    }
  }

  // Update Loan Details Table
  function updateLoanDetailsTable() {
    const loanDetailsTableBody = document.getElementById(
      "loanDetailsTableBody"
    );
    if (!loanDetailsTableBody) return;

    loanDetailsTableBody.innerHTML = "";
    const loanDetails = JSON.parse(localStorage.getItem("loanDetails")) || [];

    loanDetails.forEach((loan) => {
      const row = document.createElement("tr");
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
    document.querySelectorAll(".loan-view-btn").forEach((btn) => {
      btn.addEventListener("click", viewLoan);
    });
    document.querySelectorAll(".loan-approve-btn").forEach((btn) => {
      btn.addEventListener("click", approveLoan);
    });
    document.querySelectorAll(".loan-send-btn").forEach((btn) => {
      btn.addEventListener("click", sendLoanOptions);
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
  window.addEventListener("storage", (event) => {
    if (event.key === "emiData") {
      updateSuperAdminTable();
      updateSuperAdminCharts();
    } else if (event.key === "penaltyRules") {
      updateSuperAdminPenaltyTable();
    } else if (event.key === "loanApplications") {
      updateEnquiriesTable();
    } else if (event.key === "loanDetails") {
      updateLoanDetailsTable();
    } else if (event.key === "superAdminSanctionData") {
      updateSuperAdminSanctionDataTable(); // Add this line
    }
  });

  // Initialize the dashboard view
  showDashboard();

  // Make sure charts are updated when the page loads
  updateSuperAdminCharts();

  // Also update the sanction data table
  updateSuperAdminSanctionDataTable();
});

// Add this function to update the sanction data table in SuperAdmin
function updateSuperAdminSanctionDataTable() {
  const tableBody = document.getElementById("superAdminSanctionDataTable");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  const sanctionData = JSON.parse(
    localStorage.getItem("superAdminSanctionData") || "[]"
  );

  if (sanctionData.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="6" class="text-center">No sanction letter data available</td></tr>';
    return;
  }

  sanctionData.forEach((letter, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
              <td>${index + 1}</td>
              <td>${letter.loanAccNo}</td>
              <td>${letter.applicantName}</td>
              <td>₹${Number(letter.loanAmount).toLocaleString("en-IN")}</td>
              <td>${new Date(letter.sanctionDate).toLocaleDateString(
                "en-IN"
              )}</td>
              <td>
                  <button class="btn btn-info btn-sm view-sanction" data-index="${index}">View</button>
                  <button class="btn btn-primary btn-sm download-sanction" data-index="${index}">Download</button>
                  <button class="btn btn-success btn-sm send-sanction" data-index="${index}">Send</button>
              </td>
          `;
    tableBody.appendChild(row);
  });

  // Add event listeners to buttons
  document.querySelectorAll(".view-sanction").forEach((btn) => {
    btn.addEventListener("click", viewSuperAdminSanctionLetter);
  });

  document.querySelectorAll(".download-sanction").forEach((btn) => {
    btn.addEventListener("click", downloadSuperAdminSanctionLetter);
  });

  document.querySelectorAll(".send-sanction").forEach((btn) => {
    btn.addEventListener("click", sendSuperAdminSanctionLetter);
  });
}

// Function to view sanction letter details
function viewSuperAdminSanctionLetter(e) {
  const index = e.target.dataset.index;
  const sanctionData = JSON.parse(
    localStorage.getItem("superAdminSanctionData") || "[]"
  );
  const letter = sanctionData[index];

  if (!letter) {
    console.error("No letter data found");
    return;
  }

  // Create modal HTML
  const modalHTML = `
          <div class="modal fade" id="superAdminLetterModal" tabindex="-1">
              <div class="modal-dialog modal-lg">
                  <div class="modal-content">
                      <div class="modal-header">
                          <h5 class="modal-title">Loan Sanction Letter</h5>
                          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                      </div>
                      <div class="modal-body">
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
                                          <td>${letter.loanAccNo}</td>
                                      </tr>
                                      <tr>
                                          <th>Applicant Name</th>
                                          <td>${letter.applicantName}</td>
                                      </tr>
                                      <tr>
                                          <th>Sanction Date</th>
                                          <td>${new Date(
                                            letter.sanctionDate
                                          ).toLocaleDateString("en-IN")}</td>
                                      </tr>
                                      <tr>
                                          <th>Loan Amount</th>
                                          <td>₹${Number(
                                            letter.loanAmount
                                          ).toLocaleString("en-IN")}</td>
                                      </tr>
                                      <tr>
                                          <th>EMI Amount</th>
                                          <td>₹${Number(
                                            letter.emiAmount
                                          ).toLocaleString("en-IN")}/month</td>
                                      </tr>
                                      <tr>
                                          <th>Loan Type</th>
                                          <td>${letter.loanType}</td>
                                      </tr>
                                      <tr>
                                          <th>Tenure</th>
                                          <td>${letter.tenure} years</td>
                                      </tr>
                                      <tr>
                                          <th>Interest Rate</th>
                                          <td>${
                                            letter.interestRate
                                          }% per annum</td>
                                      </tr>
                                  </table>
                              </div>
                          </div>
                      </div>
                      <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          <button type="button" class="btn btn-primary" id="downloadSuperAdminPreview">Download</button>
                          <button type="button" class="btn btn-success" id="whatsAppSuperAdminPreview">WhatsApp</button>
                      </div>
                  </div>
              </div>
          </div>
      `;

  // Add modal to body
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Show modal
  const modal = new bootstrap.Modal(
    document.getElementById("superAdminLetterModal")
  );
  modal.show();

  // Remove modal from DOM when hidden
  document
    .getElementById("superAdminLetterModal")
    .addEventListener("hidden.bs.modal", function () {
      this.remove();
    });

  // Add event listeners for download and WhatsApp buttons
  document
    .getElementById("downloadSuperAdminPreview")
    .addEventListener("click", () => {
      downloadSuperAdminSanctionLetter({
        target: { dataset: { index: index } },
      });
    });

  document
    .getElementById("whatsAppSuperAdminPreview")
    .addEventListener("click", () => {
      sendSuperAdminSanctionLetter({ target: { dataset: { index: index } } });
    });
}

// Function to download sanction letter
function downloadSuperAdminSanctionLetter(e) {
  try {
    const index = e.target.dataset.index;
    const sanctionData = JSON.parse(
      localStorage.getItem("superAdminSanctionData") || "[]"
    );
    const data = sanctionData[index];

    if (!data) {
      console.error("No data found for PDF generation");
      alert("Error: No data found for PDF generation");
      return;
    }

    // Initialize jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("LOAN SANCTION LETTER", 105, 20, { align: "center" });

    // Add company details
    doc.setFontSize(16);
    doc.text("INSTA FINANCE", 105, 30, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("123 Finance Street, City - 400001", 105, 35, { align: "center" });
    doc.text("Tel: +91 1234567890 | Email: contact@instafinance.com", 105, 40, {
      align: "center",
    });

    // Add letter details
    doc.setFontSize(11);
    doc.text(
      `Date: ${new Date(data.sanctionDate).toLocaleDateString("en-IN")}`,
      20,
      50
    );
    doc.text(`Ref No: ${data.loanAccNo}`, 20, 55);

    // Add salutation
    doc.text("To,", 20, 65);
    doc.text(`${data.applicantName}`, 20, 70);

    // Add subject
    doc.setFont("helvetica", "bold");
    doc.text("Subject: Sanction of Loan", 20, 80);
    doc.setFont("helvetica", "normal");

    // Add letter body
    doc.text("Dear Sir/Madam,", 20, 90);
    doc.text(
      "With reference to your loan application, we are pleased to inform you that your loan",
      20,
      100
    );
    doc.text(
      "has been sanctioned with the following terms and conditions:",
      20,
      105
    );

    // Add loan details
    let yPos = 115;
    const details = [
      ["Loan Account Number", `: ${data.loanAccNo}`],
      ["Applicant Name", `: ${data.applicantName}`],
      [
        "Sanctioned Amount",
        `: ₹${Number(data.loanAmount).toLocaleString("en-IN")}`,
      ],
      ["Interest Rate", `: ${data.interestRate}% per annum`],
      ["Loan Tenure", `: ${data.tenure} years`],
      [
        "EMI Amount",
        `: ₹${Number(data.emiAmount).toLocaleString("en-IN")}/month`,
      ],
      ["Loan Type", `: ${data.loanType}`],
      [
        "Sanction Date",
        `: ${new Date(data.sanctionDate).toLocaleDateString("en-IN")}`,
      ],
    ];

    details.forEach((row) => {
      doc.text(row[0], 20, yPos);
      doc.text(row[1], 80, yPos);
      yPos += 7;
    });

    // Add terms and conditions
    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Terms and Conditions:", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 7;

    const terms = [
      "1. The loan amount will be disbursed after completion of all documentation.",
      "2. EMI will be deducted on the specified date of every month.",
      "3. Delay in EMI payment will attract penalty charges.",
      "4. Prepayment charges may apply as per bank norms.",
      "5. The bank reserves the right to recall the loan in case of default.",
    ];

    terms.forEach((term) => {
      doc.text(term, 20, yPos);
      yPos += 7;
    });

    // Add signature
    yPos += 10;
    doc.text("For INSTA FINANCE", 20, yPos);
    yPos += 10;
    doc.text("Authorized Signatory", 20, yPos);

    // Add footer
    doc.setFontSize(8);
    doc.text(
      "This is a computer generated document and does not require physical signature.",
      105,
      280,
      {
        align: "center",
      }
    );

    // Save the PDF
    doc.save(`Loan_Sanction_Letter_${data.loanAccNo}.pdf`);
    console.log("PDF generated successfully");
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Error generating PDF: " + error.message);
  }
}

// Function to send sanction letter via WhatsApp
function sendSuperAdminSanctionLetter(e) {
  const index = e.target.dataset.index;
  const sanctionData = JSON.parse(
    localStorage.getItem("superAdminSanctionData") || "[]"
  );
  const letter = sanctionData[index];

  if (!letter) {
    console.error("No letter data found");
    return;
  }

  const message = encodeURIComponent(
    `Dear ${
      letter.applicantName
    },\n\nYour loan has been sanctioned. Amount: ₹${Number(
      letter.loanAmount
    ).toLocaleString("en-IN")}\nLoan Account Number: ${
      letter.loanAccNo
    }\n\nRegards,\nInsta Finance`
  );
  window.open(`https://wa.me/?text=${message}`, "_blank");
}

// Add this to the showDownload function
function showDownload() {
  dashboardContent.style.display = "none";
  formContent.style.display = "none";
  penaltyContent.style.display = "none";
  totalEnquiriesContent.style.display = "none";
  downloadContent.style.display = "block";
  notificationContent.style.display = "none";
  updateLoanDetailsTable();
  updateSuperAdminSanctionDataTable();
}

// Add event listener for storage changes
window.addEventListener("storage", (event) => {
  if (event.key === "penaltyRules") {
    updateSuperAdminPenaltyTable();
  } else if (event.key === "loanApplications") {
    updateEnquiriesTable();
  } else if (event.key === "emiData") {
    updateSuperAdminTable();
    updateSuperAdminCharts();
  } else if (event.key === "superAdminSanctionData") {
    updateSuperAdminSanctionDataTable();
  }
});

// Initialize the sanction data table when the page loads
document.addEventListener("DOMContentLoaded", () => {
  // Existing code...

  // Update sanction data table if we're on the download page
  if (downloadContent && downloadContent.style.display !== "none") {
    updateSuperAdminSanctionDataTable();
  }
});
