
const form = document.getElementById('expenses-form');
const addMileageBtn = document.getElementById('add-mileage');
const addPhoneBtn = document.getElementById('add-phone');
const addOtherBtn = document.getElementById('add-other');
const totalAmount = document.getElementById('totalAmount');
const mileageSubtotal = document.getElementById('mileage-subtotal');
const phoneSubtotal = document.getElementById('phone-subtotal');
const otherSubtotal = document.getElementById('other-subtotal');
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

function bindInputs(entry) {
  entry.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updateTotals);
  });
}

addMileageBtn.addEventListener('click', () => {
  const entry = document.createElement('div');
  entry.className = 'entry mileage-entry';
  entry.innerHTML = \`
    <input type="date" class="mileage-date" name="mileage-date[]" />
    <input type="text" class="mileage-purpose" name="mileage-purpose[]" placeholder="Purpose of Journey" />
    <input type="number" class="mileage-miles" name="mileage-miles[]" placeholder="Miles" step="0.1" />
    <input type="text" class="mileage-amount" name="mileage-amount[]" placeholder="£" readonly />
  \`;
  addMileageBtn.before(entry);
  bindInputs(entry);
});

addPhoneBtn.addEventListener('click', () => {
  const entry = document.createElement('div');
  entry.className = 'entry phone-entry';
  entry.innerHTML = \`
    <input type="text" class="phone-period" name="phone-period[]" placeholder="Bill Period" />
    <label><input type="checkbox" class="phone-attached" name="phone-attached[]" /> Bill Attached?</label>
    <input type="number" class="phone-amount" name="phone-amount[]" placeholder="£" step="0.01" />
  \`;
  addPhoneBtn.before(entry);
  bindInputs(entry);
});

addOtherBtn.addEventListener('click', () => {
  const entry = document.createElement('div');
  entry.className = 'entry other-entry';
  entry.innerHTML = \`
    <input type="date" class="other-date" name="other-date[]" />
    <input type="text" class="other-reason" name="other-reason[]" placeholder="Reason for Expense" />
    <label><input type="checkbox" class="other-attached" name="other-attached[]" /> Receipt Attached?</label>
    <input type="number" class="other-amount" name="other-amount[]" placeholder="£" step="0.01" />
  \`;
  addOtherBtn.before(entry);
  bindInputs(entry);
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

// Handle Formspree submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  data.append('signature', canvas.toDataURL());
  const json = {};

  data.forEach((value, key) => {
    if (!json[key]) {
      json[key] = value;
    } else {
      if (!Array.isArray(json[key])) {
        json[key] = [json[key]];
      }
      json[key].push(value);
    }
  });

  const response = await fetch('https://formspree.io/f/movdbkbj', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(json)
  });

  if (response.ok) {
    alert('✅ Your claim was submitted successfully!');
    form.reset();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateTotals();
  } else {
    alert('❌ There was an error submitting your form.');
  }
});
