/* UI Components */
import { showToast, triggerConfetti } from './utils.js';

export function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLogo = document.getElementById('nav-logo');

    window.addEventListener('scroll', () => {
        navbar?.classList.toggle('scrolled', window.scrollY > 80);
        updateActiveNav();
    });

    if (navLogo) {
        navLogo.style.cursor = 'pointer';
        navLogo.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function () {
            document.querySelectorAll('.nav-menu a').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function updateActiveNav() {
    let current = 'hero';
    document.querySelectorAll('section[id]').forEach(section => {
        if (window.scrollY >= section.offsetTop - 150) current = section.getAttribute('id');
    });
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}

export function initNavProfile(onReset) {
    document.getElementById('nav-profile')?.addEventListener('click', () => {
        if (onReset) onReset();
    });
}

export function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => btn?.classList.toggle('visible', window.scrollY > 500));
    btn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

export function initCarousels() {
    document.querySelectorAll('.carousel-arrow').forEach(arrow => {
        const newArrow = arrow.cloneNode(true);
        arrow.parentNode.replaceChild(newArrow, arrow);

        newArrow.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const targetId = newArrow.dataset.target;
            const track = document.getElementById(`${targetId}-track`);
            if (!track) return;

            const cards = Array.from(track.children);
            let cardWidth = 380;
            for (const card of cards) {
                if (card.offsetWidth > 0) {
                    const style = window.getComputedStyle(card);
                    cardWidth = card.offsetWidth + parseInt(style.marginRight || 0) + 16;
                    break;
                }
            }

            const totalWidth = cards.length * cardWidth;
            const maxScroll = Math.max(0, totalWidth - track.parentElement.offsetWidth);
            let currentScroll = parseInt(track.dataset.scroll || 0);

            if (newArrow.classList.contains('next')) currentScroll = Math.min(currentScroll + cardWidth, maxScroll);
            else currentScroll = Math.max(currentScroll - cardWidth, 0);

            track.style.transform = `translateX(-${currentScroll}px)`;
            track.dataset.scroll = currentScroll;
            updateCarouselArrows(targetId, currentScroll, maxScroll);
        });
    });

    initCarouselTouch();
    setTimeout(refreshCarousels, 500);
}

function refreshCarousels() {
    document.querySelectorAll('.carousel-track').forEach(track => {
        const target = track.id.replace('-track', '');
        const cards = Array.from(track.children);
        let cardWidth = 380;
        for (const card of cards) {
            if (card.offsetWidth > 0) {
                const style = window.getComputedStyle(card);
                cardWidth = card.offsetWidth + parseInt(style.marginRight || 0) + 16;
                break;
            }
        }
        const maxScroll = Math.max(0, (cards.length * cardWidth) - track.parentElement.offsetWidth);
        updateCarouselArrows(target, parseInt(track.dataset.scroll || 0), maxScroll);
    });
}

function updateCarouselArrows(target, scroll, max) {
    const prev = document.querySelector(`.carousel-arrow.prev[data-target="${target}"]`);
    const next = document.querySelector(`.carousel-arrow.next[data-target="${target}"]`);
    if (prev) { prev.disabled = scroll <= 0; prev.style.opacity = scroll <= 0 ? '0.3' : '1'; }
    if (next) { next.disabled = scroll >= max; next.style.opacity = scroll >= max ? '0.3' : '1'; }
}

function initCarouselTouch() {
    document.querySelectorAll('.carousel-track').forEach(track => {
        let startX = 0, currentX = 0, dragging = false;
        track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; dragging = true; }, { passive: true });
        track.addEventListener('touchmove', e => { if (dragging) currentX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', () => {
            if (!dragging) return;
            dragging = false;
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                const cardWidth = track.children[0]?.offsetWidth + 24 || 350;
                const scroll = parseInt(track.dataset.scroll || 0);
                const max = Math.max(0, track.scrollWidth - track.parentElement.offsetWidth);
                const newScroll = diff > 0 ? Math.min(scroll + cardWidth, max) : Math.max(scroll - cardWidth, 0);
                track.style.transform = `translateX(-${newScroll}px)`;
                track.dataset.scroll = newScroll;
            }
        });
    });
}

