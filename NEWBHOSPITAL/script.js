// Slideshow functionality
const images = [
    'assets/hero-bg.jpg',
    'assets/services-bg.jpg',
    'assets/equipment-bg.jpg',
    'assets/lab-bg.jpg'
];

function initSlideshow() {
    const container = document.querySelector('.slideshow-container');
    
    // Create slides
    images.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = `slide ${index === 0 ? 'active' : ''}`;
        slide.style.backgroundImage = `url(${image})`;
        container.appendChild(slide);
    });

    let currentSlide = 0;
    
    // Change slide every 5 seconds
    setInterval(() => {
        const slides = document.querySelectorAll('.slide');
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000);
}

// Initialize slideshow when page loads
document.addEventListener('DOMContentLoaded', initSlideshow);

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        navMenu.classList.remove('active');
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Booking form handling
const bookingForm = document.getElementById('bookingForm');

bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        serviceType: document.getElementById('serviceType').value,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        date: document.getElementById('date').value,
        notes: document.getElementById('notes').value,
        timestamp: new Date().toISOString()
    };

    // Validate form data
    if (!validateForm(formData)) {
        return;
    }

    // Store booking in localStorage
    saveBooking(formData);

    // Show success message
    showMessage('Booking submitted successfully! We will contact you shortly.', 'success');
    
    // Reset form
    bookingForm.reset();
});

// Form validation
function validateForm(data) {
    // Phone validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(data.phone)) {
        showMessage('Please enter a valid phone number', 'error');
        return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showMessage('Please enter a valid email address', 'error');
        return false;
    }

    // Date validation
    const selectedDate = new Date(data.date);
    const today = new Date();
    if (selectedDate < today) {
        showMessage('Please select a future date', 'error');
        return false;
    }

    return true;
}

// Save booking to localStorage
function saveBooking(booking) {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
}

// Message display
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    document.querySelector('.booking-form').insertAdjacentElement('beforebegin', messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Service type specific fields
document.getElementById('serviceType').addEventListener('change', function(e) {
    const serviceType = e.target.value;
    const notesLabel = document.querySelector('label[for="notes"]');
    
    switch(serviceType) {
        case 'equipment':
            notesLabel.textContent = 'Equipment Details & Requirements';
            break;
        case 'laboratory':
            notesLabel.textContent = 'Test Details & Special Instructions';
            break;
        default:
            notesLabel.textContent = 'Additional Notes';
    }
});
