/**
 * BRAVATO COFFEE - SCROLL-CONTROLLED IMAGE SEQUENCE ANIMATION
 * Cinematic 192-frame scroll animation engine
 */

class ScrollAnimation {
  constructor() {
    this.canvas = document.getElementById('hero-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.scrollContainer = document.querySelector('.hero-scroll-container');

    // Animation configuration
    this.startFrame = 30;  // Start from frame 30
    this.endFrame = 192;   // End at frame 192
    this.frameCount = this.endFrame - this.startFrame + 1; // Total frames: 163
    this.images = [];
    this.currentFrame = 0;
    this.imagesLoaded = 0;

    // Performance optimization
    this.isAnimating = false;
    this.lastScrollY = 0;

    // Initialize
    this.init();
  }

  init() {
    this.setupCanvas();
    this.preloadImages();
    this.setupScrollListener();
    this.updateLoadingProgress();
  }

  setupCanvas() {
    // Set canvas size to match viewport
    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = window.innerWidth * dpr;
      this.canvas.height = window.innerHeight * dpr;
      this.canvas.style.width = `${window.innerWidth}px`;
      this.canvas.style.height = `${window.innerHeight}px`;
      this.ctx.scale(dpr, dpr);

      // Redraw current frame after resize
      if (this.images[this.currentFrame]?.complete) {
        this.drawFrame(this.currentFrame);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
  }

  preloadImages() {
    // Create array of image promises
    const imagePromises = [];

    // Load frames from startFrame (30) to endFrame (192)
    for (let i = this.startFrame; i <= this.endFrame; i++) {
      const img = new Image();
      const frameNumber = String(i).padStart(3, '0');
      img.src = `/assets/ezgif-frame-${frameNumber}.jpg`;

      // Track loading progress
      const promise = new Promise((resolve, reject) => {
        img.onload = () => {
          this.imagesLoaded++;
          this.updateLoadingProgress();
          resolve();
        };
        img.onerror = () => {
          console.error(`Failed to load frame ${frameNumber}`);
          reject();
        };
      });

      this.images.push(img);
      imagePromises.push(promise);
    }

    // Wait for all images to load
    Promise.all(imagePromises).then(() => {
      this.onImagesLoaded();
    }).catch((error) => {
      console.error('Error loading images:', error);
    });
  }

  updateLoadingProgress() {
    const progress = (this.imagesLoaded / this.frameCount) * 100;
    const progressBar = document.querySelector('.loading-progress');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  }

  onImagesLoaded() {
    console.log('All frames loaded successfully');

    // Hide loading indicator
    const loadingElement = document.querySelector('.hero-loading');
    if (loadingElement) {
      loadingElement.classList.add('hidden');
      setTimeout(() => {
        loadingElement.style.display = 'none';
      }, 500);
    }

    // Draw first frame
    this.drawFrame(0);

    // Show scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.style.opacity = '0.7';
    }
  }

  setupScrollListener() {
    let ticking = false;

    const handleScroll = () => {
      this.lastScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.updateFrame();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  updateFrame() {
    if (!this.scrollContainer) return;

    // Get scroll progress within the hero container
    const containerTop = this.scrollContainer.offsetTop;
    const containerHeight = this.scrollContainer.offsetHeight;
    const scrollPosition = this.lastScrollY - containerTop;

    // Calculate progress (0 to 1)
    const progress = Math.max(0, Math.min(1, scrollPosition / containerHeight));

    // Map progress to frame index (0 to 191)
    const frameIndex = Math.floor(progress * (this.frameCount - 1));

    // Only update if frame changed
    if (frameIndex !== this.currentFrame) {
      this.currentFrame = frameIndex;
      this.drawFrame(frameIndex);

      // Update scroll progress indicator
      this.updateScrollProgress(progress);
    }

    // Hide scroll indicator after scrolling starts
    if (progress > 0.05) {
      const scrollIndicator = document.querySelector('.scroll-indicator');
      if (scrollIndicator) {
        scrollIndicator.style.opacity = '0';
      }
    }
  }

  drawFrame(frameIndex) {
    const img = this.images[frameIndex];

    if (!img || !img.complete) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Calculate dimensions to fit image in viewport while maintaining aspect ratio
    const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1);
    const canvasHeight = this.canvas.height / (window.devicePixelRatio || 1);

    const imgAspect = img.width / img.height;
    const canvasAspect = canvasWidth / canvasHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgAspect > canvasAspect) {
      // Image is wider - fit to height
      drawHeight = canvasHeight;
      drawWidth = drawHeight * imgAspect;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = 0;
    } else {
      // Image is taller - fit to width
      drawWidth = canvasWidth;
      drawHeight = drawWidth / imgAspect;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    }

    // Draw image centered and scaled
    this.ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  updateScrollProgress(progress) {
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
      progressBar.style.width = `${progress * 100}%`;

      if (progress > 0 && progress < 1) {
        progressBar.classList.add('visible');
      } else {
        progressBar.classList.remove('visible');
      }
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on home page
  if (document.getElementById('hero-canvas')) {
    new ScrollAnimation();
  }
});
