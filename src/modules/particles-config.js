/* Particles Configuration */
export const particlesConfig = {
    particles: {
        number: { value: 50, density: { enable: true, value_area: 1000 } },
        color: { value: ["#E50914", "#667eea", "#46D369", "#FFD700"] },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#E50914", opacity: 0.2, width: 1 },
        move: { enable: true, speed: 2, direction: "none", random: true, out_mode: "out" }
    },
    interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" } },
        modes: { grab: { distance: 140, line_linked: { opacity: 0.5 } }, push: { particles_nb: 4 } }
    },
    retina_detect: true
};
