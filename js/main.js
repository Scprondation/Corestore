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
            e.preventDefault();
            const target = e.currentTarget.getAttribute('href');
            
            // Add active class to transition
            transitionEl.classList.add('is-active');
            
            // Navigate after transition
            setTimeout(() => {
                window.location.href = target;
            }, 600);
        });
    });
    
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme + '-theme';
    
    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop();
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});