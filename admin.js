import './style.css';
import { app, db } from './firebase.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDocs, addDoc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

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
  loadSpeakers();
  loadTestimonies();
  loadAgendaDays();
}

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
const testimonyRoleInput = document.getElementById('testimony-role');
const testimonyLocationInput = document.getElementById('testimony-location');
const testimonyImageInput = document.getElementById('testimony-image');
const testimonyTextInput = document.getElementById('testimony-text');
const testimonyRatingInput = document.getElementById('testimony-rating');

function testimonyFormData() {
  return {
    name: testimonyNameInput.value.trim(),
    role: testimonyRoleInput.value.trim(),
    location: testimonyLocationInput.value.trim(),
    image: testimonyImageInput.value.trim() || '/img/testimonial1.jpg',
    testimony: testimonyTextInput.value.trim(),
    rating: Math.min(5, Math.max(1, parseInt(testimonyRatingInput.value, 10) || 5)),
  };
}

function clearTestimonyForm() {
  testimonyIdInput.value = '';
  testimonyNameInput.value = '';
  testimonyRoleInput.value = '';
  testimonyLocationInput.value = '';
  testimonyImageInput.value = '';
  testimonyTextInput.value = '';
  testimonyRatingInput.value = '5';
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
          <span class="text-gray-400 text-sm">${escapeHtml(t.role)} · ${escapeHtml((t.testimony || '').slice(0, 40))}…</span>
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
        testimonyRoleInput.value = item.role || '';
        testimonyLocationInput.value = item.location || '';
        testimonyImageInput.value = item.image || '';
        testimonyTextInput.value = item.testimony || '';
        testimonyRatingInput.value = String(item.rating != null ? item.rating : 5);
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

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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

const agendaItemsPanel = document.getElementById('agenda-items-panel');
const agendaItemsDayLabel = document.getElementById('agenda-items-day-label');
const agendaItemsDayIdInput = document.getElementById('agenda-items-day-id');
const agendaItemsList = document.getElementById('agenda-items-list');
const addAgendaItemBtn = document.getElementById('add-agenda-item-btn');
const agendaItemsPanelClose = document.getElementById('agenda-items-panel-close');
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
        <div class="border border-gray-600 rounded-lg p-4 bg-gray-700/30">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span class="font-medium text-white">${escapeHtml(day.label)}</span>
              <span class="text-gray-400 text-sm ml-2">${escapeHtml(day.date || '')} · order ${day.order != null ? day.order : 0}</span>
            </div>
            <div class="flex gap-2 flex-wrap">
              <button type="button" class="edit-agenda-day px-3 py-1 rounded bg-gray-600 hover:bg-gray-500 text-xs" data-id="${escapeAttr(day.id)}">Edit day</button>
              <button type="button" class="manage-agenda-items px-3 py-1 rounded bg-accent-orange/80 hover:bg-orange-600 text-xs" data-id="${escapeAttr(day.id)}">Manage items</button>
              <button type="button" class="delete-agenda-day px-3 py-1 rounded bg-red-900/50 hover:bg-red-800 text-red-300 text-xs" data-id="${escapeAttr(day.id)}">Delete day</button>
            </div>
          </div>
          <p class="text-gray-500 text-xs mt-1">${(day.items || []).length} session(s)</p>
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
          loadAgendaDays();
          if (currentAgendaDay && currentAgendaDay.id === id) {
            agendaItemsPanel.classList.add('hidden');
            currentAgendaDay = null;
          }
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
        currentAgendaDay = { ...day, items: Array.isArray(day.items) ? [...day.items] : [] };
        agendaItemsDayIdInput.value = day.id;
        agendaItemsDayLabel.textContent = 'Sessions for: ' + (day.label || 'Day');
        agendaItemsPanel.classList.remove('hidden');
        renderAgendaItemsList();
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
  try {
    if (id) {
      const day = agendaDaysData.find((d) => d.id === id);
      await setDoc(doc(db, 'agendaDays', id), { ...data, items: day ? (day.items || []) : [] });
    } else {
      await addDoc(collection(db, 'agendaDays'), data);
    }
    clearAgendaDayForm();
    loadAgendaDays();
  } catch (err) {
    alert('Save failed: ' + (err.message || err));
  }
});

function renderAgendaItemsList() {
  if (!currentAgendaDay || !agendaItemsList) return;
  const items = currentAgendaDay.items || [];
  agendaItemsList.innerHTML = items.length
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

  agendaItemsList.querySelectorAll('.edit-agenda-item').forEach((btn) => {
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

  agendaItemsList.querySelectorAll('.delete-agenda-item').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const index = parseInt(btn.getAttribute('data-index'), 10);
      if (!confirm('Delete this session?')) return;
      const newItems = currentAgendaDay.items.filter((_, i) => i !== index);
      try {
        await setDoc(doc(db, 'agendaDays', currentAgendaDay.id), {
          label: currentAgendaDay.label,
          date: currentAgendaDay.date,
          order: currentAgendaDay.order,
          items: newItems,
        });
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

addAgendaItemBtn.addEventListener('click', () => {
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
    await setDoc(doc(db, 'agendaDays', currentAgendaDay.id), {
      label: currentAgendaDay.label,
      date: currentAgendaDay.date,
      order: currentAgendaDay.order,
      items: currentAgendaDay.items,
    });
    const dayInList = agendaDaysData.find((d) => d.id === currentAgendaDay.id);
    if (dayInList) dayInList.items = currentAgendaDay.items;
    agendaItemForm.classList.add('hidden');
    renderAgendaItemsList();
  } catch (err) {
    alert('Save failed: ' + (err.message || err));
  }
});

agendaItemsPanelClose.addEventListener('click', () => {
  agendaItemsPanel.classList.add('hidden');
  currentAgendaDay = null;
});
