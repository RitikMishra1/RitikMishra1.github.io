/* Animations Module */
import { particlesConfig } from './particles-config.js';
import Typed from 'typed.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Initialize Particles
export function initParticles(containerId) {
    if (typeof particlesJS !== 'undefined' && document.getElementById(containerId)) {
        particlesJS(containerId, particlesConfig);
    }
}

// Initialize Typed.js
let typedInstance = null;
export function initTypedAnimation() {
    const typedElement = document.getElementById('typed-roles');
    if (!typedElement) return;

    if (typedInstance) typedInstance.destroy();

    typedInstance = new Typed('#typed-roles', {
        strings: ['AI/ML Engineer', 'GenAI Specialist', 'Full-Stack ML Developer', 'LLM Expert', 'Recommender Systems Architect', 'Production ML Engineer'],
        typeSpeed: 50, backSpeed: 30, backDelay: 2000, loop: true, showCursor: true, cursorChar: '|'
    });
}

// Cleanup Typed instance
export function destroyTypedAnimation() {
    if (typedInstance) typedInstance.destroy();
}

// Trigger GSAP Animations
export function triggerGSAPAnimations() {
    ensureContentVisible();

    // Note: We assume gsap and ScrollTrigger are loaded via CDN or npm imports
    // If using npm, we need to register the plugin
    gsap.registerPlugin(ScrollTrigger);

    // Hero animations
    gsap.fromTo('.hero-content > *',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
    );

    // Impact section
    gsap.fromTo('.big-stat',
        { y: 60, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: '.big-stats', start: 'top 85%', toggleActions: 'play none none none' }
        }
    );

    gsap.fromTo('.impact-card',
        { y: 50, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: '.impact-grid', start: 'top 85%', toggleActions: 'play none none none' }
        }
    );

    // Experience section
    gsap.fromTo('.exp-card',
        { x: 100, opacity: 0 },
        {
            x: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power2.out',
            scrollTrigger: { trigger: '.experience-carousel', start: 'top 85%', toggleActions: 'play none none none' }
        }
    );

    // Projects section
    gsap.fromTo('.project-card',
        { scale: 0.9, opacity: 0 },
        {
            scale: 1, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'back.out(1.2)',
            scrollTrigger: { trigger: '.project-grid', start: 'top 85%', toggleActions: 'play none none none' }
        }
    );

    // Skills section
    gsap.fromTo('.skill-category',
        { y: 40, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 0.6, stagger: 0.2, ease: 'power2.out',
            scrollTrigger: { trigger: '.skills-showcase', start: 'top 85%', toggleActions: 'play none none none' }
        }
    );

    gsap.fromTo('.skill-chip',
        { scale: 0, opacity: 0 },
        {
            scale: 1, opacity: 1, duration: 0.3, stagger: 0.02, ease: 'back.out(2)',
            scrollTrigger: { trigger: '.skills-showcase', start: 'top 80%', toggleActions: 'play none none none' }
        }
    );

    // Testimonials section
    gsap.fromTo('.testimonial-card',
        { y: 50, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out',
            scrollTrigger: { trigger: '.testimonials-row', start: 'top 85%', toggleActions: 'play none none none' }
        }
    );

    // Fun facts section
    gsap.fromTo('.fact-card',
        { y: 30, opacity: 0, rotation: -5 },
        {
            y: 0, opacity: 1, rotation: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: '.fun-facts-row', start: 'top 85%', toggleActions: 'play none none none' }
        }
    );

    setTimeout(() => ScrollTrigger.refresh(), 500);
}

// Fallback to ensure content is visible
function ensureContentVisible() {
    const elements = [
        '.big-stat', '.impact-card', '.exp-card', '.project-card',
        '.skill-category', '.skill-chip', '.testimonial-card', '.fact-card',
        '.hero-content > *'
    ];
    elements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.opacity = '';
            el.style.transform = '';
        });
    });
}

// Animate Counters
export function animateCounters() {
    const bigStatValues = document.querySelectorAll('.big-stat-value');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const countTo = parseFloat(el.dataset.count);
                const prefix = el.textContent.includes('₹') ? '₹' : el.textContent.includes('$') ? '$' : '';
                animateValue(el, 0, countTo, 2000, prefix);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    bigStatValues.forEach(stat => observer.observe(stat));

    document.querySelectorAll('.hero-metrics .metric-value[data-count]').forEach(metric => {
        const countTo = parseFloat(metric.dataset.count);
        const suffix = metric.dataset.suffix || '';
        const prefix = metric.textContent.includes('₹') ? '₹' : '';
        setTimeout(() => animateValue(metric, 0, countTo, 2000, prefix, suffix), 500);
    });
}

function animateValue(element, start, end, duration, prefix = '', suffix = '') {
    const startTime = performance.now();
    const isDecimal = end % 1 !== 0;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * easeProgress;
        element.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}
