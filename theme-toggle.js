// Theme toggle script
document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('theme-toggle');
    const themeSlider = document.getElementById('theme-slider');

    // Function to set the theme based on the slider value
    const setTheme = () => {
        const isDark = themeSlider.value === '1';
        document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };

    // Function to initialize the theme based on localStorage or system preference
    const initTheme = () => {
        const storedTheme = localStorage.getItem('theme');
        // Set the slider value based on localStorage
        themeSlider.value = storedTheme === 'dark' ? '1' : '0';
        // Call setTheme to apply the initial theme
        setTheme();
    };

    // Set theme based on slider interaction
    themeSlider.addEventListener('input', setTheme);

    // Set theme based on sun/moon icon click
    themeToggle.addEventListener('click', () => {
        // Toggle the slider value between 0 and 1
        themeSlider.value = themeSlider.value === '0' ? '1' : '0';
        // Call setTheme to apply the updated theme
        setTheme();
    });

    // Initialize theme on page load
    initTheme();
});

function highlightProject(element) {
    // Remove highlight from all project cards
    document.querySelectorAll('.project-card').forEach(card => {
      card.classList.remove('highlight');
    });
    // Add highlight to the clicked project card
    element.classList.add('highlight');
  }
  