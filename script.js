const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');
const navLinks = document.querySelectorAll('.site-nav a');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const projectTabs = document.querySelectorAll('.project-tab');
const projectPanels = document.querySelectorAll('.project-panel');

projectTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetId = tab.dataset.project;

    projectTabs.forEach(otherTab => {
      otherTab.classList.remove('active');
      otherTab.setAttribute('aria-selected', 'false');
    });

    projectPanels.forEach(panel => {
      const isTarget = panel.id === targetId;
      panel.classList.toggle('active', isTarget);
      panel.hidden = !isTarget;
    });

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
  });
});
