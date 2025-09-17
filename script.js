// Modern Web App JavaScript
class WebApp {
    constructor() {
        this.currentTheme = 'light';
        this.isAnimationEnabled = true;
        this.currentColorVariant = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.setupIntersectionObserver();
        this.loadUserPreferences();
        console.log('🚀 Web App initialized successfully!');
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenu = document.getElementById('mobile-menu');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenu && navMenu) {
            mobileMenu.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link
                    this.updateActiveNavLink(anchor.getAttribute('href'));
                }
            });
        });

        // Demo controls
        this.setupDemoControls();

        // Contact form
        this.setupContactForm();

        // Hero buttons
        this.setupHeroButtons();

        // Window scroll events
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    setupDemoControls() {
        const demoBtns = document.querySelectorAll('.demo-btn');
        const demoBox = document.getElementById('demoBox');

        demoBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const demo = btn.getAttribute('data-demo');
                this.handleDemoAction(demo, demoBox, btn);
            });
        });

        // Interactive demo box
        if (demoBox) {
            demoBox.addEventListener('click', () => {
                this.animateElement(demoBox, 'pulse');
            });
        }
    }

    handleDemoAction(action, demoBox, btn) {
        if (!demoBox) return;

        switch (action) {
            case 'colors':
                this.changeColors(demoBox);
                this.showFeedback(btn, 'Colors changed! 🎨');
                break;
            case 'animation':
                this.toggleAnimation(demoBox);
                this.showFeedback(btn, this.isAnimationEnabled ? 'Animation enabled! ✨' : 'Animation disabled! ⏸️');
                break;
            case 'theme':
                this.toggleTheme();
                this.showFeedback(btn, `${this.currentTheme === 'dark' ? 'Dark' : 'Light'} mode activated! ${this.currentTheme === 'dark' ? '🌙' : '☀️'}`);
                break;
        }
    }

    changeColors(element) {
        this.currentColorVariant = (this.currentColorVariant + 1) % 4;
        
        // Remove existing color classes
        element.classList.remove('color-variant-1', 'color-variant-2', 'color-variant-3');
        
        // Add new color class
        if (this.currentColorVariant > 0) {
            element.classList.add(`color-variant-${this.currentColorVariant}`);
        }

        this.animateElement(element, 'bounce');
    }

    toggleAnimation(element) {
        this.isAnimationEnabled = !this.isAnimationEnabled;
        
        if (this.isAnimationEnabled) {
            element.style.animation = '';
            this.animateElement(element, 'animate-spin');
        } else {
            element.style.animation = 'none';
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.saveUserPreferences();
        
        // Animate theme transition
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    setupContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            if (this.validateForm(data)) {
                this.submitForm(data, form);
            }
        });
    }

    validateForm(data) {
        const errors = [];

        if (!data.name.trim()) errors.push('Name is required');
        if (!data.email.trim()) errors.push('Email is required');
        if (!this.isValidEmail(data.email)) errors.push('Please enter a valid email');
        if (!data.message.trim()) errors.push('Message is required');

        if (errors.length > 0) {
            this.showNotification(errors.join('. '), 'error');
            return false;
        }

        return true;
    }

    async submitForm(data, form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await this.delay(2000);
            
            // Show success message
            this.showNotification('Message sent successfully! We\'ll get back to you soon. 📧', 'success');
            form.reset();
            
        } catch (error) {
            this.showNotification('Failed to send message. Please try again. ❌', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    setupHeroButtons() {
        const primaryBtn = document.querySelector('.hero-buttons .btn-primary');
        const secondaryBtn = document.querySelector('.hero-buttons .btn-secondary');

        if (primaryBtn) {
            primaryBtn.addEventListener('click', () => {
                this.scrollToSection('#features');
                this.showNotification('Welcome to our amazing features! 🚀', 'info');
            });
        }

        if (secondaryBtn) {
            secondaryBtn.addEventListener('click', () => {
                this.showNotification('Thanks for your interest! Scroll down to explore more. 💫', 'info');
                this.scrollToSection('#about');
            });
        }
    }

    setupScrollAnimations() {
        // Add initial animation classes
        const animatedElements = document.querySelectorAll('.feature-card, .demo-container > *, .contact-form');
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.transitionDelay = `${index * 0.1}s`;
        });
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, options);

        // Observe elements for animation
        const elementsToObserve = document.querySelectorAll('.feature-card, .demo-container > *, .contact-form');
        elementsToObserve.forEach(el => observer.observe(el));
    }

    handleScroll() {
        const navbar = document.querySelector('.navbar');
        const scrollY = window.scrollY;

        // Update navbar background opacity
        if (navbar) {
            const opacity = Math.min(scrollY / 100, 0.95);
            navbar.style.background = `rgba(0, 0, 0, ${opacity})`;

            
        }

        // Update active navigation based on scroll position
        this.updateActiveNavOnScroll();

        // Parallax effect for floating cards
        this.updateFloatingCards(scrollY);
    }

    updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    updateFloatingCards(scrollY) {
        const cards = document.querySelectorAll('.floating-card');
        cards.forEach((card, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrollY * speed);
            card.style.transform = `translateY(${yPos}px)`;
        });
    }

    updateActiveNavLink(href) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`a[href="${href}"]`)?.classList.add('active');
    }

    scrollToSection(selector) {
        const element = document.querySelector(selector);
        if (element) {
            const offsetTop = element.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    handleKeydown(e) {
        // Keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'd':
                    e.preventDefault();
                    this.toggleTheme();
                    this.showNotification('Theme toggled with keyboard shortcut! ⌨️', 'info');
                    break;
                case 'h':
                    e.preventDefault();
                    this.scrollToSection('#home');
                    break;
            }
        }

        // Escape to close mobile menu
        if (e.key === 'Escape') {
            const mobileMenu = document.getElementById('mobile-menu');
            const navMenu = document.querySelector('.nav-menu');
            if (mobileMenu && navMenu && navMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    }

    // Utility functions
    animateElement(element, animationClass) {
        element.classList.remove('animate-bounce', 'animate-spin', 'pulse');
        element.classList.add(animationClass);
        
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, 1000);
    }

    showFeedback(button, message) {
        const originalText = button.textContent;
        button.textContent = message;
        button.style.background = 'var(--primary-color)';
        button.style.color = 'white';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.style.color = '';
        }, 2000);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: '9999',
            fontSize: '14px',
            maxWidth: '300px',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease',
            wordWrap: 'break-word'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    saveUserPreferences() {
        const preferences = {
            theme: this.currentTheme,
            animationEnabled: this.isAnimationEnabled,
            colorVariant: this.currentColorVariant
        };
        localStorage.setItem('webAppPreferences', JSON.stringify(preferences));
    }

    loadUserPreferences() {
        try {
            const saved = localStorage.getItem('webAppPreferences');
            if (saved) {
                const preferences = JSON.parse(saved);
                this.currentTheme = preferences.theme || 'light';
                this.isAnimationEnabled = preferences.animationEnabled ?? true;
                this.currentColorVariant = preferences.colorVariant || 0;
                
                // Apply saved theme
                document.documentElement.setAttribute('data-theme', this.currentTheme);
                
                // Apply saved color variant
                const demoBox = document.getElementById('demoBox');
                if (demoBox && this.currentColorVariant > 0) {
                    demoBox.classList.add(`color-variant-${this.currentColorVariant}`);
                }
            }
        } catch (error) {
            console.warn('Could not load user preferences:', error);
        }
    }

    // Public API methods
    getTheme() {
        return this.currentTheme;
    }

    setTheme(theme) {
        if (['light', 'dark'].includes(theme)) {
            this.currentTheme = theme;
            document.documentElement.setAttribute('data-theme', theme);
            this.saveUserPreferences();
        }
    }

    showWelcomeMessage() {
        this.showNotification('Welcome to our modern web application! 🎉', 'success');
    }
}

