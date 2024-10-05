// JavaScript to handle switching between sections and showing project details

// Get all the main navigation buttons
const navButtons = document.querySelectorAll('.nav-btn');
// Get all content sections (projects, about, contact)
const contentSections = document.querySelectorAll('.content-section');

// Get all the project buttons
const projectButtons = document.querySelectorAll('.project-btn');
// Get all project content sections
const projectContents = document.querySelectorAll('.project-content');

// Add click event listener for main navigation buttons
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Hide all sections
        contentSections.forEach(section => section.style.display = 'none');
        
        // Get the target section from the button's data attribute
        const targetSection = document.getElementById(button.dataset.target);
        
        // Show the targeted section
        targetSection.style.display = 'block';

        // Hide all project details when switching sections
        projectContents.forEach(project => project.style.display = 'none');
    });
});

// Add click event listener for project buttons
projectButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Hide all project details
        projectContents.forEach(content => content.style.display = 'none');
        
        // Get the target project content from the button's data attribute
        const targetProject = document.getElementById(button.dataset.project);
        
        // Show the targeted project content
        targetProject.style.display = 'block';
    });
});
