const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeText = document.getElementById('theme-text');

// 1. Check saved user preference in localStorage on page load
const savedTheme = localStorage.getItem('verdikt-theme');

if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateButtonText(savedTheme);
} else {
  // Optional: Check system preference (if user's OS is set to dark mode)
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateButtonText('dark');
  }
}

// 2. Toggle Theme function on button click
themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('verdikt-theme', newTheme); // Save preference
  updateButtonText(newTheme);
});

// Helper function to switch icon and text
function updateButtonText(theme) {
  if (theme === 'dark') {
    themeIcon.textContent = '☀️';
    themeText.textContent = 'Light Mode';
  } else {
    themeIcon.textContent = '🌙';
    themeText.textContent = 'Dark Mode';
  }
}

// --- Live Search Bar Filter ---
const searchInput = document.getElementById('search-input');
const reviewCards = document.querySelectorAll('.review');
const noResults = document.getElementById('no-results');

if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    let matchesCount = 0;

    reviewCards.forEach((card) => {
      const cardText = card.textContent.toLowerCase();

      if (cardText.includes(query)) {
        if (card.classList.contains('hidden')) {
          card.classList.remove('hidden');
          card.classList.add('search-enter');
          const finishSearchAnimation = () => {
            card.classList.remove('search-enter');
            card.removeEventListener('animationend', finishSearchAnimation);
            card.removeEventListener('animationcancel', finishSearchAnimation);
          };
          card.addEventListener('animationend', finishSearchAnimation);
          card.addEventListener('animationcancel', finishSearchAnimation);
        }
        matchesCount++;
      } else {
        card.classList.remove('search-enter');
        card.classList.add('hidden');
      }
    });

    if (noResults) {
      noResults.classList.toggle('hidden', matchesCount > 0);
    }
  });
}