// AceBase Landing Page JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize email forms
    initializeEmailForms();
    
    // Set today's date in dashboard
    setTodaysDate();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize navbar scroll effect
    initializeNavbarEffect();
    
    // Initialize animations on scroll
    initializeScrollAnimations();
    
    // Initialize schedule animation
    initializeScheduleAnimation();
    
    // Initialize modal functionality
    initializeModal();
}

function setTodaysDate() {
    const dashboardDateElement = document.getElementById('dashboardDate');
    if (dashboardDateElement) {
        const today = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const formattedDate = today.toLocaleDateString('en-US', options);
        dashboardDateElement.textContent = formattedDate;
    }
}

function animateNumber(element, from, to) {
    const duration = 1000;
    const start = Date.now();
    
    function update() {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(from + (to - from) * progress);
        element.textContent = current.toString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Modal Functions
function showModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// Initialize modal close functionality
function initializeModal() {
    const modal = document.getElementById('successModal');
    const closeButton = modal.querySelector('.modal-close');
    
    // Close on clicking X button
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    
    // Close on clicking outside
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
}

// Email Form Handling
function initializeEmailForms() {
    const forms = document.querySelectorAll('.email-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault(); // Prevent default form submission
            
            const submitButton = form.querySelector('button[type="submit"]');
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            // Show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Joining...';
            emailInput.disabled = true;

            try {
                // Create URL with parameters
                const url = new URL(form.action);
                url.searchParams.append('EMAIL', email);
                
                // Add callback parameter for JSONP
                const script = document.createElement('script');
                const callbackName = 'mailchimpCallback_' + Math.random().toString(36).substring(2);
                url.searchParams.append('c', callbackName);
                
                // Create promise to handle JSONP response
                const responsePromise = new Promise((resolve, reject) => {
                    window[callbackName] = (response) => {
                        if (response && typeof response === 'object') {
                            delete window[callbackName];
                            script.remove();
                            resolve(response);
                        }
                    };
                    
                    // Handle script load error
                    script.onerror = () => {
                        delete window[callbackName];
                        script.remove();
                        reject(new Error('Failed to load'));
                    };

                    // Add timeout
                    setTimeout(() => {
                        delete window[callbackName];
                        script.remove();
                        reject(new Error('Request timed out'));
                    }, 10000);
                });
                
                // Add script to document
                script.src = url.toString();
                document.body.appendChild(script);
                
                // Wait for response
                const response = await responsePromise;
                
                if (response.result === 'success') {
                    // Success! Show success message
                    emailInput.value = '';
                    submitButton.textContent = 'Joined!';
                    
                    // Update modal content
                    const modalTitle = document.getElementById('modalTitle');
                    const modalMessage = document.getElementById('modalMessage');
                    const modalSteps = document.getElementById('modalSteps');
                    
                    modalTitle.textContent = '🎉 Welcome to AceBase!';
                    modalMessage.textContent = response.msg || 'Thanks for joining! We\'ll keep you updated on our progress.';
                    
                    modalSteps.innerHTML = `
                        <li>We'll send you exclusive updates on our progress</li>
                        <li>You'll get early access when we launch</li>
                        <li>25% launch discount just for early supporters</li>
                        <li>First to hear about new features and improvements</li>
                    `;
                    
                    // Show success modal
                    showModal();
                    
                    // Reset button text after delay
                    setTimeout(() => {
                        submitButton.textContent = form.id === 'heroForm' ? 'Get early access' : 'Join the Waitlist';
                    }, 2000);
                } else {
                    // Show error message from Mailchimp
                    throw new Error(response.msg || 'Submission failed');
                }
            } catch (error) {
                console.error('Error:', error);
                submitButton.textContent = 'Try again';
                
                // Show error message in a more user-friendly way
                const errorMessage = error.message.includes('already subscribed') 
                    ? 'You\'re already on our waitlist! We\'ll keep you updated.'
                    : 'Sorry, there was an error. Please try again.';
                
                alert(errorMessage);
            } finally {
                // Re-enable form
                submitButton.disabled = false;
                emailInput.disabled = false;
            }
        });
    });
}

