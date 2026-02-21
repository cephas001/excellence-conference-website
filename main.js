import './style.css';
import { db } from './firebase.js';
import { collection, getDocs } from 'firebase/firestore';

// Session length in minutes for "Live" status
const SESSION_LENGTH_MINUTES = 30;

/**
 * Parse date string (YYYY-MM-DD) and time string (e.g. "10:00 AM") into a Date.
 */
function parseDateTime(dateStr, timeStr) {
    const [datePart] = dateStr.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!timeMatch) return new Date(year, month - 1, day);
    let [, h, m, ampm] = timeMatch;
    h = parseInt(h, 10);
    m = parseInt(m, 10);
    if (ampm.toUpperCase() === 'PM' && h !== 12) h += 12;
    if (ampm.toUpperCase() === 'AM' && h === 12) h = 0;
    return new Date(year, month - 1, day, h, m, 0, 0);
}

/**
 * Get dynamic status: "Completed" | "Live" | "Upcoming" based on current time.
 */
function getStatusForItem(dateStr, timeStr) {
    const start = parseDateTime(dateStr, timeStr);
    const end = new Date(start.getTime() + SESSION_LENGTH_MINUTES * 60 * 1000);
    const now = new Date();
    if (now < start) return 'Upcoming';
    if (now >= start && now <= end) return 'Live';
    return 'Completed';
}

// Agenda grouped by day – Conference May 19–24, 2026 (date in YYYY-MM-DD for status logic)
const agendaByDay = [
    {
        day: 1,
        date: '2026-05-19',
        label: 'Day 1 – Tuesday, 19 May 2026',
        items: [
            { time: '9:00 AM', title: 'Opening Greetings', description: 'National Anthem,<br>State Anthem<br>Welcome Address', type: 'simple' },
            { time: '9:30 AM', title: 'Opening Address', description: 'Building a Digital Economy for Sustainable Growth in Ogun State', type: 'simple' },
            { time: '10:00 AM', tag: 'Keynote', title: 'Entrepreneurs Playbook – The Reality of Building for the African Market', speaker: { name: 'Seye Bandele', role: 'Founder • PaidHR', image: 'https://ui-avatars.com/api/?name=Seye+Bandele&background=random' }, type: 'detailed' },
            { time: '10:45 AM', tag: 'Panel', title: 'Unlocking Opportunities in the Creative Economy', speaker: { name: 'Ayo Adeagbo', role: 'SA to the President • Art, Culture and Creative Economy', image: 'https://ui-avatars.com/api/?name=Ayo+Adeagbo&background=random' }, type: 'detailed' },
        ],
    },
    {
        day: 2,
        date: '2026-05-20',
        label: 'Day 2 – Wednesday, 20 May 2026',
        items: [
            { time: '9:00 AM', title: 'Morning Devotion', description: 'Worship and prayer', type: 'simple' },
            { time: '9:45 AM', tag: 'Keynote', title: 'Leading with Grace', speaker: { name: 'Ps. David O\'Neill', role: 'Senior Pastor • Grace Community Church', image: 'https://ui-avatars.com/api/?name=David+ONeill&background=random' }, type: 'detailed' },
            { time: '10:30 AM', title: 'Breakout Sessions', description: 'Theme-based small group discussions', type: 'simple' },
            { time: '12:00 PM', title: 'Lunch &amp; Networking', description: 'Catered lunch in the main hall', type: 'simple' },
        ],
    },
    {
        day: 3,
        date: '2026-05-21',
        label: 'Day 3 – Thursday, 21 May 2026',
        items: [
            { time: '9:00 AM', title: 'Worship &amp; Praise', description: 'Corporate worship session', type: 'simple' },
            { time: '9:45 AM', tag: 'Workshop', title: 'The Heart of Worship', speaker: { name: 'Elena Rodriguez', role: 'Worship Leader', image: 'https://ui-avatars.com/api/?name=Elena+Rodriguez&background=random' }, type: 'detailed' },
            { time: '11:00 AM', title: 'Q&amp;A Session', description: 'Open discussion with speakers', type: 'simple' },
        ],
    },
    {
        day: 4,
        date: '2026-05-22',
        label: 'Day 4 – Friday, 22 May 2026',
        items: [
            { time: '9:00 AM', title: 'Morning Session', description: 'Teaching and reflection', type: 'simple' },
            { time: '10:30 AM', tag: 'Panel', title: 'Biblical Finance', speaker: { name: 'Jonathan Wright', role: 'Guest Lecturer', image: 'https://ui-avatars.com/api/?name=Jonathan+Wright&background=random' }, type: 'detailed' },
            { time: '12:00 PM', title: 'Lunch Break', description: 'Fellowship in the main hall', type: 'simple' },
        ],
    },
    {
        day: 5,
        date: '2026-05-23',
        label: 'Day 5 – Saturday, 23 May 2026',
        items: [
            { time: '9:00 AM', title: 'Family &amp; Youth Focus', description: 'Sessions for all ages', type: 'simple' },
            { time: '10:00 AM', tag: 'Workshop', title: 'Healthy Families', speaker: { name: 'Maria Gonzales', role: 'Family Counselor', image: 'https://ui-avatars.com/api/?name=Maria+Gonzales&background=random' }, type: 'detailed' },
            { time: '11:30 AM', title: 'Next Gen Faith', description: 'Youth ministry session', type: 'simple' },
        ],
    },
    {
        day: 6,
        date: '2026-05-24',
        label: 'Day 6 – Sunday, 24 May 2026',
        items: [
            { time: '9:00 AM', title: 'Closing Worship', description: 'Corporate praise and thanksgiving', type: 'simple' },
            { time: '10:00 AM', title: 'Closing Remarks', description: 'Thanksgiving and benediction', type: 'simple' },
            { time: '11:00 AM', title: 'Farewell &amp; Commissioning', description: 'Send-off and prayer', type: 'simple' },
        ],
    },
];