export function initNotifications() {
    const btn = document.getElementById('notif-btn');
    const panel = document.getElementById('notif-panel');
    if (btn && panel) {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            panel.classList.toggle('hidden');
            const badge = btn.querySelector('.notif-badge');
            if (badge && !panel.classList.contains('hidden')) setTimeout(() => badge.style.display = 'none', 1000);
        });
        panel.querySelector('.notif-close')?.addEventListener('click', () => panel.classList.add('hidden'));
        document.addEventListener('click', e => {
            if (!panel.contains(e.target) && !btn.contains(e.target)) panel.classList.add('hidden');
        });
    }
}

export function initVideoControls() {
    const muteBtn = document.getElementById('mute-btn');
    const heroVideo = document.getElementById('hero-video');
    let muted = true;

    if (muteBtn && heroVideo) {
        muteBtn.addEventListener('click', () => {
            muted = !muted;
            heroVideo.muted = muted;
            muteBtn.innerHTML = muted ? '<i class="fas fa-volume-xmark"></i>' : '<i class="fas fa-volume-high"></i>';
            muteBtn.classList.toggle('unmuted', !muted);
        });
    }

    document.querySelectorAll('video').forEach(v => {
        v.addEventListener('loadeddata', () => { v.classList.add('loaded'); v.classList.remove('error'); });
        v.addEventListener('error', () => {
            v.classList.add('error'); v.classList.remove('loaded'); v.style.display = 'none';
            const fb = v.nextElementSibling;
            if (fb && fb.classList.contains('fallback')) fb.style.display = 'block';
        });
    });
}

export function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) window.scrollTo({ top: target.offsetTop - 70 - 20, behavior: 'smooth' });
        });
    });
}

export function initHeroButtons() {
    document.getElementById('add-to-list')?.addEventListener('click', function () {
        const icon = this.querySelector('i');
        const isPlus = icon.classList.contains('fa-plus');
        icon.classList.toggle('fa-plus', !isPlus);
        icon.classList.toggle('fa-check', isPlus);
        showToast(isPlus ? 'Added to shortlist! 🎉' : 'Removed from shortlist');
    });

    document.getElementById('thumbs-up')?.addEventListener('click', function () {
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-solid');
        icon.style.color = icon.classList.contains('fa-solid') ? '#46d369' : '';
        if (icon.classList.contains('fa-solid')) { showToast('Thanks for the endorsement! 👍'); triggerConfetti(); }
    });
}


export function initProjectCards() {
    // Netflix Card Hover Logic
    const Cards = document.querySelectorAll('.project-card');

    Cards.forEach(card => {
        let hoverTimeout;

        // Hover Expand Delay
        card.addEventListener('mouseenter', function () {
            hoverTimeout = setTimeout(() => {
                // Play video if exists
                const video = this.querySelector('video');
                if (video) video.play().catch(() => { });

                // Dim others
                this.parentElement.querySelectorAll('.project-card').forEach(s => {
                    if (s !== this) {
                        s.style.opacity = '0.3';
                    }
                });
            }, 400); // 400ms delay before expanding/playing
        });

        card.addEventListener('mouseleave', function () {
            clearTimeout(hoverTimeout);
            const video = this.querySelector('video');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }

            // Reset others
            this.parentElement.querySelectorAll('.project-card').forEach(s => {
                s.style.opacity = '';
            });
        });

        // Play button - opens GitHub
        const playBtn = card.querySelector('.action-btn.play');
        if (playBtn) {
            playBtn.addEventListener('click', function (e) {
                e.stopPropagation(); // Don't open modal
                const githubUrl = card.dataset.github;
                if (githubUrl) {
                    window.open(githubUrl, '_blank');
                }
            });
        }

        // Expand button - opens modal
        const expandBtn = card.querySelector('.expand-btn');
        if (expandBtn) {
            expandBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                openNetflixModal(card);
            });
        }

        // Click on card (not buttons) opens modal
        card.addEventListener('click', function (e) {
            // Only open modal if clicking on card itself, not buttons
            if (!e.target.closest('.action-btn')) {
                openNetflixModal(this);
            }
        });
    });
}

