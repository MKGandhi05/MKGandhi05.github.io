// Portfolio JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const body = document.body;

    // Toggle mobile menu
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            mobileMenu.classList.toggle('hidden');
            body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking on a link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Close mobile menu
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                mobileMenu.classList.add('hidden');
                body.style.overflow = '';
                
                // Navigate to section
                const targetId = this.getAttribute('href');
                scrollToSection(targetId);
            });
        });

        // Close mobile menu when clicking outside
        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                mobileMenu.classList.add('hidden');
                body.style.overflow = '';
            }
        });
    }

    // Scroll to section function
    function scrollToSection(targetId) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const navHeight = document.querySelector('.nav-header').offsetHeight;
            const targetPosition = targetSection.offsetTop - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Desktop navigation links
    const desktopNavLinks = document.querySelectorAll('.nav-link');
    desktopNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            scrollToSection(targetId);
        });
    });

    // Hero action buttons scroll links
    const scrollLinks = document.querySelectorAll('.scroll-link');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            scrollToSection(targetId);
        });
    });

    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const allNavLinks = document.querySelectorAll('.nav-link');

    function highlightActiveNav() {
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                allNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Scroll to top button
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    
    function toggleScrollToTopBtn() {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
            scrollToTopBtn.classList.remove('hidden');
        } else {
            scrollToTopBtn.classList.remove('visible');
            scrollToTopBtn.classList.add('hidden');
        }
    }

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements that should animate
    const animatedElements = document.querySelectorAll('.skill-category, .project-card, .community-card, .timeline-item, .highlight-card');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Scroll event listener
    window.addEventListener('scroll', function() {
        highlightActiveNav();
        toggleScrollToTopBtn();
    });

    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const formData = new FormData(contactForm);
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const subject = formData.get('subject').trim();
            const message = formData.get('message').trim();
            
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Submit to Formspree
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    showNotification('There was an error sending your message. Please try again.', 'error');
                }
            }).catch(error => {
                showNotification('There was an error sending your message. Please try again.', 'error');
            }).finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '90px',
            right: '20px',
            padding: '16px 24px',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '400px',
            wordWrap: 'break-word'
        });
        
        // Set background color based on type
        switch(type) {
            case 'success':
                notification.style.background = 'var(--color-success)';
                break;
            case 'error':
                notification.style.background = 'var(--color-error)';
                break;
            case 'warning':
                notification.style.background = 'var(--color-warning)';
                break;
            default:
                notification.style.background = 'var(--color-info)';
        }
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Remove on click
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
    }

    // Resume download functionality
    const resumeBtn = document.querySelector('.download-resume');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create comprehensive resume content
            const resumeContent = `MEDISHETTY MANIKANTA GANDHI
Full Stack Developer

Contact Information:
Email: manikantagandhim@outlook.com
Phone: +91 8328448464
Location: Hyderabad, India
LinkedIn: https://linkedin.com/in/Medishetty-manikanta-gandhi
GitHub: https://github.com/MKGandhi05
Portfolio: https://mkgandhi05.github.io/

PROFESSIONAL SUMMARY
====================
Final-year Computer Science student (graduating 2026) with experience in Python, JavaScript, Django, and Flask. 
Skilled in REST APIs, SQL, and cloud (Azure), with strong foundation in algorithms and scalable application design.

EDUCATION
=========
Bachelor of Technology in Computer Science
Sri Indu College of Engineering and Technology
Duration: Nov 2022 – May 2026

Intermediate in MPC
Sri Gayathri Junior College, Hyderabad
Duration: Jun 2020 – May 2022

PROFESSIONAL EXPERIENCE
========================
Full Stack Developer Intern | Rinav Tech | Hyderabad, India
Duration: Apr 2025 – July 2025
• Automated onboarding and media uploads with Django + MySQL workflow, reducing manual effort by ~60%
• Designed scalable enterprise-style app with REST API endpoints supporting 1,000+ concurrent users with <200ms response time
• Built reusable modules for login, registration, media management, reducing code duplication by 40%

IT Lead Intern | Mentoria Institute Limited | Hyderabad, India  
Duration: Jan 2025 – Apr 2025
• Delivered centralized website (Flask + React + MySQL), improving efficiency by ~40%
• Integrated 5+ third-party APIs and deployed on cloud for real-time operations
• Led 3-member agile team, implementing CI/CD pipelines, reducing deployment time by 50%

FEATURED PROJECTS
=================
PromptProbe (https://promptprobe.in)
• Multi-LLM playground with authentication, REST APIs, and session tracking
• 250+ users in week one, 15+ paid subscribers
• Tech Stack: React, Django, REST APIs, Authentication

CodeMania
• Hackathon platform for participants with automated event workflows
• 150+ participants, reduced admin workload by 75%
• Tech Stack: Django, MySQL, Event Management

PowerPitch
• Event tracking system with MySQL-backed automation
• 90+ weekly users, decreased paperwork by 80%
• Tech Stack: MySQL, Python, Automation

TECHNICAL SKILLS
================
Programming Languages: Python, JavaScript
Web Technologies: React.js, HTML, CSS (Tailwind), Django, Flask, REST APIs
Databases: SQL, MySQL, MongoDB
Cloud & Tools: Azure, Git, GitHub, VS Code, Power BI, Copilot Studio
Core Computer Science: Data Structures & Algorithms, Operating Systems, DBMS
Soft Skills: Communication, Problem Solving, Leadership

COMMUNITY & LEADERSHIP
======================
Co Organizer - Microsoft AI Innovators Hub & Global AI Hyderabad
• Organized 10+ learning sessions engaging 200+ participants per event

Coordinator - Cyber Club, SICET
• Organized 3+ large-scale events impacting 500+ students

Organizer - CodeMania 2K25 Hackathon
• Managed hackathon with 150+ participants across 35+ teams

ACHIEVEMENTS & METRICS
======================
• Built applications serving 1,000+ concurrent users
• Reduced manual processes by up to 80% through automation
• Led teams and managed events with 500+ participants
• Developed platforms with 250+ active users and paid subscribers`;
            
            // Create and download the resume
            const blob = new Blob([resumeContent], { type: 'text/plain;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Medishetty_Manikanta_Gandhi_Resume.txt';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            showNotification('Resume downloaded successfully!', 'success');
        });
    }

    // External links handling - ensure they open in new tabs
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Ensure the link opens in a new tab
            if (!this.target) {
                this.target = '_blank';
            }
            console.log('External link clicked:', this.href);
        });
    });

    // Typing animation for hero section
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Initialize typing animation after a delay
    setTimeout(() => {
        const heroTagline = document.querySelector('.hero-tagline');
        if (heroTagline) {
            const originalText = heroTagline.textContent;
            typeWriter(heroTagline, originalText, 50);
        }
    }, 1000);

    // Add hover effects to skill tags
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Initialize active nav on page load
    highlightActiveNav();
    
    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Initialize scroll to top button state
    toggleScrollToTopBtn();

    console.log('Portfolio JavaScript loaded successfully!');
});