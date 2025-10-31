// ==========================================
// SM Recording Studio - Music Studio Booking System
// Complete Frontend Implementation
// Managed by Swapnil Mishra
// ==========================================

// ============================================
// STUDIO INFORMATION
// ============================================
const STUDIO_INFO = {
    name: 'SM Recording Studio',
    owner: 'Swapnil Mishra',
    phone: '+91 6393 046 385',
    whatsapp: '916393046385',
    email: 'swapnilmishramusic@gmail.com',
    locationUrl: 'https://maps.app.goo.gl/QprpQHr97fS14TE29',
    youtube: 'https://youtube.com/@swapnilmishra?si=If9NjqpjV_ih8Ow3',
    instagram: 'https://www.instagram.com/swapnilmishramusic?igsh=MTRlNzU3cDYxdWsybA==',
    hours: '10:00 AM - 10:00 PM (Mon-Sun)'
};
// ============================================
// SERVICES DATA - Easy to modify
// ============================================
const SERVICES = [
    {
        id: 1,
        name: 'Shayari / Nazm Recording',
        nameHindi: 'शायरी / नज़्म रिकॉर्डिंग',
        icon: '📝',
        description: 'Professional shayari and nazm recording with high-quality sound',
        duration: '30 min',
        price: 500
    },
    {
        id: 2,
        name: 'Music Track Recording (Vocal)',
        nameHindi: 'म्यूजिक ट्रैक रिकॉर्डिंग',
        icon: '🎤',
        description: 'Complete vocal track recording for your songs',
        duration: '1 hour',
        price: 1200
    },
    {
        id: 3,
        name: 'Dialogue / Dubbing Recording',
        nameHindi: 'डायलॉग / डबिंग रिकॉर्डिंग',
        icon: '🎬',
        description: 'Professional dialogue and dubbing services for videos',
        duration: '30 min',
        price: 600
    },
    {
        id: 4,
        name: 'Mixing & Mastering',
        nameHindi: 'मिक्सिंग और मास्टरिंग',
        icon: '🎚️',
        description: 'Professional mixing and mastering for your tracks',
        duration: 'per track',
        price: 1500
    },
    {
        id: 5,
        name: 'Voiceover / Jingle Recording',
        nameHindi: 'वॉयसओवर / जिंगल रिकॉर्डिंग',
        icon: '📢',
        description: 'Commercial voiceovers and jingle recording',
        duration: '30 min',
        price: 700
    },
    {
        id: 6,
        name: 'Rehearsal Room Hourly',
        nameHindi: 'रिहर्सल रूम',
        icon: '🎸',
        description: 'Hourly rehearsal room booking with equipment',
        duration: '1 hour',
        price: 300
    }
];

// Time slots for booking (10 AM to 10 PM)
const TIME_SLOTS = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
];

// ============================================
// DOM Elements
// ============================================
const servicesGrid = document.getElementById('servicesGrid');
const calcServiceSelect = document.getElementById('calcService');
const bookingServiceSelect = document.getElementById('service');
const timeSelect = document.getElementById('time');
const dateInput = document.getElementById('date');
const bookingForm = document.getElementById('bookingForm');
const totalPriceElement = document.getElementById('totalPrice');

// ============================================
// Initialize App
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    renderServices();
    populateServiceSelects();
    setupCalculator();
    setupBookingForm();
    setupDateRestrictions();
    loadBookings();
    setupMobileMenu();
});

// ============================================
// Render Services Cards
// ============================================
function renderServices() {
    const servicesHTML = SERVICES.map(service => `
        <div class="service-card">
            <div class="service-icon">${service.icon}</div>
            <h3 class="service-name">${service.name}</h3>
            <p class="service-description">${service.description}</p>
            <div class="service-details">
                <span class="service-duration">⏱️ ${service.duration}</span>
                <span class="service-price">₹${service.price}</span>
            </div>
        </div>
    `).join('');
    
    // Add custom request card
    const customCard = `
        <div class="service-card custom-request-card">
            <div class="service-icon">💬</div>
            <h3 class="service-name">Custom Request</h3>
            <p class="service-description">Have a special requirement? Contact us for custom pricing and services.</p>
            <button class="custom-btn" onclick="contactCustom()">Contact Us</button>
        </div>
    `;
    
    servicesGrid.innerHTML = servicesHTML + customCard;
}

// ============================================
// Populate Service Dropdowns
// ============================================
function populateServiceSelects() {
    const options = SERVICES.map(service => 
        `<option value="${service.id}">${service.name} - ₹${service.price}</option>`
    ).join('');
    
    calcServiceSelect.innerHTML = '<option value="">-- Select Service --</option>' + options;
    bookingServiceSelect.innerHTML = '<option value="">-- Select Service --</option>' + options;
}

