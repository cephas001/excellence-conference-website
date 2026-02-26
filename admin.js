import './style.css';
import { app, db } from './firebase.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDocs, getDoc, addDoc, setDoc, deleteDoc, query, orderBy, Timestamp } from 'firebase/firestore';

const auth = getAuth(app);

const loginView = document.getElementById('login-view');
const adminView = document.getElementById('admin-view');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const loginBtn = document.getElementById('login-btn');
const signOutBtn = document.getElementById('sign-out-btn');

function showLogin() {
  loginView.classList.remove('hidden');
  adminView.classList.add('hidden');
  loginError.classList.add('hidden');
  loginError.textContent = '';
}

function showAdmin() {
  loginView.classList.add('hidden');
  adminView.classList.remove('hidden');
  switchAdminPanel('speakers');
  loadSpeakers();
  loadTestimonies();
  loadAgendaDays();
  loadMerchSettings();
  loadMerchItems();
  loadDinnerSettings();
  loadVenueSettings();
  loadAnnouncement();
  loadFAQ();
  loadContactSettings();
}

function switchAdminPanel(section) {
  const panels = adminView.querySelectorAll('.admin-panel');
  const links = adminView.querySelectorAll('.admin-nav-link');
  panels.forEach((el) => el.classList.add('hidden'));
  links.forEach((el) => {
    el.classList.remove('bg-gray-700', 'text-white');
    el.classList.add('text-gray-300');
    if (el.getAttribute('data-section') === section) {
      el.classList.add('bg-gray-700', 'text-white');
      el.classList.remove('text-gray-300');
    }
  });
  const panel = document.getElementById('panel-' + section);
  if (panel) panel.classList.remove('hidden');
}

adminView.addEventListener('click', (e) => {
  const link = e.target.closest('.admin-nav-link');
  if (!link) return;
  e.preventDefault();
  const section = link.getAttribute('data-section');
  if (section) switchAdminPanel(section);
});

function setLoginError(msg) {
  loginError.textContent = msg || '';
  loginError.classList.toggle('hidden', !msg);
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('admin-email').value.trim();
  const password = document.getElementById('admin-password').value;
  if (!email || !password) return;
  setLoginError('');
  loginBtn.disabled = true;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    setLoginError(err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' ? 'Invalid email or password.' : err.message || 'Sign in failed.');
  } finally {
    loginBtn.disabled = false;
  }
});

signOutBtn.addEventListener('click', async () => {
  await signOut(auth);
  window.location.replace('index.html');
});

document.getElementById('back-to-home-btn').addEventListener('click', () => {
  window.location.replace('index.html');
});

onAuthStateChanged(auth, (user) => {
  if (user) showAdmin();
  else showLogin();
});

// --- Speakers ---
const speakersList = document.getElementById('speakers-list');
const speakerForm = document.getElementById('speaker-form');
const addSpeakerBtn = document.getElementById('add-speaker-btn');
const speakerFormCancel = document.getElementById('speaker-form-cancel');
const speakerIdInput = document.getElementById('speaker-id');
const speakerNameInput = document.getElementById('speaker-name');
const speakerRoleInput = document.getElementById('speaker-role');
const speakerBioInput = document.getElementById('speaker-bio');
const speakerTopicInput = document.getElementById('speaker-topic');
const speakerImageInput = document.getElementById('speaker-image');

function speakerFormData() {
  return {
    name: speakerNameInput.value.trim(),
    role: speakerRoleInput.value.trim(),
    bio: speakerBioInput.value.trim(),
    topic: speakerTopicInput.value.trim(),
    image: speakerImageInput.value.trim() || '/img/speaker1.jpg',
  };
}

function clearSpeakerForm() {
  speakerIdInput.value = '';
  speakerNameInput.value = '';
  speakerRoleInput.value = '';
  speakerBioInput.value = '';
  speakerTopicInput.value = '';
  speakerImageInput.value = '';
  speakerForm.classList.add('hidden');
}

