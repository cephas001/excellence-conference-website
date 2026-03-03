import { db } from './firebase.js';
import { collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';

const MERCH_SETTINGS_ID = 'config';

function escapeHtml(s) {
  if (s == null) return '';
  const str = String(s);
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export async function initMerch() {
  const itemsEl = document.getElementById('merch-items-container');
  const paymentEl = document.getElementById('merch-payment-details');
  const accountNameEl = document.getElementById('merch-display-account-name');
  const accountBankEl = document.getElementById('merch-display-account-bank');
  const accountNumberEl = document.getElementById('merch-display-account-number');
  const formLinkEl = document.getElementById('merch-form-link');
  const errorEl = document.getElementById('merch-error');
  const retryBtn = document.getElementById('merch-retry-btn');

  if (!itemsEl) return;
  if (errorEl) errorEl.classList.add('hidden');
  itemsEl.innerHTML = '<p class="text-gray-500 text-sm">Loading…</p>';
  if (retryBtn && !retryBtn.dataset.bound) {
    retryBtn.dataset.bound = '1';
    retryBtn.addEventListener('click', () => initMerch());
  }

  try {
    const [settingsSnap, itemsSnap] = await Promise.all([
      getDoc(doc(db, 'merchSettings', MERCH_SETTINGS_ID)),
      getDocs(query(collection(db, 'merchItems'), orderBy('order', 'asc'))),
    ]);

    const settings = settingsSnap.exists() ? settingsSnap.data() : {};
    const items = itemsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (items.length === 0) {
      itemsEl.innerHTML = '<p class="text-gray-500 text-sm">No merch items yet. Check back later.</p>';
    } else {
      itemsEl.innerHTML = items
        .map((item) => {
          const urls = Array.isArray(item.images) && item.images.length
            ? item.images
            : (item.image ? [item.image] : []);
          const hasMultiple = urls.length > 1;
          const imagesHtml =
            urls.length === 0
              ? ''
              : hasMultiple
                ? `
          <div class="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory rounded-lg mb-3 -mx-1 px-1" style="scrollbar-width: thin;">
            ${urls.map((url) => `<img src="${escapeHtml(url)}" alt="${escapeHtml(item.name || '')}" class="flex-shrink-0 w-48 h-40 object-cover rounded-lg snap-center snap-always">`).join('')}
          </div>
        `
                : `<img src="${escapeHtml(urls[0])}" alt="${escapeHtml(item.name || '')}" class="w-full h-40 object-cover rounded-lg mb-3">`;
          return `
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-4">
          ${imagesHtml}
          <h3 class="font-semibold text-white">${escapeHtml(item.name)}</h3>
          <p class="text-accent-orange font-medium mt-1">${escapeHtml(item.price)}</p>
          ${item.description ? `<p class="text-gray-400 text-sm mt-2">${escapeHtml(item.description)}</p>` : ''}
        </div>
      `;
        })
        .join('');
    }

    const hasPayment =
      (settings.accountName && settings.accountName.trim()) ||
      (settings.accountBank && settings.accountBank.trim()) ||
      (settings.accountNumber && settings.accountNumber.trim()) ||
      (settings.googleFormLink && settings.googleFormLink.trim());

    if (paymentEl) {
      paymentEl.classList.toggle('hidden', !hasPayment);
    }
    if (accountNameEl) accountNameEl.textContent = settings.accountName || '—';
    if (accountBankEl) accountBankEl.textContent = settings.accountBank || '—';
    if (accountNumberEl) accountNumberEl.textContent = settings.accountNumber || '—';
    if (formLinkEl) {
      formLinkEl.href = settings.googleFormLink || '#';
      formLinkEl.classList.toggle('pointer-events-none', !settings.googleFormLink);
    }
    if (errorEl) errorEl.classList.add('hidden');
  } catch (e) {
    console.warn('Merch load failed', e);
    itemsEl.innerHTML = '';
    if (errorEl) errorEl.classList.remove('hidden');
    if (paymentEl) paymentEl.classList.add('hidden');
  }
}
