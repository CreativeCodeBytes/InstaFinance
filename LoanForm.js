document.addEventListener('DOMContentLoaded', function() {
    const menuBar = document.getElementById('menu-bar');
    const navLinks = document.querySelector('.nav-links');
  
    menuBar.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  });
      // Data for towns or Talukas of each districts
      const townsData = {
            "Ahmednagar": ["Ahmednagar", "Shirdi", "Sangamner", "Kopargaon", "Rahata", "Shrirampur", "Pathardi", "Rahuri", "Shrigonda", "Jamkhed", "Newasa", "Karjat", "Akole", "Parner", "Shevgaon", "Nagar", "Bhingar", "Miri", "Puntamba", "Kolhar", "Takali Dhokeshwar", "Wadgaon Gupta"],
  
            "Akola": ["Akola","Akot","Balapur","Patur","Murtijapur","Telhara","Barshitakli"],
  
    "Amravati": ["Amravati", "Achalpur", "Daryapur", "Warud", "Chandur", "Anjangaon", "Morshi", "Chikhaldara", "Nandgaon Khandeshwar", "Teosa"],
  
    "SambhajiNagar": ["SambhajiNagar", "Paithan", "Khuldabad", "Vaijapur", "Kannad", "Sillod", "Phulambri", "Soegaon", "Gangapur"],
  
    "Beed": ["Beed", "Majalgaon", "Georai", "Patoda", "Kaij", "Wadwani", "Dharur", "Ambajogai", "Ashti", "Parli"],
  
    "Bhandara": ["Bhandara", "Tumsar", "Sakoli", "Lakhani", "Mohadi", "Pauni", "Lakhandur"],
  
    "Buldhana": ["Buldhana", "Chikhli", "Khamgaon", "Shegaon", "Deulgaon Raja", "Mehkar", "Nandura", "Sangrampur", "Jalgaon Jamod", "Malkapur", "Motala"],
  
    "Chandrapur": ["Chandrapur", "Ballarpur", "Warora", "Rajura", "Brahmapuri", "Mul", "Chimur", "Pombhurna", "Korpana", "Gondpipri", "Sawali"],
  
    "Dhule": ["Dhule", "Sakri", "Shirpur", "Dondaicha", "Shindkheda"],
  
    "Gadchiroli": ["Gadchiroli", "Aheri", "Armori", "Chamorshi", "Mulchera", "Etapalli", "Bhamragad", "Kurkheda", "Dhanora", "Sironcha"],
  
    "Gondia": ["Gondia", "Tirora", "Amgaon", "Deori", "Sadak Arjuni", "Salekasa", "Goregaon"],
  
    "Hingoli": ["Hingoli", "Sengaon", "Basmath", "Kalamnuri", "Aundha Nagnath"],
  
    "Jalgaon": ["Jalgaon", "Bhusawal", "Chopda", "Erandol", "Yawal", "Amalner", "Parola","Bhadgaon","Pachora", "Dharangaon", "Jamner", "Raver", "Bodwad"],
  
    "Jalna": ["Jalna", "Ambad", "Badnapur", "Partur", "Mantha", "Ghansawangi", "Bhokardan", "Jafrabad"],
  
    "Kolhapur": ["Kolhapur", "Ichalkaranji", "Gadhinglaj", "Kagal", "Shahuwadi", "Panhala", "Hatkanangale", "Karvir", "Radhanagari", "Ajra", "Chandgad", "Bhudargad"],
  
    "Latur": ["Latur", "Udgir", "Ausa", "Nilanga", "Renapur", "Chakur", "Deoni", "Jalkot"],
  
    "Mumbai City": ["Marine Lines", "Cuffe Parade", "Malabar Hill", "Fort", "Byculla", "Girgaon", "Tardeo"],
  
    "Mumbai Suburban": ["Borivali", "Andheri", "Bandra", "Goregaon", "Malad", "Kandivali", "Dahisar", "Kurla", "Ghatkopar", "Powai", "Mulund"],
  
    "Nagpur": ["Nagpur", "Hingna", "Kamptee", "Katol", "Kalameshwar", "Umred", "Mouda", "Saoner", "Ramtek", "Bhiwapur", "Parseoni", "Nagpur Rural"],
  
    "Nanded": ["Nanded", "Biloli", "Degloor", "Hadgaon", "Mudkhed", "Ardhapur", "Himayatnagar", "Kinwat", "Kandhar", "Mahur", "Mukhed", "Loha"],
  
    "Nandurbar": ["Nandurbar", "Shahada", "Taloda", "Akkalkuwa", "Akrani (Dhadgaon)", "Navapur"],
    "Nashik": ["Nashik", "Malegaon", "Manmad", "Sinnar", "Igatpuri", "Kalwan", "Niphad", "Chandwad", "Trimbak", "Yeola", "Dindori", "Baglan (Satana)"],
  
    "Osmanabad": ["Osmanabad", "Tuljapur", "Omerga", "Paranda", "Kalamb", "Bhoom", "Washi", "Lohara"],
  
    "Palghar": ["Palghar", "Vasai", "Dahanu", "Boisar", "Jawhar", "Talasari", "Mokhada", "Vikramgad", "Wada"],
  
    "Parbhani": ["Parbhani", "Pathri", "Purna", "Manwath", "Selu", "Jintur", "Sonpeth", "Gangakhed"],
  
    "Pune": ["Pune", "Baramati", "Junnar", "Shirur", "Haveli", "Bhor", "Daund", "Indapur", "Khed", "Maval", "Mulshi", "Ambegaon", "Velhe"],
  
    "Raigad": ["Raigad", "Alibag", "Panvel", "Uran", "Murud", "Khalapur", "Pen", "Karjat", "Roha", "Mangaon", "Mahad", "Shrivardhan", "Sudhagad (Pali)"],
  
    "Ratnagiri": ["Ratnagiri", "Chiplun", "Dapoli", "Guhagar", "Sangameshwar", "Rajapur", "Khed", "Mandangad", "Lanja"],
  
    "Sangli": ["Sangli", "Tasgaon", "Vita", "Islampur", "Miraj", "Kadegaon", "Jat", "Palus", "Khanapur", "Shirala", "Atpadi"],
  
    "Satara": ["Satara", "Karad", "Mahabaleshwar", "Phaltan", "Wai", "Koregaon", "Khandala", "Patan", "Jaoli", "Man"],
  
    "Sindhudurg": ["Sindhudurg", "Malvan", "Kudal", "Sawantwadi", "Vengurla", "Devgad", "Dodamarg", "Kankavli"],
  
    "Solapur": ["Solapur", "Pandharpur", "Barshi", "Mangalwedha", "Akkalkot", "Sangole", "Karmala", "Madha", "Malshiras"],
  
    "Thane": ["Thane", "Ulhasnagar", "Kalyan", "Bhiwandi", "Murbad", "Shahapur", "Ambernath", "Dombivli"],
  
    "Wardha": ["Wardha", "Arvi", "Hinganghat", "Pulgaon", "Deoli", "Seloo", "Ashti", "Karanja"],
  
    "Washim": ["Washim", "Risod", "Mangrulpir", "Karanja", "Malegaon", "Manora"],
    
    "Yavatmal": ["Yavatmal", "Pusad", "Darwha", "Digras", "Arni", "Ghatanji", "Ralegaon", "Wani", "Pandharkawada (Kelapur)", "Umarkhed", "Zari Jamni", "Ner"]
        
  };
  
      // Populate towns based on the selected district
      function populateTowns() {
        const districtSelect = document.getElementById('district');
        const townSelect = document.getElementById('town');
  
        // Clear existing options
        townSelect.innerHTML = '<option value="" disabled selected>--Select Taluka--</option>';
  
        const selectedDistrict = districtSelect.value;
        if (selectedDistrict && townsData[selectedDistrict]) {
          townsData[selectedDistrict].forEach(town => {
            const option = document.createElement('option');
            option.value = town;
            option.textContent = town;
            townSelect.appendChild(option);
          });
        }
      }
  
      // Script for input validation 
      document.addEventListener('DOMContentLoaded', () => {
        const inputs = {
          fullName: {
            element: document.getElementById('name'),
            regex: /^[A-Za-z\s]+$/,
            errorMessage: "Invalid full name. Only alphabets and spaces are allowed.",
            successMessage: "Valid full name.",
          },
          phone: {
            element: document.getElementById('phone'),
            regex: /^[6-9]\d{9}$/,
            errorMessage: "Invalid phone number. Must be 10 digits starting with 6-9.",
            successMessage: "Valid phone number.",
          },
          email: {
            element: document.getElementById('email'),
            regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            errorMessage: "Invalid email address format.",
            successMessage: "Valid email address.",
          },
          pan: {
            element: document.getElementById('pan'),
            regex: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
            errorMessage: "Invalid PAN format. Must be in format: ABCDE1234F.",
            successMessage: "Valid PAN number.",
          },
          aadhar: {
            element: document.getElementById('aadhar'),
            regex: /^\d{12}$/,
            errorMessage: "Invalid Aadhaar number. Must be exactly 12 digits.",
            successMessage: "Valid Aadhaar number.",
          },
          guarantorPhone: {
            element: document.getElementById('refContact1'),
            regex: /^[6-9]\d{9}$/,
            errorMessage: "Invalid guarantor phone number. Must be 10 digits starting with 6-9.",
            successMessage: "Valid phone number.",
          },
          guarantorPan: {
            element: document.getElementById('guarantorPan'),
            regex: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
            errorMessage: "Invalid guarantor PAN format. Must be in format: ABCDE1234F.",
            successMessage: "Valid PAN number.",
          },
          guarantorAadhar: {
            element: document.getElementById('guarantorAadhar'),
            regex: /^\d{12}$/,
            errorMessage: "Invalid guarantor Aadhaar number. Must be exactly 12 digits.",
            successMessage: "Valid Aadhaar number.",
          },
          guarantorName: {
            element: document.getElementById('refName1'),
            regex: /^[A-Za-z\s]+$/,
            errorMessage: "Invalid guarantor name. Only alphabets and spaces are allowed.",
            successMessage: "Valid guarantor name.",
          },
          guarantorRelationship: {
            element: document.getElementById('refRelationship1'),
            regex: /^[A-Za-z\s]+$/,
            errorMessage: "Invalid relationship. Only alphabets and spaces are allowed.",
            successMessage: "Valid relationship.",
          },
        };
  
        Object.values(inputs).forEach(({ element, regex, errorMessage, successMessage }) => {
          const messageElement = document.createElement('div');
          messageElement.className = 'validation-message';
          element.parentElement.appendChild(messageElement);
  
          element.addEventListener('input', () => {
            if (!regex.test(element.value)) {
              messageElement.style.color = 'red';
              messageElement.textContent = errorMessage;
            } else {
              messageElement.style.color = 'green';
              messageElement.textContent = successMessage;
            }
          });
        });
      });
  
      // Signature
      const canvas = document.getElementById("signature-pad");
      const ctx = canvas.getContext("2d");
      let drawing = false;
      let penColor = "black"; // Default pen color
  
      function resizeCanvas() {
        canvas.width = Math.min(window.innerWidth * 0.9, 450);
        canvas.height = Math.min(window.innerHeight * 0.3, 200);
      }
  
      // Resize canvas on load and resize
      window.onload = resizeCanvas;
      window.onresize = resizeCanvas;
  
      // Drawing with mouse and touch
      function getEventPosition(e) {
        const rect = canvas.getBoundingClientRect();
        return {
          x: (e.touches ? e.touches[0].clientX : e.clientX) - rect.left,
          y: (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
        };
      }
  
      canvas.addEventListener("mousedown", (e) => startDrawing(getEventPosition(e)));
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
  
      function changePenColor(color) {
        penColor = color;
      }
  
      function resetSignature() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
  
      function openSignatureBox() {
        document.getElementById("signature-modal").style.display = "flex";
      }
  
      function cancelSignature() {
        document.getElementById("signature-modal").style.display = "none";
      }
  
      function saveSignature() {
        const imageData = canvas.toDataURL("image/png");
        document.getElementById("signature").value = "Signature saved";
        document.getElementById("signature-modal").style.display = "none";
      }
  
      function loadSignatureFromFile(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            img.src = e.target.result;
          };
          reader.readAsDataURL(file);
        } else {
          alert("Please select a valid image file.");
        }
      }
  
      //script for loan amount
  document.getElementById("loanAmount").addEventListener("input", function () {
    const loanAmount = this.value;
    const errorElement = document.getElementById("loanAmountError");
  
    if (loanAmount < 10000 || loanAmount > 1000000) {
      errorElement.textContent = "Loan amount must be between ₹10,000 and ₹10,00,000.";
    } else {
      errorElement.textContent = ""; // Clear error message
    }
  });
  
      document.getElementById("dob").addEventListener("change", function () {
        const dob = new Date(this.value);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        const dayDiff = today.getDate() - dob.getDate();
  
        // Adjust age calculation if birthday has not occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          age--;
        }
  
        const errorElement = document.getElementById("dob-error");
  
        // Show or hide error based on strict age validation (must be over 18)
        if (age <= 18) {
          errorElement.style.display = "block"; // Show error message
          this.setCustomValidity("You must be older than 18 years."); // Prevent form submission
        } else {
          errorElement.style.display = "none"; // Hide error message
          this.setCustomValidity(""); // Allow form submission
        }
      });
  
      function submitLoanApplication(event) {
        event.preventDefault();
        
        // Collect form data
        const formData = {
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          phone: document.getElementById('phone').value,
          dob: document.getElementById('dob').value,
          gender: document.getElementById('gender').value,
          ownership: document.getElementById('ownership').value,
          address: document.getElementById('address').value,
          pan: document.getElementById('pan').value,
          aadhar: document.getElementById('aadhar').value,
          state: document.getElementById('state').value,
          district: document.getElementById('district').value,
          town: document.getElementById('town').value,
          loanAmount: document.getElementById('loanAmount').value,
          tenure: document.getElementById('tenure').value,
          emiSchedule: document.getElementById('emiSchedule').value,
          refName1: document.getElementById('refName1').value,
          refRelationship1: document.getElementById('refRelationship1').value,
          refContact1: document.getElementById('refContact1').value,
          gownership: document.getElementById('gownership').value,
          guarantorAddress: document.getElementById('guarantorAddress').value,
          guarantorPan: document.getElementById('guarantorPan').value,
          guarantorAadhar: document.getElementById('guarantorAadhar').value,
          status: 'Pending',
        };
  
        // Get existing applications or initialize an empty array
        let loanApplications = JSON.parse(localStorage.getItem('loanApplications')) || [];
        
        // Add the new application
        loanApplications.push(formData);
        
        // Save updated applications back to localStorage
        localStorage.setItem('loanApplications', JSON.stringify(loanApplications));
  
        alert("Your loan application has been successfully submitted!");
        document.getElementById('loanForm').reset();
      }
  
      function validateForm() {
        let valid = true;
  
        // Clear previous error messages
        clearErrors();
  
        // Validate Loan Amount
        const loanAmount = document.getElementById('loanAmount').value;
        if (loanAmount < 10000) {
          document.getElementById('loanAmountError').innerText = "Loan amount must be at least ₹10,000.";
          valid = false;
        }
  
        // Validate Loan Tenure
        const tenure = document.getElementById('tenure').value;
        if (tenure < 6 || tenure > 240) {
          document.getElementById('tenureError').innerText = "Loan tenure should be between 6 months and 240 months.";
          valid = false;
        }
  
        // Validate EMI Schedule
        const emiSchedule = document.getElementById('emiSchedule').value;
        if (!emiSchedule) {
          document.getElementById('emiScheduleError').innerText = "Please select a preferred EMI schedule.";
          valid = false;
        }
  
        return valid;
      }
  
      function clearErrors() {
        const errorElements = document.querySelectorAll('.error');
        errorElements.forEach(element => {
          element.innerText = '';
        });
      }
  
      document.getElementById('loanForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
          submitLoanApplication(e);
        }
      });
  
      function showAlert(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'custom-alert';
        alertDiv.innerHTML = `
          <p>${message}</p>
          <button onclick="this.parentElement.style.display='none'">Close</button>
        `;
        document.body.appendChild(alertDiv);
      }
  
      //just added
       // Function to convert image to base64
      function getBase64(file) {
              return new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => resolve(reader.result);
                  reader.onerror = error => reject(error);
              });
        }
        // Process all file inputs
        const fileInputs = ['photoUpload', 'aadharUpload', 'panUpload', 'incomeProof', 'residentialProof', 
                              'photoUpload2', 'aadharUpload2', 'panUpload2', 'gincomeProof', 'gresidentialProof'];
  
  
                              
      // Convert image inputs to Base64 and store them
      convertImageToBase64(document.getElementById('photoUpload'), function (photoBase64) {
          formData.photo = photoBase64;
  
          convertImageToBase64(document.getElementById('aadharUpload'), function (aadharBase64) {
              formData.aadhar = aadharBase64;
  
              convertImageToBase64(document.getElementById('panUpload'), function (panBase64) {
                  formData.panCard = panBase64;  
  
                  // Get existing applications or initialize an empty array
                  let loanApplications = JSON.parse(localStorage.getItem('loanApplications')) || [];
                  
                  // Add the new application
                  loanApplications.push(formData);
                  
                  // Save updated applications back to localStorage
                  localStorage.setItem('loanApplications', JSON.stringify(loanApplications));
  
                  alert("Your loan application has been successfully submitted!");
                  document.getElementById('loanForm').reset();
              });
          });
      });
    // });
  