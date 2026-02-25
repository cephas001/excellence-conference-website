import { db } from './firebase.js';
import { doc, getDoc, getDocs, collection, query, orderBy } from 'firebase/firestore';

const EVENT_SETTINGS = 'eventSettings';
const ANNOUNCEMENT_ID = 'current';
const VENUE_ID = 'venue';
const DINNER_ID = 'dinner';
const CONTACT_ID = 'contact';

function escapeHtml(s) {
  if (s == null) return '';
  const div = document.createElement('div');
  div.textContent = String(s);
  return div.innerHTML;
}

/** Show/hide announcement banner; offset header when visible. */
export async function initAnnouncement() {
  const banner = document.getElementById('announcement-banner');
  const textEl = document.getElementById('announcement-text');
  const header = document.getElementById('main-header');
  if (!banner || !textEl || !header) return;
  try {
    const snap = await getDoc(doc(db, EVENT_SETTINGS, ANNOUNCEMENT_ID));
    if (!snap.exists()) {
      banner.classList.add('hidden');
      header.style.top = '';
      document.getElementById('app')?.classList.remove('has-announcement');
      return;
    }
    const d = snap.data();
    const message = (d.message || '').trim();
    const endTime = d.endTime;
    if (!message) {
      banner.classList.add('hidden');
      header.style.top = '';
      document.getElementById('app')?.classList.remove('has-announcement');
      return;
    }
    const now = new Date();
    const end = endTime && endTime.toDate ? endTime.toDate() : null;
    if (end && now >= end) {
      banner.classList.add('hidden');
      header.style.top = '';
      document.getElementById('app')?.classList.remove('has-announcement');
      return;
    }
    textEl.innerHTML = escapeHtml(message) + ' &nbsp; — &nbsp; ' + escapeHtml(message);
    banner.classList.remove('hidden');
    header.style.top = '1.75rem';
    const app = document.getElementById('app');
    if (app) app.classList.add('has-announcement');
  } catch (e) {
    banner.classList.add('hidden');
    header.style.top = '';
    document.getElementById('app')?.classList.remove('has-announcement');
  }
}

export async function loadVenue() {
  const section = document.getElementById('venue-section');
  const content = document.getElementById('venue-content');
  if (!section || !content) return;
  try {
    const snap = await getDoc(doc(db, EVENT_SETTINGS, VENUE_ID));
    if (!snap.exists()) {
      section.classList.add('hidden');
      return;
    }
    const d = snap.data();
    const name = (d.venueName || '').trim();
    const address = (d.address || '').trim();
    const mapLink = (d.mapLink || '').trim();
    if (!name && !address) {
      section.classList.add('hidden');
      return;
    }
    let html = '';
    if (name) html += `<p class="text-xl font-semibold text-white mb-2">${escapeHtml(name)}</p>`;
    if (address) html += `<p class="text-gray-300 mb-3">${escapeHtml(address)}</p>`;
    if (mapLink) html += `<a href="${escapeHtml(mapLink)}" target="_blank" rel="noopener noreferrer" class="inline-block border-2 border-accent-orange text-white hover:bg-accent-orange px-4 py-2 rounded-lg text-sm font-semibold transition-colors">Get directions</a>`;
    content.innerHTML = html;
    section.classList.remove('hidden');
  } catch (e) {
    section.classList.add('hidden');
  }
}