async function loadSpeakers() {
  try {
    const snap = await getDocs(collection(db, 'speakers'));
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    speakersList.innerHTML = list.length
      ? list
          .map(
            (s) => `
        <div class="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-gray-700">
          <span class="text-white font-medium">${escapeHtml(s.name)}</span>
          <span class="text-gray-400 text-sm">${escapeHtml(s.role)} · ${escapeHtml(s.topic || '—')}</span>
          <div class="flex gap-2">
            <button type="button" class="edit-speaker px-3 py-1 rounded bg-gray-600 hover:bg-gray-500 text-xs" data-id="${escapeAttr(s.id)}">Edit</button>
            <button type="button" class="delete-speaker px-3 py-1 rounded bg-red-900/50 hover:bg-red-800 text-red-300 text-xs" data-id="${escapeAttr(s.id)}">Delete</button>
          </div>
        </div>
      `
          )
          .join('')
      : '<p class="text-gray-500 text-sm py-2">No speakers yet. Add one below.</p>';

    speakersList.querySelectorAll('.edit-speaker').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = list.find((x) => x.id === id);
        if (!item) return;
        speakerIdInput.value = id;
        speakerNameInput.value = item.name || '';
        speakerRoleInput.value = item.role || '';
        speakerBioInput.value = item.bio || '';
        speakerTopicInput.value = item.topic || '';
        speakerImageInput.value = item.image || '';
        speakerForm.classList.remove('hidden');
      });
    });

    speakersList.querySelectorAll('.delete-speaker').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this speaker?')) return;
        const id = btn.getAttribute('data-id');
        try {
          await deleteDoc(doc(db, 'speakers', id));
          loadSpeakers();
        } catch (e) {
          alert('Delete failed: ' + (e.message || e));
        }
      });
    });
  } catch (e) {
    speakersList.innerHTML = '<p class="text-red-400 text-sm">Failed to load speakers.</p>';
  }
}

addSpeakerBtn.addEventListener('click', () => {
  clearSpeakerForm();
  speakerForm.classList.remove('hidden');
});

speakerFormCancel.addEventListener('click', clearSpeakerForm);

speakerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = speakerIdInput.value.trim();
  const data = speakerFormData();
  try {
    if (id) {
      await setDoc(doc(db, 'speakers', id), data);
    } else {
      await addDoc(collection(db, 'speakers'), data);
    }
    clearSpeakerForm();
    loadSpeakers();
  } catch (err) {
    alert('Save failed: ' + (err.message || err));
  }
});

// --- Testimonies ---
const testimoniesList = document.getElementById('testimonies-list');
const testimonyForm = document.getElementById('testimony-form');
const addTestimonyBtn = document.getElementById('add-testimony-btn');
const testimonyFormCancel = document.getElementById('testimony-form-cancel');
const testimonyIdInput = document.getElementById('testimony-id');
const testimonyNameInput = document.getElementById('testimony-name');
const testimonyLocationInput = document.getElementById('testimony-location');
const testimonyTextInput = document.getElementById('testimony-text');

function testimonyFormData() {
  return {
    name: testimonyNameInput.value.trim(),
    location: testimonyLocationInput.value.trim(),
    testimony: testimonyTextInput.value.trim(),
  };
}

function clearTestimonyForm() {
  testimonyIdInput.value = '';
  testimonyNameInput.value = '';
  testimonyLocationInput.value = '';
  testimonyTextInput.value = '';
  testimonyForm.classList.add('hidden');
}

async function loadTestimonies() {
  try {
    const snap = await getDocs(collection(db, 'testimonies'));
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    testimoniesList.innerHTML = list.length
      ? list
          .map(
            (t) => `
        <div class="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-gray-700">
          <span class="text-white font-medium">${escapeHtml(t.name)}</span>
          <span class="text-gray-400 text-sm">${escapeHtml((t.testimony || '').slice(0, 50))}…</span>
          <div class="flex gap-2">
            <button type="button" class="edit-testimony px-3 py-1 rounded bg-gray-600 hover:bg-gray-500 text-xs" data-id="${escapeAttr(t.id)}">Edit</button>
            <button type="button" class="delete-testimony px-3 py-1 rounded bg-red-900/50 hover:bg-red-800 text-red-300 text-xs" data-id="${escapeAttr(t.id)}">Delete</button>
          </div>
        </div>
      `
          )
          .join('')
      : '<p class="text-gray-500 text-sm py-2">No testimonies yet. Add one below.</p>';

    testimoniesList.querySelectorAll('.edit-testimony').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = list.find((x) => x.id === id);
        if (!item) return;
        testimonyIdInput.value = id;
        testimonyNameInput.value = item.name || '';
        testimonyLocationInput.value = item.location || '';
        testimonyTextInput.value = item.testimony || '';
        testimonyForm.classList.remove('hidden');
      });
    });

    testimoniesList.querySelectorAll('.delete-testimony').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this testimony?')) return;
        const id = btn.getAttribute('data-id');
        try {
          await deleteDoc(doc(db, 'testimonies', id));
          loadTestimonies();
        } catch (e) {
          alert('Delete failed: ' + (e.message || e));
        }
      });
    });
  } catch (e) {
    testimoniesList.innerHTML = '<p class="text-red-400 text-sm">Failed to load testimonies.</p>';
  }
}

