// Updated script.js (full rebuild with mileage fix, Safari support, optional sections, and working PDF)

const form = document.getElementById('expenses-form');
const addMileageBtn = document.getElementById('add-mileage');
const mileageContainer = document.getElementById('mileage-claims');
const mileageSubtotal = document.getElementById('mileage-subtotal');
const totalAmount = document.getElementById('totalAmount');
const MILEAGE_RATE = 0.45;

function updateTotals() {
  let total = 0;
  let mileageTotal = 0;

  const milesInputs = document.querySelectorAll('.mileage-miles');
  const amountInputs = document.querySelectorAll('.mileage-amount');

  for (let i = 0; i < milesInputs.length; i++) {
    const miles = parseFloat(milesInputs[i].value);
    const amount = isNaN(miles) ? 0 : (miles * MILEAGE_RATE);
    amountInputs[i].value = amount.toFixed(2);
    mileageTotal += amount;
  }

  mileageSubtotal.innerText = mileageTotal.toFixed(2);
  totalAmount.value = mileageTotal.toFixed(2); // Expand if other sections are re-added
}

form.addEventListener('input', updateTotals);

addMileageBtn.addEventListener('click', () => {
  const entry = document.createElement('div');
  entry.className = 'entry';
  entry.innerHTML = `
    <input type="date" class="mileage-date" />
    <input type="text" class="mileage-purpose" placeholder="Purpose of Journey" />
    <input type="number" class="mileage-miles" placeholder="Miles" step="0.1" />
    <input type="text" class="mileage-amount" placeholder="£" readonly />
  `;
  mileageContainer.insertBefore(entry, addMileageBtn);
  entry.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updateTotals);
  });
});

// Signature pad
const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;

canvas.addEventListener('mousedown', () => (drawing = true));
canvas.addEventListener('mouseup', () => {
  drawing = false;
  ctx.beginPath();
});
canvas.addEventListener('mousemove', draw);

function draw(e) {
  if (!drawing) return;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#000';
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

document.getElementById('clear-signature').onclick = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// Submit via email (mailto fallback)
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const job = document.getElementById('jobTitle').value;
  const period = document.getElementById('claimPeriod').value;
  const total = document.getElementById('totalAmount').value;
  const auth = document.getElementById('claimAuthorised').value;

  const subject = encodeURIComponent(`Expense Claim from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nJob Title: ${job}\nPeriod: ${period}\nClaim Authorised By: ${auth}\nTotal Claimed: £${total}`
  );

  window.location.href = `mailto:Kieran@ymca.scot?subject=${subject}&body=${body}`;
});

// PDF generation (uses actual form)
const downloadBtn = document.getElementById('download-pdf');
downloadBtn.onclick = () => {
  const element = document.querySelector('.container');
  html2pdf()
    .set({
      margin: [15, 10, 15, 10],
      filename: `YMCA_Expenses_${document.getElementById('name').value || 'claim'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        scrollY: 0,
        windowWidth: document.body.scrollWidth,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    })
    .from(element)
    .save();
};