export async function loadFAQ() {
  const section = document.getElementById('faq-section');
  const list = document.getElementById('faq-list');
  if (!section || !list) return;
  try {
    const q = query(collection(db, 'faq'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((x) => (x.question || '').trim());
    if (items.length === 0) {
      section.classList.add('hidden');
      return;
    }
    list.innerHTML = items
      .map(
        (item) => `
      <details class="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden group">
        <summary class="px-4 py-3 text-white font-medium cursor-pointer list-none flex items-center justify-between gap-2">
          <span>${escapeHtml(item.question)}</span>
          <ion-icon name="chevron-down" class="text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0"></ion-icon>
        </summary>
        <div class="px-4 pb-3 pt-0 text-gray-300 text-sm border-t border-gray-700">${escapeHtml(item.answer || '')}</div>
      </details>
    `
      )
      .join('');
    section.classList.remove('hidden');
  } catch (e) {
    section.classList.add('hidden');
  }
}

export async function initDinner() {
  const loading = document.getElementById('dinner-loading');
  const content = document.getElementById('dinner-content');
  const intro = document.getElementById('dinner-intro');
  const details = document.getElementById('dinner-details');
  const errBlock = document.getElementById('dinner-error');
  const retryBtn = document.getElementById('dinner-retry-btn');
  if (!loading || !content) return;
  const showLoading = () => {
    loading.classList.remove('hidden');
    content.classList.add('hidden');
    if (errBlock) errBlock.classList.add('hidden');
  };
  const showContent = () => {
    loading.classList.add('hidden');
    content.classList.remove('hidden');
    if (errBlock) errBlock.classList.add('hidden');
  };
  const showError = () => {
    loading.classList.add('hidden');
    content.classList.add('hidden');
    if (errBlock) errBlock.classList.remove('hidden');
  };
  const run = async () => {
    showLoading();
    try {
      const snap = await getDoc(doc(db, EVENT_SETTINGS, DINNER_ID));
      intro.textContent = 'Join us for an evening of fellowship and celebration during Excellence Conference 2026. The conference dinner is a highlight for connection and reflection.';
      if (!snap.exists()) {
        details.innerHTML = '<h2 class="text-lg font-bold text-white">Details</h2><p class="text-gray-400 text-sm">Venue, date, and time will be announced closer to the event. Check back or contact the organisers for the latest information.</p>';
        showContent();
        return;
      }
      const d = snap.data();
      if ((d.description || '').trim()) intro.textContent = d.description.trim();
      const venueName = (d.venueName || '').trim();
      const venueAddress = (d.venueAddress || '').trim();
      const date = (d.date || '').trim();
      const time = (d.time || '').trim();
      const mapLink = (d.mapLink || '').trim();
      let detailsHtml = '<h2 class="text-lg font-bold text-white">Details</h2>';
      if (venueName) detailsHtml += `<p class="text-white font-medium">${escapeHtml(venueName)}</p>`;
      if (venueAddress) detailsHtml += `<p class="text-gray-300 text-sm">${escapeHtml(venueAddress)}</p>`;
      if (date) detailsHtml += `<p class="text-gray-300 text-sm"><span class="text-gray-400">Date:</span> ${escapeHtml(date)}</p>`;
      if (time) detailsHtml += `<p class="text-gray-300 text-sm"><span class="text-gray-400">Time:</span> ${escapeHtml(time)}</p>`;
      if (mapLink) detailsHtml += `<a href="${escapeHtml(mapLink)}" target="_blank" rel="noopener noreferrer" class="inline-block mt-2 border-2 border-accent-orange text-white hover:bg-accent-orange px-4 py-2 rounded-lg text-sm font-semibold transition-colors">Get directions</a>`;
      details.innerHTML = detailsHtml;
      showContent();
    } catch (e) {
      showError();
    }
  };
  if (retryBtn) retryBtn.addEventListener('click', run);
  await run();
}

export async function initContact() {
  const loading = document.getElementById('contact-loading');
  const content = document.getElementById('contact-content');
  const details = document.getElementById('contact-details');
  const errBlock = document.getElementById('contact-error');
  const retryBtn = document.getElementById('contact-retry-btn');
  if (!loading || !content) return;
  const showLoading = () => {
    loading.classList.remove('hidden');
    content.classList.add('hidden');
    if (errBlock) errBlock.classList.add('hidden');
  };
  const showContent = () => {
    loading.classList.add('hidden');
    content.classList.remove('hidden');
    if (errBlock) errBlock.classList.add('hidden');
  };
  const showError = () => {
    loading.classList.add('hidden');
    content.classList.add('hidden');
    if (errBlock) errBlock.classList.remove('hidden');
  };
  const run = async () => {
    showLoading();
    try {
      const snap = await getDoc(doc(db, EVENT_SETTINGS, CONTACT_ID));
      if (!snap.exists()) {
        details.innerHTML = '<p class="text-gray-400 text-sm">Contact details will be added soon.</p>';
        showContent();
        return;
      }
      const d = snap.data();
      const email = (d.email || '').trim();
      const phone = (d.phone || '').trim();
      let html = '';
      if (email) html += `<p class="text-gray-300"><span class="text-gray-500">Email:</span> <a href="mailto:${escapeHtml(email)}" class="text-accent-orange hover:underline">${escapeHtml(email)}</a></p>`;
      if (phone) html += `<p class="text-gray-300"><span class="text-gray-500">Phone:</span> <a href="tel:${escapeHtml(phone)}" class="text-accent-orange hover:underline">${escapeHtml(phone)}</a></p>`;
      if (!html) html = '<p class="text-gray-400 text-sm">Contact details will be added soon.</p>';
      details.innerHTML = html;
      showContent();
    } catch (e) {
      showError();
    }
  };
  if (retryBtn) retryBtn.addEventListener('click', run);
  await run();
}