addTestimonyBtn.addEventListener('click', () => {
  clearTestimonyForm();
  testimonyForm.classList.remove('hidden');
});

testimonyFormCancel.addEventListener('click', clearTestimonyForm);

testimonyForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = testimonyIdInput.value.trim();
  const data = testimonyFormData();
  try {
    if (id) {
      await setDoc(doc(db, 'testimonies', id), data);
    } else {
      await addDoc(collection(db, 'testimonies'), data);
    }
    clearTestimonyForm();
    loadTestimonies();
  } catch (err) {
    alert('Save failed: ' + (err.message || err));
  }
});

function escapeAttr(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Escape a string for safe use inside a CSS attribute selector value (e.g. [data-day-id="..."]). */
function escapeCssAttrValue(s) {
  if (s == null) return '';
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Remove undefined values so Firestore accepts the payload (it rejects undefined). */
function stripUndefined(obj) {
  if (obj === undefined || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map((v) => stripUndefined(v)).filter((v) => v !== undefined);
  if (typeof obj !== 'object') return obj;
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    const cleaned = stripUndefined(v);
    if (cleaned !== undefined) out[k] = cleaned;
  }
  return out;
}

// --- Agenda (days + items) ---
const agendaDaysList = document.getElementById('agenda-days-list');
const addAgendaDayBtn = document.getElementById('add-agenda-day-btn');
const agendaDayForm = document.getElementById('agenda-day-form');
const agendaDayIdInput = document.getElementById('agenda-day-id');
const agendaDayLabelInput = document.getElementById('agenda-day-label');
const agendaDayDateInput = document.getElementById('agenda-day-date');
const agendaDayOrderInput = document.getElementById('agenda-day-order');
const agendaDayFormCancel = document.getElementById('agenda-day-form-cancel');

const agendaItemsList = document.getElementById('agenda-days-list');
const agendaItemForm = document.getElementById('agenda-item-form');
const agendaItemIndexInput = document.getElementById('agenda-item-index');
const agendaItemTimeInput = document.getElementById('agenda-item-time');
const agendaItemTypeSelect = document.getElementById('agenda-item-type');
const agendaItemTitleInput = document.getElementById('agenda-item-title');
const agendaItemDescriptionInput = document.getElementById('agenda-item-description');
const agendaItemDetailedFields = document.getElementById('agenda-item-detailed-fields');
const agendaItemTagInput = document.getElementById('agenda-item-tag');
const agendaItemSpeakerNameInput = document.getElementById('agenda-item-speaker-name');
const agendaItemSpeakerRoleInput = document.getElementById('agenda-item-speaker-role');
const agendaItemSpeakerImageInput = document.getElementById('agenda-item-speaker-image');
const agendaItemFormCancel = document.getElementById('agenda-item-form-cancel');

let agendaDaysData = [];
let currentAgendaDay = null;

function clearAgendaDayForm() {
  agendaDayIdInput.value = '';
  agendaDayLabelInput.value = '';
  agendaDayDateInput.value = '';
  agendaDayOrderInput.value = '0';
  agendaDayForm.classList.add('hidden');
}

function agendaDayFormData() {
  return {
    label: agendaDayLabelInput.value.trim(),
    date: agendaDayDateInput.value.trim(),
    order: parseInt(agendaDayOrderInput.value, 10) || 0,
    items: [],
  };
}

async function loadAgendaDays() {
  try {
    const q = query(collection(db, 'agendaDays'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    agendaDaysData = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    agendaDaysList.innerHTML = agendaDaysData.length
      ? agendaDaysData
          .map(
            (day) => `
        <div class="agenda-day-card border border-gray-600 rounded-lg p-4 bg-gray-700/30" data-day-id="${escapeAttr(day.id)}">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span class="font-medium text-white">${escapeHtml(day.label)}</span>
              <span class="text-gray-400 text-sm ml-2">${escapeHtml(day.date || '')} · order ${day.order != null ? day.order : 0}</span>
            </div>
            <div class="flex gap-2 flex-wrap">
              <button type="button" class="edit-agenda-day px-3 py-1 rounded bg-gray-600 hover:bg-gray-500 text-xs" data-id="${escapeAttr(day.id)}">Edit day</button>
              <button type="button" class="manage-agenda-items px-3 py-1 rounded bg-accent-orange/80 hover:bg-orange-600 text-xs" data-id="${escapeAttr(day.id)}">Manage sessions</button>
              <button type="button" class="delete-agenda-day px-3 py-1 rounded bg-red-900/50 hover:bg-red-800 text-red-300 text-xs" data-id="${escapeAttr(day.id)}">Delete day</button>
            </div>
          </div>
          <p class="text-gray-500 text-xs mt-1">${(day.items || []).length} session(s)</p>
          <div class="day-expandable hidden mt-3 pt-3 border-t border-gray-600" data-day-id="${escapeAttr(day.id)}">
            <div class="agenda-items-list mb-4 space-y-2"></div>
            <button type="button" class="add-agenda-item-in-day px-4 py-2 rounded-lg bg-accent-orange/80 hover:bg-orange-600 text-sm font-medium" data-id="${escapeAttr(day.id)}">Add session</button>
          </div>
        </div>
      `
          )
          .join('')
      : '<p class="text-gray-500 text-sm py-2">No agenda days yet. Add a day below.</p>';

    agendaDaysList.querySelectorAll('.edit-agenda-day').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const day = agendaDaysData.find((x) => x.id === id);
        if (!day) return;
        agendaDayIdInput.value = day.id;
        agendaDayLabelInput.value = day.label || '';
        agendaDayDateInput.value = day.date || '';
        agendaDayOrderInput.value = String(day.order != null ? day.order : 0);
        agendaDayForm.classList.remove('hidden');
      });
    });

    agendaDaysList.querySelectorAll('.delete-agenda-day').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this day and all its sessions?')) return;
        const id = btn.getAttribute('data-id');
        try {
          await deleteDoc(doc(db, 'agendaDays', id));
          if (currentAgendaDay && currentAgendaDay.id === id) currentAgendaDay = null;
          loadAgendaDays();
        } catch (e) {
          alert('Delete failed: ' + (e.message || e));
        }
      });
    });

    agendaDaysList.querySelectorAll('.manage-agenda-items').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const day = agendaDaysData.find((x) => x.id === id);
        if (!day) return;
        const expandable = document.querySelector(`.day-expandable[data-day-id="${escapeCssAttrValue(id)}"]`);
        if (!expandable) return;
        const isOpen = !expandable.classList.contains('hidden');
        document.querySelectorAll('.day-expandable').forEach((el) => el.classList.add('hidden'));
        if (!isOpen) {
          expandable.classList.remove('hidden');
          currentAgendaDay = { ...day, items: Array.isArray(day.items) ? [...day.items] : [] };
          renderAgendaItemsList();
        } else {
          currentAgendaDay = null;
        }
      });
    });

    agendaDaysList.querySelectorAll('.add-agenda-item-in-day').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const day = agendaDaysData.find((x) => x.id === id);
        if (!day) return;
        currentAgendaDay = { ...day, items: Array.isArray(day.items) ? [...day.items] : [] };
        agendaItemIndexInput.value = '';
        agendaItemTimeInput.value = '';
        agendaItemTitleInput.value = '';
        agendaItemDescriptionInput.value = '';
        agendaItemTypeSelect.value = 'simple';
        agendaItemTagInput.value = '';
        agendaItemSpeakerNameInput.value = '';
        agendaItemSpeakerRoleInput.value = '';
        agendaItemSpeakerImageInput.value = '';
        agendaItemDetailedFields.classList.add('hidden');
        agendaItemForm.classList.remove('hidden');
      });
    });
  } catch (e) {
    agendaDaysList.innerHTML = '<p class="text-red-400 text-sm">Failed to load agenda.</p>';
  }
}

