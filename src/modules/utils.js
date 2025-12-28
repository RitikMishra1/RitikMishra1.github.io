/* Utilities */
export function showToast(msg) {
    document.querySelector('.toast-notification')?.remove();
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = msg;
    toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.95);color:#fff;padding:14px 28px;border-radius:8px;font-size:14px;z-index:10000;animation:toastIn .3s ease,toastOut .3s ease 2.5s forwards;border:1px solid rgba(229,9,20,.3);box-shadow:0 10px 40px rgba(0,0,0,.5)';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

export function triggerConfetti() { for (let i = 0; i < 50; i++) createConfetti(); }

export function createConfetti() {
    const c = document.createElement('div');
    const colors = ['#E50914', '#FFD700', '#46D369', '#667eea', '#ff6b6b', '#4ecdc4'];
    c.style.cssText = `position:fixed;width:${5+Math.random()*10}px;height:${5+Math.random()*10}px;background:${colors[Math.floor(Math.random()*colors.length)]};top:-20px;left:${Math.random()*100}vw;z-index:10000;border-radius:${Math.random()>.5?'50%':'0'};pointer-events:none;animation:confettiFall ${2+Math.random()*3}s linear forwards`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 5000);
}

// Add dynamic styles for utilities
const style = document.createElement('style');
style.textContent = `
@keyframes confettiFall { to { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
@keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
@keyframes toastOut { from { opacity: 1; transform: translateX(-50%) translateY(0); } to { opacity: 0; transform: translateX(-50%) translateY(-20px); } }
`;
document.head.appendChild(style);
