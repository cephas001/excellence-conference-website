import './style.css';
import './firebase.js';
import { db } from './firebase.js';
import { collection, getDocs } from 'firebase/firestore';

// Slideshow functionality
let currentSlide = 0;
const totalSlides = 4;
let slideshowInterval;

const initSlideshow = () => {
    const images = document.querySelectorAll('.slideshow-image');
    const dots = document.querySelectorAll('.dot');
    
    const showSlide = (index) => {
        // Hide all images
        images.forEach((img, i) => {
            img.classList.remove('active');
            if (i === index) {
                img.classList.add('active');
            }
        });
        
        // Update dots
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
                dot.classList.remove('border');
                dot.classList.add('bg-white');
            } else {
                dot.classList.remove('active');
                dot.classList.add('border');
                dot.classList.remove('bg-white');
            }
        });
    };
    
    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    };
    
    // Auto-advance slideshow every 5 seconds
    slideshowInterval = setInterval(nextSlide, 5000);
    
    // Add click handlers to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            // Reset the interval
            clearInterval(slideshowInterval);
            slideshowInterval = setInterval(nextSlide, 5000);
        });
    });
    
    // Show first slide
    showSlide(0);
};

// Fallback data when Firestore is empty or unavailable
const speakersFallback = [
    { name: "Dr. Sarah James", role: "Keynote Speaker", bio: "Renowned theologian and author with over 20 years of ministry experience", topic: "Renewing Hope", image: "/img/speaker1.jpg" },
    { name: "Rev. Michael Chen", role: "Youth Pastor", bio: "Passionate about empowering the next generation in faith and purpose", topic: "Next Gen Faith", image: "/img/speaker2.jpg" },
    { name: "Elena Rodriguez", role: "Worship Leader", bio: "Anointed worship leader bringing hearts into God's presence", topic: "The Heart of Worship", image: "/img/speaker3.jpg" },
    { name: "Ps. David O'Neill", role: "Senior Pastor", bio: "Leading with grace and wisdom for over three decades", topic: "Leading with Grace", image: "/img/speaker4.jpg" },
    { name: "Maria Gonzales", role: "Family Counselor", bio: "Dedicated to building strong, healthy families through biblical principles", topic: "Healthy Families", image: "/img/speaker5.jpg" },
    { name: "Jonathan Wright", role: "Guest Lecturer", bio: "Expert in biblical finance and stewardship principles", topic: "Biblical Finance", image: "/img/speaker6.jpg" }
];

const testimoniesFallback = [
    { name: "Michael Thompson", role: "Business Executive", location: "Lagos, Nigeria", image: "/img/testimonial1.jpg", testimony: "The Excellence Conference was a life-changing experience. The speakers were inspiring, and the chapel setting created such a peaceful atmosphere for reflection and growth.", rating: 5 },
    { name: "Grace Okafor", role: "Entrepreneur", location: "Abuja, Nigeria", image: "/img/testimonial2.jpg", testimony: "I was deeply moved by the worship sessions and the sense of community. The admission process was smooth, and the entire event was well-organized. Can't wait for this year!", rating: 5 },
    { name: "David Johnson", role: "Ministry Leader", location: "Port Harcourt, Nigeria", image: "/img/testimonial3.jpg", testimony: "The conference exceeded my expectations. The chapel provided the perfect sacred space for spiritual growth. The testimonies shared were powerful and encouraging.", rating: 5 },
    { name: "Sarah Williams", role: "Youth Coordinator", location: "Ibadan, Nigeria", image: "/img/testimonial4.jpg", testimony: "An incredible weekend of renewal and connection. The speakers brought fresh perspectives, and I left feeling equipped and inspired for ministry.", rating: 5 },
    { name: "James Okafor", role: "Church Leader", location: "Enugu, Nigeria", image: "/img/testimonial5.jpg", testimony: "The atmosphere in the chapel was truly special. It was more than a conference - it was a divine appointment. Highly recommend to everyone!", rating: 5 },
    { name: "Maryam Ibrahim", role: "Worship Minister", location: "Kaduna, Nigeria", image: "/img/testimonial6.jpg", testimony: "The worship sessions were powerful, and the teaching was profound. This conference has become a highlight of my year. See you next time!", rating: 5 }
];

async function getSpeakers() {
    try {
        const snap = await getDocs(collection(db, 'speakers'));
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        return list.length ? list : speakersFallback;
    } catch {
        return speakersFallback;
    }
}

async function getTestimonies() {
    try {
        const snap = await getDocs(collection(db, 'testimonies'));
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        return list.length ? list : testimoniesFallback;
    } catch {
        return testimoniesFallback;
    }
}

