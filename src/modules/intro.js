/* Netflix Intro */
import { initParticles } from './animations.js';

export function initNetflixIntro(onComplete, onSkip) {
    const netflixIntro = document.getElementById('netflix-intro');
    const profileGate = document.getElementById('profile-gate');

    // Only skip intro if resuming an active session (profile already selected in this tab)
    const savedProfile = sessionStorage.getItem('selectedProfile');
    if (savedProfile) {
        if (netflixIntro) netflixIntro.style.display = 'none';
        if (onSkip) onSkip(savedProfile);
        return;
    }

    // Always show the intro animation for new sessions

    if (netflixIntro) {
        let introSkipped = false;
        let soundPlayed = false;
        const netflixSound = document.getElementById('netflix-sound');
        const skipHint = document.querySelector('.skip-hint');

        let audioContext = null;
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('AudioContext not available');
        }

        const playTaDumSound = async () => {
            if (soundPlayed || !netflixSound) return;
            try {
                if (audioContext && audioContext.state === 'suspended') await audioContext.resume();
                netflixSound.volume = 1.0;
                netflixSound.currentTime = 0;
                await netflixSound.play();
                soundPlayed = true;
                if (skipHint) skipHint.style.opacity = '0';
            } catch (err) {
                console.log('Autoplay blocked');
                soundPlayed = false;
            }
        };

        const skipIntro = (fromClick = false) => {
            if (introSkipped) return;
            introSkipped = true;
            if (fromClick && !soundPlayed) playTaDumSound();
            setTimeout(transitionToProfileGate, soundPlayed || fromClick ? 800 : 0);
        };

        const transitionToProfileGate = () => {
            netflixIntro.classList.add('hidden');
            setTimeout(() => {
                netflixIntro.style.display = 'none';
                if (netflixSound) { netflixSound.pause(); netflixSound.currentTime = 0; }
                // Don't show profile gate here - let startApp handle it with proper event listeners
                if (onComplete) onComplete();
            }, 800);
        };

        setTimeout(() => { if (!introSkipped) playTaDumSound(); }, 100);
        setTimeout(() => { if (!introSkipped && !soundPlayed) playTaDumSound(); }, 2300);
        netflixIntro.addEventListener('click', () => skipIntro(true));
        netflixIntro.style.cursor = 'pointer';

        let mouseMoved = false;
        netflixIntro.addEventListener('mousemove', () => {
            if (!mouseMoved && !soundPlayed && !introSkipped) {
                mouseMoved = true;
                playTaDumSound();
            }
        });

        setTimeout(() => { if (!introSkipped) skipIntro(false); }, 6000);
    }
}
