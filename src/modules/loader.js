/* Preloader with Real Asset Loading */
export function initPreloader(onComplete) {
    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('.preloader-progress');

    let finished = false;

    const finishLoading = () => {
        if (finished) return;
        finished = true;

        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                if (onComplete) onComplete();
            }, 300);
        } else {
            if (onComplete) onComplete();
        }
    };

    // Show preloader
    if (preloader) {
        preloader.style.display = 'flex';
        preloader.style.opacity = '1';
    }

    // Animate progress bar quickly
    if (progressBar) {
        progressBar.style.transition = 'width 0.8s ease-out';
        progressBar.style.width = '100%';
    }

    // Finish after brief animation (fast preloader)
    setTimeout(finishLoading, 1000);
}