// Map of speaker name -> full speaker (from Firestore) for popup details
let speakersMap = {};

function escapeAttr(s) {
    if (s == null) return '';
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function showSpeakerModal(payload) {
    const modal = document.getElementById('speaker-modal');
    const content = document.getElementById('speaker-modal-content');
    if (!modal || !content) return;
    const full = speakersMap[payload.name] || {};
    const bio = full.bio || '';
    const topic = full.topic || payload.sessionTitle || '';
    content.innerHTML = `
        <div class="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-gray-700 flex-shrink-0">
            <img src="${payload.image || ''}" alt="${escapeAttr(payload.name)}" class="w-full h-full object-cover" onerror="this.style.display='none'">
        </div>
        <h3 class="text-xl font-bold text-white mb-1">${escapeAttr(payload.name)}</h3>
        <p class="text-accent-orange text-sm font-semibold mb-3">${escapeAttr(payload.role)}</p>
        ${bio ? `<p class="text-gray-300 text-sm leading-relaxed text-left mb-3">${escapeAttr(bio)}</p>` : ''}
        ${topic ? `<div class="pt-3 border-t border-gray-700 text-left"><p class="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Speaking on</p><p class="text-white font-semibold text-sm">${escapeAttr(topic)}</p></div>` : ''}
    `;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    modal.setAttribute('aria-hidden', 'false');
}

function closeSpeakerModal() {
    const modal = document.getElementById('speaker-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    modal.setAttribute('aria-hidden', 'true');
}

function renderAgendaItem(item, dateStr, index) {
    const status = getStatusForItem(dateStr, item.time);
    const isDetailed = item.type === 'detailed';
    const delay = (index % 4) * 100;
    const statusClass =
        status === 'Live'
            ? 'bg-accent-orange/80 text-white border-accent-orange'
            : status === 'Completed'
              ? 'bg-gray-800 text-gray-400 border-gray-700'
              : 'bg-gray-700 text-gray-300 border-gray-600';

    return `
      <div class="relative flex gap-6 animate-fade-in-up" style="animation-delay: ${delay}ms; opacity: 0;">
        <div class="flex-shrink-0 z-10">
            <div class="bg-gray-800 border border-gray-700 rounded-full px-3 py-1 text-xs font-medium text-gray-300 w-[85px] text-center transition-all duration-300 hover:scale-105">
                ${item.time}
            </div>
        </div>
        <div class="flex-grow pb-8">
            <div class="flex items-center justify-between mb-2">
                <span class="${statusClass} text-[10px] font-medium px-3 py-1 rounded-full border transition-all duration-300 hover:scale-105">
                    ${status}
                </span>
                ${item.tag ? `<span class="bg-gray-800 text-gray-400 text-[10px] font-medium px-3 py-1 rounded-full border border-gray-700">${item.tag}</span>` : ''}
            </div>
            <h3 class="text-base font-bold text-white mb-1 leading-tight transition-colors duration-300 hover:text-accent-orange">
                ${item.title}
            </h3>
            ${!isDetailed ? `<p class="text-xs text-gray-400 leading-relaxed">${item.description}</p>` : ''}
            ${isDetailed && item.speaker ? `
                <button type="button" class="speaker-card mt-3 w-full border border-gray-700 rounded-2xl p-3 flex items-center gap-3 shadow-sm bg-gray-800 transition-all duration-300 hover:border-gray-600 hover:shadow-md hover:-translate-y-1 text-left cursor-pointer"
                    data-speaker-name="${escapeAttr(item.speaker.name)}"
                    data-speaker-role="${escapeAttr(item.speaker.role)}"
                    data-speaker-image="${escapeAttr(item.speaker.image)}"
                    data-session-title="${escapeAttr(item.title)}">
                    <img src="${item.speaker.image}" alt="${item.speaker.name}" class="w-10 h-10 rounded-full object-cover bg-gray-700 flex-shrink-0" loading="lazy">
                    <div class="min-w-0">
                        <p class="text-sm font-bold text-white">${item.speaker.name}</p>
                        <p class="text-[10px] text-gray-400">${item.speaker.role}</p>
                    </div>
                    <ion-icon name="chevron-forward" class="text-gray-500 ml-auto flex-shrink-0"></ion-icon>
                </button>
            ` : ''}
        </div>
      </div>
    `;
}

function renderAgenda() {
    const container = document.getElementById('agenda-list');
    if (!container) return;

    container.innerHTML = agendaByDay
        .map(
            (day, dayIndex) => `
      <div class="agenda-day border-b border-gray-800 last:border-b-0">
        <button type="button" class="agenda-day-trigger w-full flex items-center justify-between px-4 py-4 text-left bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors" data-day="${day.day}" aria-expanded="${dayIndex === 0}">
          <span class="font-semibold text-white">${day.label}</span>
          <ion-icon name="chevron-down" class="agenda-day-icon text-2xl text-gray-400 transition-transform duration-200"></ion-icon>
        </button>
        <div class="agenda-day-content overflow-hidden transition-all duration-300 relative pl-0" data-day="${day.day}" style="max-height: ${dayIndex === 0 ? 'none' : '0'};">
          <div class="absolute left-[5.5rem] top-4 bottom-0 w-px bg-gray-700"></div>
          <div class="pt-4 pb-6 space-y-8">
            ${day.items.map((item, i) => renderAgendaItem(item, day.date, i)).join('')}
          </div>
        </div>
      </div>
    `
        )
        .join('');

    // Toggle accordion
    container.querySelectorAll('.agenda-day-trigger').forEach((btn) => {
        btn.addEventListener('click', () => {
            const day = btn.getAttribute('data-day');
            const content = container.querySelector(`.agenda-day-content[data-day="${day}"]`);
            const icon = btn.querySelector('.agenda-day-icon');
            const isOpen = content.style.maxHeight !== '0px' && content.style.maxHeight !== '0';

            if (isOpen) {
                content.style.maxHeight = '0';
                icon.style.transform = 'rotate(0deg)';
                btn.setAttribute('aria-expanded', 'false');
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    const firstIcon = container.querySelector('.agenda-day-trigger[data-day="1"] .agenda-day-icon');
    if (firstIcon) firstIcon.style.transform = 'rotate(180deg)';

    // Speaker card click -> open modal
    container.addEventListener('click', (e) => {
        const card = e.target.closest('.speaker-card');
        if (!card) return;
        e.preventDefault();
        showSpeakerModal({
            name: card.getAttribute('data-speaker-name') || '',
            role: card.getAttribute('data-speaker-role') || '',
            image: card.getAttribute('data-speaker-image') || '',
            sessionTitle: card.getAttribute('data-session-title') || '',
        });
    });

    const closeBtn = document.getElementById('speaker-modal-close');
    const modalEl = document.getElementById('speaker-modal');
    if (closeBtn) closeBtn.addEventListener('click', closeSpeakerModal);
    if (modalEl) modalEl.addEventListener('click', (e) => { if (e.target === modalEl) closeSpeakerModal(); });
}

async function initAgenda() {
    try {
        const snap = await getDocs(collection(db, 'speakers'));
        snap.docs.forEach((d) => {
            const data = d.data();
            if (data.name) speakersMap[data.name] = { ...data, id: d.id };
        });
    } catch (_) {}
    renderAgenda();
}

document.addEventListener('DOMContentLoaded', initAgenda);