addAgendaDayBtn.addEventListener('click', () => {
  clearAgendaDayForm();
  agendaDayForm.classList.remove('hidden');
});

agendaDayFormCancel.addEventListener('click', clearAgendaDayForm);

agendaDayForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = agendaDayIdInput.value.trim();
  const data = agendaDayFormData();
  const payload = id
    ? { ...data, items: (agendaDaysData.find((d) => d.id === id) || {}).items || [] }
    : data;
  try {
    if (id) {
      await setDoc(doc(db, 'agendaDays', id), stripUndefined(payload));
    } else {
      await addDoc(collection(db, 'agendaDays'), stripUndefined(payload));
    }
    clearAgendaDayForm();
    loadAgendaDays();
  } catch (err) {
    alert('Save failed: ' + (err.message || err));
  }
});

function renderAgendaItemsList() {
  if (!currentAgendaDay) return;
  const container = document.querySelector(`.day-expandable[data-day-id="${escapeCssAttrValue(currentAgendaDay.id)}"] .agenda-items-list`);
  if (!container) return;
  const items = currentAgendaDay.items || [];
  container.innerHTML = items.length
    ? items
        .map(
          (item, i) => `
        <div class="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-gray-600">
          <span class="text-white text-sm">${escapeHtml(item.time)} – ${escapeHtml(item.title)}</span>
          <div class="flex gap-2">
            <button type="button" class="edit-agenda-item px-2 py-1 rounded bg-gray-600 hover:bg-gray-500 text-xs" data-index="${i}">Edit</button>
            <button type="button" class="delete-agenda-item px-2 py-1 rounded bg-red-900/50 hover:bg-red-800 text-red-300 text-xs" data-index="${i}">Delete</button>
          </div>
        </div>
      `
        )
        .join('')
    : '<p class="text-gray-500 text-sm py-2">No sessions. Add one below.</p>';

  container.querySelectorAll('.edit-agenda-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.getAttribute('data-index'), 10);
      const item = currentAgendaDay.items[index];
      if (!item) return;
      agendaItemIndexInput.value = String(index);
      agendaItemTimeInput.value = item.time || '';
      agendaItemTitleInput.value = item.title || '';
      agendaItemDescriptionInput.value = item.description || '';
      agendaItemTypeSelect.value = item.type === 'detailed' ? 'detailed' : 'simple';
      agendaItemTagInput.value = item.tag || '';
      agendaItemSpeakerNameInput.value = item.speaker ? (item.speaker.name || '') : '';
      agendaItemSpeakerRoleInput.value = item.speaker ? (item.speaker.role || '') : '';
      agendaItemSpeakerImageInput.value = item.speaker ? (item.speaker.image || '') : '';
      agendaItemDetailedFields.classList.toggle('hidden', item.type !== 'detailed');
      agendaItemForm.classList.remove('hidden');
    });
  });

  container.querySelectorAll('.delete-agenda-item').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const index = parseInt(btn.getAttribute('data-index'), 10);
      if (!confirm('Delete this session?')) return;
      const newItems = currentAgendaDay.items.filter((_, i) => i !== index);
      try {
        await setDoc(doc(db, 'agendaDays', currentAgendaDay.id), stripUndefined({
          label: currentAgendaDay.label,
          date: currentAgendaDay.date,
          order: currentAgendaDay.order,
          items: newItems,
        }));
        currentAgendaDay.items = newItems;
        const dayInList = agendaDaysData.find((d) => d.id === currentAgendaDay.id);
        if (dayInList) dayInList.items = newItems;
        renderAgendaItemsList();
      } catch (e) {
        alert('Delete failed: ' + (e.message || e));
      }
    });
  });
}

