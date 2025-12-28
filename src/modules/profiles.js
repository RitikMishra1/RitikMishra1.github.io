/* Profiles Module */
import { profileContent } from './profile-data.js';

let profileSelectionInProgress = false;

export function initProfileSelection(onSelect) {
    const profileCards = document.querySelectorAll('.profile-card');

    profileCards.forEach(card => {
        // Remove any existing listeners by cloning
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);

        newCard.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Prevent multiple clicks
            if (profileSelectionInProgress) return;
            profileSelectionInProgress = true;

            const selectedProfile = newCard.dataset.profile;

            // Visual feedback
            newCard.classList.add('selected');
            newCard.style.transform = 'scale(1.1)';
            newCard.style.pointerEvents = 'none';

            // Disable other cards
            document.querySelectorAll('.profile-card').forEach(c => {
                if (c !== newCard) {
                    c.style.opacity = '0.5';
                    c.style.pointerEvents = 'none';
                }
            });

            sessionStorage.setItem('selectedProfile', selectedProfile);

            // Small delay for visual feedback before transition
            setTimeout(() => {
                if (onSelect) onSelect(selectedProfile);
            }, 200);
        }, { once: true });

        newCard.addEventListener('mouseenter', () => {
            if (profileSelectionInProgress) return;
            const glow = newCard.querySelector('.profile-glow');
            if (glow) { glow.style.opacity = '1'; glow.style.transform = 'scale(1.2)'; }
        });

        newCard.addEventListener('mouseleave', () => {
            const glow = newCard.querySelector('.profile-glow');
            if (glow) { glow.style.opacity = '0.5'; glow.style.transform = 'scale(1)'; }
        });
    });
}

export function applyProfileContent(profileType) {
    const config = profileContent[profileType];
    if (!config) return;

    const heroDesc = document.getElementById('hero-desc');
    if (heroDesc) { heroDesc.innerHTML = config.description; heroDesc.classList.add('fade-in'); }

    ['impact', 'experience', 'projects', 'skills', 'about', 'contact'].forEach(id => {
        const section = document.getElementById(id);
        if (section) section.style.display = config.hideSections.includes(id) ? 'none' : '';
    });

    const funFacts = document.getElementById('fun-facts');
    if (funFacts) funFacts.style.display = config.showFunFacts ? '' : 'none';

    document.body.className = `profile-${profileType}`;
    updateNotificationBadge(profileType);
}

function updateNotificationBadge(profileType) {
    const badge = document.querySelector('.notif-badge');
    const counts = { recruiter: 7, stalker: 10, techbro: 5, investor: 8 };
    if (badge) badge.textContent = counts[profileType] || 7;
}

export function resetProfileSelection() {
    profileSelectionInProgress = false;
    sessionStorage.removeItem('selectedProfile');
    document.body.className = '';
    document.querySelectorAll('.profile-card').forEach(card => {
        card.classList.remove('selected');
        card.style.transform = '';
        card.style.opacity = '';
        card.style.pointerEvents = '';
    });
}
