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

function syncProjectFromHash(scroll = false) {
  if (!window.location.hash) {
    return;
  }

  const target = document.querySelector(window.location.hash);

  if (!target) {
    return;
  }

  const panel = target.closest('.project-panel');

  if (!panel) {
    return;
  }

  activateProject(panel.id);

  if (scroll) {
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

window.addEventListener('hashchange', () => {
  syncProjectFromHash(true);
});

syncProjectFromHash();

const galleryImages = document.querySelectorAll('.gallery img');
const imageViewer = document.getElementById('imageViewer');
const imageViewerStage = document.getElementById('imageViewerStage');
const imageViewerImage = document.getElementById('imageViewerImage');
const imageViewerCaption = document.getElementById('imageViewerCaption');
const imageViewerClose = document.getElementById('imageViewerClose');
const imageZoomIn = document.getElementById('imageZoomIn');
const imageZoomOut = document.getElementById('imageZoomOut');
const imageZoomReset = document.getElementById('imageZoomReset');

let activeImageTrigger = null;
let imageViewerScale = 1;
let imageViewerMinScale = 1;
const imageViewerMaxScale = 8;
let imageViewerDragState = null;

galleryImages.forEach((image) => {
  image.tabIndex = 0;
  image.setAttribute('role', 'button');
  image.setAttribute('aria-label', image.alt ? `Open image: ${image.alt}` : 'Open project screenshot');

  image.addEventListener('click', () => {
    openImageViewer(image);
  });

  image.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    openImageViewer(image);
  });
});

function openImageViewer(image) {
  if (!imageViewer || !imageViewerStage || !imageViewerImage) {
    return;
  }

  activeImageTrigger = image;
  imageViewer.hidden = false;
  imageViewer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('viewer-open');

  imageViewerCaption.textContent = image.alt || 'Project screenshot';
  imageViewerImage.alt = image.alt || 'Expanded project screenshot';
  imageViewerImage.src = image.currentSrc || image.src;
  imageViewerImage.draggable = false;
  imageViewerStage.scrollTop = 0;
  imageViewerStage.scrollLeft = 0;

  const onLoad = () => {
    fitImageToViewer();
    updateImageViewerScale(1, { preservePosition: false });
  };

  if (imageViewerImage.complete) {
    onLoad();
  } else {
    imageViewerImage.onload = onLoad;
  }
}

function closeImageViewer() {
  if (!imageViewer || imageViewer.hidden) {
    return;
  }

  imageViewer.hidden = true;
  imageViewer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('viewer-open');
  imageViewerStage.classList.remove('is-zoomed', 'is-dragging');
  imageViewerImage.removeAttribute('src');

  if (activeImageTrigger) {
    activeImageTrigger.focus();
  }
}

function fitImageToViewer() {
  if (!imageViewerImage.naturalWidth || !imageViewerStage) {
    return;
  }

  const maxWidth = Math.max(260, imageViewerStage.clientWidth - 32);
  const maxHeight = Math.max(260, imageViewerStage.clientHeight - 32);
  imageViewerMinScale = Math.min(
    maxWidth / imageViewerImage.naturalWidth,
    maxHeight / imageViewerImage.naturalHeight,
    1
  );
}