// ============================================
// Pricing Calculator
// ============================================
function setupCalculator() {
    calcServiceSelect.addEventListener('change', updateTotalPrice);
    document.querySelectorAll('.addon-section input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateTotalPrice);
    });
}

function updateTotalPrice() {
    let total = 0;
    
    // Get service price
    const serviceId = calcServiceSelect.value;
    if (serviceId) {
        const service = SERVICES.find(s => s.id == serviceId);
        total += service.price;
    }
    
    // Add add-ons
    document.querySelectorAll('.addon-section input[type="checkbox"]:checked').forEach(checkbox => {
        total += parseInt(checkbox.value);
    });
    
    totalPriceElement.textContent = `₹${total}`;
}

// ============================================
// Date & Time Setup
// ============================================
function setupDateRestrictions() {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    
    // Populate time slots when date changes
    dateInput.addEventListener('change', populateTimeSlots);
}

function populateTimeSlots() {
    const selectedDate = new Date(dateInput.value);
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    
    // Simulate one blocked slot (random)
    const blockedSlot = TIME_SLOTS[Math.floor(Math.random() * TIME_SLOTS.length)];
    
    const options = TIME_SLOTS.map(time => {
        const [hours, minutes] = time.split(':');
        const slotTime = new Date(selectedDate);
        slotTime.setHours(parseInt(hours), parseInt(minutes));
        
        // Disable if past time for today or if it's the blocked slot
        const isPast = isToday && slotTime < today;
        const isBlocked = time === blockedSlot;
        const disabled = isPast || isBlocked ? 'disabled' : '';
        const label = isBlocked ? `${time} (Booked)` : time;
        
        return `<option value="${time}" ${disabled}>${label}</option>`;
    }).join('');
    
    timeSelect.innerHTML = '<option value="">-- Select Time --</option>' + options;
}

// ============================================
// Form Validation
// ============================================
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous error
    field.classList.remove('error');
    const errorSpan = field.nextElementSibling;
    if (errorSpan && errorSpan.classList.contains('error-message')) {
        errorSpan.textContent = '';
    }
    
    // Validation rules
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (fieldName === 'phone') {
        const phoneRegex = /^[6-9][0-9]{9}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Enter valid 10-digit mobile number';
        }
    } else if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Enter valid email address';
        }
    }
    
    if (!isValid) {
        field.classList.add('error');
        if (errorSpan) {
            errorSpan.textContent = errorMessage;
        }
    }
    
    return isValid;
}

function validateForm() {
    const fields = bookingForm.querySelectorAll('[required]');
    let isValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// ============================================
// Booking Form Setup
// ============================================
function setupBookingForm() {
    // Add blur event listeners for real-time validation
    const fields = bookingForm.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
    });
    
    // Form submission
    bookingForm.addEventListener('submit', handleBookingSubmit);
}

function handleBookingSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        showToast('Please fix the errors in the form', 'error');
        return;
    }
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        serviceId: document.getElementById('service').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        notes: document.getElementById('notes').value.trim()
    };
    
    const service = SERVICES.find(s => s.id == formData.serviceId);
    
    // Send to WhatsApp directly
    sendToWhatsApp(formData, service);
}

