// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Navigation Menu Toggle
    const menuBtn = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('.navigation');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            navigation.classList.toggle('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navigation') && !e.target.closest('.menu-toggle')) {
            navigation.classList.remove('active');
        }
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu after clicking
                navigation.classList.remove('active');
            }
        });
    });

    // Portfolio Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');
            
            filterButtons.forEach(button => button.classList.remove('active'));
            btn.classList.add('active');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Testimonial Slider
    const slider = document.querySelector('.testimonials-track');
    const slides = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slider-dots');
    
    let currentSlide = 0;
    const slideWidth = 100; // percentage

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        slider.style.transform = `translateX(-${slideWidth * currentSlide}%)`;
        updateDots();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(currentSlide);
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
    }

    // Auto advance slides every 5 seconds
    setInterval(nextSlide, 5000);

    // Video Testimonial
    const videoThumbnail = document.querySelector('.video-wrapper');
    const playBtn = document.querySelector('.play-btn');

    if (videoThumbnail && playBtn) {
        playBtn.addEventListener('click', () => {
            // Replace with actual video implementation
            const video = document.createElement('iframe');
            video.src = 'https://www.youtube.com/embed/your-video-id?autoplay=1';
            video.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            video.allowFullscreen = true;
            videoThumbnail.innerHTML = '';
            videoThumbnail.appendChild(video);
        });
    }

    // Stats Counter Animation
    const stats = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    function animateStats() {
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // Animation duration in milliseconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCount = () => {
                if (current < target) {
                    current += increment;
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target;
                }
            };

            updateCount();
        });
        hasAnimated = true;
    }

    // Trigger stats animation when section is in view
    const statsSection = document.querySelector('.testimonial-stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    animateStats();
                }
            });
        });

        observer.observe(statsSection);
    }

    // Stats counter animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const value = target.innerText;
                const endValue = parseInt(target.getAttribute('data-target'));
                animateNumber(target, 0, endValue, 2000);
                statsObserver.unobserve(target);
            }
        });
    });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Initialize Swiper for testimonials
    if (document.querySelector('.testimonials-slider .swiper-container')) {
        const testimonialsSwiper = new Swiper('.testimonials-slider .swiper-container', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
        });
    }

    // Counter Animation with Intersection Observer
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.dataset.target);
        const suffix = counter.dataset.suffix || '';
        const duration = 2000;
        const start = 0;
        
        animateNumber(counter, start, target, duration, suffix);
    };

    // Use a single Intersection Observer for all counters
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target); // Only animate once
                }
            });
        }, {
            threshold: 0.5
        });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // Video Modal
    const videoButtons = document.querySelectorAll('.play-button');
    const body = document.body;

    videoButtons.forEach(button => {
        button.addEventListener('click', () => {
            const videoUrl = button.dataset.video;
            const modal = document.createElement('div');
            modal.classList.add('video-modal');
            
            modal.innerHTML = `
                <div class="video-modal-content">
                    <button class="close-modal">&times;</button>
                    <div class="video-container">
                        <iframe src="${videoUrl}?autoplay=1" frameborder="0" allowfullscreen></iframe>
                    </div>
                </div>
            `;
            
            body.appendChild(modal);
            body.style.overflow = 'hidden';
            
            // Close modal functionality
            const closeBtn = modal.querySelector('.close-modal');
            const closeModal = () => {
                body.removeChild(modal);
                body.style.overflow = '';
            };
            
            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
            
            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeModal();
            });
        });
    });

    // Add video modal styles dynamically
    const modalStyles = document.createElement('style');
    modalStyles.textContent =
    document.head.appendChild(modalStyles);

    // Animation on Scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkScroll() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('animate');
            }
        });
    }

    // Initial check for elements in view
    checkScroll();
    
    // Check on scroll
    window.addEventListener('scroll', checkScroll);

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Add navigation links for new sections
    const navLinks = document.querySelector('.navigation');
    if (navLinks) {
        const pricingLink = document.createElement('a');
        pricingLink.href = '#pricing';
        pricingLink.className = 'nav-link';
        pricingLink.textContent = 'Pricing';
        
        const faqLink = document.createElement('a');
        faqLink.href = '#faq';
        faqLink.className = 'nav-link';
        faqLink.textContent = 'FAQ';
        
        const blogLink = document.createElement('a');
        blogLink.href = '#blog';
        blogLink.className = 'nav-link';
        blogLink.textContent = 'Blog';
        
        const teamLink = document.createElement('a');
        teamLink.href = '#team';
        teamLink.className = 'nav-link';
        teamLink.textContent = 'Team';
        
        navLinks.insertBefore(pricingLink, document.querySelector('a[href="#contact"]'));
        navLinks.insertBefore(faqLink, document.querySelector('a[href="#contact"]'));
        navLinks.insertBefore(blogLink, document.querySelector('a[href="#contact"]'));
        navLinks.insertBefore(teamLink, document.querySelector('a[href="#contact"]'));
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: contactForm.querySelector('#name').value,
                email: contactForm.querySelector('#email').value,
                phone: contactForm.querySelector('#phone').value,
                subject: contactForm.querySelector('#subject').value,
                message: contactForm.querySelector('#message').value
            };
            
            // Create success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                Thank you ${formData.name}! Your message has been sent successfully. We'll get back to you soon.
            `;
            
            // Add success message to form
            const existingMessage = contactForm.querySelector('.success-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            contactForm.appendChild(successMessage);
            
            // Show success message with animation
            setTimeout(() => {
                successMessage.classList.add('show');
            }, 100);
            
            // Reset form
            contactForm.reset();
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
                setTimeout(() => {
                    successMessage.remove();
                }, 450);
            }, 5000);
        });
    }

    // Newsletter Form Handling
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            // Here you would typically send this to your backend
            // For now, we'll just show a success message
            const button = newsletterForm.querySelector('button');
            const originalText = button.textContent;
            button.textContent = 'Subscribed!';
            button.style.backgroundColor = '#10B981';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '';
                newsletterForm.reset();
            }, 2000);
        });
    }

    // Portfolio Filtering
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Video Modal
    const videoModal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('videoFrame');
    const videoLinks = document.querySelectorAll('.portfolio-link');
    const closeButtons = document.querySelectorAll('.close-modal');

    videoLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const videoUrl = link.getAttribute('data-video');
            videoFrame.src = videoUrl;
            videoModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Project Details Modal
    const projectModal = document.getElementById('projectModal');
    const projectLinks = document.querySelectorAll('.portfolio-details-link');
    const projectTitle = document.getElementById('projectTitle');
    const projectCategory = document.getElementById('projectCategory');
    const projectDescription = document.getElementById('projectDescription');
    const projectClient = document.getElementById('projectClient');
    const projectDuration = document.getElementById('projectDuration');
    const projectServices = document.getElementById('projectServices');
    const projectGallery = document.getElementById('projectGallery');

    // Project Data (you can replace this with actual data)
    const projectData = {
        nike: {
            title: 'Nike Campaign',
            category: 'Commercial',
            description: 'A dynamic commercial campaign showcasing Nike\'s latest product line with cutting-edge visual effects and storytelling.',
            client: 'Nike Inc.',
            duration: '2 weeks',
            services: 'Video Editing, Color Grading, Motion Graphics',
            gallery: [
                'https://via.placeholder.com/600x400/1E293B/6366F1',
                'https://via.placeholder.com/600x400/1E293B/6366F1',
                'https://via.placeholder.com/600x400/1E293B/6366F1'
            ]
        },
        // Add more project data here
    };

    projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = link.getAttribute('data-project');
            const project = projectData[projectId];
            
            if (project) {
                projectTitle.textContent = project.title;
                projectCategory.textContent = project.category;
                projectDescription.textContent = project.description;
                projectClient.textContent = project.client;
                projectDuration.textContent = project.duration;
                projectServices.textContent = project.services;
                
                // Clear and populate gallery
                projectGallery.innerHTML = '';
                project.gallery.forEach(image => {
                    const galleryItem = document.createElement('div');
                    galleryItem.className = 'gallery-item';
                    galleryItem.innerHTML = `<img src="${image}" alt="Project Image">`;
                    projectGallery.appendChild(galleryItem);
                });
                
                projectModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close Modals
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            videoModal.style.display = 'none';
            projectModal.style.display = 'none';
            videoFrame.src = '';
            document.body.style.overflow = 'auto';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            videoModal.style.display = 'none';
            videoFrame.src = '';
            document.body.style.overflow = 'auto';
        }
        if (e.target === projectModal) {
            projectModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Smooth Scroll for Navigation Links
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

    // Pricing Section Functionality
    const pricingToggle = document.getElementById('pricingToggle');
    const pricingSection = document.getElementById('pricing');
    const monthlyText = document.querySelector('.pricing-toggle .monthly');
    const yearlyText = document.querySelector('.pricing-toggle .yearly');
    const priceAmounts = document.querySelectorAll('.price .amount');
    const periodTexts = document.querySelectorAll('.price .period');

    // Price data
    const prices = {
        basic: {
            monthly: 29,
            yearly: 278  // 29 * 12 - 20% discount
        },
        pro: {
            monthly: 49,
            yearly: 470  // 49 * 12 - 20% discount
        },
        premium: {
            monthly: 99,
            yearly: 950  // 99 * 12 - 20% discount
        }
    };

    function updatePrices(isYearly) {
        const priceCards = document.querySelectorAll('.pricing-card');
        priceCards.forEach((card, index) => {
            const priceAmount = card.querySelector('.price .amount');
            const periodText = card.querySelector('.price .period');
            let planType;
            
            // Determine plan type based on index or card class
            if (card.classList.contains('popular')) {
                planType = 'pro';
            } else if (index === 2) {
                planType = 'premium';
            } else {
                planType = 'basic';
            }

            // Update price amount
            const newPrice = isYearly ? prices[planType].yearly : prices[planType].monthly;
            priceAmount.textContent = newPrice;

            // Update period text
            periodText.textContent = isYearly ? '/yr' : '/mo';
        });
    }

    pricingToggle.addEventListener('change', () => {
        const isYearly = pricingToggle.checked;
        
        if (isYearly) {
            pricingSection.classList.add('yearly');
            monthlyText.classList.remove('active');
            yearlyText.classList.add('active');
        } else {
            pricingSection.classList.remove('yearly');
            monthlyText.classList.add('active');
            yearlyText.classList.remove('active');
        }

        updatePrices(isYearly);
    });

    // Click on text to toggle
    monthlyText.addEventListener('click', () => {
        pricingToggle.checked = false;
        pricingToggle.dispatchEvent(new Event('change'));
    });

    yearlyText.addEventListener('click', () => {
        pricingToggle.checked = true;
        pricingToggle.dispatchEvent(new Event('change'));
    });

    // Initialize prices
    updatePrices(false);

    // FAQ Accordion
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = '0';
                        }
                    }
                });

                // Toggle current item
                item.classList.toggle('active');
                if (item.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        }
    });

    // Pricing Card Hover Effects
    const pricingCards = document.querySelectorAll('.pricing-card');

    pricingCards.forEach(card => {
        if (card) {
            card.addEventListener('mouseenter', () => {
                card.classList.add('active');
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('active');
            });
        }
    });

    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }

    // Smooth Scroll for Pricing Links
    const pricingLinks = document.querySelectorAll('a[href^="#"]');
    pricingLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Hero Section Animations
    // Play button hover effect
    const playButton = document.querySelector('.play-button');
    if (playButton) {
        playButton.addEventListener('mouseenter', () => {
            playButton.style.transform = 'translate(-50%, -50%) scale(1.1)';
        });
        
        playButton.addEventListener('mouseleave', () => {
            playButton.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        // Video modal functionality
        playButton.addEventListener('click', () => {
            // Add your video modal functionality here
            console.log('Play button clicked');
        });
    }

    // Floating cards animation
    const cards = document.querySelectorAll('.floating-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 2}s`;
    });

    // Number animation helper function
    function animateNumber(element, start, end, duration, suffix = '+') {
        let current = start;
        const range = end - start;
        const increment = range / (duration / 16);
        const startTime = performance.now();

        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            current = Math.min(start + (elapsed / duration) * range, end);
            
            element.textContent = Math.floor(current) + suffix;
            
            if (current < end) {
                requestAnimationFrame(updateNumber);
            }
        }

        requestAnimationFrame(updateNumber);
    }

    // Initialize hero stats
    const heroStats = document.querySelectorAll('.hero-stats .stat-number');
    heroStats.forEach(stat => {
        animateNumber(stat, 0, 350, 2000, '+');
    });

    // Header Functionality
    const header = document.querySelector('.header');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li');

    // Sticky Header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // Mobile Navigation
    mobileNavToggle.addEventListener('click', () => {
        const isOpen = mobileNavLinks.classList.contains('active');
        mobileNavLinks.classList.toggle('active');
        mobileNavToggle.querySelector('i').className = isOpen ? 'fas fa-bars' : 'fas fa-times';
        
        // Animate nav items
        navItems.forEach((item, index) => {
            if (item.style.animation) {
                item.style.animation = '';
            } else {
                item.style.animation = `navItemFade 0.5s ease forwards ${index * 0.1 + 0.3}s`;
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-nav-toggle')) {
            mobileNavLinks.classList.remove('active');
            mobileNavToggle.querySelector('i').className = 'fas fa-bars';
            navItems.forEach(item => {
                item.style.animation = '';
            });
        }
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink?.classList.add('active');
            } else {
                navLink?.classList.remove('active');
            }
        });
    });
});