// Project Roadmap Data (Episodes/Seasons)
const projectRoadmaps = {
    'ai-engine': {
        role: 'ML Engineer',
        impact: 'Production Recommender',
        categories: 'Recommender Systems, Enterprise AI, Scale',
        seasons: {
            1: {
                name: 'Foundation', episodes: [
                    { title: 'Requirements & Data Analysis', desc: 'Analyzed user behavior data and defined KPIs for recommendation quality.' },
                    { title: 'Tech Stack Selection', desc: 'Evaluated LightFM vs collaborative filtering. Chose hybrid approach for cold-start handling.' },
                    { title: 'Data Pipeline Setup', desc: 'Built ETL pipelines with Airflow to process user interactions.' }
                ]
            },
            2: {
                name: 'Core Development', episodes: [
                    { title: 'Feature Engineering', desc: 'Created user/item features including behavioral signals and contextual data.' },
                    { title: 'Model Architecture', desc: 'Implemented LightFM with custom loss functions optimized for engagement.' },
                    { title: 'API Development', desc: 'Built Flask REST APIs with Redis caching for low-latency serving.' }
                ]
            },
            3: {
                name: 'Optimization', episodes: [
                    { title: 'A/B Testing Framework', desc: 'Deployed experiment framework to validate engagement improvements.' },
                    { title: 'Model Tuning', desc: 'Hyperparameter optimization using Optuna for best accuracy.' },
                    { title: 'Latency Optimization', desc: 'Reduced inference time through model quantization and caching.' }
                ]
            },
            4: {
                name: 'Scaling', episodes: [
                    { title: 'Kubernetes Deployment', desc: 'Containerized services with auto-scaling for production traffic.' },
                    { title: 'Infrastructure', desc: 'Deployed with load balancing for optimal latency.' },
                    { title: 'Monitoring & Alerts', desc: 'Implemented Prometheus/Grafana dashboards with SLA monitoring.' }
                ]
            },
            5: {
                name: 'Production & Growth', episodes: [
                    { title: 'Documentation', desc: 'Created comprehensive API documentation and integration guides.' },
                    { title: 'Analytics', desc: 'Built dashboards to track recommendation quality metrics.' },
                    { title: 'Continuous Learning', desc: 'Implemented online learning for real-time model updates.' }
                ]
            }
        }
    },
    'rag-system': {
        role: 'ML Engineer',
        impact: 'Enterprise Deployment',
        categories: 'LLMs, RAG, Enterprise Search',
        seasons: {
            1: {
                name: 'Architecture Design', episodes: [
                    { title: 'Requirements Gathering', desc: 'Interviewed stakeholders to understand document types and query patterns.' },
                    { title: 'Vector DB Selection', desc: 'Evaluated Pinecone vs Weaviate vs Chroma for enterprise requirements.' },
                    { title: 'LLM Integration Planning', desc: 'Designed GPT-4 integration with fallback to open-source models.' }
                ]
            },
            2: {
                name: 'Document Processing', episodes: [
                    { title: 'Ingestion Pipeline', desc: 'Built multi-format parser supporting PDF, DOCX, and HTML documents.' },
                    { title: 'Chunking Strategy', desc: 'Implemented semantic chunking with overlap for context preservation.' },
                    { title: 'Embedding Generation', desc: 'Used OpenAI embeddings with caching for cost optimization.' }
                ]
            },
            3: {
                name: 'Query & Retrieval', episodes: [
                    { title: 'Semantic Search', desc: 'Implemented hybrid search combining vector similarity and BM25.' },
                    { title: 'Context Assembly', desc: 'Built smart context window management for optimal LLM prompting.' },
                    { title: 'Response Generation', desc: 'Fine-tuned prompts for accurate, citation-backed responses.' }
                ]
            }
        }
    },
    'virtual-tryon': {
        role: 'AI Software Engineer',
        impact: 'Key Series A Contribution',
        categories: 'GenAI, Computer Vision, E-commerce',
        seasons: {
            1: {
                name: 'Research & Prototyping', episodes: [
                    { title: 'Literature Review', desc: 'Analyzed SOTA in virtual try-on: VITON, ClothFlow, and diffusion approaches.' },
                    { title: 'Dataset Preparation', desc: 'Curated and preprocessed 500K+ apparel images with segmentation masks.' },
                    { title: 'Baseline Implementation', desc: 'Built initial GAN-based pipeline achieving 60% realism score.' }
                ]
            },
            2: {
                name: 'Diffusion Models', episodes: [
                    { title: 'Stable Diffusion Integration', desc: 'Adapted SD for clothing transfer with ControlNet guidance.' },
                    { title: 'Pose Estimation', desc: 'Integrated OpenPose for body landmark detection and warping.' },
                    { title: 'Quality Enhancement', desc: 'Added super-resolution and artifact removal post-processing.' }
                ]
            },
            3: {
                name: 'Optimization', episodes: [
                    { title: 'Inference Speed', desc: 'Reduced generation time from 30s to 3s using TensorRT optimization.' },
                    { title: 'Quality Metrics', desc: 'Achieved 40% improvement in FID score vs baseline.' },
                    { title: 'Edge Case Handling', desc: 'Improved robustness for complex poses and patterns.' }
                ]
            },
            4: {
                name: 'Production', episodes: [
                    { title: 'API Development', desc: 'Built scalable REST API handling 1000+ requests/minute.' },
                    { title: 'A/B Testing', desc: 'Ran experiments showing 25% increase in conversion rate.' },
                    { title: 'Series A Pitch', desc: 'Contributed demos that helped secure Series A funding.' }
                ]
            }
        }
    },
    'audio-sentiment': {
        role: 'ML Engineer',
        impact: '₹2.5M Annual Savings',
        categories: 'NLP, Speech, Cost Optimization',
        seasons: {
            1: {
                name: 'Problem Definition', episodes: [
                    { title: 'Business Analysis', desc: 'Identified ₹2.5M/year GPT-4 API costs for call center analytics.' },
                    { title: 'Data Collection', desc: 'Gathered 50K+ labeled call recordings across 5 languages.' },
                    { title: 'Baseline Metrics', desc: 'Established accuracy benchmarks using existing GPT-4 pipeline.' }
                ]
            },
            2: {
                name: 'Model Development', episodes: [
                    { title: 'Whisper Integration', desc: 'Implemented multilingual transcription with Whisper large-v3.' },
                    { title: 'Sentiment Classifier', desc: 'Trained custom transformer classifier on transcribed text.' },
                    { title: 'Pipeline Integration', desc: 'Built end-to-end pipeline: audio → text → sentiment.' }
                ]
            },
            3: {
                name: 'Deployment', episodes: [
                    { title: 'Cost Analysis', desc: 'Validated 85% cost reduction vs GPT-4 API approach.' },
                    { title: 'Production Rollout', desc: 'Deployed to process 10K calls/day with 99.5% uptime.' },
                    { title: 'Monitoring Setup', desc: 'Built dashboards for accuracy drift and processing metrics.' }
                ]
            }
        }
    },
    'faculty-system': {
        role: 'Full Stack Developer',
        impact: 'Managed 500+ Faculty',
        categories: 'Web Dev, Management, Enterprise',
        seasons: {
            1: {
                name: 'Requirement Gathering', episodes: [
                    { title: 'Workflow Analysis', desc: 'Analyzed existing manual processes involved in faculty recruitment and payroll.' },
                    { title: 'Stakeholder Meetings', desc: 'Conducted workshops with university admin to define user roles and permissions.' },
                    { title: 'Database Schema', desc: 'Designed normalized database schema for faculty profiles, leaves, and salary data.' }
                ]
            },
            2: {
                name: 'Development Phase', episodes: [
                    { title: 'Core Modules', desc: 'Developed authentication, profile management, and leave application modules.' },
                    { title: 'Payroll Integration', desc: 'Implemented automated payroll calculation engine adhering to university norms.' },
                    { title: 'Dashboard UI', desc: 'Built responsive dashboards for faculty and admin using React and Material UI.' }
                ]
            },
            3: {
                name: 'Deployment & Training', episodes: [
                    { title: 'UAT', desc: 'Conducted User Acceptance Testing with a pilot group of 50 faculty members.' },
                    { title: 'Production Rollout', desc: 'Deployed application on university servers using Docker containers.' },
                    { title: 'User Training', desc: 'Conducted training sessions and provided documentation for smooth adoption.' }
                ]
            }
        }
    },
    'mlops': {
        role: 'ML Platform Engineer',
        impact: '99.9% Uptime',
        categories: 'DevOps, ML Ops, Infrastructure',
        seasons: {
            1: {
                name: 'Platform Design', episodes: [
                    { title: 'Requirements', desc: 'Gathered ML team needs for training, deployment, and monitoring.' },
                    { title: 'Tool Evaluation', desc: 'Compared MLflow, Kubeflow, and custom solutions.' },
                    { title: 'Architecture', desc: 'Designed microservices architecture on Kubernetes.' }
                ]
            },
            2: {
                name: 'CI/CD Pipeline', episodes: [
                    { title: 'Training Pipeline', desc: 'Built automated training with TFX and Airflow orchestration.' },
                    { title: 'Testing Framework', desc: 'Implemented model validation gates for accuracy and latency.' },
                    { title: 'Deployment Automation', desc: 'Created GitOps workflow with ArgoCD for model deployment.' }
                ]
            },
            3: {
                name: 'Monitoring', episodes: [
                    { title: 'Model Metrics', desc: 'Built dashboards tracking prediction quality and drift.' },
                    { title: 'Infrastructure Monitoring', desc: 'Set up Prometheus/Grafana for resource utilization.' },
                    { title: 'Alerting', desc: 'Configured alerts for model degradation and infrastructure issues.' }
                ]
            },
            4: {
                name: 'Optimization', episodes: [
                    { title: 'Auto-scaling', desc: 'Implemented HPA for dynamic resource allocation.' },
                    { title: 'Cost Optimization', desc: 'Reduced infrastructure costs 40% through spot instances.' },
                    { title: 'Documentation', desc: 'Created comprehensive platform documentation and training.' }
                ]
            }
        }
    },
    'client-analytics': {
        role: 'Technical Associate',
        impact: 'Data-Driven Decisions',
        categories: 'Analytics, BI, Executive Dashboards',
        seasons: {
            1: {
                name: 'Discovery', episodes: [
                    { title: 'Stakeholder Interviews', desc: 'Gathered requirements from business teams for analytics needs.' },
                    { title: 'Data Audit', desc: 'Inventoried available data sources across enterprise systems.' },
                    { title: 'KPI Definition', desc: 'Defined metrics aligned with business objectives.' }
                ]
            },
            2: {
                name: 'Development', episodes: [
                    { title: 'Data Pipeline', desc: 'Built automated data pipelines for consistent reporting.' },
                    { title: 'ETL Pipelines', desc: 'Created data transformation pipelines for clean analytics.' },
                    { title: 'Dashboard Design', desc: 'Designed interactive dashboards in Power BI.' }
                ]
            },
            3: {
                name: 'Insights', episodes: [
                    { title: 'Predictive Models', desc: 'Built forecasting models for business metrics.' },
                    { title: 'Anomaly Detection', desc: 'Implemented automated alerting for metric anomalies.' },
                    { title: 'Business Impact', desc: 'Delivered actionable insights to stakeholders.' }
                ]
            }
        }
    },
    'cv-detection': {
        role: 'Computer Vision Engineer',
        impact: '10x Faster Diagnostics',
        categories: 'Computer Vision, Manufacturing, Quality',
        seasons: {
            1: {
                name: 'Data & Baseline', episodes: [
                    { title: 'Data Collection', desc: 'Gathered 100K+ labeled images of manufacturing defects.' },
                    { title: 'Annotation Pipeline', desc: 'Built labeling workflow with quality assurance.' },
                    { title: 'Baseline Model', desc: 'Trained initial YOLOv5 achieving 85% mAP.' }
                ]
            },
            2: {
                name: 'Model Optimization', episodes: [
                    { title: 'Architecture Tuning', desc: 'Experimented with YOLOv8, achieving 99.5% detection rate.' },
                    { title: 'TensorRT Conversion', desc: 'Optimized for edge deployment with 5ms inference.' },
                    { title: 'Edge Cases', desc: 'Improved robustness for lighting and angle variations.' }
                ]
            },
            3: {
                name: 'Deployment', episodes: [
                    { title: 'Edge Deployment', desc: 'Deployed on NVIDIA Jetson for real-time inspection.' },
                    { title: 'Integration', desc: 'Connected to manufacturing line PLC systems.' },
                    { title: 'Impact Measurement', desc: 'Validated 10x improvement in inspection throughput.' }
                ]
            }
        }
    }
};

