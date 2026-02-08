/**
 * BRAVATO COFFEE - PAGE ANIMATIONS
 * Subtle fade-in and slide-in animations for non-home pages
 */

document.addEventListener('DOMContentLoaded', () => {
    initPageAnimations();
});

function initPageAnimations() {
    // Create Intersection Observer for fade-in effects
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll(
        '.fade-in-element, .slide-in-left-element, .slide-in-right-element, .card, .product-card, .brew-step'
    );

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Add CSS classes for animated elements
const style = document.createElement('style');
style.textContent = `
  .fade-in-element,
  .slide-in-left-element,
  .slide-in-right-element,
  .card,
  .product-card,
  .brew-step {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .slide-in-left-element {
    transform: translateX(-40px);
  }
  
  .slide-in-right-element {
    transform: translateX(40px);
  }
  
  .fade-in-element.animate,
  .slide-in-left-element.animate,
  .slide-in-right-element.animate,
  .card.animate,
  .product-card.animate,
  .brew-step.animate {
    opacity: 1;
    transform: translate(0, 0);
  }
  
  /* Stagger animation delays */
  .card:nth-child(1) { transition-delay: 0s; }
  .card:nth-child(2) { transition-delay: 0.1s; }
  .card:nth-child(3) { transition-delay: 0.2s; }
  .card:nth-child(4) { transition-delay: 0.3s; }
  
  .product-card:nth-child(1) { transition-delay: 0s; }
  .product-card:nth-child(2) { transition-delay: 0.15s; }
  .product-card:nth-child(3) { transition-delay: 0.3s; }
  
  .brew-step:nth-child(1) { transition-delay: 0s; }
  .brew-step:nth-child(2) { transition-delay: 0.1s; }
  .brew-step:nth-child(3) { transition-delay: 0.2s; }
  .brew-step:nth-child(4) { transition-delay: 0.3s; }
  .brew-step:nth-child(5) { transition-delay: 0.4s; }
`;
document.head.appendChild(style);
