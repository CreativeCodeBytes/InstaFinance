document.addEventListener("DOMContentLoaded", () => {
  const sidebarLinks = document.querySelectorAll(".sidebar .nav-link");
  const logoutBtn = document.getElementById("logoutBtn");
  const homeBtn = document.getElementById("homeBtn");
  const dashboardContent = document.getElementById("dashboardContent");
  const formContent = document.getElementById("formContent");
  const penaltyContent = document.getElementById("penaltyContent");
  const totalEnquiriesContent = document.getElementById(
    "totalEnquiriesContent"
  );
  const downloadContent = document.getElementById("downloadContent");
  const notificationContent = document.getElementById("notificationContent");
  const penaltyRuleForm = document.getElementById("penaltyRuleForm");
  const penaltyRulesTable = document
    .getElementById("penaltyRulesTable")
    .querySelector("tbody");
  const sanctionLetterForm = document.getElementById("sanctionLetterForm");
  const notificationForm = document.getElementById("notificationForm");
  const saveTemplateBtn = document.getElementById("saveTemplateBtn");

  let sanctionLetters = [];
  let editIndex = null; // Track the index of the rule being edited

  // Load existing sanction letters
  const savedLetters = localStorage.getItem("sanctionLetters");
  if (savedLetters) {
    sanctionLetters = JSON.parse(savedLetters);
    updateSanctionLettersTable();
  }

  const loanApplicationForm = document.getElementById("loanForm");

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

  // Home button
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      showDashboard();
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

  // Fix the show/hide functions
  function showDashboard() {
    dashboardContent.style.display = "block";
    formContent.style.display = "none";
    penaltyContent.style.display = "none";
    totalEnquiriesContent.style.display = "none";
    downloadContent.style.display = "none";
    notificationContent.style.display = "none";
  }

  function showForm() {
    dashboardContent.style.display = "none";
    formContent.style.display = "block";
    penaltyContent.style.display = "none";
    totalEnquiriesContent.style.display = "none";
    downloadContent.style.display = "none";
    notificationContent.style.display = "none";

    // Get the active period button or default to 'daily'
    const activePeriodBtn = document.querySelector(".btn-group .btn.active");
    const period = activePeriodBtn ? activePeriodBtn.dataset.period : "daily";

    // Update the table with data from localStorage
    updateTable(period);
  }

  function showPenalty() {
    dashboardContent.style.display = "none";
    formContent.style.display = "none";
    penaltyContent.style.display = "block";
    totalEnquiriesContent.style.display = "none";
    downloadContent.style.display = "none";
    notificationContent.style.display = "none";
    updatePenaltyRulesTable();
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
    updateSanctionLettersTable();
  }

  function showNotificationSection() {
    dashboardContent.style.display = "none";
    formContent.style.display = "none";
    penaltyContent.style.display = "none";
    totalEnquiriesContent.style.display = "none";
    downloadContent.style.display = "none";
    notificationContent.style.display = "block";
  }

  // Update the table in Form section with EMI data from localStorage
  function updateTable(period) {
    const tableBody = document.getElementById("tableBody");
    if (!tableBody) return;

    // Load EMI data from localStorage (saved by Admin Dashboard)
    const emiData = JSON.parse(localStorage.getItem("emiData") || "[]");

    // Clear existing table rows
    tableBody.innerHTML = "";

    // Filter data based on selected period
    const filteredData = emiData.filter((item) => item.emiSchedule === period);

    if (filteredData.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td colspan="8" class="text-center">No data available for ${period} schedule</td>
      `;
      tableBody.appendChild(row);
      return;
    }

    // Add rows for each EMI record
    filteredData.forEach((item) => {
      const row = document.createElement("tr");
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

    // Add event listeners to view buttons
    document.querySelectorAll(".view-btn").forEach((btn, index) => {
      btn.addEventListener("click", () => {
        showItemDetails(filteredData[index]);
      });
    });
  }

  // Add a function to show EMI details
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

  // Make the functions available to the rest of the script
  window.showDashboard = showDashboard;
  window.showForm = showForm;
  window.showPenalty = showPenalty;
  window.showTotalEnquiries = showTotalEnquiries;
  window.showDownload = showDownload;
  window.showNotificationSection = showNotificationSection;

  // Data for towns or Talukas of each districts
  const townsData = {
    Ahmednagar: [
      "Ahmednagar",
      "Shirdi",
      "Sangamner",
      "Kopargaon",
      "Rahata",
      "Shrirampur",
      "Pathardi",
      "Rahuri",
      "Shrigonda",
      "Jamkhed",
      "Newasa",
      "Karjat",
      "Akole",
      "Parner",
      "Shevgaon",
      "Nagar",
      "Bhingar",
      "Miri",
      "Puntamba",
      "Kolhar",
      "Takali Dhokeshwar",
      "Wadgaon Gupta",
    ],

    Akola: [
      "Akola",
      "Akot",
      "Balapur",
      "Patur",
      "Murtijapur",
      "Telhara",
      "Barshitakli",
    ],

    Amravati: [
      "Amravati",
      "Achalpur",
      "Daryapur",
      "Warud",
      "Chandur",
      "Anjangaon",
      "Morshi",
      "Chikhaldara",
      "Nandgaon Khandeshwar",
      "Teosa",
    ],

    SambhajiNagar: [
      "SambhajiNagar",
      "Paithan",
      "Khuldabad",
      "Vaijapur",
      "Kannad",
      "Sillod",
      "Phulambri",
      "Soegaon",
      "Gangapur",
    ],

    Beed: [
      "Beed",
      "Majalgaon",
      "Georai",
      "Patoda",
      "Kaij",
      "Wadwani",
      "Dharur",
      "Ambajogai",
      "Ashti",
      "Parli",
    ],

    Bhandara: [
      "Bhandara",
      "Tumsar",
      "Sakoli",
      "Lakhani",
      "Mohadi",
      "Pauni",
      "Lakhandur",
    ],

    Buldhana: [
      "Buldhana",
      "Chikhli",
      "Khamgaon",
      "Shegaon",
      "Deulgaon Raja",
      "Mehkar",
      "Nandura",
      "Sangrampur",
      "Jalgaon Jamod",
      "Malkapur",
      "Motala",
    ],

    Chandrapur: [
      "Chandrapur",
      "Ballarpur",
      "Warora",
      "Rajura",
      "Brahmapuri",
      "Mul",
      "Chimur",
      "Pombhurna",
      "Korpana",
      "Gondpipri",
      "Sawali",
    ],

    Dhule: ["Dhule", "Sakri", "Shirpur", "Dondaicha", "Shindkheda"],

    Gadchiroli: [
      "Gadchiroli",
      "Aheri",
      "Armori",
      "Chamorshi",
      "Mulchera",
      "Etapalli",
      "Bhamragad",
      "Kurkheda",
      "Dhanora",
      "Sironcha",
    ],

    Gondia: [
      "Gondia",
      "Tirora",
      "Amgaon",
      "Deori",
      "Sadak Arjuni",
      "Salekasa",
      "Goregaon",
    ],

    Hingoli: ["Hingoli", "Sengaon", "Basmath", "Kalamnuri", "Aundha Nagnath"],

    Jalgaon: [
      "Jalgaon",
      "Bhusawal",
      "Chopda",
      "Erandol",
      "Yawal",
      "Amalner",
      "Parola",
      "Bhadgaon",
      "Pachora",
      "Dharangaon",
      "Jamner",
      "Raver",
      "Bodwad",
    ],

    Jalna: [
      "Jalna",
      "Ambad",
      "Badnapur",
      "Partur",
      "Mantha",
      "Ghansawangi",
      "Bhokardan",
      "Jafrabad",
    ],

    Kolhapur: [
      "Kolhapur",
      "Ichalkaranji",
      "Gadhinglaj",
      "Kagal",
      "Shahuwadi",
      "Panhala",
      "Hatkanangale",
      "Karvir",
      "Radhanagari",
      "Ajra",
      "Chandgad",
      "Bhudargad",
    ],

    Latur: [
      "Latur",
      "Udgir",
      "Ausa",
      "Nilanga",
      "Renapur",
      "Chakur",
      "Deoni",
      "Jalkot",
    ],

    "Mumbai City": [
      "Marine Lines",
      "Cuffe Parade",
      "Malabar Hill",
      "Fort",
      "Byculla",
      "Girgaon",
      "Tardeo",
    ],

    "Mumbai Suburban": [
      "Borivali",
      "Andheri",
      "Bandra",
      "Goregaon",
      "Malad",
      "Kandivali",
      "Dahisar",
      "Kurla",
      "Ghatkopar",
      "Powai",
      "Mulund",
    ],

    Nagpur: [
      "Nagpur",
      "Hingna",
      "Kamptee",
      "Katol",
      "Kalameshwar",
      "Umred",
      "Mouda",
      "Saoner",
      "Ramtek",
      "Bhiwapur",
      "Parseoni",
      "Nagpur Rural",
    ],

    Nanded: [
      "Nanded",
      "Biloli",
      "Degloor",
      "Hadgaon",
      "Mudkhed",
      "Ardhapur",
      "Himayatnagar",
      "Kinwat",
      "Kandhar",
      "Mahur",
      "Mukhed",
      "Loha",
    ],

    Nandurbar: [
      "Nandurbar",
      "Shahada",
      "Taloda",
      "Akkalkuwa",
      "Akrani (Dhadgaon)",
      "Navapur",
    ],
    Nashik: [
      "Nashik",
      "Malegaon",
      "Manmad",
      "Sinnar",
      "Igatpuri",
      "Kalwan",
      "Niphad",
      "Chandwad",
      "Trimbak",
      "Yeola",
      "Dindori",
      "Baglan (Satana)",
    ],

    Osmanabad: [
      "Osmanabad",
      "Tuljapur",
      "Omerga",
      "Paranda",
      "Kalamb",
      "Bhoom",
      "Washi",
      "Lohara",
    ],

    Palghar: [
      "Palghar",
      "Vasai",
      "Dahanu",
      "Boisar",
      "Jawhar",
      "Talasari",
      "Mokhada",
      "Vikramgad",
      "Wada",
    ],

    Parbhani: [
      "Parbhani",
      "Pathri",
      "Purna",
      "Manwath",
      "Selu",
      "Jintur",
      "Sonpeth",
      "Gangakhed",
    ],

    Pune: [
      "Pune",
      "Baramati",
      "Junnar",
      "Shirur",
      "Haveli",
      "Bhor",
      "Daund",
      "Indapur",
      "Khed",
      "Maval",
      "Mulshi",
      "Ambegaon",
      "Velhe",
    ],

    Raigad: [
      "Raigad",
      "Alibag",
      "Panvel",
      "Uran",
      "Murud",
      "Khalapur",
      "Pen",
      "Karjat",
      "Roha",
      "Mangaon",
      "Mahad",
      "Shrivardhan",
      "Sudhagad (Pali)",
    ],

    Ratnagiri: [
      "Ratnagiri",
      "Chiplun",
      "Dapoli",
      "Guhagar",
      "Sangameshwar",
      "Rajapur",
      "Khed",
      "Mandangad",
      "Lanja",
    ],

    Sangli: [
      "Sangli",
      "Tasgaon",
      "Vita",
      "Islampur",
      "Miraj",
      "Kadegaon",
      "Jat",
      "Palus",
      "Khanapur",
      "Shirala",
      "Atpadi",
    ],

    Satara: [
      "Satara",
      "Karad",
      "Mahabaleshwar",
      "Phaltan",
      "Wai",
      "Koregaon",
      "Khandala",
      "Patan",
      "Jaoli",
      "Man",
    ],

    Sindhudurg: [
      "Sindhudurg",
      "Malvan",
      "Kudal",
      "Sawantwadi",
      "Vengurla",
      "Devgad",
      "Dodamarg",
      "Kankavli",
    ],

    Solapur: [
      "Solapur",
      "Pandharpur",
      "Barshi",
      "Mangalwedha",
      "Akkalkot",
      "Sangole",
      "Karmala",
      "Madha",
      "Malshiras",
    ],

    Thane: [
      "Thane",
      "Ulhasnagar",
      "Kalyan",
      "Bhiwandi",
      "Murbad",
      "Shahapur",
      "Ambernath",
      "Dombivli",
    ],

    Wardha: [
      "Wardha",
      "Arvi",
      "Hinganghat",
      "Pulgaon",
      "Deoli",
      "Seloo",
      "Ashti",
      "Karanja",
    ],

    Washim: ["Washim", "Risod", "Mangrulpir", "Karanja", "Malegaon", "Manora"],

    Yavatmal: [
      "Yavatmal",
      "Pusad",
      "Darwha",
      "Digras",
      "Arni",
      "Ghatanji",
      "Ralegaon",
      "Wani",
      "Pandharkawada (Kelapur)",
      "Umarkhed",
      "Zari Jamni",
      "Ner",
    ],
  };

  // Populate towns based on the selected district
  function populateTowns() {
    const districtSelect = document.getElementById("district");
    const townSelect = document.getElementById("town");

    // Clear existing options
    townSelect.innerHTML =
      '<option value="" disabled selected>--Select Taluka--</option>';

    const selectedDistrict = districtSelect.value;
    if (selectedDistrict && townsData[selectedDistrict]) {
      townsData[selectedDistrict].forEach((town) => {
        const option = document.createElement("option");
        option.value = town;
        option.textContent = town;
        townSelect.appendChild(option);
      });
    }
  }

  // Make the populateTowns function available globally
  window.populateTowns = populateTowns;

  // Signature Pad Functions
  const canvas = document.getElementById("signature-pad");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let drawing = false;
    let penColor = "black"; // Default pen color

    function resizeCanvas() {
      canvas.width = Math.min(window.innerWidth * 0.9, 450);
      canvas.height = Math.min(window.innerHeight * 0.3, 200);
    }

    // Resize canvas on load and resize
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Drawing with mouse and touch
    function getEventPosition(e) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.touches ? e.touches[0].clientX : e.clientX) - rect.left,
        y: (e.touches ? e.touches[0].clientY : e.clientY) - rect.top,
      };
    }

    canvas.addEventListener("mousedown", (e) =>
      startDrawing(getEventPosition(e))
    );
    canvas.addEventListener("mousemove", (e) => draw(getEventPosition(e)));
    canvas.addEventListener("mouseup", stopDrawing);

    canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      startDrawing(getEventPosition(e));
    });
    canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      draw(getEventPosition(e));
    });
    canvas.addEventListener("touchend", stopDrawing);

    function startDrawing({ x, y }) {
      drawing = true;
      ctx.beginPath();
      ctx.moveTo(x, y);
    }

    function draw({ x, y }) {
      if (!drawing) return;
      ctx.strokeStyle = penColor;
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    function stopDrawing() {
      drawing = false;
    }

    // Make signature functions available globally
    window.changePenColor = (color) => {
      penColor = color;
    };

    window.resetSignature = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    window.openSignatureBox = () => {
      document.getElementById("signature-modal").style.display = "flex";
    };

    window.cancelSignature = () => {
      document.getElementById("signature-modal").style.display = "none";
    };

    window.saveSignature = () => {
      const imageData = canvas.toDataURL("image/png");
      document.getElementById("signature").value = "Signature saved";
      document.getElementById("signature-modal").style.display = "none";
    };

    window.loadSignatureFromFile = (event) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () =>
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        alert("Please select a valid image file.");
      }
    };
  }

  // Loan Application Form Submission
  function submitLoanApplication(event) {
    event.preventDefault();

    // Collect form data
    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      dob: document.getElementById("dob").value,
      gender: document.getElementById("gender").value,
      ownership: document.getElementById("ownership").value,
      address: document.getElementById("address").value,
      pan: document.getElementById("pan").value,
      aadhar: document.getElementById("aadhar").value,
      state: document.getElementById("state").value,
      district: document.getElementById("district").value,
      town: document.getElementById("town").value,
      loanAmount: document.getElementById("loanAmount").value,
      tenure: document.getElementById("tenure").value,
      emiSchedule: document.getElementById("emiSchedule").value,
      refName1: document.getElementById("refName1").value,
      refRelationship1: document.getElementById("refRelationship1").value,
      refContact1: document.getElementById("refContact1").value,
      gownership: document.getElementById("gownership").value,
      guarantorAddress: document.getElementById("guarantorAddress").value,
      guarantorPan: document.getElementById("guarantorPan").value,
      guarantorAadhar: document.getElementById("guarantorAadhar").value,
      status: "Pending",
    };

    // Get existing applications or initialize an empty array
    const loanApplications =
      JSON.parse(localStorage.getItem("loanApplications")) || [];

    // Add the new application
    loanApplications.push(formData);

    // Save updated applications back to localStorage
    localStorage.setItem("loanApplications", JSON.stringify(loanApplications));

    alert("Your loan application has been successfully submitted!");
    document.getElementById("loanForm").reset();

    return false;
  }

  // Make submitLoanApplication function available globally
  window.submitLoanApplication = submitLoanApplication;

  // Penalty Rules Management
  function loadPenaltyRules() {
    return JSON.parse(localStorage.getItem("penaltyRules")) || [];
  }

  function savePenaltyRules(penaltyRules) {
    localStorage.setItem("penaltyRules", JSON.stringify(penaltyRules));
  }

  function updatePenaltyRulesTable() {
    const penaltyRules = loadPenaltyRules();
    if (penaltyRulesTable) {
      penaltyRulesTable.innerHTML = "";

      if (penaltyRules.length === 0) {
        penaltyRulesTable.innerHTML =
          '<tr><td colspan="7" class="text-center">No penalty rules found</td></tr>';
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
            <button class="btn btn-warning btn-sm edit-rule" data-index="${index}">Edit</button>
            <button class="btn btn-danger btn-sm delete-rule" data-index="${index}">Delete</button>
          </td>
        `;
        penaltyRulesTable.appendChild(row);
      });

      // Add event listeners for edit & delete buttons
      document.querySelectorAll(".edit-rule").forEach((button) => {
        button.addEventListener("click", function () {
          const index = this.dataset.index;
          editPenaltyRule(index);
        });
      });

      document.querySelectorAll(".delete-rule").forEach((button) => {
        button.addEventListener("click", function () {
          const index = this.dataset.index;
          deletePenaltyRule(index);
        });
      });
    }
  }

  function editPenaltyRule(index) {
    const penaltyRules = loadPenaltyRules();
    const rule = penaltyRules[index];

    document.getElementById("custName").value = rule.custName;
    document.getElementById("ruleName").value = rule.ruleName;
    document.getElementById("loanType").value = rule.loanType;
    document.getElementById("gracePeriod").value = rule.gracePeriod;
    document.getElementById("penaltyRate").value = rule.penaltyRate;
    document.getElementById("maxPenalty").value = rule.maxPenalty;

    editIndex = index;
    document.getElementById("submitBtn").textContent = "Update Rule";
  }

  function deletePenaltyRule(index) {
    const penaltyRules = loadPenaltyRules();
    if (confirm("Are you sure you want to delete this rule?")) {
      penaltyRules.splice(index, 1);
      savePenaltyRules(penaltyRules);
      updatePenaltyRulesTable();
    }
  }

  if (penaltyRuleForm) {
    penaltyRuleForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const penaltyRules = loadPenaltyRules();

      const newRule = {
        custName: document.getElementById("custName").value,
        ruleName: document.getElementById("ruleName").value,
        loanType: document.getElementById("loanType").value,
        gracePeriod: document.getElementById("gracePeriod").value,
        penaltyRate: document.getElementById("penaltyRate").value,
        maxPenalty: document.getElementById("maxPenalty").value,
      };

      if (editIndex !== null) {
        penaltyRules[editIndex] = newRule; // Update existing rule
        editIndex = null;
        document.getElementById("submitBtn").textContent = "Save Rule";
      } else {
        penaltyRules.push(newRule); // Add new rule
      }

      savePenaltyRules(penaltyRules);
      updatePenaltyRulesTable();
      penaltyRuleForm.reset();

      // Show success message
      alert("Penalty rule saved successfully!");
    });
  }

  // Total Enquiries Management
  function updateEnquiriesTable() {
    const enquiriesTableBody = document.getElementById("enquiriesTableBody");
    if (enquiriesTableBody) {
      enquiriesTableBody.innerHTML = "";
      const loanApplications =
        JSON.parse(localStorage.getItem("loanApplications")) || [];

      if (loanApplications.length === 0) {
        enquiriesTableBody.innerHTML = `<tr><td colspan="12" class="text-center">No data available</td></tr>`;
        return;
      }

      loanApplications.forEach((application, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${application.applicantName || application.name || "N/A"}</td>
          <td>${application.email || "N/A"}</td>
          <td>${application.phone || "N/A"}</td>
          <td>₹${
            application.loanAmount || application.amountSanctioned || "N/A"
          }</td>
          <td>${
            application.loanTenure || application.tenure || "N/A"
          } months</td>
          <td>${application.emiSchedule || "N/A"}</td>
          <td>${application.address || "N/A"}</td>
          <td>${application.state || "N/A"}</td>
          <td>${application.district || "N/A"}</td>
          <td>${application.town || "N/A"}</td>
          <td>${application.status || "Pending"}</td>
          <td>
            <button class="btn btn-info btn-sm view-btn" data-index="${index}">View</button>
          </td>
        `;
        enquiriesTableBody.appendChild(row);
      });

      // Add event listeners to view buttons
      document
        .querySelectorAll("#enquiriesTableBody .view-btn")
        .forEach((button, index) => {
          button.addEventListener("click", () => {
            viewApplication({ target: { dataset: { index } } });
          });
        });
    }
  }

  function viewApplication(e) {
    const index = e.target.dataset.index;
    const application = JSON.parse(localStorage.getItem("loanApplications"))[
      index
    ];

    // Remove any existing modal
    const existingModal = document.getElementById("applicationModal");
    if (existingModal) {
      existingModal.remove();
    }

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
                <p><strong>Date of Birth:</strong> ${
                  application.dob || "N/A"
                }</p>
                <p><strong>Gender:</strong> ${application.gender || "N/A"}</p>
              </div>
              <div class="col-md-6">
                <h6 class="text-primary">Address & Documents</h6>
                <p><strong>Address Ownership:</strong> ${
                  application.ownership || "N/A"
                }</p>
                <p><strong>Address:</strong> ${application.address || "N/A"}</p>
                <p><strong>PAN:</strong> ${application.pan || "N/A"}</p>
                <p><strong>Aadhar:</strong> ${application.aadhar || "N/A"}</p>
              </div>

              <!-- Loan Details -->
              <div class="col-md-12">
                <h6 class="text-success">Loan Information</h6>
                <p><strong>Loan Amount:</strong> ₹${
                  application.loanAmount || "N/A"
                }</p>
                <p><strong>Loan Tenure:</strong> ${
                  application.tenure || "N/A"
                } months</p>
                <p><strong>EMI Schedule:</strong> ${
                  application.emiSchedule || "N/A"
                }</p>
                <p><strong>Status:</strong> <span class="badge bg-${
                  application.status === "Approved" ? "success" : "warning"
                }">${application.status || "Pending"}</span></p>
              </div>

              <!-- Guarantor Details -->
              <div class="col-md-12">
                <h4 class="text-warning text-center">Guarantor Details</h4>
                <p><strong>Guarantor Name:</strong> ${
                  application.refName1 || "N/A"
                }</p>
                <p><strong>Contact:</strong> ${
                  application.refContact1 || "N/A"
                }</p>
                <p><strong>Address Ownership:</strong> ${
                  application.gownership || "N/A"
                }</p>
                <p><strong>Address:</strong> ${
                  application.guarantorAddress || "N/A"
                }</p>
                <p><strong>PAN:</strong> ${
                  application.guarantorPan || "N/A"
                }</p>
                <p><strong>Aadhar:</strong> ${
                  application.guarantorAadhar || "N/A"
                }</p>
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
  `;

    document.body.insertAdjacentHTML("beforeend", modalContent);
    // Declare bootstrap variable
    const bootstrap = window.bootstrap;
    const modal = new bootstrap.Modal(
      document.getElementById("applicationModal")
    );
    modal.show();

    // Add event listener to close button
    document.querySelector(".close-app-modal").addEventListener("click", () => {
      modal.hide();
    });

    document
      .getElementById("applicationModal")
      .addEventListener("hidden.bs.modal", function () {
        this.remove();
      });
  }

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

  // Sanction Letter Functions
  function updateSanctionLettersTable() {
    const tableBody = document.getElementById("sanctionLettersTable");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    sanctionLetters.forEach((letter, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${letter.loanAccNo}</td>
        <td>${letter.applicantName}</td>
        <td>₹${Number(letter.loanAmount).toLocaleString("en-IN")}</td>
        <td>${new Date(letter.sanctionDate).toLocaleDateString("en-IN")}</td>
        <td>
          <button class="btn btn-info btn-sm view-letter" data-index="${index}">View</button>
          <button class="btn btn-primary btn-sm download-letter" data-index="${index}">Download</button>
          <button class="btn btn-success btn-sm send-letter" data-index="${index}">Send</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Add event listeners to buttons
    document.querySelectorAll(".view-letter").forEach((btn) => {
      btn.addEventListener("click", viewSanctionLetter);
    });

    document.querySelectorAll(".download-letter").forEach((btn) => {
      btn.addEventListener("click", downloadSanctionLetter);
    });

    document.querySelectorAll(".send-letter").forEach((btn) => {
      btn.addEventListener("click", sendSanctionLetter);
    });
  }

  function viewSanctionLetter(e) {
    const index = e.target.dataset.index;
    const letter = sanctionLetters[index];

    // Create a modal element if it doesn't exist
    let modalElement = document.getElementById("letterPreviewModal");
    if (!modalElement) {
      const modalHTML = `
        <div class="modal fade" id="letterPreviewModal" tabindex="-1">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Loan Sanction Letter</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <!-- Letter content will be inserted here -->
              </div>
              <div class                <!-- Letter content will be inserted here -->
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary close-letter-btn">Close</button>
                <button type="button" class="btn btn-primary" id="downloadPreview">Download</button>
                <button type="button" class="btn btn-success" id="whatsAppPreview">WhatsApp</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      `;
      document.body.insertAdjacentHTML("beforeend", modalHTML);
      modalElement = document.getElementById("letterPreviewModal");

      // Add event listener to the close button
      modalElement
        .querySelector(".close-letter-btn")
        .addEventListener("click", () => {
          const bootstrap = window.bootstrap;
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          }
        });
    }

    showLetterPreview(letter);
  }

  function showLetterPreview(data) {
    // Declare bootstrap variable
    const bootstrap = window.bootstrap;
    const modalElement = document.getElementById("letterPreviewModal");
    const modalBody = modalElement.querySelector(".modal-body");

    modalBody.innerHTML = generateLetterHTML(data);

    // Initialize and show the modal
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    // Add event listener to the modal's close button
    modalElement.querySelector(".btn-close").addEventListener("click", () => {
      modal.hide();
    });
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
            <tr><th>Loan Account Number</th><td>${data.loanAccNo}</td></tr>
            <tr><th>Applicant Name</th><td>${data.applicantName}</td></tr>
            <tr><th>Sanction Date</th><td>${new Date(
              data.sanctionDate
            ).toLocaleDateString("en-IN")}</td></tr>
            <tr><th>Loan Amount</th><td>₹${Number(
              data.loanAmount
            ).toLocaleString("en-IN")}</td></tr>
            <tr><th>EMI Amount</th><td>₹${Number(data.emiAmount).toLocaleString(
              "en-IN"
            )}/month</td></tr>
            <tr><th>Loan Type</th><td>${data.loanType}</td></tr>
            <tr><th>Tenure</th><td>${data.tenure} years</td></tr>
            <tr><th>Interest Rate</th><td>${
              data.interestRate
            }% per annum</td></tr>
          </table>
        </div>
      </div>
    `;
  }

  function downloadSanctionLetter(e) {
    try {
      const index = e.target.dataset.index;
      const data = sanctionLetters[index];

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
      doc.text("123 Finance Street, City - 400001", 105, 35, {
        align: "center",
      });
      doc.text(
        "Tel: +91 1234567890 | Email: contact@instafinance.com",
        105,
        40,
        { align: "center" }
      );

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

  function sendSanctionLetter(e) {
    const index = e.target.dataset.index;
    const letter = sanctionLetters[index];
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

  // Sanction Letter Form Handler
  if (sanctionLetterForm) {
    sanctionLetterForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = {
        loanAccNo: document.getElementById("loanAccNo").value,
        applicantName: document.getElementById("applicantName").value,
        sanctionDate: document.getElementById("sanctionDate").value,
        loanAmount: document.getElementById("loanAmount").value,
        emiAmount: document.getElementById("emiAmount").value,
        loanType: document.getElementById("loanType").value,
        tenure: document.getElementById("tenure").value,
        interestRate: document.getElementById("interestRate").value,
      };

      // Save to local sanctionLetters array
      sanctionLetters.push(formData);
      localStorage.setItem("sanctionLetters", JSON.stringify(sanctionLetters));

      // Also save to a shared location for Admin Dashboard
      const adminSanctionData = JSON.parse(
        localStorage.getItem("adminSanctionData") || "[]"
      );
      adminSanctionData.push(formData);
      localStorage.setItem(
        "adminSanctionData",
        JSON.stringify(adminSanctionData)
      );

      // Also save to a shared location for SuperAdmin Dashboard
      const superAdminSanctionData = JSON.parse(
        localStorage.getItem("superAdminSanctionData") || "[]"
      );
      superAdminSanctionData.push(formData);
      localStorage.setItem(
        "superAdminSanctionData",
        JSON.stringify(superAdminSanctionData)
      );

      updateSanctionLettersTable();
      this.reset();
      alert("Sanction Letter generated successfully!");
    });
  }

  // Notification form submission
  if (saveTemplateBtn) {
    saveTemplateBtn.addEventListener("click", () => {
      const employeeName = document.getElementById("employeeName").value;
      const templateType = document.getElementById("templateType").value;
      const templateContent = document.getElementById("templateContent").value;

      if (employeeName && templateType && templateContent) {
        // Here you would typically send this data to a server
        // For this example, we'll just show a success message
        alert("Notification saved and sent successfully!");
        notificationForm.reset();
      } else {
        alert("Please fill in all fields");
      }
    });
  }

  // Initialize the dashboard view
  showDashboard();

  // Add event listeners to period buttons
  const periodButtons = document.querySelectorAll(".btn-group .btn");

  periodButtons.forEach((button) => {
    button.addEventListener("click", function () {
      periodButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      updateTable(this.dataset.period);
    });
  });
});