// ============================================
// Booking Summary Modal
// ============================================
function showBookingSummary(formData, service) {
    const modal = document.getElementById('bookingModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Phone:</strong> ${formData.phone}</p>
        ${formData.email ? `<p><strong>Email:</strong> ${formData.email}</p>` : ''}
        <p><strong>Service:</strong> ${service.name}</p>
        <p><strong>Price:</strong> ₹${service.price}</p>
        <p><strong>Date:</strong> ${formatDate(formData.date)}</p>
        <p><strong>Time:</strong> ${formData.time}</p>
        ${formData.notes ? `<p><strong>Notes:</strong> ${formData.notes}</p>` : ''}
        
        <div class="modal-buttons">
            <button class="modal-button confirm-pay-button" onclick="confirmBooking(true)">
                Confirm & Pay (Simulate)
            </button>
            <button class="modal-button confirm-later-button" onclick="confirmBooking(false)">
                Confirm (Pay Later)
            </button>
        </div>
    `;
    
    modal.classList.add('show');
    
    // Store temp booking data
    window.tempBooking = { formData, service };
}

// ============================================
// Confirm Booking
// ============================================
function confirmBooking(withPayment) {
    closeModal('bookingModal');
    
    if (withPayment) {
        simulatePayment();
    } else {
        saveBooking(false);
    }
}

// ============================================
// Simulate Payment Flow
// ============================================
function simulatePayment() {
    const loaderModal = document.getElementById('loaderModal');
    loaderModal.classList.add('show');
    
    // Simulate payment processing (2 seconds)
    setTimeout(() => {
        loaderModal.classList.remove('show');
        saveBooking(true);
    }, 2000);
}

// ============================================
// Save Booking to localStorage
// ============================================
function saveBooking(isPaid) {
    const { formData, service } = window.tempBooking;
    
    // Generate booking ID
    const bookingId = generateBookingId();
    
    const booking = {
        id: bookingId,
        ...formData,
        serviceName: service.name,
        servicePrice: service.price,
        isPaid: isPaid,
        bookedAt: new Date().toISOString()
    };
    
    // Get existing bookings
    const bookings = getBookings();
    bookings.push(booking);
    
    // Save to localStorage
    localStorage.setItem('smRecordesBookings', JSON.stringify(bookings));
    
    // Show success modal
    showSuccessModal(booking);
    
    // Reset form
    bookingForm.reset();
    
    // Reload bookings display
    loadBookings();
    
    delete window.tempBooking;
}

// ============================================
// Success Modal
// ============================================
function showSuccessModal(booking) {
    const modal = document.getElementById('successModal');
    const successBody = document.getElementById('successBody');
    
    const message = booking.isPaid 
        ? 'भुगतान सफल! आपकी बुकिंग कन्फर्म हो गई है।\nPayment successful! Your booking is confirmed.'
        : 'आपकी बुकिंग रजिस्टर हो गई है। कृपया स्टूडियो पर भुगतान करें।\nYour booking is registered. Please pay at the studio.';
    
    successBody.innerHTML = `
        <p><strong>Booking ID:</strong> ${booking.id}</p>
        <p><strong>Service:</strong> ${booking.serviceName}</p>
        <p><strong>Date & Time:</strong> ${formatDate(booking.date)} at ${booking.time}</p>
        <p><strong>Amount:</strong> ₹${booking.servicePrice}</p>
        <p><strong>Status:</strong> ${booking.isPaid ? 'Paid ✓' : 'Pay at Studio'}</p>
        <hr>
        <p style="white-space: pre-line; margin-top: 1rem;">${message}</p>
        <button class="print-button" onclick="printBooking('${booking.id}')">
            Print Receipt
        </button>
    `;
    
    modal.classList.add('show');
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('show');
}

// ============================================
// Load & Display Bookings
// ============================================
function getBookings() {
    const stored = localStorage.getItem('smRecordesBookings');
    return stored ? JSON.parse(stored) : [];
}

function loadBookings() {
    const bookings = getBookings();
    const bookingsList = document.getElementById('bookingsList');
    const myBookingsSection = document.getElementById('myBookingsSection');
    
    if (bookings.length === 0) {
        myBookingsSection.style.display = 'none';
        return;
    }
    
    myBookingsSection.style.display = 'block';
    
    bookingsList.innerHTML = bookings.map(booking => `
        <div class="booking-item">
            <h4>Booking #${booking.id}</h4>
            <p><strong>Service:</strong> ${booking.serviceName}</p>
            <p><strong>Date & Time:</strong> ${formatDate(booking.date)} at ${booking.time}</p>
            <p><strong>Amount:</strong> ₹${booking.servicePrice}</p>
            <p><strong>Status:</strong> ${booking.isPaid ? 'Paid ✓' : 'Pending Payment'}</p>
            <p><strong>Name:</strong> ${booking.name}</p>
            <p><strong>Phone:</strong> ${booking.phone}</p>
            <button class="print-button" onclick="printBooking('${booking.id}')">Print</button>
        </div>
    `).join('');
}

// ============================================
// Export Bookings as CSV
// ============================================
document.getElementById('exportBookings')?.addEventListener('click', exportBookingsCSV);

function exportBookingsCSV() {
    const bookings = getBookings();
    
    if (bookings.length === 0) {
        showToast('No bookings to export', 'error');
        return;
    }
    
    // CSV headers
    let csv = 'Booking ID,Name,Phone,Email,Service,Price,Date,Time,Status,Booked At\n';
    
    // Add data rows
    bookings.forEach(booking => {
        csv += `${booking.id},${booking.name},${booking.phone},${booking.email || ''},${booking.serviceName},${booking.servicePrice},${booking.date},${booking.time},${booking.isPaid ? 'Paid' : 'Pending'},${booking.bookedAt}\n`;
    });
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sm-recordes-bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    showToast('Bookings exported successfully!', 'success');
}

// ============================================
// Print Booking Receipt
// ============================================
function printBooking(bookingId) {
    const bookings = getBookings();
    const booking = bookings.find(b => b.id === bookingId);
    
    if (!booking) return;
    
    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.write(`
        <html>
        <head>
            <title>Booking Receipt - ${bookingId}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #667eea; }
                .receipt { border: 2px solid #667eea; padding: 20px; border-radius: 10px; }
                p { margin: 10px 0; }
                .footer { margin-top: 30px; text-align: center; color: #666; }
            </style>
        </head>
        <body>
            <div class="receipt">
                <h1>SM Recordes</h1>
                <h2>Booking Receipt</h2>
                <hr>
                <p><strong>Booking ID:</strong> ${booking.id}</p>
                <p><strong>Name:</strong> ${booking.name}</p>
                <p><strong>Phone:</strong> ${booking.phone}</p>
                <p><strong>Service:</strong> ${booking.serviceName}</p>
                <p><strong>Date & Time:</strong> ${formatDate(booking.date)} at ${booking.time}</p>
                <p><strong>Amount:</strong> ₹${booking.servicePrice}</p>
                <p><strong>Status:</strong> ${booking.isPaid ? 'Paid ✓' : 'Pay at Studio'}</p>
                <hr>
                <div class="footer">
                    <p>Thank you for choosing SM Recordes!</p>
                    <p>Contact: +91-9876543210</p>
                </div>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// ============================================
// Utility Functions
// ============================================
function generateBookingId() {
    return 'SMR' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
}

// ============================================
// WhatsApp Integration
// ============================================
function sendToWhatsApp(formData, service) {
    // Format the date nicely
    const formattedDate = formatDate(formData.date);
    
    // Create WhatsApp message with all booking details
    let message = `🎵 *NEW BOOKING REQUEST* 🎵\n\n`;
    message += `*Customer Details:*\n`;
    message += `👤 Name: ${formData.name}\n`;
    message += `📱 Phone: ${formData.phone}\n`;
    if (formData.email) {
        message += `📧 Email: ${formData.email}\n`;
    }
    message += `\n*Booking Details:*\n`;
    message += `🎤 Service: ${service.name} (${service.nameHindi})\n`;
    message += `💰 Price: ₹${service.price}\n`;
    message += `⏱️ Duration: ${service.duration}\n`;
    message += `📅 Preferred Date: ${formattedDate}\n`;
    message += `🕐 Preferred Time: ${formData.time}\n`;
    
    if (formData.notes) {
        message += `\n*Additional Notes:*\n${formData.notes}\n`;
    }
    
    message += `\n✨ _Sent from SM Recording Studio Website_`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Swapnil Mishra's WhatsApp number (without + sign, with country code)
    const whatsappNumber = STUDIO_INFO.whatsapp; // 916393046385
    
    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Show success message
    showToast('Opening WhatsApp... 💬', 'success');
    
    // Open WhatsApp in new tab
    setTimeout(() => {
        window.open(whatsappURL, '_blank');
        
        // Reset form after 1 second
        setTimeout(() => {
            bookingForm.reset();
            showToast('Form submitted successfully! ✅', 'success');
        }, 1000);
    }, 500);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
    });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// Close modal with close button
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.target.closest('.modal').classList.remove('show');
    });
});

