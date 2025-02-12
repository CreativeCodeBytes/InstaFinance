document.getElementById('loanForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      dob: document.getElementById('dob').value,
      gender: document.getElementById('gender').value,
      address: document.getElementById('address').value,
      pan: document.getElementById('pan').value,
      state: document.getElementById('state').value,
      nationality: document.getElementById('nationality').value,
      loanAmount: document.getElementById('loanAmount').value,
      tenure: document.getElementById('tenure').value,
      emiSchedule: document.getElementById('emiSchedule').value
    };
    

    // Store the form data in localStorage
    let loanApplications = JSON.parse(localStorage.getItem('loanApplications')) || [];
    loanApplications.push(formData);
    localStorage.setItem('loanApplications', JSON.stringify(loanApplications));

    showAlert("Your loan application has been successfully submitted!");
    this.reset();
    
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

    // Data for towns or Talukas of each  districts
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

    // script for input validation 

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
      element: document.querySelector('input[name="pan"][placeholder="Enter guarantor Pan number"]'),
      regex: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      errorMessage: "Invalid guarantor PAN format. Must be in format: ABCDE1234F.",
      successMessage: "Valid PAN number.",
    },
    guarantorAadhar: {
      element: document.querySelector('input[name="aadhar"][placeholder="Enter guarantor Aadhar number"]'),
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
// //signature
//   // Signature Pad Initialization
// const canvas = document.getElementById("signature-pad");
// const ctx = canvas.getContext("2d");
// let drawing = false;
// let penColor = "black"; // Default pen color
// let hasDrawn = false; // Track if user has drawn
// let fileUploaded = false; // Track if file is uploaded
// const signatureInput = document.getElementById("signature-input"); // Hidden input to store signature

// // Resize Canvas
// function resizeCanvas() {
//   canvas.width = Math.min(window.innerWidth * 0.9, 450);
//   canvas.height = Math.min(window.innerHeight * 0.3, 200);
//   ctx.fillStyle = "white"; // Make background white
//   ctx.fillRect(0, 0, canvas.width, canvas.height);
// }
// window.onload = resizeCanvas;
// window.onresize = resizeCanvas;

// // Get event position for mouse and touch events
// function getEventPosition(e) {
//   const rect = canvas.getBoundingClientRect();
//   return {
//     x: (e.touches ? e.touches[0].clientX : e.clientX) - rect.left,
//     y: (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
//   };
// }

// // Event Listeners for Drawing
// canvas.addEventListener("mousedown", (e) => startDrawing(getEventPosition(e)));
// canvas.addEventListener("mousemove", (e) => draw(getEventPosition(e)));
// canvas.addEventListener("mouseup", stopDrawing);
// canvas.addEventListener("mouseleave", stopDrawing);

// canvas.addEventListener("touchstart", (e) => {
//   e.preventDefault();
//   startDrawing(getEventPosition(e));
// });
// canvas.addEventListener("touchmove", (e) => {
//   e.preventDefault();
//   draw(getEventPosition(e));
// });
// canvas.addEventListener("touchend", stopDrawing);

// // Start Drawing
// function startDrawing({ x, y }) {
//   drawing = true;
//   hasDrawn = true; // User has drawn on the pad
//   fileUploaded = false; // Reset file upload flag when drawing
//   ctx.beginPath();
//   ctx.moveTo(x, y);
// }

// // Draw Line
// function draw({ x, y }) {
//   if (!drawing) return;
//   ctx.strokeStyle = penColor;
//   ctx.lineWidth = 2;
//   ctx.lineTo(x, y);
//   ctx.stroke();
// }

// // Stop Drawing
// function stopDrawing() {
//   drawing = false;
// }

// // Change Pen Color
// function changePenColor(color) {
//   penColor = color;
// }

// // Reset Signature (Clears Drawing & File Upload)
// function resetSignature() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.fillStyle = "white"; // Reset with white background
//   ctx.fillRect(0, 0, canvas.width, canvas.height);
//   hasDrawn = false;
//   fileUploaded = false;
//   document.getElementById("signature-file").value = ""; // Clear file input
//   signatureInput.value = ""; // Clear hidden input
//   document.getElementById("signature-error").style.display = "none"; // Hide error message
// }

// // Open Signature Box
// function openSignatureBox() {
//   document.getElementById("signature-modal").style.display = "flex";
// }

// // Cancel Signature Box
// function cancelSignature() {
//   document.getElementById("signature-modal").style.display = "none";
// }

// // Save Signature (Only if drawn or file uploaded)
// function saveSignature() {
//   if (!hasDrawn && !fileUploaded) {
//     document.getElementById("signature-error").style.display = "block";
//     return;
//   }
//   document.getElementById("signature-error").style.display = "none";

//   // Convert canvas to Base64 and store in hidden input
//   const imageData = canvas.toDataURL("image/png");
//   signatureInput.value = imageData; // Store signature in input field

//   alert("Signature saved successfully!");
//   document.getElementById("signature-modal").style.display = "none";
// }

// // Load Signature from File
// function loadSignatureFromFile(event) {
//   const file = event.target.files[0];
//   if (file && file.type.startsWith("image/")) {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const img = new Image();
//       img.onload = () => {
//         ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous signature
//         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//         fileUploaded = true; // Mark file as uploaded
//         hasDrawn = false; // Reset drawing flag when file is uploaded

//         // Store uploaded image as Base64 in hidden input
//         signatureInput.value = e.target.result;
//       };
//       img.src = e.target.result;
//     };
//     reader.readAsDataURL(file);
//   } else {
//     alert("Please select a valid image file.");
//   }
// }

//   // const canvas = document.getElementById("signature-pad");
//   //   const ctx = canvas.getContext("2d");
//   //   let drawing = false;
//   //   let penColor = "black"; // Default pen color
  
// Signature Pad Initialization
const canvas = document.getElementById("signature-pad");
const ctx = canvas.getContext("2d");
let drawing = false;
let hasDrawn = false;
let fileUploaded = false;
let penColor = "black";
const signatureInput = document.getElementById("signature");
const signatureData = document.getElementById("signature-data");
const signatureError = document.getElementById("signature-error");

// Resize Canvas and Set Background
function resizeCanvas() {
  canvas.width = Math.min(window.innerWidth * 0.9, 450);
  canvas.height = Math.min(window.innerHeight * 0.3, 200);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
window.onload = resizeCanvas;
window.onresize = resizeCanvas;

// Get Event Position (Mouse & Touch)
function getEventPosition(e) {
  const rect = canvas.getBoundingClientRect();
  return {
      x: (e.touches ? e.touches[0].clientX : e.clientX) - rect.left,
      y: (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
  };
}

// Event Listeners for Drawing
canvas.addEventListener("mousedown", (e) => startDrawing(getEventPosition(e)));
canvas.addEventListener("mousemove", (e) => draw(getEventPosition(e)));
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  startDrawing(getEventPosition(e));
});
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  draw(getEventPosition(e));
});
canvas.addEventListener("touchend", stopDrawing);

