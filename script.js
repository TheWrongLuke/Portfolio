const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');
const navLinks = document.querySelectorAll('.site-nav a');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const projectTabs = document.querySelectorAll('.project-tab');
const projectPanels = document.querySelectorAll('.project-panel');

projectTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    activateProject(tab.dataset.project);
  });
});

function activateProject(targetId) {
  projectTabs.forEach((otherTab) => {
    const isTarget = otherTab.dataset.project === targetId;
    otherTab.classList.toggle('active', isTarget);
    otherTab.setAttribute('aria-selected', String(isTarget));
  });

  projectPanels.forEach((panel) => {
    const isTarget = panel.id === targetId;
    panel.classList.toggle('active', isTarget);
    panel.hidden = !isTarget;
  });
}

const projectJumpLinks = document.querySelectorAll('.project-jump');

projectJumpLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.dataset.project;
    const hash = link.getAttribute('href');
    const target = hash ? document.querySelector(hash) : null;

    if (!targetId || !target) {
      return;
    }

    event.preventDefault();
    activateProject(targetId);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', hash);
  });
});
