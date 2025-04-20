// Theme switching
function setupThemeSwitcher() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.getAttribute('data-theme');
            document.body.className = theme + '-theme';
            
            // Save to localStorage
            localStorage.setItem('theme', theme);
        });
    });
}

// Admin functionality
function setupAdminFunctionality() {
    const addProjectBtn = document.getElementById('add-project-btn');
    const manageUsersBtn = document.getElementById('manage-users-btn');
    
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', () => {
            // In a real app, this would open a form to add a new project
            alert('Admin: Add new project functionality would go here');
        });
    }
    
    if (manageUsersBtn) {
        manageUsersBtn.addEventListener('click', () => {
            // In a real app, this would open a user management interface
            alert('Admin: User management functionality would go here');
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupThemeSwitcher();
    setupAdminFunctionality();
    
    // Load saved notification preference
    const notificationsToggle = document.getElementById('notifications-toggle');
    if (notificationsToggle) {
        const savedPref = localStorage.getItem('notifications') === 'true';
        notificationsToggle.checked = savedPref;
        
        notificationsToggle.addEventListener('change', (e) => {
            localStorage.setItem('notifications', e.target.checked);
        });
    }
});