// Smooth Scrolling for Navigation Links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar Scroll Effect
function initializeNavbarEffect() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.problem-card, .feature-card, .stat, .session-card');
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Schedule Animation
function initializeScheduleAnimation() {
    const dashboardPreview = document.querySelector('.dashboard-preview');
    if (!dashboardPreview) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    let animationStarted = false;
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animationStarted) {
                animationStarted = true;
                // Start animation after a slight delay
                setTimeout(() => {
                    startScheduleAnimation();
                }, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    observer.observe(dashboardPreview);
    
    // Add click listener to dashboard title for manual restart
    const dashboardTitle = document.querySelector('.dashboard-title');
    if (dashboardTitle) {
        dashboardTitle.style.cursor = 'pointer';
        dashboardTitle.title = 'Click to replay animation';
        dashboardTitle.addEventListener('click', function() {
            window.AceBase.restartScheduleAnimation();
        });
    }
}

function startScheduleAnimation() {
    const sessionCards = document.querySelectorAll('.session-card');
    const advancedPadelCard = sessionCards[0]; // 4/4 students
    const beginnerTennisCard = sessionCards[1]; // 2/4 students
    const privateCoachingCard = sessionCards[2]; // Private session
    
    // Animation sequence - coordinated timing to avoid visual conflicts
    const animationSteps = [
        {
            delay: 0,
            action: () => {
                showNotification('🚪', 'Student Cancelled', 'Ken dropped from Advanced Training', 'dropout');
                setTimeout(() => {
                    animateStudentDropOut(advancedPadelCard, '4/4', '3/4', 'confirmed', 'available');
                }, 1200); // Wait for notification to fully appear and settle
            }
        },
        {
            delay: 4500,
            action: () => {
                showNotification('🎾', 'New Enrollment', 'Andre joined Beginner Group', 'joinin');
                setTimeout(() => {
                    animateStudentJoinIn(beginnerTennisCard, '2/4', '3/4', 'available', 'available');
                }, 1200);
            }
        },
        {
            delay: 8000,
            action: () => {
                showNotification('✅', 'Class Filled', 'Maria completed Advanced Training booking', 'filled');
                setTimeout(() => {
                    animateStudentJoinIn(advancedPadelCard, '3/4', '4/4', 'available', 'confirmed');
                }, 1200);
            }
        },
        {
            delay: 12500,
            action: () => {
                showNotification('🏆', 'Class Filled', 'Luis filled the last spot in Beginner Group', 'filled');
                setTimeout(() => {
                    animateStudentJoinIn(beginnerTennisCard, '3/4', '4/4', 'available', 'confirmed');
                }, 1200);
            }
        },
        {
            delay: 17000,
            action: () => {
                showNotification('🔄', 'Session Upgraded', 'Private session expanded to group coaching', 'joinin');
                setTimeout(() => {
                    animateNewStudentAdded(privateCoachingCard);
                }, 1200);
            }
        }
    ];
    
    animationSteps.forEach(step => {
        setTimeout(step.action, step.delay);
    });
}
function animateStudentDropOut(card, fromCount, toCount, fromStatus, toStatus) {
    const studentsElement = card.querySelector('.session-students');
    const statusElement = card.querySelector('.session-status');
    
    // Add dropout animation class
    card.classList.add('animating-dropout');
    
    setTimeout(() => {
        // Update the student count
        studentsElement.textContent = studentsElement.textContent.replace(fromCount, toCount);
        
        // Update status
        statusElement.textContent = toStatus === 'available' ? '1 spot available' : 'Confirmed';
        statusElement.className = `session-status ${toStatus}`;
        statusElement.classList.add('animating-status');
    }, 500);
}

function animateStudentJoinIn(card, fromCount, toCount, fromStatus, toStatus) {
    const studentsElement = card.querySelector('.session-students');
    const statusElement = card.querySelector('.session-status');
    
    // Add join-in animation class
    card.classList.add('animating-joinin');
    
    setTimeout(() => {
        // Update the student count
        studentsElement.textContent = studentsElement.textContent.replace(fromCount, toCount);
        
        // Update status
        if (toStatus === 'confirmed') {
            statusElement.textContent = 'Confirmed';
            statusElement.className = 'session-status confirmed';
        } else {
            const spotsLeft = parseInt(toCount.split('/')[1]) - parseInt(toCount.split('/')[0]);
            statusElement.textContent = spotsLeft === 1 ? '1 spot available' : `${spotsLeft} spots available`;
        }
        
        statusElement.classList.add('animating-status');
    }, 500);
}

function animateNewStudentAdded(card) {
    const studentsElement = card.querySelector('.session-students');
    const statusElement = card.querySelector('.session-status');
    
    // Add join-in animation class
    card.classList.add('animating-joinin');
    
    setTimeout(() => {
        // Update to show group session instead of private
        studentsElement.textContent = '2/2 students • Court 3';
        statusElement.textContent = 'Confirmed';
        statusElement.className = 'session-status confirmed';
        statusElement.classList.add('animating-status');
        
        // Update session name to reflect the change
        const sessionName = card.querySelector('.session-name');
        sessionName.textContent = 'Advanced Coaching';
    }, 500);
}

function showNotification(icon, title, message, type = 'joinin') {
    const notificationsContainer = document.getElementById('scheduleNotifications');
    if (!notificationsContainer) return;
    
    // Clear any existing notifications immediately and reset container
    notificationsContainer.innerHTML = '';
    notificationsContainer.style.height = '0px';
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
    `;
    
    notificationsContainer.appendChild(notification);
    
    // Small delay to ensure DOM is ready, then calculate height and show
    setTimeout(() => {
        const notificationHeight = notification.offsetHeight + 16; // 16px for margins
        notificationsContainer.style.height = `${notificationHeight}px`;
        
        // Trigger show animation after container height is set
        setTimeout(() => {
            notification.classList.add('show');
        }, 150);
    }, 50);
    
    // Auto-hide after 4 seconds - more time to read
    setTimeout(() => {
        hideNotification(notification);
    }, 4000);
}

function hideNotification(notification) {
    if (!notification || !notification.parentNode) return;
    
    notification.classList.add('hide');
    notification.classList.remove('show');
    
    // Start collapsing the container after a brief delay for smooth transition
    setTimeout(() => {
        const container = document.getElementById('scheduleNotifications');
        if (container) {
            container.style.height = '0px';
        }
        
        // Remove notification after container starts collapsing
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 200);
}

function clearNotifications() {
    const notificationsContainer = document.getElementById('scheduleNotifications');
    if (notificationsContainer) {
        notificationsContainer.style.height = '0px';
        notificationsContainer.innerHTML = '';
    }
}

// Export functions for potential external use
window.AceBase = {
    restartScheduleAnimation: function() {
        // Reset to original state first
        resetScheduleToOriginal();
        // Start animation after a brief delay
        setTimeout(() => {
            startScheduleAnimation();
        }, 500);
    }
};

function resetScheduleToOriginal() {
    const sessionCards = document.querySelectorAll('.session-card');
    const advancedPadelCard = sessionCards[0];
    const beginnerTennisCard = sessionCards[1]; 
    const privateCoachingCard = sessionCards[2];
    
    // Reset Advanced Training
    const advancedStudents = advancedPadelCard.querySelector('.session-students');
    const advancedStatus = advancedPadelCard.querySelector('.session-status');
    advancedStudents.textContent = '4/4 students • Court 1';
    advancedStatus.textContent = 'Confirmed';
    advancedStatus.className = 'session-status confirmed';
    
    // Reset Beginner Group
    const beginnerStudents = beginnerTennisCard.querySelector('.session-students');
    const beginnerStatus = beginnerTennisCard.querySelector('.session-status');
    beginnerStudents.textContent = '2/4 students • Court 2';
    beginnerStatus.textContent = '2 spots available';
    beginnerStatus.className = 'session-status available';
    
    // Reset Private Coaching
    const privateStudents = privateCoachingCard.querySelector('.session-students');
    const privateStatus = privateCoachingCard.querySelector('.session-status');
    const privateName = privateCoachingCard.querySelector('.session-name');
    privateStudents.textContent = 'Sarah Martinez';
    privateStatus.textContent = 'Confirmed';
    privateStatus.className = 'session-status confirmed';
    privateName.textContent = 'Private Coaching';
    
    // Remove any animation classes
    sessionCards.forEach(card => {
        card.classList.remove('animating-dropout', 'animating-joinin');
        const status = card.querySelector('.session-status');
        status.classList.remove('animating-status');
    });
    
    // Clear any existing notifications
    clearNotifications();
}
