const API_URL = 'https://s3zyol2bu1.execute-api.eu-west-2.amazonaws.com/prod';
 
// Update copyright year
document.getElementById("date").innerHTML = new Date().getFullYear();

// ── VISITOR COUNTER ────────────────────────────────────────────────
// Fires automatically when the page finishes loading
async function loadVisitorCount() {
try {
    const response = await fetch(API_URL + '/count');
    const data = await response.json();
    console.log(data)
    document.getElementById('visitor-count').textContent = data.visitor_count;
} catch (error) {
    console.error('Could not load visitor count:', error);
}
}
window.addEventListener('load', loadVisitorCount);

// ── CONTACT FORM ───────────────────────────────────────────────────
const form      = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formMsg   = document.getElementById('form-message');

form.addEventListener('submit', async function(e) {
e.preventDefault();

// Disable button -- prevents double submission and duplicate SNS emails
submitBtn.disabled = true;
submitBtn.textContent = 'Sending...';
formMsg.textContent = '';

const data = {
    name:    document.getElementById('name').value,
    email:   document.getElementById('email').value,
    message: document.getElementById('message').value
};

try {
    const response = await fetch(API_URL + '/contact', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
    formMsg.textContent = result.message;
    formMsg.style.color = 'green';
    form.reset();
    } else {
    formMsg.textContent = result.error;
    formMsg.style.color = 'red';
    }
} catch (error) {
    formMsg.textContent = 'Something went wrong. Please try again.';
    formMsg.style.color = 'red';
} finally {
    // Always re-enable button whether success or failure
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
}
});
