// script.js including mileage, phone bill, and other expenses sections with calculation and Safari-safe logic

const form = document.getElementById('expenses-form');
const addMileageBtn = document.getElementById('add-mileage');
const addPhoneBtn = document.getElementById('add-phone');
const addOtherBtn = document.getElementById('add-other');

const mileageSubtotal = document.getElementById('mileage-subtotal');
const phoneSubtotal = document.getElementById('phone-subtotal');
const otherSubtotal = document.getElementById('other-subtotal');
const totalAmount = document.getElementById('totalAmount');

const MILEAGE_RATE = 0.45;

function updateTotals() {
  let total = 0;

  // Mileage
  let mileageTotal = 0;
  document.querySelectorAll('.mileage-entry').forEach(row => {
    const miles = parseFloat(row.querySelector('.mileage-miles').value) || 0;
    const amount = miles * MILEAGE_RATE;
    row.querySelector('.mileage-amount').value = amount.toFixed(2);
    mileageTotal += amount;
  });
  mileageSubtotal.innerText = mileageTotal.toFixed(2);
  total += mileageTotal;

  // Phone Bill
  let phoneTotal = 0;
  document.querySelectorAll('.phone-entry').forEach(row => {
    const amt = parseFloat(row.querySelector('.phone-amount').value) || 0;
    phoneTotal += amt;
  });
  phoneSubtotal.innerText = phoneTotal.toFixed(2);
  total += phoneTotal;

  // Other Expenses
  let otherTotal = 0;
  document.querySelectorAll('.other-entry').forEach(row => {
    const amt = parseFloat(row.querySelector('.other-amount').value) || 0;
    otherTotal += amt;
  });
  otherSubtotal.innerText = otherTotal.toFixed(2);
  total += otherTotal;

  totalAmount.value = total.toFixed(2);
}

form.addEventListener('input', updateTotals);

addMileageBtn.addEventListener('click', () => {
  const entry = document.createElement('div');
  entry.className = 'entry mileage-entry';
  entry.innerHTML = `
    <input type="date" class="mileage-date" />
    <input type="text" class="mileage-purpose" placeholder="Purpose of Journey" />
    <input type="number" class="mileage-miles" placeholder="Miles" step="0.1" />
    <input type="text" class="mileage-amount" placeholder="£" readonly />
  `;
  addMileageBtn.before(entry);
  entry.querySelectorAll('input').forEach(input => input.addEventListener('input', updateTotals));
});

addPhoneBtn.addEventListener('click', () => {
  const entry = document.createElement('div');
  entry.className = 'entry phone-entry';
  entry.innerHTML = `
    <input type="text" class="phone-period" placeholder="Bill Period" />
    <label><input type="checkbox" class="phone-attached" /> Bill Attached?</label>
    <input type="number" class="phone-amount" placeholder="£" step="0.01" />
  `;
  addPhoneBtn.before(entry);
  entry.querySelectorAll('input').forEach(input => input.addEventListener('input', updateTotals));
});

addOtherBtn.addEventListener('click', () => {
  const entry = document.createElement('div');
  entry.className = 'entry other-entry';
  entry.innerHTML = `
    <input type="date" class="other-date" />
    <input type="text" class="other-reason" placeholder="Reason for Expense" />
    <label><input type="checkbox" class="other-attached" /> Receipt Attached?</label>
    <input type="number" class="other-amount" placeholder="£" step="0.01" />
  `;
  addOtherBtn.before(entry);
  entry.querySelectorAll('input').forEach(input => input.addEventListener('input', updateTotals));
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

// Submit via email
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

// PDF generation
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