// Track current project's GitHub URL for modal
let currentProjectGithub = '';

// Modal Logic
function openNetflixModal(cardSource) {
    const modal = document.querySelector('.netflix-modal-overlay');
    if (!modal) return;

    // Get data from card attributes
    const projectId = cardSource.dataset.project;
    const title = cardSource.dataset.title || cardSource.querySelector('h4')?.textContent || 'Project Title';
    const description = cardSource.dataset.desc || 'Project Description';
    const match = cardSource.dataset.match || '98';
    const year = cardSource.dataset.year || '2024';
    const seasons = cardSource.dataset.seasons || '3';
    const tags = cardSource.dataset.tags || '';
    const imgSrc = cardSource.dataset.img || cardSource.querySelector('img')?.src;
    currentProjectGithub = cardSource.dataset.github || '';

    // Get roadmap data
    const roadmap = projectRoadmaps[projectId] || {};

    // Update Modal DOM
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-desc').textContent = description;
    document.getElementById('modal-match').textContent = `${match}% Match`;
    document.getElementById('modal-year').textContent = year;
    document.getElementById('modal-seasons').textContent = `${seasons} Seasons`;
    document.getElementById('modal-tags').textContent = tags.split(',').join(', ');
    document.getElementById('modal-role').textContent = roadmap.role || 'Engineer';
    document.getElementById('modal-impact').textContent = roadmap.impact || 'Enterprise Impact';
    document.getElementById('modal-categories').textContent = roadmap.categories || 'AI, ML';

    // Image
    const modalImg = document.getElementById('modal-hero-img');
    if (modalImg) modalImg.src = imgSrc;

    // Season Selector
    const seasonSelect = document.getElementById('season-select');
    if (seasonSelect && roadmap.seasons) {
        seasonSelect.innerHTML = '';
        Object.keys(roadmap.seasons).forEach(num => {
            const opt = document.createElement('option');
            opt.value = num;
            opt.textContent = `Season ${num}: ${roadmap.seasons[num].name}`;
            seasonSelect.appendChild(opt);
        });
        seasonSelect.onchange = () => renderEpisodes(roadmap.seasons[seasonSelect.value]);
        renderEpisodes(roadmap.seasons['1']);
    }

    // Show Modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Smart Stock Image Library
// Smart Stock Image Library
const stockImages = {
    planning: [
        'images/stock/planning_1.jpg', // Whiteboard
        'images/stock/planning_2.jpg', // Agile Team
        'images/stock/business_1.jpg'  // Meeting (reused)
    ],
    coding: [
        'images/stock/coding_1.jpg', // Code Screen
        'images/stock/coding_2.jpg', // Laptop Dark
        'images/stock/coding_3.jpg'  // Python Code
    ],
    data: [
        'images/stock/data_1.jpg', // Server
        'images/stock/data_2.jpg', // Graphs
        'images/stock/data_3.jpg'  // Abstract Data
    ],
    design: [
        'images/stock/design_1.jpg', // UI Design
        'images/stock/design_2.jpg'  // Creative
    ],
    deploy: [
        'images/stock/deploy_1.jpg', // Rocket (launch)
        'images/stock/deploy_2.jpg'  // Rocket (flight)
    ],
    business: [
        'images/stock/business_1.jpg', // Handshake
        'images/stock/business_2.jpg'  // Professional
    ]
};

function getEpisodeImage(title, desc) {
    const text = (title + ' ' + desc).toLowerCase();

    if (text.includes('plan') || text.includes('requirement') || text.includes('analysis') || text.includes('gather')) return stockImages.planning[Math.floor(Math.random() * stockImages.planning.length)];
    if (text.includes('code') || text.includes('develop') || text.includes('build') || text.includes('implement') || text.includes('api')) return stockImages.coding[Math.floor(Math.random() * stockImages.coding.length)];
    if (text.includes('data') || text.includes('train') || text.includes('model') || text.includes('pipeline')) return stockImages.data[Math.floor(Math.random() * stockImages.data.length)];
    if (text.includes('design') || text.includes('ui') || text.includes('ux') || text.includes('architect')) return stockImages.design[Math.floor(Math.random() * stockImages.design.length)];
    if (text.includes('deploy') || text.includes('production') || text.includes('cloud') || text.includes('monitor')) return stockImages.deploy[Math.floor(Math.random() * stockImages.deploy.length)];
    if (text.includes('business') || text.includes('cost') || text.includes('client') || text.includes('team')) return stockImages.business[Math.floor(Math.random() * stockImages.business.length)];

    // Default fallback
    return stockImages.coding[0];
}

function renderEpisodes(seasonData) {
    const container = document.getElementById('episodes-list');
    if (!container || !seasonData) return;

    container.innerHTML = '';
    seasonData.episodes.forEach((ep, i) => {
        const imgSrc = ep.img || getEpisodeImage(ep.title, ep.desc);

        const epDiv = document.createElement('div');
        epDiv.className = 'episode-item';
        epDiv.innerHTML = `
            <span class="episode-number">${i + 1}</span>
            <div class="episode-img" style="position:relative; padding:0; overflow:hidden;">
                <img src="${imgSrc}" alt="${ep.title}" style="width:100%; height:100%; object-fit:cover;">
                <div class="episode-play-overlay" style="position:absolute; inset:0; background:rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center;">
                    <i class="fas fa-play" style="color:white; font-size:1.2rem; opacity:0.8;"></i>
                </div>
            </div>
            <div class="episode-details">
                <h4>${ep.title}</h4>
                <p>${ep.desc}</p>
            </div>
        `;
        container.appendChild(epDiv);
    });
}

export function setupModal() {
    // Initial Setup for Close events
    const modal = document.querySelector('.netflix-modal-overlay');
    if (!modal) return;

    const closeBtn = modal.querySelector('.modal-close-btn');

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        const v = document.getElementById('modal-hero-video');
        if (v) v.pause();
    };

    closeBtn?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    // Modal Play button - opens GitHub
    const modalPlayBtn = modal.querySelector('.modal-btn.play');
    if (modalPlayBtn) {
        modalPlayBtn.addEventListener('click', () => {
            if (currentProjectGithub) {
                window.open(currentProjectGithub, '_blank');
            }
        });
    }
}

