// Updated script.js

// Auto-calculate mileage and total
const form = document.getElementById('expenses-form');
const addMileageBtn = document.getElementById('add-mileage');
const mileageContainer = document.getElementById('mileage-claims');
const mileageSubtotal = document.getElementById('mileage-subtotal');
const totalAmount = document.getElementById('totalAmount');

const MILEAGE_RATE = 0.45;

function updateTotals() {
  let total = 0;
  let mileageTotal = 0;

  document.querySelectorAll('.mileage-miles').forEach((input, i) => {
    const miles = parseFloat(input.value) || 0;
    const amount = (miles * MILEAGE_RATE).toFixed(2);
    mileageTotal += parseFloat(amount);
    document.querySelectorAll('.mileage-amount')[i].value = amount;
  });

  mileageSubtotal.innerText = mileageTotal.toFixed(2);
  total = mileageTotal;
  totalAmount.value = total.toFixed(2);
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

// Submit button sends email via mailto:
document.getElementById('expenses-form').addEventListener('submit', function (e) {
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

// PDF Generation from visible page
const downloadBtn = document.getElementById('download-pdf');
downloadBtn.onclick = () => {
  const element = document.querySelector('.container');
  const opt = {
    margin: [10, 10],
    filename: `YMCA_Expenses_${document.getElementById('name').value || 'claim'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };
  html2pdf()   .set({     margin: [15, 10, 15, 10], // top, left, bottom, right     filename: `YMCA_Expenses_${document.getElementById('name').value || 'claim'}.pdf`,     image: { type: 'jpeg', quality: 0.98 },     html2canvas: {       scale: 2,       scrollY: 0,       windowWidth: document.body.scrollWidth,     },     jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },     pagebreak: { mode: ['css', 'legacy'] }   })   .from(element)   .save();
};