agendaItemTypeSelect.addEventListener('change', () => {
  agendaItemDetailedFields.classList.toggle('hidden', agendaItemTypeSelect.value !== 'detailed');
});

agendaItemFormCancel.addEventListener('click', () => {
  agendaItemForm.classList.add('hidden');
});

agendaItemForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentAgendaDay) return;
  const indexStr = agendaItemIndexInput.value;
  const index = indexStr === '' ? -1 : parseInt(indexStr, 10);
  const item = {
    time: agendaItemTimeInput.value.trim(),
    title: agendaItemTitleInput.value.trim(),
    description: agendaItemDescriptionInput.value.trim() || undefined,
    type: agendaItemTypeSelect.value === 'detailed' ? 'detailed' : 'simple',
    tag: agendaItemTypeSelect.value === 'detailed' ? (agendaItemTagInput.value.trim() || undefined) : undefined,
  };
  if (item.type === 'detailed') {
    item.speaker = {
      name: agendaItemSpeakerNameInput.value.trim() || '',
      role: agendaItemSpeakerRoleInput.value.trim() || '',
      image: agendaItemSpeakerImageInput.value.trim() || '',
    };
  }
  if (index >= 0 && index < currentAgendaDay.items.length) {
    currentAgendaDay.items[index] = item;
  } else {
    currentAgendaDay.items.push(item);
  }
  try {
    await setDoc(doc(db, 'agendaDays', currentAgendaDay.id), stripUndefined({
      label: currentAgendaDay.label,
      date: currentAgendaDay.date,
      order: currentAgendaDay.order,
      items: currentAgendaDay.items,
    }));
    const dayInList = agendaDaysData.find((d) => d.id === currentAgendaDay.id);
    if (dayInList) dayInList.items = currentAgendaDay.items;
    agendaItemForm.classList.add('hidden');
    renderAgendaItemsList();
  } catch (err) {
    alert('Save failed: ' + (err.message || err));
  }
});

