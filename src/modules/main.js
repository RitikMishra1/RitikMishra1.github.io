/* Main Entry Point */
import { initNetflixIntro } from './intro.js';
import { initPreloader } from './loader.js';
import { initProfileSelection, applyProfileContent, resetProfileSelection } from './profiles.js';
import { initParticles, initTypedAnimation, triggerGSAPAnimations, animateCounters, destroyTypedAnimation } from './animations.js';
import { initNavbar, initCarousels, initNotifications, initSmoothScroll, initVideoControls, initHeroButtons, initBackToTop, initProjectCards, initSkillChips, initNavProfile, setupModal, initImageLoading, initLORCards } from './ui.js';
import { showToast, createConfetti } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    initNetflixIntro(
        // On intro complete - go directly to profile gate (no preloader needed)
        () => startApp(),
        // On intro skip
        (savedProfile) => {
            if (savedProfile) {
                // If saved profile exists, go straight to main app
                startApp(savedProfile);
            } else {
                // No saved profile, show profile gate immediately
                startApp();
            }
        }
    );

    // Konami Code
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') document.getElementById('notif-panel')?.classList.add('hidden');
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        if (konamiCode.join(',') === konamiSequence.join(',')) activatePartyMode();
    });
});

function startApp(savedProfile = null) {
    const profileGate = document.getElementById('profile-gate');
    const mainApp = document.getElementById('main-app');

    if (savedProfile) {
        // Direct load if profile exists - skip to main app
        if (profileGate) {
            profileGate.classList.add('hidden');
            profileGate.style.display = 'none';
        }
        if (mainApp) {
            mainApp.classList.remove('hidden');
            mainApp.style.display = 'block';
            mainApp.style.opacity = '1';
        }
        applyProfileContent(savedProfile);
        initComponents();
    } else {
        // Show Profile Gate immediately with event listeners attached
        if (profileGate) {
            profileGate.classList.remove('hidden');
            profileGate.style.display = 'flex';
            profileGate.style.opacity = '1';
            profileGate.style.visibility = 'visible';
            initParticles('particles-bg');
        }

        // Initialize profile selection with click handlers BEFORE user can interact
        initProfileSelection((selected) => {
            // On Profile Selected - now run the preloader
            profileGate.style.opacity = '0';
            setTimeout(() => {
                profileGate.classList.add('hidden');
                profileGate.style.display = 'none';

                // Run preloader before showing main app
                initPreloader(() => {
                    if (mainApp) {
                        mainApp.classList.remove('hidden');
                        mainApp.style.display = 'block';
                        mainApp.style.opacity = '1';
                    }
                    applyProfileContent(selected);
                    initComponents();
                });
            }, 400);
        });
    }
}

function initComponents() {
    initParticles('hero-particles');
    initTypedAnimation();
    triggerGSAPAnimations();
    animateCounters();

    // UI Components
    initNavbar();
    initCarousels();
    initNotifications();
    initSmoothScroll();
    initVideoControls();
    initHeroButtons();
    initBackToTop();
    initProjectCards();
    setupModal();
    initSkillChips();
    initImageLoading();
    initLORCards();

    // Nav Profile Reset
    initNavProfile(() => {
        destroyTypedAnimation();
        resetProfileSelection();

        const mainApp = document.getElementById('main-app');
        const profileGate = document.getElementById('profile-gate');

        if (mainApp && profileGate) {
            mainApp.style.opacity = '0';
            setTimeout(() => {
                mainApp.classList.add('hidden');
                mainApp.style.opacity = '';

                profileGate.classList.remove('hidden');
                profileGate.style.display = 'flex';
                profileGate.style.opacity = '1';
                profileGate.style.visibility = 'visible';

                initParticles('particles-bg');

                // Re-initialize profile selection for new clicks
                initProfileSelection((selected) => {
                    profileGate.style.opacity = '0';
                    setTimeout(() => {
                        profileGate.classList.add('hidden');
                        profileGate.style.display = 'none';

                        // Run preloader before showing main app
                        initPreloader(() => {
                            mainApp.classList.remove('hidden');
                            mainApp.style.display = 'block';
                            mainApp.style.opacity = '1';

                            applyProfileContent(selected);
                            initTypedAnimation();
                            triggerGSAPAnimations();
                            animateCounters();
                        });
                    }, 400);
                });
            }, 400);
        }
    });

    // Console Easter Egg
    console.log('%c 🎬 RITIKFLIX ', 'background: linear-gradient(135deg, #E50914 0%, #831010 100%); color: white; font-size: 28px; padding: 15px 30px; border-radius: 8px; font-weight: bold;');
    console.log('%c Production-Ready AI/ML Portfolio ', 'color: #46D369; font-size: 16px; font-weight: bold;');
}

function activatePartyMode() {
    showToast('🎉 Party Mode Activated! 🎉');
    document.body.style.animation = 'partyMode 0.5s ease infinite';
    for (let i = 0; i < 150; i++) setTimeout(() => createConfetti(), i * 30);
    setTimeout(() => document.body.style.animation = '', 5000);
}
