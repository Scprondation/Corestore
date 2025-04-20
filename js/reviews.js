import { auth, database } from './firebase.js';

let currentProjectId = null;
let currentUserId = null;

// Load reviews for a project
function loadReviews(projectId) {
    currentProjectId = projectId;
    const reviewsContainer = document.getElementById('project-reviews');
    reviewsContainer.innerHTML = '<p>Loading reviews...</p>';
    
    database.ref(`reviews/${projectId}`).once('value')
        .then(snapshot => {
            const reviews = snapshot.val();
            reviewsContainer.innerHTML = '';
            
            if (!reviews) {
                reviewsContainer.innerHTML = '<p>No reviews yet. Be the first to review!</p>';
                return;
            }
            
            let hasUserReviewed = false;
            
            for (const reviewId in reviews) {
                const review = reviews[reviewId];
                
                if (currentUserId && review.userId === currentUserId) {
                    hasUserReviewed = true;
                }
                
                const reviewElement = document.createElement('div');
                reviewElement.className = 'review-item';
                reviewElement.innerHTML = `
                    <div class="review-header">
                        <img src="${review.userPhoto || 'https://via.placeholder.com/40'}" alt="${review.userName}" class="review-avatar">
                        <span>${review.userName}</span>
                        <div class="review-rating">${renderStars(review.rating)}</div>
                    </div>
                    <p>${review.comment || 'No comment provided.'}</p>
                    <div class="review-date">${new Date(review.timestamp).toLocaleDateString()}</div>
                `;
                
                reviewsContainer.appendChild(reviewElement);
            }
            
            // Show/hide review form based on whether user has reviewed
            const addReviewSection = document.getElementById('add-review-section');
            if (addReviewSection) {
                if (currentUserId && !hasUserReviewed) {
                    addReviewSection.classList.remove('hidden');
                    setupStarRating();
                } else {
                    addReviewSection.classList.add('hidden');
                }
            }
        })
        .catch(error => {
            console.error('Error loading reviews:', error);
            reviewsContainer.innerHTML = '<p>Error loading reviews. Please try again.</p>';
        });
}

// Setup star rating interaction
function setupStarRating() {
    const stars = document.querySelectorAll('.star-rating .star');
    let selectedRating = 0;
    
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = parseInt(star.getAttribute('data-value'));
            selectedRating = value;
            
            stars.forEach((s, index) => {
                if (index < value) {
                    s.innerHTML = '<i class="fas fa-star"></i>';
                } else {
                    s.innerHTML = '<i class="far fa-star"></i>';
                }
            });
        });
        
        star.addEventListener('mouseover', () => {
            const value = parseInt(star.getAttribute('data-value'));
            
            stars.forEach((s, index) => {
                if (index < value) {
                    s.innerHTML = '<i class="fas fa-star"></i>';
                }
            });
        });
        
        star.addEventListener('mouseout', () => {
            stars.forEach((s, index) => {
                if (index >= selectedRating) {
                    s.innerHTML = '<i class="far fa-star"></i>';
                }
            });
        });
    });
    
    // Submit review button
    document.getElementById('submit-review').addEventListener('click', () => {
        if (selectedRating === 0) {
            alert('Please select a rating');
            return;
        }
        
        submitReview(selectedRating);
    });
}

// Submit a new review
function submitReview(rating) {
    const user = auth.currentUser;
    if (!user || !currentProjectId) return;
    
    const review = {
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL,
        rating: rating,
        comment: '', // Could add a textarea for comments
        timestamp: Date.now()
    };
    
    // Push new review
    database.ref(`reviews/${currentProjectId}`).push(review)
        .then(() => {
            // Update project's average rating
            updateProjectRating(currentProjectId);
            
            // Reload reviews
            loadReviews(currentProjectId);
        })
        .catch(error => {
            console.error('Error submitting review:', error);
            alert('Error submitting review. Please try again.');
        });
}

// Update project's average rating
function updateProjectRating(projectId) {
    database.ref(`reviews/${projectId}`).once('value')
        .then(snapshot => {
            const reviews = snapshot.val();
            if (!reviews) return;
            
            let total = 0;
            let count = 0;
            
            for (const reviewId in reviews) {
                total += reviews[reviewId].rating;
                count++;
            }
            
            const avgRating = total / count;
            
            // Update project with new average rating
            database.ref(`projects/${projectId}`).update({
                avgRating: avgRating,
                reviewCount: count
            });
        })
        .catch(error => {
            console.error('Error updating project rating:', error);
        });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set current user ID if logged in
    auth.onAuthStateChanged(user => {
        currentUserId = user ? user.uid : null;
        
        // If we're on a project modal and user logs in/out, reload reviews
        if (document.getElementById('project-modal') && currentProjectId) {
            loadReviews(currentProjectId);
        }
    });
});