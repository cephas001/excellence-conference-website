import './style.css';
import { initHome } from './home.js';
import { initAgenda } from './main.js';
import { initMerch } from './merch.js';
import { initAnnouncement, initDinner, initContact } from './event.js';

const ROUTES = ['home', 'agenda', 'dinner', 'merch', 'contact'];
let homeInitialized = false;
let currentRoute = '';

function getRouteFromHash() {
  const hash = window.location.hash.slice(1).toLowerCase() || 'home';
  return ROUTES.includes(hash) ? hash : 'home';
}

function showView(route) {
  const loader = document.getElementById('loader');
  const app = document.getElementById('app');
  if (route !== 'home' && loader && app) {
    loader.style.display = 'none';
    app.classList.remove('hidden');
  }
  ROUTES.forEach((r) => {
    const el = document.getElementById(`view-${r}`);
    if (el) el.classList.toggle('hidden', r !== route);
  });
  document.querySelectorAll('#bottom-nav [data-route]').forEach((a) => {
    const isActive = a.getAttribute('data-route') === route;
    a.classList.toggle('text-accent-orange', isActive);
    a.classList.toggle('text-gray-400', !isActive);
  });
  if (route === 'home' && !homeInitialized) {
    homeInitialized = true;
    initHome();
  } else if (route === 'agenda') {
    initAgenda();
  } else if (route === 'merch') {
    initMerch();
  } else if (route === 'dinner') {
    initDinner();
  } else if (route === 'contact') {
    initContact();
  }
  currentRoute = route;
  const titles = { home: 'Excellence Conference - Home', agenda: 'Agenda', dinner: 'Conference Dinner', merch: 'Merch', contact: 'Contact' };
  document.title = titles[route] || `Excellence Conference - ${route.charAt(0).toUpperCase() + route.slice(1)}`;
}

function navigateTo(route) {
  window.location.hash = route === 'home' ? '' : route;
  showView(route);
}

function handleNav(e) {
  const a = e.target.closest('a[data-route]');
  if (!a) return;
  e.preventDefault();
  const route = a.getAttribute('data-route');
  if (route && ROUTES.includes(route)) navigateTo(route);
}

function handleInPageLinks(e) {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const hash = a.getAttribute('href').slice(1).toLowerCase();
  if (ROUTES.includes(hash) || hash === '') {
    e.preventDefault();
    navigateTo(hash || 'home');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initAnnouncement();
  document.body.addEventListener('click', handleNav);
  document.body.addEventListener('click', handleInPageLinks);
  window.addEventListener('hashchange', () => showView(getRouteFromHash()));
  showView(getRouteFromHash());
});