// Start Drawing
function startDrawing({ x, y }) {
  drawing = true;
  hasDrawn = true;
  fileUploaded = false;
  ctx.beginPath();
  ctx.moveTo(x, y);
}

// Draw Line
function draw({ x, y }) {
  if (!drawing) return;
  ctx.strokeStyle = penColor;
  ctx.lineWidth = 2;
  ctx.lineTo(x, y);
  ctx.stroke();
}

// Stop Drawing
function stopDrawing() {
  drawing = false;
}

// Change Pen Color
function changePenColor(color) {
  penColor = color;
}

// Reset Signature Pad
function resetSignature() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  hasDrawn = false;
  fileUploaded = false;
  document.getElementById("signature-file").value = "";
  signatureInput.value = "";
  signatureData.value = "";
  signatureError.style.display = "none";
}

// Open Signature Modal
function openSignatureBox() {
  document.getElementById("signature-modal").style.display = "flex";
}

// Close Signature Modal
function cancelSignature() {
  document.getElementById("signature-modal").style.display = "none";
}

// Save Signature
function saveSignature() {
  if (!hasDrawn && !fileUploaded) {
      signatureError.style.display = "block";
      return;
  }
  signatureError.style.display = "none";

  // Convert drawn signature to Base64 image
  const imageData = canvas.toDataURL("image/png");
  signatureInput.value = "Signature Saved";
  signatureData.value = imageData;

  alert("Signature saved successfully!");
  document.getElementById("signature-modal").style.display = "none";
}

// Load Signature from File
function loadSignatureFromFile(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              fileUploaded = true;
              hasDrawn = false;
              signatureInput.value = "Signature Uploaded";
              signatureData.value = e.target.result;
          };
          img.src = e.target.result;
      };
      reader.readAsDataURL(file);
  } else {
      alert("Please select a valid image file.");
  }
}

//   function resizeCanvas() {
//     canvas.width = Math.min(window.innerWidth * 0.9, 450);
//     canvas.height = Math.min(window.innerHeight * 0.3, 200);
//   }
//   // Resize canvas on load and resize
//   window.onload = resizeCanvas;
//   window.onresize = resizeCanvas;

//   // Drawing with mouse and touch
//   function getEventPosition(e) {
//     const rect = canvas.getBoundingClientRect();
//     return {
//       x: (e.touches ? e.touches[0].clientX : e.clientX) - rect.left,
//       y: (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
//     };
//   }

//   canvas.addEventListener("mousedown", (e) => startDrawing(getEventPosition(e)));
//   canvas.addEventListener("mousemove", (e) => draw(getEventPosition(e)));
//   canvas.addEventListener("mouseup", stopDrawing);

