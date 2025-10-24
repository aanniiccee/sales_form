// URL ของ Google Apps Script Web App
const GAS_URL = "https://script.google.com/macros/s/AKfycbxrWEFERuo05dPsgP2UoHXG3jgdeylBnKcEDGvDVQyp18Jcl_CKvCA4TMsEH8eKK0af/exec";

// --- ฟังก์ชัน alert แบบ custom ---
function showCustomAlert(msg) {
  const alertDiv = document.getElementById("customAlert");
  document.getElementById("alertMessage").innerText = msg;
  alertDiv.style.display = "block";
}

function closeAlert() {
  document.getElementById("customAlert").style.display = "none";
}

// --- ดึง phone suggestions ---
function fetchPhoneSuggestions() {
  const query = document.getElementById("phoneNumber").value.trim();
  if (!query) return;

  fetch(`${GAS_URL}?action=getMatchingPhoneNumbers&query=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      const suggestionsDiv = document.getElementById("phoneSuggestions");
      suggestionsDiv.innerHTML = "";

      if (data.length) {
        suggestionsDiv.style.display = "block";
        data.forEach(phone => {
          const div = document.createElement("div");
          div.textContent = phone;
          div.style.cursor = "pointer";
          div.onclick = () => {
            document.getElementById("phoneNumber").value = phone;
            suggestionsDiv.style.display = "none";
          };
          suggestionsDiv.appendChild(div);
        });
      } else {
        suggestionsDiv.style.display = "none";
      }
    })
    .catch(err => showCustomAlert("Error fetching phone numbers: " + err));
}

// --- Save order ---
function saveOrder() {
  const phone = document.getElementById("phoneNumber").value.trim();
  const deliveryFee = parseFloat(document.getElementById("deliveryFee").value);

  if (!phone) { showCustomAlert("Phone is required"); return; }
  if (isNaN(deliveryFee)) { showCustomAlert("Delivery fee is required"); return; }

  const orderData = {
    action: "saveOrder",
    orderData: {
      phoneNumber: phone,
      deliveryFee: deliveryFee,
      products: [] // เพิ่มสินค้าตามต้องการ
    }
  };

  fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData)
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        showCustomAlert("Order saved successfully!");
      } else {
        showCustomAlert("Error saving order: " + res.error);
      }
    })
    .catch(err => showCustomAlert("Error: " + err));
}
