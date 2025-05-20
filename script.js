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

  let mileageTotal = 0;
  document.querySelectorAll('.mileage-entry').forEach(row => {
    const miles = parseFloat(row.querySelector('.mileage-miles').value) || 0;
    const amount = miles * MILEAGE_RATE;
    row.querySelector('.mileage-amount').value = amount.toFixed(2);
    mileageTotal += amount;
  });
  mileageSubtotal.innerText = mileageTotal.toFixed(2);
  total += mileageTotal;

  let phoneTotal = 0;
  document.querySelectorAll('.phone-entry').forEach(row => {
    const amt = parseFloat(row.querySelector('.phone-amount').value) || 0;
    phoneTotal += amt;
  });
  phoneSubtotal.innerText = phoneTotal.toFixed(2);
  total += phoneTotal;

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
    <input type="date" class="mileage-date" name="mileage-date[]" />
    <input type="text" class="mileage-purpose" name="mileage-purpose[]" placeholder="Purpose of Journey" />
    <input type="number" class="mileage-miles" name="mileage-miles[]" placeholder="Miles" step="0.1" />
    <input type="text" class="mileage-amount" name="mileage-amount[]" placeholder="£" readonly />
  `;
  addMileageBtn.before(entry);
  entry.querySelectorAll('input').forEach(i => i.addEventListener('input', updateTotals));
});

addPhoneBtn.addEventListener('click', () => {
  const entry = document.createElement('div');
  entry.className = 'entry phone-entry';
  entry.innerHTML = `
    <input type="text" class="phone-period" name="phone-period[]" placeholder="Bill Period" />
    <label><input type="checkbox" class="phone-attached" name="phone-attached[]" /> Bill Attached?</label>
    <input type="number" class="phone-amount" name="phone-amount[]" placeholder="£" step="0.01" />
  `;
  addPhoneBtn.before(entry);
  entry.querySelectorAll('input').forEach(i => i.addEventListener('input', updateTotals));
});

addOtherBtn.addEventListener('click', () => {
  const entry = document.createElement('div');
  entry.className = 'entry other-entry';
  entry.innerHTML = `
    <input type="date" class="other-date" name="other-date[]" />
    <input type="text" class="other-reason" name="other-reason[]" placeholder="Reason for Expense" />
    <label><input type="checkbox" class="other-attached" name="other-attached[]" /> Receipt Attached?</label>
    <input type="number" class="other-amount" name="other-amount[]" placeholder="£" step="0.01" />
  `;
  addOtherBtn.before(entry);
  entry.querySelectorAll('input').forEach(i => i.addEventListener('input', updateTotals));
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
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#000';
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

document.getElementById('clear-signature').onclick = () => {