// --- Merch: settings + items ---
const MERCH_SETTINGS_ID = 'config';
const merchSettingsForm = document.getElementById('merch-settings-form');
const merchAccountNumberInput = document.getElementById('merch-account-number');
const merchAccountNameInput = document.getElementById('merch-account-name');
const merchGoogleFormLinkInput = document.getElementById('merch-google-form-link');
const merchItemsList = document.getElementById('merch-items-list');
const merchAddItemBtn = document.getElementById('merch-add-item-btn');
const merchItemForm = document.getElementById('merch-item-form');
const merchItemIdInput = document.getElementById('merch-item-id');
const merchItemNameInput = document.getElementById('merch-item-name');
const merchItemPriceInput = document.getElementById('merch-item-price');
const merchItemDescriptionInput = document.getElementById('merch-item-description');
const merchItemImagesList = document.getElementById('merch-item-images-list');
const merchItemAddImageBtn = document.getElementById('merch-item-add-image-btn');
const merchItemFormCancel = document.getElementById('merch-item-form-cancel');

function getMerchItemImages() {
  if (!merchItemImagesList) return [];
  return Array.from(merchItemImagesList.querySelectorAll('.merch-item-image-url'))
    .map((input) => input.value.trim())
    .filter(Boolean);
}

function setMerchItemImages(urls) {
  if (!merchItemImagesList) return;
  merchItemImagesList.innerHTML = '';
  (urls && urls.length ? urls : ['']).forEach((url) => appendMerchItemImageRow(url));
}

function appendMerchItemImageRow(value = '') {
  const row = document.createElement('div');
  row.className = 'flex gap-2 items-center';
  row.innerHTML = `
    <input type="text" class="merch-item-image-url flex-1 px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm" placeholder="https://…" value="${escapeAttr(value)}">
    <button type="button" class="merch-item-image-remove px-2 py-1.5 rounded bg-red-900/50 hover:bg-red-800 text-red-300 text-xs shrink-0">Remove</button>
  `;
  merchItemImagesList.appendChild(row);
  row.querySelector('.merch-item-image-remove').addEventListener('click', () => row.remove());
}

async function loadMerchSettings() {
  if (!merchSettingsForm) return;
  try {
    const snap = await getDoc(doc(db, 'merchSettings', MERCH_SETTINGS_ID));
    const d = snap.exists() ? snap.data() : {};
    merchAccountNumberInput.value = d.accountNumber || '';
    merchAccountNameInput.value = d.accountName || '';
    merchGoogleFormLinkInput.value = d.googleFormLink || '';
  } catch (e) {
    console.warn('Merch settings load failed', e);
  }
}

merchSettingsForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await setDoc(doc(db, 'merchSettings', MERCH_SETTINGS_ID), stripUndefined({
      accountNumber: merchAccountNumberInput.value.trim() || null,
      accountName: merchAccountNameInput.value.trim() || null,
      googleFormLink: merchGoogleFormLinkInput.value.trim() || null,
    }));
    alert('Payment details saved.');
  } catch (err) {
    alert('Save failed: ' + (err.message || err));
  }
});

let merchItemsData = [];

async function loadMerchItems() {
  if (!merchItemsList) return;
  try {
    const q = query(collection(db, 'merchItems'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    merchItemsData = snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
    renderMerchItemsList();
  } catch (e) {
    console.warn('Merch items load failed', e);
    merchItemsData = [];
    renderMerchItemsList();
  }
}

function renderMerchItemsList() {
  merchItemsList.innerHTML = merchItemsData.length
    ? merchItemsData
        .map(
          (item) => `
        <div class="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-gray-700/50 border border-gray-600">
          <div>
            <span class="font-medium text-white">${escapeHtml(item.name || '')}</span>
            <span class="text-gray-400 text-sm ml-2">${escapeHtml(item.price || '')}</span>
          </div>
          <div class="flex gap-2">
            <button type="button" class="edit-merch-item px-3 py-1 rounded bg-gray-600 hover:bg-gray-500 text-xs" data-id="${escapeAttr(item.id)}">Edit</button>
            <button type="button" class="delete-merch-item px-3 py-1 rounded bg-red-900/50 hover:bg-red-800 text-red-300 text-xs" data-id="${escapeAttr(item.id)}">Delete</button>
          </div>
        </div>
      `
        )
        .join('')
    : '<p class="text-gray-500 text-sm py-2">No items yet. Add one below.</p>';

  merchItemsList.querySelectorAll('.edit-merch-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = merchItemsData.find((x) => x.id === id);
      if (!item) return;
      merchItemIdInput.value = item.id;
      merchItemNameInput.value = item.name || '';
      merchItemPriceInput.value = item.price || '';
      merchItemDescriptionInput.value = item.description || '';
      const urls = Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []);
      setMerchItemImages(urls.length ? urls : ['']);
      merchItemForm.classList.remove('hidden');
    });
  });

  merchItemsList.querySelectorAll('.delete-merch-item').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (!confirm('Delete this item?')) return;
      try {
        await deleteDoc(doc(db, 'merchItems', id));
        loadMerchItems();
      } catch (err) {
        alert('Delete failed: ' + (err.message || err));
      }
    });
  });
}