// Enhanced features and easter eggs
class EnhancedFeatures {
    constructor(app) {
        this.app = app;
        this.setupEasterEggs();
        this.setupAdvancedInteractions();
    }

    setupEasterEggs() {
        // Konami code easter egg
        let konamiCode = [];
        const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        
        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.code);
            if (konamiCode.length > konamiSequence.length) {
                konamiCode.shift();
            }
            
            if (konamiCode.join('') === konamiSequence.join('')) {
                this.activateSpecialMode();
                konamiCode = [];
            }
        });

        // Logo click counter
        let logoClicks = 0;
        const logo = document.querySelector('.nav-logo');
        if (logo) {
            logo.addEventListener('click', () => {
                logoClicks++;
                if (logoClicks === 5) {
                    this.showSecretMessage();
                    logoClicks = 0;
                }
            });
        }
    }

    setupAdvancedInteractions() {
        // Mouse trail effect
        this.setupMouseTrail();
        
        // Dynamic background
        this.setupDynamicBackground();
        
        // Sound effects (visual feedback)
        this.setupSoundEffects();
    }

    setupMouseTrail() {
        const trail = [];
        const maxTrailLength = 10;

        document.addEventListener('mousemove', (e) => {
            trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
            
            if (trail.length > maxTrailLength) {
                trail.shift();
            }
        });

        // Clean up old trail points
        setInterval(() => {
            const now = Date.now();
            while (trail.length > 0 && now - trail[0].time > 1000) {
                trail.shift();
            }
        }, 100);
    }

    setupDynamicBackground() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        // Dynamic background disabled - keeping static background image
        // let mouseX = 0;
        // let mouseY = 0;

        // document.addEventListener('mousemove', (e) => {
        //     mouseX = (e.clientX / window.innerWidth) * 100;
        //     mouseY = (e.clientY / window.innerHeight) * 100;
        // });

        // const updateBackground = () => {
        //     if (hero) {
        //         hero.style.background = `linear-gradient(${mouseX}deg, var(--primary-color) ${mouseY}%, var(--secondary-color) 100%)`;
        //     }
        //     requestAnimationFrame(updateBackground);
        // };

        // updateBackground();
    }

    setupSoundEffects() {
        // Visual feedback for interactions (since we can't use actual sounds)
        const buttons = document.querySelectorAll('button, .btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.createRippleEffect(button);
            });
        });
    }

    createRippleEffect(element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
        ripple.classList.add('ripple');
        
        // Add ripple styles
        Object.assign(ripple.style, {
            position: 'absolute',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.6)',
            transform: 'scale(0)',
            animation: 'ripple 0.6s linear',
            pointerEvents: 'none'
        });

        // Add CSS animation if not already added
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    activateSpecialMode() {
        document.body.style.animation = 'rainbow 2s linear infinite';
        
        // Add rainbow animation if not already added
        if (!document.querySelector('#rainbow-styles')) {
            const style = document.createElement('style');
            style.id = 'rainbow-styles';
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        this.app.showNotification('🌈 Rainbow mode activated! You found the secret! 🦄', 'success');
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }

    showSecretMessage() {
        this.app.showNotification('🔥 You\'re a curious one! Keep exploring! ✨', 'info');
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            interactionTime: 0,
            scrollPerformance: []
        };
        this.measurePerformance();
    }

    measurePerformance() {
        // Page load time
        window.addEventListener('load', () => {
            this.metrics.loadTime = performance.now();
            console.log(`📊 Page loaded in ${this.metrics.loadTime.toFixed(2)}ms`);
        });

        // Interaction timing
        document.addEventListener('click', () => {
            const interactionStart = performance.now();
            requestAnimationFrame(() => {
                this.metrics.interactionTime = performance.now() - interactionStart;
            });
        });

        // Scroll performance
        let scrollStart;
        window.addEventListener('scroll', () => {
            if (!scrollStart) scrollStart = performance.now();
        });

        window.addEventListener('scrollend', () => {
            if (scrollStart) {
                const scrollTime = performance.now() - scrollStart;
                this.metrics.scrollPerformance.push(scrollTime);
                scrollStart = null;
            }
        });
    }

    getMetrics() {
        return this.metrics;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const app = new WebApp();
    const enhancedFeatures = new EnhancedFeatures(app);
    const performanceMonitor = new PerformanceMonitor();
    
    // Make app globally accessible for debugging
    window.webApp = app;
    window.performanceMonitor = performanceMonitor;
    
    // Show welcome message after a short delay
    setTimeout(() => {
        app.showWelcomeMessage();
    }, 1000);
    
    // Log initialization
    console.log('🎉 All systems initialized!');
    console.log('💡 Try these keyboard shortcuts:');
    console.log('   - Ctrl/Cmd + D: Toggle theme');
    console.log('   - Ctrl/Cmd + H: Go to home');
    console.log('   - Escape: Close mobile menu');
    console.log('🎯 Click the logo 5 times for a surprise!');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WebApp, EnhancedFeatures, PerformanceMonitor };
}