// ============================================
// Custom Request Handler
// ============================================
function contactCustom() {
    const phone = STUDIO_INFO.whatsapp;
    const message = encodeURIComponent('Hi Swapnil, I have a custom recording requirement.');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
}

// ============================================
// Mobile Menu Toggle
// ============================================
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle?.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
}

// ============================================
// Smooth Scroll for Navigation
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ==========================================
// BACKEND INTEGRATION NOTES (for future)
// ==========================================
/*
To connect this booking form to a backend:

1. Replace the saveBooking() function to make an API call:
   
   async function saveBooking(isPaid) {
       const { formData, service } = window.tempBooking;
       
       try {
           const response = await fetch('https://your-api.com/bookings', {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                   ...formData,
                   serviceName: service.name,
                   servicePrice: service.price,
                   isPaid: isPaid
               })
           });
           
           const result = await response.json();
           
           if (result.success) {
               showSuccessModal(result.booking);
           } else {
               showToast('Booking failed. Please try again.', 'error');
           }
       } catch (error) {
           console.error('Error:', error);
           showToast('Network error. Please try again.', 'error');
       }
   }

2. For payment gateway integration (Razorpay example):
   
   function initiatePayment(amount, bookingData) {
       const options = {
           key: 'YOUR_RAZORPAY_KEY',
           amount: amount * 100, // paise
           currency: 'INR',
           name: 'SM Recordes',
           description: 'Studio Booking Payment',
           handler: function (response) {
               // Payment successful
               saveBooking(true, response.razorpay_payment_id);
           },
           prefill: {
               name: bookingData.name,
               email: bookingData.email,
               contact: bookingData.phone
           }
       };
       
       const rzp = new Razorpay(options);
       rzp.open();
   }

3. Load Razorpay script in HTML:
   <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
*/

console.log('SM Recordes Booking System Loaded Successfully!');
console.log('Services:', SERVICES.length);
console.log('Current Bookings:', getBookings().length);