merchAddItemBtn.addEventListener('click', () => {
  merchItemIdInput.value = '';
  merchItemNameInput.value = '';
  merchItemPriceInput.value = '';
  merchItemDescriptionInput.value = '';
  setMerchItemImages(['']);
  merchItemForm.classList.remove('hidden');
});

merchItemAddImageBtn.addEventListener('click', () => appendMerchItemImageRow(''));

merchItemFormCancel.addEventListener('click', () => merchItemForm.classList.add('hidden'));

merchItemForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = merchItemIdInput.value.trim();
  const existing = id ? merchItemsData.find((x) => x.id === id) : null;
  const imageUrls = getMerchItemImages();
  const data = stripUndefined({
    name: merchItemNameInput.value.trim(),
    price: merchItemPriceInput.value.trim(),
    description: merchItemDescriptionInput.value.trim() || undefined,
    images: imageUrls.length ? imageUrls : undefined,
    order: existing != null ? existing.order : merchItemsData.length,
  });
  try {
    if (id) {
      await setDoc(doc(db, 'merchItems', id), data);
    } else {
      await addDoc(collection(db, 'merchItems'), data);
    }
    merchItemForm.classList.add('hidden');
    loadMerchItems();
  } catch (err) {
    alert('Save failed: ' + (err.message || err));
  }
});

// --- Event settings: Dinner, Venue, Announcement, FAQ, Contact ---
const EVENT_SETTINGS = 'eventSettings';
const DINNER_ID = 'dinner';
const VENUE_ID = 'venue';
const ANNOUNCEMENT_ID = 'current';
const CONTACT_ID = 'contact';

async function loadDinnerSettings() {
  const form = document.getElementById('dinner-settings-form');
  if (!form) return;
  try {
    const snap = await getDoc(doc(db, EVENT_SETTINGS, DINNER_ID));
    const d = snap.exists() ? snap.data() : {};
    document.getElementById('dinner-venue-name').value = d.venueName || '';
    document.getElementById('dinner-venue-address').value = d.venueAddress || '';
    document.getElementById('dinner-date').value = d.date || '';
    document.getElementById('dinner-time').value = d.time || '';
    document.getElementById('dinner-description').value = d.description || '';
    document.getElementById('dinner-map-link').value = d.mapLink || '';
  } catch (e) {
    console.warn('Dinner settings load failed', e);
  }
}
document.getElementById('dinner-settings-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await setDoc(doc(db, EVENT_SETTINGS, DINNER_ID), stripUndefined({
      venueName: document.getElementById('dinner-venue-name').value.trim() || null,
      venueAddress: document.getElementById('dinner-venue-address').value.trim() || null,
      date: document.getElementById('dinner-date').value.trim() || null,
      time: document.getElementById('dinner-time').value.trim() || null,
      description: document.getElementById('dinner-description').value.trim() || null,
      mapLink: document.getElementById('dinner-map-link').value.trim() || null,
    }));
    alert('Dinner details saved.');
  } catch (err) {
    alert('Save failed: ' + (err.message || err));
  }
});

async function loadVenueSettings() {
  const form = document.getElementById('venue-settings-form');
  if (!form) return;
  try {
    const snap = await getDoc(doc(db, EVENT_SETTINGS, VENUE_ID));
    const d = snap.exists() ? snap.data() : {};
    document.getElementById('venue-name').value = d.venueName || '';
    document.getElementById('venue-address').value = d.address || '';
    document.getElementById('venue-map-link').value = d.mapLink || '';
  } catch (e) {
    console.warn('Venue settings load failed', e);
  }
}
document.getElementById('venue-settings-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await setDoc(doc(db, EVENT_SETTINGS, VENUE_ID), stripUndefined({
      venueName: document.getElementById('venue-name').value.trim() || null,
      address: document.getElementById('venue-address').value.trim() || null,
      mapLink: document.getElementById('venue-map-link').value.trim() || null,
    }));
    alert('Venue saved.');
  } catch (err) {
    alert('Save failed: ' + (err.message || err));
  }
});

