// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.8)';
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'transparent';
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.boxShadow = 'none';
    }
});

// Simple Carousel
(function() {
    function initCarousel() {
        const carousel = document.querySelector('.image-carousel-section');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('#carousel-prev-btn');
        const nextBtn = carousel.querySelector('#carousel-next-btn');
        const indicatorsContainer = carousel.querySelector('#carousel-indicators');
        
        if (!slides.length || !prevBtn || !nextBtn || !indicatorsContainer) {
            console.error('Carousel elements not found');
            return;
        }
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Reset indicators container and create indicators
    indicatorsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('button');
        indicator.className = 'carousel-indicator' + (i === 0 ? ' active' : '');
        indicator.setAttribute('data-slide', i);
        indicator.setAttribute('aria-label', `Slide ${i + 1}`);
        indicatorsContainer.appendChild(indicator);
    }
    
    const indicators = carousel.querySelectorAll('.carousel-indicator');
    
    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.display = 'none';
        });
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide and indicator
        slides[index].classList.add('active');
        slides[index].style.display = 'flex';
        indicators[index].classList.add('active');
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        showSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prev);
    }
    
    // Button events
    nextBtn.addEventListener('click', () => {
        nextSlide();
        restartAutoplay();
    });
    prevBtn.addEventListener('click', () => {
        prevSlide();
        restartAutoplay();
    });
    
    // Indicator events
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            restartAutoplay();
        });
    });
    
    // Auto-play every 4 seconds
    let autoPlayInterval;
    const startAutoplay = () => {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(nextSlide, 4000);
    };
    const restartAutoplay = () => {
        clearInterval(autoPlayInterval);
        startAutoplay();
    };
    startAutoplay();
    
    // Pause on hover
    const carouselWrapper = carousel.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
        carouselWrapper.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });
        carouselWrapper.addEventListener('mouseleave', () => {
            startAutoplay();
        });
    }
    
        // Initialize - hide all slides except first
        slides.forEach((slide, index) => {
            if (index !== 0) {
                slide.classList.remove('active');
            }
        });
        showSlide(0);
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCarousel);
    } else {
        initCarousel();
    }
})();

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.inmueble-card, .contact-item, .map-container').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Hover effects for property cards
document.querySelectorAll('.inmueble-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
        this.style.boxShadow = '0 25px 50px rgba(78, 205, 196, 0.3)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 20px 40px rgba(78, 205, 196, 0.2)';
    });
});

// Social links hover effect
document.querySelectorAll('.social-link, .social-link-contact, .footer-social-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.1)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Button hover effects
document.querySelectorAll('.btn-contact').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
        this.style.boxShadow = '0 15px 30px rgba(78, 205, 196, 0.4)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 10px 20px rgba(78, 205, 196, 0.3)';
    });
});

// Loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Scroll to top functionality
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #4ecdc4, #44a08d);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 5px 15px rgba(78, 205, 196, 0.3);
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect to scroll to top button
scrollToTopBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-3px) scale(1.1)';
    this.style.boxShadow = '0 10px 25px rgba(78, 205, 196, 0.4)';
});

scrollToTopBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
    this.style.boxShadow = '0 5px 15px rgba(78, 205, 196, 0.3)';
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    // Logo animation is handled by CSS
});

// Add ripple effect to buttons
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
}

// Add ripple effect to all buttons
document.querySelectorAll('.btn-contact, .social-link, .nav-link').forEach(button => {
    button.addEventListener('click', createRipple);
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 600ms linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn-contact, .social-link, .nav-link {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Add loading animation to images and error handling
document.querySelectorAll('img').forEach((img, index) => {
    console.log(`Image ${index + 1}:`, img.src);
    
    img.addEventListener('load', function() {
        this.style.opacity = '1';
        this.style.transform = 'scale(1)';
        console.log('✅ Image loaded successfully:', this.src);
    });
    
    img.addEventListener('error', function() {
        console.error('❌ Failed to load image:', this.src);
        this.style.display = 'none';
        // Create a placeholder div
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #333, #555);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #4ecdc4;
            font-size: 1.2rem;
            text-align: center;
            border: 2px dashed #4ecdc4;
        `;
        placeholder.textContent = 'Imagen no disponible';
        this.parentNode.appendChild(placeholder);
    });
    
    img.style.opacity = '0';
    img.style.transform = 'scale(0.8)';
    img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    // Force load the image
    img.src = img.src;
});

// Console welcome message
console.log('%c🏠 Moderna Soluciones Inmobiliaria', 'color: #4ecdc4; font-size: 20px; font-weight: bold;');
console.log('%cDesarrollado con ❤️ para encontrar tu hogar ideal', 'color: #ffffff; font-size: 14px;');

// Appointment form handler
(function() {
    const form = document.getElementById('appointment-form');
    const messageEl = document.getElementById('appointment-message');
    const submitBtn = form?.querySelector('.btn-submit-appointment');
    
    if (!form) return;
    
    // Set minimum date to today
    const dateInput = document.getElementById('appointment-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!submitBtn) return;
        
        const formData = {
            name: document.getElementById('appointment-name').value.trim(),
            email: document.getElementById('appointment-email').value.trim(),
            phone: document.getElementById('appointment-phone').value.trim(),
            date: document.getElementById('appointment-date').value,
            time: document.getElementById('appointment-time').value,
            property: document.getElementById('appointment-property').value.trim(),
            message: document.getElementById('appointment-message').value.trim()
        };
        
        // Validation
        if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time) {
            showMessage('Por favor completa todos los campos obligatorios', 'error');
            return;
        }
        
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        messageEl.style.display = 'none';
        
        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showMessage('¡Cita solicitada exitosamente! Te contactaremos pronto para confirmar.', 'success');
                form.reset();
            } else {
                showMessage(result.error || 'Error al enviar la solicitud. Por favor intenta nuevamente.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Error de conexión. Por favor intenta nuevamente más tarde.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Solicitar Cita';
        }
    });
    
    function showMessage(text, type) {
        messageEl.textContent = text;
        messageEl.className = `appointment-message ${type}`;
        messageEl.style.display = 'block';
        
        // Scroll to message
        messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
})();