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
    if (img.id === 'gallery-image') {
        return; // avoid attaching error/animation handlers to modal image
    }
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

// Dynamic properties: fetch and render featured properties in carousel
(async function loadFeaturedProperties() {
    const carouselTrack = document.getElementById('carousel-track');
    const carouselDots = document.getElementById('carousel-dots');
    const carouselPrev = document.getElementById('carousel-prev');
    const carouselNext = document.getElementById('carousel-next');
    
    if (!carouselTrack) return;
    
    carouselTrack.innerHTML = '<div style="color:#ccc; padding:20px; text-align:center;">Cargando inmuebles destacados...</div>';
    try {
        const res = await fetch(`/api/properties?featured=1&t=${Date.now()}&_=${Math.random()}`, { 
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
        });
        const items = (await res.json()) || [];
        if (!Array.isArray(items) || items.length === 0) {
            carouselTrack.innerHTML = '<div style="color:#aaa; padding:20px; text-align:center;">No hay inmuebles destacados aún.</div>';
            if (carouselDots) carouselDots.innerHTML = '';
            return;
        }
        
        // Limit to 5 featured properties
        const featuredItems = items.slice(0, 5);
        let currentIndex = 0;
        
        // Get number of slides visible based on screen size
        function getSlidesPerView() {
            return window.innerWidth > 1024 ? 2 : 1;
        }
        
        // Calculate max index based on visible slides
        function getMaxIndex() {
            const slidesPerView = getSlidesPerView();
            return Math.max(0, featuredItems.length - slidesPerView);
        }
        
        // Update carousel position
        function updateCarousel() {
            const slidesPerView = getSlidesPerView();
            const maxIndex = getMaxIndex();
            
            // Clamp current index
            currentIndex = Math.min(currentIndex, maxIndex);
            currentIndex = Math.max(0, currentIndex);
            
            // Calculate transform
            const slideWidth = 100 / slidesPerView;
            const offset = -(currentIndex * slideWidth);
            carouselTrack.style.transform = `translateX(${offset}%)`;
            
            // Update dots
            if (carouselDots) {
                carouselDots.querySelectorAll('.carousel-dot').forEach((dot, idx) => {
                    dot.classList.toggle('active', idx === currentIndex);
                });
            }
            
            // Show/hide navigation buttons
            if (carouselPrev) {
                carouselPrev.style.opacity = currentIndex === 0 ? '0.5' : '1';
                carouselPrev.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
            }
            if (carouselNext) {
                carouselNext.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
                carouselNext.style.pointerEvents = currentIndex >= maxIndex ? 'none' : 'auto';
            }
        }
        
        function nextSlide() {
            const maxIndex = getMaxIndex();
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0; // Loop back to start
            }
            updateCarousel();
        }
        
        function prevSlide() {
            const maxIndex = getMaxIndex();
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = maxIndex; // Loop to end
            }
            updateCarousel();
        }
        
        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const oldMaxIndex = getMaxIndex();
                currentIndex = Math.min(currentIndex, oldMaxIndex);
                updateCarousel();
            }, 150);
        });
        
        // Create carousel slides
        const slidesHtml = featuredItems.map((p, i) => {
            const badgeClass = p.status === 'venta' ? 'venta' : 'renta';
            const detailsHtml = (p.details || []).map(d => `
                <div class="detail-item">
                    <i class="fas fa-circle"></i>
                    <span>${d}</span>
                </div>
            `).join('');
            const amenitiesHtml = (p.amenities || []).map(a => `<span class="amenity">${a}</span>`).join('');
            const waText = p.whatsappText && p.whatsappText.trim().length > 0
                ? encodeURIComponent(p.whatsappText)
                : encodeURIComponent(`Hola, me interesa ${p.title}`);
            const imgSrc = (p.images && p.images.length ? p.images[0] : p.image);
            const imagesData = encodeURIComponent(JSON.stringify(p.images && p.images.length ? p.images : [p.image]));
            const propertyUrl = `/inmueble?id=${p.id}`;
            return `
            <div class="carousel-slide">
                <div class="inmueble-card" style="max-width: 600px; margin: 0 auto; width: 100%; max-width: 100%;">
                    <div class="card-image" style="cursor: pointer;" onclick="window.location.href='${propertyUrl}'">
                        <img src="${imgSrc}" alt="${p.title}">
                        <div class="property-badge ${badgeClass}">${p.status?.toUpperCase() || ''}</div>
                    </div>
                    <div class="card-content">
                        <h3 style="cursor: pointer;" onclick="window.location.href='${propertyUrl}'">${p.title}</h3>
                        <p class="price">${p.price}</p>
                        <div class="property-details">${detailsHtml}</div>
                        <div class="amenities">${amenitiesHtml}</div>
                        <div class="btn-row" style="display:flex; gap:8px; flex-wrap:wrap;">
                          <a href="${propertyUrl}" class="btn-contact" style="text-decoration: none; display: inline-flex; align-items: center; justify-content: center;">
                            <i class="fas fa-share-alt"></i> Ver Detalles
                          </a>
                          <button class="btn-contact btn-gallery" data-images="${imagesData}">Ver fotos</button>
                          <a href="https://wa.me/50494812219?text=${waText}" class="btn-contact">Contactar</a>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');
        
        carouselTrack.innerHTML = slidesHtml;
        
        // Create dots
        if (carouselDots && featuredItems.length > 1) {
            carouselDots.innerHTML = featuredItems.map((_, i) => 
                `<button class="carousel-dot ${i === 0 ? 'active' : ''}" data-slide="${i}"></button>`
            ).join('');
            
            carouselDots.querySelectorAll('.carousel-dot').forEach((dot, idx) => {
                dot.addEventListener('click', () => {
                    currentIndex = idx;
                    updateCarousel();
                });
            });
        }
        
        // Carousel navigation
        if (carouselPrev) carouselPrev.addEventListener('click', prevSlide);
        if (carouselNext) carouselNext.addEventListener('click', nextSlide);
        
        // Auto-play carousel (optional)
        let autoPlayInterval = setInterval(nextSlide, 5000);
        const carouselContainer = document.getElementById('featured-carousel');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
            carouselContainer.addEventListener('mouseleave', () => {
                autoPlayInterval = setInterval(nextSlide, 5000);
            });
        }
        
        updateCarousel();

        // Re-attach animations and hover effects for new elements
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
        document.querySelectorAll('.btn-contact').forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.05)';
                this.style.boxShadow = '0 15px 30px rgba(78, 205, 196, 0.4)';
            });
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 10px 20px rgba(78, 205, 196, 0.3)';
            });
            btn.addEventListener('click', createRipple);
        });

        // Gallery modal logic
        const modal = document.getElementById('gallery-modal');
        const imgEl = document.getElementById('gallery-image');
        const prevBtn = document.getElementById('gallery-prev');
        const nextBtn = document.getElementById('gallery-next');
        const closeBtn = document.getElementById('gallery-close');
        const thumbs = document.getElementById('gallery-thumbs');
        let galleryImages = [];
        let galleryIndex = 0;

        function renderGallery() {
            if (!galleryImages.length) return;
            // remove any previous placeholder and show image
            if (imgEl.parentNode) {
                Array.from(imgEl.parentNode.querySelectorAll('div')).forEach(d => {
                    if (d.textContent === 'Imagen no disponible') d.remove();
                });
            }
            imgEl.style.display = '';
            imgEl.style.opacity = '1';
            imgEl.style.transform = 'none';
            imgEl.src = galleryImages[galleryIndex];
            thumbs.innerHTML = galleryImages.map((u, idx) => `
                <img src="${u}" data-idx="${idx}" style="width:70px; height:70px; object-fit:cover; border-radius:8px; border:${idx===galleryIndex?'2px solid #4ecdc4':'1px solid #444'}; cursor:pointer;"/>
            `).join('');
            thumbs.querySelectorAll('img').forEach(t => t.addEventListener('click', () => {
                galleryIndex = Number(t.getAttribute('data-idx'));
                renderGallery();
            }));
        }

        function openGallery(images) {
            galleryImages = images;
            galleryIndex = 0;
            renderGallery();
            modal.style.display = 'flex';
        }
        function closeGallery(){ modal.style.display = 'none'; }

        prevBtn.onclick = () => { if (galleryImages.length) { galleryIndex = (galleryIndex - 1 + galleryImages.length) % galleryImages.length; renderGallery(); } };
        nextBtn.onclick = () => { if (galleryImages.length) { galleryIndex = (galleryIndex + 1) % galleryImages.length; renderGallery(); } };
        closeBtn.onclick = closeGallery;
        modal.addEventListener('click', (e) => { if (e.target === modal) closeGallery(); });
        window.addEventListener('keydown', (e) => {
            if (modal.style.display === 'flex') {
                if (e.key === 'ArrowLeft') prevBtn.onclick();
                if (e.key === 'ArrowRight') nextBtn.onclick();
                if (e.key === 'Escape') closeGallery();
            }
        });

        document.querySelectorAll('.btn-gallery').forEach(btn => {
            btn.addEventListener('click', () => {
                try {
                    const arr = JSON.parse(decodeURIComponent(btn.dataset.images || '[]'));
                    if (Array.isArray(arr) && arr.length) openGallery(arr);
                } catch {}
            });
        });
    } catch (e) {
        grid.innerHTML = '<div style="color:#f77; padding:20px;">Error cargando inmuebles.</div>';
    }
})();

// Appointment form handler
(function() {
    const form = document.getElementById('appointment-form');
    const messageEl = document.getElementById('appointment-status-message');
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
            message: document.getElementById('appointment-message')?.value.trim() || ''
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