function updateImageViewerScale(nextScale, options = {}) {
  if (!imageViewerImage || !imageViewerStage || !imageViewerImage.naturalWidth || !imageViewerImage.naturalHeight) {
    return;
  }

  const clampedScale = Math.min(imageViewerMaxScale, Math.max(imageViewerMinScale, nextScale));
  const previousWidth = imageViewerImage.clientWidth || imageViewerImage.naturalWidth * imageViewerScale;
  const previousHeight = imageViewerImage.clientHeight || imageViewerImage.naturalHeight * imageViewerScale;
  const anchorX = options.anchorX ?? imageViewerStage.clientWidth / 2;
  const anchorY = options.anchorY ?? imageViewerStage.clientHeight / 2;
  const positionRatioX = previousWidth ? (imageViewerStage.scrollLeft + anchorX) / previousWidth : 0.5;
  const positionRatioY = previousHeight ? (imageViewerStage.scrollTop + anchorY) / previousHeight : 0.5;

  imageViewerScale = clampedScale;
  imageViewerImage.style.width = `${imageViewerImage.naturalWidth * imageViewerScale}px`;
  imageViewerImage.style.height = 'auto';

  requestAnimationFrame(() => {
    if (options.preservePosition === false) {
      imageViewerStage.scrollTop = 0;
      imageViewerStage.scrollLeft = Math.max(0, (imageViewerImage.clientWidth - imageViewerStage.clientWidth) / 2);
    } else {
      imageViewerStage.scrollLeft = Math.max(0, positionRatioX * imageViewerImage.clientWidth - anchorX);
      imageViewerStage.scrollTop = Math.max(0, positionRatioY * imageViewerImage.clientHeight - anchorY);
    }

    imageViewerStage.classList.toggle('is-zoomed', imageViewerScale > imageViewerMinScale);
    imageZoomReset.textContent = `${Math.round(imageViewerScale * 100)}%`;
    imageZoomOut.disabled = imageViewerScale <= imageViewerMinScale;
    imageZoomIn.disabled = imageViewerScale >= imageViewerMaxScale;
  });
}

if (imageViewer && imageViewerStage && imageViewerImage) {
  imageViewer.addEventListener('click', (event) => {
    if (event.target === imageViewer) {
      closeImageViewer();
    }
  });

  imageViewerClose.addEventListener('click', closeImageViewer);
  imageZoomIn.addEventListener('click', () => updateImageViewerScale(imageViewerScale + 0.25));
  imageZoomOut.addEventListener('click', () => updateImageViewerScale(imageViewerScale - 0.25));
  imageZoomReset.addEventListener('click', () => updateImageViewerScale(1));

  window.addEventListener('resize', () => {
    if (imageViewer.hidden) {
      return;
    }

    fitImageToViewer();
    updateImageViewerScale(imageViewerScale, { preservePosition: false });
  });

  imageViewerStage.addEventListener('wheel', (event) => {
    if (imageViewer.hidden) {
      return;
    }

    event.preventDefault();
    const direction = event.deltaY < 0 ? 0.2 : -0.2;
    const stageRect = imageViewerStage.getBoundingClientRect();

    updateImageViewerScale(imageViewerScale + direction, {
      anchorX: event.clientX - stageRect.left,
      anchorY: event.clientY - stageRect.top,
    });
  }, { passive: false });

  imageViewerStage.addEventListener('pointerdown', (event) => {
    if (imageViewerScale <= imageViewerMinScale || event.button !== 0) {
      return;
    }

    imageViewerDragState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: imageViewerStage.scrollLeft,
      scrollTop: imageViewerStage.scrollTop,
    };

    imageViewerStage.setPointerCapture(event.pointerId);
    imageViewerStage.classList.add('is-dragging');
  });

  imageViewerStage.addEventListener('pointermove', (event) => {
    if (!imageViewerDragState || event.pointerId !== imageViewerDragState.pointerId) {
      return;
    }

    imageViewerStage.scrollLeft = imageViewerDragState.scrollLeft - (event.clientX - imageViewerDragState.startX);
    imageViewerStage.scrollTop = imageViewerDragState.scrollTop - (event.clientY - imageViewerDragState.startY);
  });

  const endImageViewerDrag = (event) => {
    if (!imageViewerDragState || event.pointerId !== imageViewerDragState.pointerId) {
      return;
    }

    imageViewerStage.classList.remove('is-dragging');
    imageViewerStage.releasePointerCapture(event.pointerId);
    imageViewerDragState = null;
  };

  imageViewerStage.addEventListener('pointerup', endImageViewerDrag);
  imageViewerStage.addEventListener('pointercancel', endImageViewerDrag);
}

document.addEventListener('keydown', (event) => {
  if (imageViewer?.hidden) {
    return;
  }

  if (event.key === 'Escape') {
    closeImageViewer();
    return;
  }

  if (event.key === '+' || event.key === '=') {
    updateImageViewerScale(imageViewerScale + 0.25);
    return;
  }

  if (event.key === '-') {
    updateImageViewerScale(imageViewerScale - 0.25);
    return;
  }

  if (event.key === '0') {
    updateImageViewerScale(1);
  }
});
