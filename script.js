document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================================
       STICKY HEADER SCROLL EFFECT
       ========================================================================= */
    const header = document.getElementById('main-header');
    
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Run once on startup

    /* =========================================================================
       MOBILE NAVIGATION TOGGLE
       ========================================================================= */
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile nav when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    /* =========================================================================
       HERO DYNAMIC TYPING SIMULATOR
       ========================================================================= */
    const typingSpan = document.getElementById('typing-text');
    const roles = ["Software Engineer", "Java Developer", "SQL Database Designer", "Machine Learning Enthusiast"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    const typeRole = () => {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingSpan.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deleting is faster
        } else {
            typingSpan.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // Normal typing speed
        }
        
        // State transitions
        if (!isDeleting && charIndex === currentRole.length) {
            // End of typing, wait before deleting
            isDeleting = true;
            typingSpeed = 1500; // Pause at full word
        } else if (isDeleting && charIndex === 0) {
            // Word completely erased, switch to next word
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before typing next word
        }
        
        setTimeout(typeRole, typingSpeed);
    };
    
    if (typingSpan) {
        setTimeout(typeRole, 1000);
    }

    /* =========================================================================
       ACTIVE LINK HIGHLIGHT ON SCROLL
       ========================================================================= */
    const sections = document.querySelectorAll('section');
    
    const trackActiveNavLink = () => {
        let currentSectionId = 'hero';
        const scrollPosition = window.scrollY + 200; // Offset for header trigger
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', trackActiveNavLink);
    trackActiveNavLink();

    /* =========================================================================
       SCROLL REVEAL ANIMATION (INTERSECTION OBSERVER)
       ========================================================================= */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // If it is the skills section, animate progress bars
                if (entry.target.id === 'skills') {
                    animateSkillBars();
                }
                
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.15 // Trigger when 15% is visible
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Animate skills progress bars
    const animateSkillBars = () => {
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 100);
        });
    };

    /* =========================================================================
       TECHNICAL SKILLS CATEGORY FILTERING
       ========================================================================= */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button status
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-filter');
            
            skillCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                    // Retrigger fade-in look
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px) scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250); // Match transitions
                }
            });
        });
    });

    /* =========================================================================
       FORM SUBMISSION & TOAST NOTIFICATION FEEDBACK
       ========================================================================= */
    const contactForm = document.getElementById('portfolio-contact-form');
    const toastContainer = document.getElementById('toast-container');
    
    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // Icon
        const iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
        
        toast.innerHTML = `${iconSvg} <span>${message}</span>`;
        toastContainer.appendChild(toast);
        
        // Remove toast after 4 seconds
        setTimeout(() => {
            toast.classList.add('removing');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 4000);
    };
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const subject = document.getElementById('form-subject').value;
            const message = document.getElementById('form-message').value;
            
            // Client side mock validation & response
            if (name && email && subject && message) {
                // Simulate message submission success
                const submitBtn = document.getElementById('btn-submit-form');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = `Sending... <span class="typing-cursor"></span>`;
                
                setTimeout(() => {
                    showToast(`Thank you, ${name}! Your message has been sent successfully.`);
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }, 1200);
            } else {
                showToast('Please fill out all the fields in the contact form.', 'error');
            }
        });
    }
});