export function initSkillChips() {
    document.querySelectorAll('.skill-chip').forEach((chip, i) => {
        chip.style.animationDelay = `${i * 0.03}s`;
        chip.addEventListener('mouseenter', function () { this.style.transform = 'scale(1.1) translateY(-2px)'; });
        chip.addEventListener('mouseleave', function () { this.style.transform = ''; });
    });
}

// Initialize image loading states
export function initImageLoading() {
    // Add 'loaded' class when images finish loading
    document.querySelectorAll('.project-card-media img, .exp-media img').forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => img.classList.add('loaded'));
            img.addEventListener('error', () => {
                img.classList.add('loaded'); // Still remove skeleton on error
            });
        }
    });
}

// Initialize LOR card clicks
export function initLORCards() {
    const lorModal = document.getElementById('lor-modal');
    const lorFullImg = document.getElementById('lor-full-img');
    const lorClose = document.querySelector('.lor-modal-close');

    if (!lorModal || !lorFullImg) return;

    // Click on LOR card to view full
    document.querySelectorAll('.lor-card').forEach(card => {
        card.addEventListener('click', () => {
            const lorSrc = card.dataset.lor;
            if (lorSrc) {
                lorFullImg.src = lorSrc;
                lorModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal
    const closeLorModal = () => {
        lorModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    lorClose?.addEventListener('click', closeLorModal);
    lorModal.addEventListener('click', (e) => {
        if (e.target === lorModal) closeLorModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lorModal.classList.contains('active')) closeLorModal();
    });
}
