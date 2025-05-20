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

// PDF Generation
const downloadBtn = document.getElementById('download-pdf');
downloadBtn.onclick = () => generatePDF();

function generatePDF() {
  const pdfContent = document.createElement('div');
  pdfContent.innerHTML = `
    <h1>YMCA Scotland Expense Claim</h1>
    <p><strong>Name:</strong> ${document.getElementById('name').value}</p>
    <p><strong>Job Title:</strong> ${document.getElementById('jobTitle').value}</p>
    <p><strong>Claim Period:</strong> ${document.getElementById('claimPeriod').value}</p>
    <p><strong>Claim Authorised By:</strong> ${document.getElementById('claimAuthorised').value}</p>
    <p><strong>Total Claimed:</strong> £${document.getElementById('totalAmount').value}</p>
    <h2>Mileage Claims</h2>
    <ul>
      ${[...document.querySelectorAll('.entry')].map(entry => {
        const date = entry.querySelector('.mileage-date').value;
        const purpose = entry.querySelector('.mileage-purpose').value;
        const miles = entry.querySelector('.mileage-miles').value;
        const amount = entry.querySelector('.mileage-amount').value;
        return `<li>${date} — ${purpose} — ${miles} miles — £${amount}</li>`;
      }).join('')}
    </ul>
    <p><strong>Date Signed:</strong> ${document.getElementById('signatureDate').value}</p>
    <h2>Signature</h2>
    <img src="${canvas.toDataURL()}" width="300" />
  `;

  const opt = {
    margin: [10, 10],
    filename: `YMCA_Expenses_${document.getElementById('name').value || 'claim'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  html2pdf().from(pdfContent).set(opt).save();
}
