document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');
    const navbar = document.querySelector('.navbar');

    function toggleMenu() {
        const isActive = navLinks.classList.toggle('active');
        navOverlay.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', isActive);
        
        // Simple animation for the hamburger menu
        const spans = mobileMenuBtn.querySelectorAll('span');
        if (isActive) {
            spans[0].style.transform = 'translateY(7px) rotate(45deg)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
            document.body.style.overflow = '';
        }
    }

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', toggleMenu);
        if(navOverlay) navOverlay.addEventListener('click', toggleMenu);

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if(navLinks.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }

    // 2. Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
            navbar.style.padding = '0.5rem 0';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '0.75rem 0';
        }
        
        // Highlight active nav link on scroll
        const sections = document.querySelectorAll('section');
        const navItems = document.querySelectorAll('.nav-links a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = { threshold: 0.1, rootMargin: "0px 0px -20px 0px" };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    // 4. Smooth Scrolling for Anchor Links (with offset for sticky nav)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = 60; // Approximate fixed height
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // 5. Accordion Interactivity
    const accItems = document.querySelectorAll('.acc-item');
    accItems.forEach(item => {
        const title = item.querySelector('h4');
        const content = item.querySelector('p');
        
        title.style.cursor = 'pointer';
        title.style.display = 'flex';
        title.style.justifyContent = 'space-between';
        
        const indicator = document.createElement('span');
        indicator.textContent = '+';
        indicator.style.color = 'var(--text-muted)';
        indicator.style.transition = 'transform 0.3s ease';
        title.appendChild(indicator);
        
        content.style.maxHeight = '0';
        content.style.overflow = 'hidden';
        content.style.transition = 'max-height 0.3s ease, margin-top 0.3s ease';
        content.style.marginTop = '0';

        title.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');
            // Close all others
            accItems.forEach(otherItem => {
                otherItem.classList.remove('is-open');
                otherItem.querySelector('p').style.maxHeight = '0';
                otherItem.querySelector('p').style.marginTop = '0';
                otherItem.querySelector('span').innerHTML = '+';
                otherItem.querySelector('span').style.transform = 'rotate(0)';
            });

            if (!isOpen) {
                item.classList.add('is-open');
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.marginTop = '0.5rem';
                indicator.innerHTML = '-';
                indicator.style.transform = 'rotate(180deg)';
                indicator.style.color = 'var(--accent-red)';
            }
        });
    });
    
    // Open the first accordion item by default
    if(accItems.length > 0) accItems[0].querySelector('h4').click();
});