// Render Speakers (accepts data array)
const renderSpeakers = (speakers) => {
    const container = document.getElementById('speakers-grid');
    if (!container) return;
    const data = Array.isArray(speakers) && speakers.length ? speakers : speakersFallback;
    container.innerHTML = data.map((speaker, index) => {
        const delay = (index % 4) * 100;
        return `
        <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up" style="animation-delay: ${delay}ms; opacity: 0;">
            <div class="aspect-square bg-gray-100 overflow-hidden">
                <img src="${speaker.image}" alt="${speaker.name}" class="w-full h-full object-cover transition-transform duration-300 hover:scale-110" loading="lazy">
            </div>
            <div class="p-4">
                <h3 class="text-base font-bold text-gray-900 mb-0.5 leading-tight">${speaker.name}</h3>
                <p class="text-accent-orange font-semibold text-xs mb-2">${speaker.role}</p>
                <p class="text-gray-600 text-xs leading-relaxed mb-3 line-clamp-3">${speaker.bio}</p>
                <div class="pt-3 border-t border-gray-200">
                    <p class="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Speaking on</p>
                    <p class="text-gray-900 font-semibold text-sm">${speaker.topic}</p>
                </div>
            </div>
        </div>
    `;
    }).join('');
};

// Render Testimonies (accepts data array)
const renderTestimonies = (testimonies) => {
    const container = document.getElementById('testimonies-grid');
    if (!container) return;
    const data = Array.isArray(testimonies) && testimonies.length ? testimonies : testimoniesFallback;
    container.innerHTML = data.map((testimony, index) => {
        const delay = (index % 3) * 100;
        return `
        <div class="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up" style="animation-delay: ${delay}ms; opacity: 0;">
            <div class="flex items-start gap-4 mb-4">
                <div class="flex-shrink-0">
                    <div class="w-14 h-14 rounded-full bg-gray-700 overflow-hidden transition-transform duration-300 hover:scale-110">
                        <img src="${testimony.image}" alt="${testimony.name}" class="w-full h-full object-cover" loading="lazy">
                    </div>
                </div>
                <div class="flex-grow min-w-0">
                    <h4 class="text-white font-bold text-base mb-1">${testimony.name}</h4>
                    <p class="text-gray-400 text-xs mb-0.5">${testimony.role}</p>
                    <p class="text-gray-500 text-xs">${testimony.location}</p>
                </div>
                <div class="flex gap-0.5 flex-shrink-0">
                    ${Array(testimony.rating).fill(0).map(() => `
                        <ion-icon name="star" class="text-yellow-400 text-sm"></ion-icon>
                    `).join('')}
                </div>
            </div>
            <p class="text-gray-300 text-sm leading-relaxed italic">"${testimony.testimony}"</p>
        </div>
    `;
    }).join('');
};

// Hide loader and show content when page is fully loaded (logo fade out)
const hideLoader = () => {
    const loader = document.getElementById('loader');
    const app = document.getElementById('app');
    
    if (loader && app) {
        loader.classList.add('loader-exit');
        
        setTimeout(() => {
            loader.style.display = 'none';
            app.classList.remove('hidden');
            app.style.opacity = '0';
            app.style.transition = 'opacity 0.5s ease-in';
            
            app.offsetHeight;
            app.style.opacity = '1';
        }, 650);
    }
};

// Intersection Observer for scroll animations
const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections with scroll animation class
    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });
};

// Countdown to conference start: May 19, 2026 9:00 AM
const CONFERENCE_START = new Date('2026-05-19T09:00:00');
const CONFERENCE_END = new Date('2026-05-24T18:00:00');

function updateCountdown() {
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minsEl = document.getElementById('countdown-mins');
    const secsEl = document.getElementById('countdown-secs');
    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    const now = new Date();

    if (now >= CONFERENCE_END) {
        daysEl.textContent = '0';
        hoursEl.textContent = '0';
        minsEl.textContent = '0';
        secsEl.textContent = '0';
        return;
    }

    const target = now < CONFERENCE_START ? CONFERENCE_START : CONFERENCE_END;
    let diff = target - now;

    if (diff <= 0) {
        diff = 0;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days);
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
}

document.addEventListener('DOMContentLoaded', async () => {
    initSlideshow();
    const speakersEl = document.getElementById('speakers-grid');
    const testimoniesEl = document.getElementById('testimonies-grid');
    if (speakersEl) speakersEl.innerHTML = '<p class="text-gray-400 col-span-full text-center py-8">Loading speakers…</p>';
    if (testimoniesEl) testimoniesEl.innerHTML = '<p class="text-gray-400 col-span-full text-center py-8">Loading testimonies…</p>';
    const [speakers, testimonies] = await Promise.all([getSpeakers(), getTestimonies()]);
    renderSpeakers(speakers);
    renderTestimonies(testimonies);
    initScrollAnimations();
    updateCountdown();
    setInterval(updateCountdown, 1000);

    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
        setTimeout(() => {
            hideLoader();
        }, 2000);
    }
});