//   canvas.addEventListener("touchstart", (e) => {
//     e.preventDefault();
//     startDrawing(getEventPosition(e));
//   });
//   canvas.addEventListener("touchmove", (e) => {
//     e.preventDefault();
//     draw(getEventPosition(e));
//   });
//   canvas.addEventListener("touchend", stopDrawing);

//   function startDrawing({ x, y }) {
//     drawing = true;
//     ctx.beginPath();
//     ctx.moveTo(x, y);
//   }

//   function draw({ x, y }) {
//     if (!drawing) return;
//     ctx.strokeStyle = penColor;
//     ctx.lineTo(x, y);
//     ctx.stroke();
//   }

//   function stopDrawing() {
//     drawing = false;
//   }

//   function changePenColor(color) {
//     penColor = color;
//   }

//   function resetSignature() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//   }

//   function openSignatureBox() {
//     document.getElementById("signature-modal").style.display = "flex";
//   }

//   function cancelSignature() {
//     document.getElementById("signature-modal").style.display = "none";
//   }

//   function saveSignature() {
//     const imageData = canvas.toDataURL("image/png");
//     document.getElementById("signature").value = "Signature saved";
//     document.getElementById("signature-modal").style.display = "none";
//   }

//   function loadSignatureFromFile(event) {
//     const file = event.target.files[0];
//     if (file && file.type.startsWith("image/")) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const img = new Image();
//         img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//         img.src = e.target.result;
//       };
//       reader.readAsDataURL(file);
//     } else {
//       alert("Please select a valid image file.");
//     }
//   }

//DOB validations
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

// Checkbox Validation Script
document.getElementById('loanForm').addEventListener('submit', function (e) {
  const agreeCheckbox = document.getElementById('agree');
  const errorElement = document.getElementById('agree-error');
  
  if (!agreeCheckbox.checked) {
    e.preventDefault(); // Prevent form submission
    errorElement.style.display = 'block'; // Show error message
  } else {
    errorElement.style.display = 'none'; // Hide error message
  }
});
//for print validation
document.getElementById("printButton").addEventListener("click", function() {
  // Hide validation messages
  document.querySelectorAll(".validation-message").forEach(function(element) {
      element.style.display = "none";
  });

  // Print the form
  window.print();

  // Optional: Restore validation messages after printing
  setTimeout(() => {
      document.querySelectorAll(".validation-message").forEach(function(element) {
          element.style.display = "block";
      });
  }, 1000);
});

function submitLoanApplication(event) {
  event.preventDefault();

  // Collect form data
  const formData = gatherFormData();

  // Convert images to Base64 and submit data after all conversions are done
  convertImageToBase64(document.getElementById('photoUpload'), function(photoBase64) {
      formData.photo = photoBase64;

      convertImageToBase64(document.getElementById('aadharUpload'), function(aadharBase64) {
          formData.aadhar = aadharBase64;

          convertImageToBase64(document.getElementById('panUpload'), function(panBase64) {
              formData.panCard = panBase64;

              // Proceed to store the application
              storeLoanApplication(formData);
          });
      });
  });
}

function gatherFormData() {
  return {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      dob: document.getElementById('dob').value,
      gender: document.getElementById('gender').value,
      address: document.getElementById('address').value,
      pan: document.getElementById('pan').value,
      state: document.getElementById('state').value,
      district: document.getElementById('district').value,
      town: document.getElementById('town').value,
      loanAmount: document.getElementById('loanAmount').value,
      tenure: document.getElementById('tenure').value,
      emiSchedule: document.getElementById('emiSchedule').value,
      refName1: document.getElementById('refName1').value,
      refRelationship1: document.getElementById('refRelationship1').value,
      refContact1: document.getElementById('refContact1').value,
      guarantorAddress: document.getElementById('guarantorAddress').value,
      guarantorPan: document.getElementById('guarantorPan').value,
      guarantorAadhar: document.getElementById('guarantorAadhar').value,
      status: 'Pending'
  };
}

function storeLoanApplication(formData) {
  // Uncomment when you're ready to store the application data
  let loanApplications = JSON.parse(localStorage.getItem('loanApplications')) || [];
  loanApplications.push(formData);
  localStorage.setItem('loanApplications', JSON.stringify(loanApplications));

  showAlert("Your loan application has been successfully submitted!");
  document.getElementById('loanForm').reset();
}

function validateForm() {
  let valid = true;
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

function convertImageToBase64(input, callback) {
  const file = input.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
          callback(e.target.result);
      };
      reader.onerror = function (err) {
          console.error("Error reading file:", err);
          callback(null); // Handle error case
      };
      reader.readAsDataURL(file);
  } else {
      callback(null);
  }
}

function showAlert(message) {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'custom-alert';
  alertDiv.innerHTML = `
      <p>${message}</p>
      <button onclick="this.parentElement.style.display='none'">Close</button>
  `;
  document.body.appendChild(alertDiv);
}

// Event Listener for form submission
document.getElementById('loanForm').addEventListener('submit', function (e) {
  e.preventDefault();
  if (validateForm()) {
      submitLoanApplication(e);
  }
});
