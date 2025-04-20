// Mobile menu functionality
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
}

// Page transitions
document.addEventListener('DOMContentLoaded', () => {
    // Handle page transitions
    const transitionEl = document.querySelector('.transition-1');
    
    // Remove active class after transition
    setTimeout(() => {
        transitionEl.classList.remove('is-active');
    }, 600);
    
    // Handle navigation clicks
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            if (window.innerWidth > 768) { // Only animate on desktop
                e.preventDefault();
                const target = e.currentTarget.getAttribute('href');
                
                // Add active class to transition
                transitionEl.classList.add('is-active');
                
                // Navigate after transition
                setTimeout(() => {
                    window.location.href = target;
                }, 600);
            }
        });
    });
    
    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop();
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Add fade-in animation to main content
    const mainContent = document.querySelector('main');
    if (mainContent) {
        setTimeout(() => {
            mainContent.style.opacity = '1';
        }, 300);
    }
});