async function loadAnnouncement() {
  const msgEl = document.getElementById('announcement-message');
  const endEl = document.getElementById('announcement-end');
  if (!msgEl) return;
  try {
    const snap = await getDoc(doc(db, EVENT_SETTINGS, ANNOUNCEMENT_ID));
    const d = snap.exists() ? snap.data() : {};
    msgEl.value = d.message || '';
    if (d.endTime && d.endTime.toDate) {
      const date = d.endTime.toDate();
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const h = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      endEl.value = `${y}-${m}-${day}T${h}:${min}`;
    } else {
      endEl.value = '';
    }
  } catch (e) {
    console.warn('Announcement load failed', e);
  }
}
document.getElementById('announcement-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = document.getElementById('announcement-message').value.trim();
  const endLocal = document.getElementById('announcement-end').value.trim();
  const endTime = endLocal ? Timestamp.fromDate(new Date(endLocal)) : null;
  try {
    await setDoc(doc(db, EVENT_SETTINGS, ANNOUNCEMENT_ID), stripUndefined({
      message: message || null,
      endTime: endTime,
    }));
    alert('Announcement saved. Banner shows only when message is set and end time has not passed.');
  } catch (err) {
    alert('Save failed: ' + (err.message || err));
  }
});

let faqData = [];
async function loadFAQ() {
  const list = document.getElementById('faq-list-admin');
  if (!list) return;
  try {
    const q = query(collection(db, 'faq'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    faqData = snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
    list.innerHTML = faqData.length
      ? faqData
          .map(
            (item) => `
        <div class="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-gray-700/50 border border-gray-600">
          <span class="text-white text-sm">${escapeHtml((item.question || '').slice(0, 50))}${(item.question || '').length > 50 ? '…' : ''}</span>
          <div class="flex gap-2">
            <button type="button" class="edit-faq px-3 py-1 rounded bg-gray-600 hover:bg-gray-500 text-xs" data-id="${escapeAttr(item.id)}">Edit</button>
            <button type="button" class="delete-faq px-3 py-1 rounded bg-red-900/50 hover:bg-red-800 text-red-300 text-xs" data-id="${escapeAttr(item.id)}">Delete</button>
          </div>
        </div>
      `
          )
          .join('')
      : '<p class="text-gray-500 text-sm py-2">No FAQ items yet.</p>';
    list.querySelectorAll('.edit-faq').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = faqData.find((x) => x.id === btn.getAttribute('data-id'));
        if (!item) return;
        document.getElementById('faq-item-id').value = item.id;
        document.getElementById('faq-item-question').value = item.question || '';
        document.getElementById('faq-item-answer').value = item.answer || '';
        document.getElementById('faq-item-form').classList.remove('hidden');
      });
    });
    list.querySelectorAll('.delete-faq').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this FAQ?')) return;
        try {
          await deleteDoc(doc(db, 'faq', btn.getAttribute('data-id')));
          loadFAQ();
        } catch (err) {
          alert('Delete failed: ' + (err.message || err));
        }
      });
    });
  } catch (e) {
    list.innerHTML = '<p class="text-gray-500 text-sm py-2">Failed to load FAQ.</p>';
  }
}
document.getElementById('faq-add-btn')?.addEventListener('click', () => {
  document.getElementById('faq-item-id').value = '';
  document.getElementById('faq-item-question').value = '';
  document.getElementById('faq-item-answer').value = '';
  document.getElementById('faq-item-form').classList.remove('hidden');
});
document.getElementById('faq-item-cancel')?.addEventListener('click', () => {
  document.getElementById('faq-item-form').classList.add('hidden');
});
document.getElementById('faq-item-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('faq-item-id').value.trim();
  const data = stripUndefined({
    question: document.getElementById('faq-item-question').value.trim(),
    answer: document.getElementById('faq-item-answer').value.trim(),
    order: id ? (faqData.find((x) => x.id === id)?.order ?? faqData.length) : faqData.length,
  });
  try {
    if (id) {
      await setDoc(doc(db, 'faq', id), data);
    } else {
      await addDoc(collection(db, 'faq'), data);
    }
    document.getElementById('faq-item-form').classList.add('hidden');
    loadFAQ();
  } catch (err) {
    alert('Save failed: ' + (err.message || err));
  }
});

async function loadContactSettings() {
  const form = document.getElementById('contact-settings-form');
  if (!form) return;
  try {
    const snap = await getDoc(doc(db, EVENT_SETTINGS, CONTACT_ID));
    const d = snap.exists() ? snap.data() : {};
    document.getElementById('contact-email').value = d.email || '';
    document.getElementById('contact-phone').value = d.phone || '';
  } catch (e) {
    console.warn('Contact settings load failed', e);
  }
}
document.getElementById('contact-settings-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await setDoc(doc(db, EVENT_SETTINGS, CONTACT_ID), stripUndefined({
      email: document.getElementById('contact-email').value.trim() || null,
      phone: document.getElementById('contact-phone').value.trim() || null,
    }));
    alert('Contact details saved.');
  } catch (err) {
    alert('Save failed: ' + (err.message || err));
  }
});

