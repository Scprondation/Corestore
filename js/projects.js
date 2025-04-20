import { database } from './firebase.js';

// Load projects from Firebase
function loadProjects() {
    const projectsRef = database.ref('projects');
    
    projectsRef.on('value', snapshot => {
        const projects = snapshot.val();
        const featuredContainer = document.getElementById('featured-projects');
        const allProjectsContainer = document.getElementById('all-projects');
        
        if (featuredContainer) {
            featuredContainer.innerHTML = '';
            renderProjects(projects, featuredContainer, true);
        }
        
        if (allProjectsContainer) {
            allProjectsContainer.innerHTML = '';
            renderProjects(projects, allProjectsContainer);
        }
    });
}

// Render projects to the DOM
function renderProjects(projects, container, featuredOnly = false) {
    if (!projects) return;
    
    for (const id in projects) {
        const project = projects[id];
        
        if (featuredOnly && !project.featured) continue;
        
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.dataset.id = id;
        
        projectCard.innerHTML = `
            <img src="${project.image}" alt="${project.name}" class="project-image">
            <div class="project-info">
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <div class="project-meta">
                    <span class="rating">${renderStars(project.avgRating || 0)}</span>
                    <span>${project.category}</span>
                </div>
            </div>
        `;
        
        projectCard.addEventListener('click', () => openProjectModal(id, project));
        container.appendChild(projectCard);
    }
}

// Render star rating
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Open project modal
function openProjectModal(id, project) {
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('modal-project-details');
    
    modalContent.innerHTML = `
        <h2>${project.name}</h2>
        <img src="${project.image}" alt="${project.name}" style="max-width: 100%; border-radius: 8px; margin: 1rem 0;">
        <p>${project.longDescription || project.description}</p>
        <div class="project-meta">
            <span class="rating">${renderStars(project.avgRating || 0)} (${project.reviewCount || 0} reviews)</span>
            <span>${project.category}</span>
        </div>
        <a href="${project.link}" class="btn" target="_blank">Visit Project</a>
    `;
    
    modal.style.display = 'block';
    
    // Load reviews
    loadReviews(id);
    
    // Close modal when clicking X
    document.querySelector('.close-modal').onclick = function() {
        modal.style.display = 'none';
    };
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    
    // Search functionality
    if (document.getElementById('project-search')) {
        document.getElementById('project-search').addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const projects = document.querySelectorAll('.project-card');
            
            projects.forEach(project => {
                const name = project.querySelector('h3').textContent.toLowerCase();
                const desc = project.querySelector('p').textContent.toLowerCase();
                
                if (name.includes(searchTerm) || desc.includes(searchTerm)) {
                    project.style.display = 'block';
                } else {
                    project.style.display = 'none';
                }
            });
        });
    }
    
    // Filter functionality
    if (document.getElementById('project-filter')) {
        document.getElementById('project-filter').addEventListener('change', (e) => {
            const filter = e.target.value;
            const projects = document.querySelectorAll('.project-card');
            
            projects.forEach(project => {
                const category = project.querySelector('.project-meta span:last-child').textContent.toLowerCase();
                
                if (filter === 'all' || category.includes(filter)) {
                    project.style.display = 'block';
                } else {
                    project.style.display = 'none';
                }
            });
        });
    }
});