import './style.css';
import { app, db } from './firebase.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDocs, addDoc, setDoc, deleteDoc } from 'firebase/firestore';

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
