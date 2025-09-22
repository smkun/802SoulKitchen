import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyDvGG5PnYpksQRzk8RvZ7Lyc8FaxwM-kG4",
  authDomain: "soulkitchen-9e6b2.firebaseapp.com",
  projectId: "soulkitchen-9e6b2",
  storageBucket: "soulkitchen-9e6b2.firebasestorage.app",
  messagingSenderId: "370735557737",
  appId: "1:370735557737:web:f08d5a4052e12b5a7f06f8",
  measurementId: "G-4XNBK7TP6J"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// --- Admin Authentication & UI ---
const AUTHORIZED_ADMINS = [
  "802soulkitchen@gmail.com",
  "scottkunian@gmail.com"
];
let loggedIn = false;
let currentUser = null;
let currentEvents = []; // To store the latest events list

const adminFab = document.getElementById('admin-fab');
const adminModal = document.getElementById('admin-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalCloseXBtn = document.getElementById('modal-close-x-btn');

const authSection = document.getElementById('auth-section');
const adminMainSection = document.getElementById('admin-main-section');
const googleSigninBtn = document.getElementById('google-signin-btn');
const logoutBtn = document.getElementById('logout-btn');
const authError = document.getElementById('auth-error');

adminFab.addEventListener('click', () => {
    adminModal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
    adminModal.classList.add('hidden');
});

modalCloseXBtn.addEventListener('click', () => {
    adminModal.classList.add('hidden');
});

// Also close modal if clicking on the background overlay
adminModal.addEventListener('click', (e) => {
    if (e.target === adminModal) {
        adminModal.classList.add('hidden');
    }
});

// Authentication state management
const isAuthorizedAdmin = (user) => {
    return user && AUTHORIZED_ADMINS.includes(user.email);
};

// Firebase Auth state listener
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (isAuthorizedAdmin(user)) {
        loggedIn = true;
        authError.textContent = '';
        authSection.classList.add('hidden');
        adminMainSection.classList.remove('hidden');
        showEventsTab(); // Show events tab by default
        renderEvents(currentEvents); // Re-render events without admin buttons
        renderEventsAdmin(currentEvents); // Show events in admin panel
        loadMenuItems(); // Load menu items
    } else {
        loggedIn = false;
        authSection.classList.remove('hidden');
        adminMainSection.classList.add('hidden');
        renderEvents(currentEvents); // Re-render events to hide admin buttons
        if (user && !isAuthorizedAdmin(user)) {
            authError.textContent = `Access denied. "${user.email}" is not authorized.`;
        }
    }
});

// Google Sign-in
googleSigninBtn.addEventListener('click', async () => {
    try {
        authError.textContent = '';
        await signInWithPopup(auth, provider);
        // onAuthStateChanged will handle the rest
    } catch (error) {
        console.error('Sign-in error:', error);
        authError.textContent = 'Sign-in failed. Please try again.';
    }
});

// Logout
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        adminModal.classList.remove('hidden'); // Show login modal after logout
    } catch (error) {
        console.error('Sign-out error:', error);
    }
});

// Tab Management
const eventsTab = document.getElementById('events-tab');
const menuTab = document.getElementById('menu-tab');
const eventsManagement = document.getElementById('events-management');
const menuManagement = document.getElementById('menu-management');

function showEventsTab() {
    eventsTab.classList.remove('bg-brand-dark/20', 'text-brand-dark');
    eventsTab.classList.add('bg-brand-red', 'text-white');
    menuTab.classList.remove('bg-brand-red', 'text-white');
    menuTab.classList.add('bg-brand-dark/20', 'text-brand-dark');

    eventsManagement.classList.remove('hidden');
    menuManagement.classList.add('hidden');
}

function showMenuTab() {
    menuTab.classList.remove('bg-brand-dark/20', 'text-brand-dark');
    menuTab.classList.add('bg-brand-red', 'text-white');
    eventsTab.classList.remove('bg-brand-red', 'text-white');
    eventsTab.classList.add('bg-brand-dark/20', 'text-brand-dark');

    menuManagement.classList.remove('hidden');
    eventsManagement.classList.add('hidden');
}

eventsTab.addEventListener('click', showEventsTab);
menuTab.addEventListener('click', showMenuTab);


// --- Firestore & Event Management ---
const eventsCollection = collection(db, "events");
const menuCollection = collection(db, "menu");
const eventsList = document.getElementById('events-list');
const menuContainer = document.getElementById('menu-container');

// Event Management Variables
const addEventBtn = document.getElementById('add-event-btn');
const eventForm = document.getElementById('event-form');
const eventsAdminList = document.getElementById('events-admin-list');
const cancelEventBtn = document.getElementById('cancel-event-btn');
const addDateTimeBtn = document.getElementById('add-datetime-btn');
const dateTimeEntries = document.getElementById('datetime-entries');

const eventIdInput = document.getElementById('event-id');
const eventNameInput = document.getElementById('event-name');
const eventLocationInput = document.getElementById('event-location');
const eventDescriptionInput = document.getElementById('event-description');
const saveEventBtn = document.getElementById('save-event-btn');

// Function to add a date/time entry
const addDateTimeEntry = (date = '', startTime = '', endTime = '') => {
    const entryId = 'datetime-' + Date.now();
    const entryDiv = document.createElement('div');
    entryDiv.className = 'flex gap-3 items-center p-3 bg-white rounded border border-brand-orange/20';
    entryDiv.innerHTML = `
        <div class="flex-1">
            <label class="block text-xs text-brand-dark mb-1">Date</label>
            <input type="date" class="datetime-date border border-brand-orange/30 p-2 rounded w-full text-brand-dark" value="${date}">
        </div>
        <div class="flex-1">
            <label class="block text-xs text-brand-dark mb-1">Start Time</label>
            <input type="time" class="datetime-start-time border border-brand-orange/30 p-2 rounded w-full text-brand-dark" value="${startTime}">
        </div>
        <div class="flex-1">
            <label class="block text-xs text-brand-dark mb-1">End Time</label>
            <input type="time" class="datetime-end-time border border-brand-orange/30 p-2 rounded w-full text-brand-dark" value="${endTime}">
        </div>
        <button type="button" class="remove-datetime text-red-600 hover:text-red-800 font-bold text-lg mt-5">×</button>
    `;

    // Add remove functionality
    entryDiv.querySelector('.remove-datetime').addEventListener('click', () => {
        entryDiv.remove();
    });

    dateTimeEntries.appendChild(entryDiv);
};

// Function to clear the event form
const clearEventForm = () => {
    eventIdInput.value = '';
    eventNameInput.value = '';
    eventLocationInput.value = '';
    eventDescriptionInput.value = '';
    dateTimeEntries.innerHTML = '';
    addDateTimeEntry(); // Add one empty entry by default
    saveEventBtn.textContent = 'Save Event';
    eventForm.classList.add('hidden');
};

// Function to get all date/time entries
const getDateTimeEntries = () => {
    const entries = [];
    dateTimeEntries.querySelectorAll('.datetime-date').forEach((dateInput, index) => {
        const startTimeInput = dateTimeEntries.querySelectorAll('.datetime-start-time')[index];
        const endTimeInput = dateTimeEntries.querySelectorAll('.datetime-end-time')[index];
        if (dateInput.value) {
            entries.push({
                date: dateInput.value,
                startTime: startTimeInput.value || '',
                endTime: endTimeInput.value || '',
                // Keep legacy 'time' field for backward compatibility with existing events
                time: startTimeInput.value && endTimeInput.value ?
                    `${startTimeInput.value}-${endTimeInput.value}` :
                    startTimeInput.value || endTimeInput.value || ''
            });
        }
    });
    return entries;
};

// Event form event listeners
addEventBtn.addEventListener('click', () => {
    clearEventForm();
    eventForm.classList.remove('hidden');
    eventNameInput.focus();
});

cancelEventBtn.addEventListener('click', clearEventForm);

addDateTimeBtn.addEventListener('click', () => {
    addDateTimeEntry();
});

// Save or Update Event
saveEventBtn.addEventListener('click', async () => {
    if (!loggedIn) {
        alert("Please log in first.");
        return;
    }

    const dateTimeData = getDateTimeEntries();

    if (!eventNameInput.value || !eventLocationInput.value || dateTimeData.length === 0) {
        alert('Please fill in the event name, location, and at least one date.');
        return;
    }

    const eventData = {
        name: eventNameInput.value,
        location: eventLocationInput.value,
        description: eventDescriptionInput.value,
        dateTimes: dateTimeData,
        // Keep first date for sorting compatibility
        date: dateTimeData[0].date
    };

    const id = eventIdInput.value;

    try {
        if (id) {
            // Update existing event
            const eventDoc = doc(db, "events", id);
            await updateDoc(eventDoc, eventData);
        } else {
            // Add new event
            await addDoc(eventsCollection, eventData);
        }
        clearEventForm();
    } catch (error) {
        console.error("Error saving event: ", error);
        alert("There was an error saving the event.");
    }
});


// Helper function to check if event is still active/future
const isEventActive = (event) => {
    const now = new Date();

    // Check if any date/time combination is still in the future
    return event.dateTimes.some(dt => {
        const eventDate = new Date(dt.date);

        // Check if we have structured time data
        if (dt.endTime) {
            // New structured format - use end time directly
            const [hours, minutes] = dt.endTime.split(':').map(Number);
            eventDate.setHours(hours, minutes, 0, 0);
            return eventDate > now;
        } else if (dt.startTime) {
            // Has start time but no end time - assume it lasts 1 hour
            const [hours, minutes] = dt.startTime.split(':').map(Number);
            eventDate.setHours(hours + 1, minutes, 0, 0);
            return eventDate > now;
        } else if (dt.time && dt.time.trim()) {
            // Legacy format - try to parse end time from time string (e.g., "9am-3pm" -> "3pm")
            const timeStr = dt.time.toLowerCase().trim();
            let endTime = null;

            // Look for patterns like "9am-3pm", "9:00-15:00", "9-3pm"
            const rangeMatch = timeStr.match(/.*?[-–—]\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/);
            if (rangeMatch) {
                const endTimeStr = rangeMatch[1];
                // Parse end time
                const timeMatch = endTimeStr.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
                if (timeMatch) {
                    let hours = parseInt(timeMatch[1]);
                    const minutes = parseInt(timeMatch[2] || '0');
                    const ampm = timeMatch[3];

                    if (ampm === 'pm' && hours !== 12) hours += 12;
                    if (ampm === 'am' && hours === 12) hours = 0;

                    eventDate.setHours(hours, minutes, 0, 0);
                    endTime = eventDate;
                }
            }

            // If we couldn't parse end time, assume event ends at 11:59 PM
            if (!endTime) {
                eventDate.setHours(23, 59, 59, 999);
                endTime = eventDate;
            }

            return endTime > now;
        } else {
            // No time specified, compare just the date (assume event runs all day)
            eventDate.setHours(23, 59, 59, 999);
            return eventDate > now;
        }
    });
};

// Render next event in sidebar
const renderSidebarNextEvent = (events) => {
    const sidebarNextEvent = document.getElementById('sidebar-next-event');
    if (!sidebarNextEvent) return;

    // Filter to show only active/future events
    const activeEvents = events.filter(isEventActive);

    if (activeEvents.length === 0) {
        sidebarNextEvent.innerHTML = `
            <div class="text-brand-white/70 italic">
                <p>No upcoming events scheduled.</p>
            </div>
        `;
        return;
    }

    // Get the next event (first in the filtered list)
    const nextEvent = activeEvents[0];

    // Format the first date/time
    let dateTimeHTML = '';
    if (nextEvent.dateTimes && nextEvent.dateTimes.length > 0) {
        const firstDateTime = nextEvent.dateTimes[0];
        const eventDate = new Date(firstDateTime.date + 'T00:00:00');
        const formattedDate = eventDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });

        dateTimeHTML = `
            <div class="flex items-center mb-2">
                <svg class="w-4 h-4 mr-2 text-brand-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span class="font-medium">${formattedDate}</span>
                ${firstDateTime.startTime && firstDateTime.endTime ?
                    `<span class="text-brand-orange ml-2">${firstDateTime.startTime}-${firstDateTime.endTime}</span>` :
                    firstDateTime.time ? `<span class="text-brand-orange ml-2">${firstDateTime.time}</span>` : ''
                }
            </div>
        `;
    }

    sidebarNextEvent.innerHTML = `
        <div class="bg-brand-dark/50 p-3 rounded-lg border border-brand-orange/20">
            <h4 class="font-bold text-brand-white mb-2">${nextEvent.name}</h4>
            ${dateTimeHTML}
            <div class="flex items-start mb-2">
                <svg class="w-4 h-4 mr-2 mt-0.5 text-brand-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 616 0z"></path>
                </svg>
                <span class="text-brand-white/90">${nextEvent.location}</span>
            </div>
            ${nextEvent.description ? `<p class="text-brand-white/80 text-xs leading-relaxed">${nextEvent.description}</p>` : ''}
        </div>
    `;
};

// Render events from Firestore
const renderEvents = (events) => {
    // Filter to show only active/future events
    const activeEvents = events.filter(isEventActive);

    // Update sidebar with next event
    renderSidebarNextEvent(events);

    eventsList.innerHTML = ''; // Clear current list
    if (activeEvents.length === 0) {
         eventsList.innerHTML = `<div class="glass-effect p-8 rounded-xl shadow-2xl text-center text-brand-white card-hover">
            <p class="text-lg font-medium">No upcoming events scheduled right now. Check back soon!</p>
        </div>`;
        return;
    }

    activeEvents.forEach((event, index) => {
        const eventElement = document.createElement('div');
        eventElement.className = 'glass-effect p-8 rounded-xl shadow-2xl card-hover slide-in';
        eventElement.style.animationDelay = `${index * 0.1}s`;

        // Handle both old single-date format and new multi-date format
        let dateTimeHTML = '';
        if (event.dateTimes && event.dateTimes.length > 0) {
            // New format with multiple dates/times
            event.dateTimes.forEach(dt => {
                const eventDate = new Date(dt.date + 'T00:00:00');
                const formattedDate = eventDate.toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                });

                dateTimeHTML += `
                    <div class="flex items-center text-lg text-brand-white font-medium mb-2">
                        <div class="w-8 h-8 mr-3 flex items-center justify-center bg-brand-red/10 rounded-lg">
                            <svg class="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        <span>${formattedDate}</span>
                        ${dt.startTime || dt.endTime ?
                            `<span class="text-brand-orange font-medium ml-4">
                                ${dt.startTime || ''}${dt.startTime && dt.endTime ? ' - ' : ''}${dt.endTime || ''}
                            </span>` :
                            dt.time ? `<span class="text-brand-orange font-medium ml-4">${dt.time}</span>` : ''
                        }
                    </div>
                `;
            });
        } else {
            // Old format compatibility
            const eventDate = new Date(event.date + 'T00:00:00');
            const formattedDate = eventDate.toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });

            dateTimeHTML = `
                <div class="flex items-center text-lg text-brand-white font-medium">
                    <div class="w-8 h-8 mr-3 flex items-center justify-center bg-brand-red/10 rounded-lg">
                        <svg class="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <span>${formattedDate}</span>
                </div>
                ${event.time ? `
                <div class="flex items-center text-lg text-brand-white font-medium">
                    <div class="w-8 h-8 mr-3 flex items-center justify-center bg-brand-orange/10 rounded-lg">
                        <svg class="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <span>${event.time}</span>
                </div>` : ''}
            `;
        }

        eventElement.innerHTML = `
            <h3 class="text-2xl font-bold mb-4 text-brand-orange">${event.name}</h3>
            <div class="mt-4 space-y-3">
                ${dateTimeHTML}
                <div class="flex items-center text-lg text-brand-white font-semibold">
                    <div class="w-8 h-8 flex items-center justify-center bg-brand-dark/10 rounded-lg">
                        <svg class="w-5 h-5 text-brand-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 616 0z"></path></svg>
                    </div>
                    <div class="flex items-center flex-1 -ml-5">
                        <span><span class="text-brand-red">Location:</span> ${event.location}</span>
                        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}" target="_blank" class="ml-4 bg-brand-red/20 hover:bg-brand-red text-brand-red hover:text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"></svg>
                            Directions
                        </a>
                    </div>
                </div>
            </div>
            ${event.description ? `<div class="mt-6 p-4 bg-brand-orange/20 rounded-lg">
                <p class="text-brand-white font-medium leading-relaxed">${event.description}</p>
            </div>` : ''}
        `;

        // No admin buttons on main page anymore - all event management is in admin panel

        eventsList.appendChild(eventElement);
    });
};

// Menu Management Variables
let currentMenuItems = [];
const menuItemsList = document.getElementById('menu-items-list');
const addMenuItemBtn = document.getElementById('add-menu-item-btn');
const menuItemForm = document.getElementById('menu-item-form');
const saveMenuItemBtn = document.getElementById('save-menu-item-btn');
const cancelMenuItemBtn = document.getElementById('cancel-menu-item-btn');

// Menu form elements
const menuItemIdInput = document.getElementById('menu-item-id');
const menuItemNameInput = document.getElementById('menu-item-name');
const menuItemDescriptionInput = document.getElementById('menu-item-description');
const menuItemCategoryInput = document.getElementById('menu-item-category');
const menuItemOrderInput = document.getElementById('menu-item-order');

// Render menu from Firestore
const renderMenu = (menuItems) => {
    if (!menuContainer) return;

    const categorizedItems = {};
    const categories = ['Mains', 'Combos', 'Sides', 'Drinks', 'Dessert'];

    // Group items by category
    menuItems.forEach(item => {
        if (!categorizedItems[item.category]) {
            categorizedItems[item.category] = [];
        }
        categorizedItems[item.category].push(item);
    });

    // Sort items within each category by order
    Object.keys(categorizedItems).forEach(category => {
        categorizedItems[category].sort((a, b) => (a.order || 0) - (b.order || 0));
    });

    let menuHTML = '';

    categories.forEach(category => {
        if (categorizedItems[category] && categorizedItems[category].length > 0) {
            if (category === 'Sides' && categories.slice(2).some(cat => categorizedItems[cat] && categorizedItems[cat].length > 0)) {
                // Start grid for Sides, Drinks, Dessert
                if (category === 'Sides') {
                    menuHTML += '<div class="grid md:grid-cols-3 gap-x-8 gap-y-6">';
                }
                menuHTML += '<div>';
            } else {
                menuHTML += '<div class="mb-6">';
            }

            menuHTML += `<h3 class="text-xl font-bold mb-2 border-b border-brand-orange/30 pb-2 text-brand-orange">${category}</h3>`;
            menuHTML += '<ul class="space-y-2 pt-2 text-brand-white">';

            categorizedItems[category].forEach(item => {
                menuHTML += '<li>';
                if (item.description) {
                    menuHTML += `<strong>${item.name}:</strong> ${item.description}`;
                } else {
                    menuHTML += item.name;
                }
                menuHTML += '</li>';
            });

            menuHTML += '</ul></div>';
        }
    });

    // Close grid if it was opened
    if (categories.slice(2).some(cat => categorizedItems[cat] && categorizedItems[cat].length > 0)) {
        menuHTML += '</div>';
    }

    menuContainer.innerHTML = menuHTML || '<p class="text-brand-white text-center">No menu items available.</p>';
};

// Render menu items for admin management
const renderMenuItems = (menuItems) => {
    if (!menuItemsList) return;

    menuItemsList.innerHTML = '';

    if (menuItems.length === 0) {
        menuItemsList.innerHTML = '<p class="text-brand-dark text-center">No menu items yet. Add some!</p>';
        return;
    }

    const categorizedItems = {};
    menuItems.forEach(item => {
        if (!categorizedItems[item.category]) {
            categorizedItems[item.category] = [];
        }
        categorizedItems[item.category].push(item);
    });

    Object.keys(categorizedItems).forEach(category => {
        categorizedItems[category].sort((a, b) => (a.order || 0) - (b.order || 0));

        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'mb-6';
        categoryDiv.innerHTML = `
            <h4 class="text-lg font-bold mb-3 text-brand-dark border-b border-brand-orange/30 pb-1">${category}</h4>
            <div class="space-y-2">
                ${categorizedItems[category].map(item => `
                    <div class="flex justify-between items-center p-3 border border-brand-orange/20 rounded-lg">
                        <div>
                            <span class="font-medium text-brand-dark">${item.name}</span>
                            ${item.description ? `<p class="text-sm text-brand-dark/70">${item.description}</p>` : ''}
                        </div>
                        <div class="flex gap-2">
                            <button class="edit-menu-btn text-brand-orange hover:text-brand-red text-sm" data-id="${item.id}">✏️ Edit</button>
                            <button class="delete-menu-btn text-brand-dark hover:text-red-600 text-sm" data-id="${item.id}">🗑️ Delete</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        menuItemsList.appendChild(categoryDiv);
    });

    // Add event listeners for edit and delete buttons
    menuItemsList.querySelectorAll('.edit-menu-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.target.getAttribute('data-id');
            editMenuItem(itemId);
        });
    });

    menuItemsList.querySelectorAll('.delete-menu-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.target.getAttribute('data-id');
            deleteMenuItem(itemId);
        });
    });
};

// Load menu items from Firestore
const loadMenuItems = () => {
    // Simple query without composite index requirement
    onSnapshot(collection(db, "menu"), (snapshot) => {
        currentMenuItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sort in JavaScript instead of Firestore
        currentMenuItems.sort((a, b) => {
            if (a.category !== b.category) {
                const categoryOrder = ['Mains', 'Combos', 'Sides', 'Drinks', 'Dessert'];
                return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
            }
            return (a.order || 0) - (b.order || 0);
        });

        renderMenu(currentMenuItems);
        if (loggedIn) {
            renderMenuItems(currentMenuItems);
        }
    });
};

// Render events for admin management
const renderEventsAdmin = (events) => {
    const eventsAdminList = document.getElementById('events-admin-list');
    if (!eventsAdminList) return;

    eventsAdminList.innerHTML = '';

    if (events.length === 0) {
        eventsAdminList.innerHTML = '<p class="text-brand-dark text-center">No events yet. Add some!</p>';
        return;
    }

    events.forEach(event => {
        const eventDate = new Date(event.date + 'T00:00:00');
        const formattedDate = eventDate.toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        const eventDiv = document.createElement('div');
        eventDiv.className = 'mb-4 p-3 border border-brand-orange/20 rounded-lg bg-white';
        eventDiv.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h5 class="font-bold text-brand-dark">${event.name}</h5>
                    <p class="text-sm text-brand-dark/70">${formattedDate}</p>
                    ${event.time ? `<p class="text-sm text-brand-dark/70">Time: ${event.time}</p>` : ''}
                    <p class="text-sm text-brand-dark/70">Location: ${event.location}</p>
                    ${event.description ? `<p class="text-sm text-brand-dark mt-1">${event.description}</p>` : ''}
                </div>
                <div class="flex gap-2 ml-4">
                    <button class="edit-event-btn text-brand-orange hover:text-brand-red text-sm font-medium" data-id="${event.id}">✏️ Edit</button>
                    <button class="delete-event-btn text-brand-dark hover:text-red-600 text-sm font-medium" data-id="${event.id}">🗑️ Delete</button>
                </div>
            </div>
        `;

        eventsAdminList.appendChild(eventDiv);
    });

    // Add event listeners for edit and delete buttons
    eventsAdminList.querySelectorAll('.edit-event-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const eventId = e.target.getAttribute('data-id');
            editEventAdmin(eventId);
        });
    });

    eventsAdminList.querySelectorAll('.delete-event-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const eventId = e.target.getAttribute('data-id');
            deleteEventAdmin(eventId);
        });
    });
};

// Edit event in admin panel
const editEventAdmin = (eventId) => {
    const event = currentEvents.find(event => event.id === eventId);
    if (event) {
        eventIdInput.value = event.id;
        eventNameInput.value = event.name;
        eventLocationInput.value = event.location;
        eventDescriptionInput.value = event.description;

        // Clear existing date/time entries
        dateTimeEntries.innerHTML = '';

        // Add date/time entries
        if (event.dateTimes && event.dateTimes.length > 0) {
            // New format with multiple dates/times
            event.dateTimes.forEach(dt => {
                let startTime = dt.startTime || '';
                let endTime = dt.endTime || '';

                // Parse legacy time format if structured times don't exist
                if (!startTime && !endTime && dt.time) {
                    const timeRange = dt.time.match(/(\d{2}:\d{2})-(\d{2}:\d{2})/);
                    if (timeRange) {
                        startTime = timeRange[1];
                        endTime = timeRange[2];
                    }
                }

                addDateTimeEntry(dt.date, startTime, endTime);
            });
        } else {
            // Old format compatibility
            addDateTimeEntry(event.date, '', '');
        }

        saveEventBtn.textContent = 'Update Event';
        eventForm.classList.remove('hidden');
        eventNameInput.focus();
    }
};

// Delete event in admin panel
const deleteEventAdmin = async (eventId) => {
    const event = currentEvents.find(event => event.id === eventId);
    if (event && window.confirm(`Are you sure you want to delete the event "${event.name}"?`)) {
        try {
            await deleteDoc(doc(db, "events", eventId));
        } catch (error) {
            console.error("Error deleting event: ", error);
            alert("Failed to delete event.");
        }
    }
};

// Listen for real-time updates
const q = query(collection(db, "events"), orderBy("date", "asc"));
onSnapshot(q, (snapshot) => {
    currentEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderEvents(currentEvents);
    if (loggedIn) {
        renderEventsAdmin(currentEvents);
    }
});

// Menu CRUD Operations
const clearMenuForm = () => {
    menuItemIdInput.value = '';
    menuItemNameInput.value = '';
    menuItemDescriptionInput.value = '';
    menuItemCategoryInput.value = '';
    menuItemOrderInput.value = '';
    saveMenuItemBtn.textContent = 'Save Item';
    menuItemForm.classList.add('hidden');
};

const editMenuItem = (itemId) => {
    const item = currentMenuItems.find(item => item.id === itemId);
    if (item) {
        menuItemIdInput.value = item.id;
        menuItemNameInput.value = item.name;
        menuItemDescriptionInput.value = item.description || '';
        menuItemCategoryInput.value = item.category;
        menuItemOrderInput.value = item.order || '';
        saveMenuItemBtn.textContent = 'Update Item';
        menuItemForm.classList.remove('hidden');
        menuItemNameInput.focus();
    }
};

const deleteMenuItem = async (itemId) => {
    const item = currentMenuItems.find(item => item.id === itemId);
    if (item && window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
        try {
            await deleteDoc(doc(db, "menu", itemId));
        } catch (error) {
            console.error("Error deleting menu item: ", error);
            alert("Failed to delete menu item.");
        }
    }
};

// Menu form event listeners
addMenuItemBtn.addEventListener('click', () => {
    clearMenuForm();
    menuItemForm.classList.remove('hidden');
    menuItemNameInput.focus();
});

cancelMenuItemBtn.addEventListener('click', clearMenuForm);

saveMenuItemBtn.addEventListener('click', async () => {
    if (!loggedIn) {
        alert("Please log in first.");
        return;
    }

    const itemData = {
        name: menuItemNameInput.value.trim(),
        description: menuItemDescriptionInput.value.trim(),
        category: menuItemCategoryInput.value,
        order: parseInt(menuItemOrderInput.value) || 0,
    };

    if (!itemData.name || !itemData.category) {
        alert('Please fill in the item name and select a category.');
        return;
    }

    const id = menuItemIdInput.value;

    try {
        if (id) {
            // Update existing item
            await updateDoc(doc(db, "menu", id), itemData);
        } else {
            // Add new item
            await addDoc(collection(db, "menu"), itemData);
        }
        clearMenuForm();
    } catch (error) {
        console.error("Error saving menu item: ", error);
        alert("There was an error saving the menu item.");
    }
});

// Photo gallery functionality with cycling
let availablePhotos = [];
let currentPhotoIndex = 0;
const photosPerPage = 6;

const loadAvailablePhotos = async () => {
    const photoExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const maxPhotos = 50; // Check up to 50 photos
    availablePhotos = [];

    // Check for available photos
    for (let i = 1; i <= maxPhotos; i++) {
        for (const ext of photoExtensions) {
            const photoPath = `PHOTOS/${i}.${ext}`;

            try {
                const img = new Image();
                const photoExists = await new Promise((resolve) => {
                    img.onload = () => resolve(true);
                    img.onerror = () => resolve(false);
                    img.src = photoPath;
                });

                if (photoExists) {
                    availablePhotos.push(photoPath);
                    break; // Found this number, move to next
                }
            } catch (error) {
                // Photo doesn't exist, continue
            }
        }
    }

    if (availablePhotos.length > 0) {
        initializePhotoGallery();
    }
};

const displayPhotos = (startIndex = 0) => {
    const photoGallery = document.getElementById('photo-gallery');
    if (!photoGallery || availablePhotos.length === 0) return;

    // Keep header
    const header = photoGallery.querySelector('h3');
    const existingPhotosContainer = photoGallery.querySelector('.photos-container');

    // Prepare photos to show
    const photosToShow = [];
    for (let i = 0; i < photosPerPage && i < availablePhotos.length; i++) {
        const photoIndex = (startIndex + i) % availablePhotos.length;
        photosToShow.push(availablePhotos[photoIndex]);
    }

    // Create new photos container
    const newPhotosContainer = document.createElement('div');
    newPhotosContainer.className = 'space-y-4 photos-container opacity-0 transition-all duration-1000 ease-in-out';

    // Add photos to new container
    photosToShow.forEach((photoPath, index) => {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-all duration-500 card-hover transform translate-y-4 opacity-0';
        photoDiv.style.transitionDelay = `${index * 150}ms`;
        photoDiv.innerHTML = `
            <img src="${photoPath}" alt="802 Soul Kitchen Photo" class="w-full h-48 object-cover transition-all duration-700">
        `;
        newPhotosContainer.appendChild(photoDiv);
    });

    if (existingPhotosContainer) {
        // Create beautiful crossfade transition

        // Position new container behind existing one
        newPhotosContainer.style.position = 'absolute';
        newPhotosContainer.style.top = '0';
        newPhotosContainer.style.left = '0';
        newPhotosContainer.style.right = '0';
        newPhotosContainer.style.zIndex = '1';

        // Make existing container positioned for layering
        existingPhotosContainer.style.position = 'relative';
        existingPhotosContainer.style.zIndex = '2';

        // Add new container behind existing one
        photoGallery.appendChild(newPhotosContainer);

        // Start the beautiful crossfade
        requestAnimationFrame(() => {
            // Immediately start fading in new photos with staggered entrance
            newPhotosContainer.classList.remove('opacity-0');
            newPhotosContainer.classList.add('opacity-100');

            const newPhotos = newPhotosContainer.querySelectorAll('.card-hover');
            newPhotos.forEach((photo, index) => {
                setTimeout(() => {
                    photo.classList.remove('opacity-0', 'translate-y-4');
                    photo.classList.add('opacity-100', 'translate-y-0');
                }, index * 150); // Slightly faster entrance
            });

            // Simultaneously fade out old photos with dreamy effect
            const existingPhotos = existingPhotosContainer.querySelectorAll('.card-hover');
            existingPhotos.forEach((photo, index) => {
                setTimeout(() => {
                    photo.style.transition = 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    photo.style.opacity = '0';
                    photo.style.transform = 'translateY(-20px) scale(0.95)';
                    photo.style.filter = 'blur(8px)';
                }, index * 120 + 800); // Start after new photos begin appearing
            });

            // Clean up after crossfade completes
            setTimeout(() => {
                // Remove old container and reset positioning
                existingPhotosContainer.remove();
                newPhotosContainer.style.position = 'static';
                newPhotosContainer.style.zIndex = 'auto';
            }, 2500); // Wait for all transitions to complete
        });

    } else {
        // First load - no existing photos to transition from
        photoGallery.innerHTML = '';
        if (header) photoGallery.appendChild(header);
        photoGallery.appendChild(newPhotosContainer);

        // Gentle initial appearance
        setTimeout(() => {
            newPhotosContainer.classList.remove('opacity-0');
            newPhotosContainer.classList.add('opacity-100');

            const photos = newPhotosContainer.querySelectorAll('.card-hover');
            photos.forEach((photo, index) => {
                setTimeout(() => {
                    photo.classList.remove('opacity-0', 'translate-y-4');
                    photo.classList.add('opacity-100', 'translate-y-0');
                }, index * 250 + 200); // Soulful staggered entrance
            });
        }, 100);

        // No manual controls - auto-cycling only
    }
};

const addGalleryControls = () => {
    const photoGallery = document.getElementById('photo-gallery');
    if (!photoGallery) return;

    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'gallery-controls flex justify-between items-center mt-4 px-2';
    controlsDiv.innerHTML = `
        <button id="prev-photos" class="bg-brand-red/20 hover:bg-brand-red text-brand-red hover:text-white px-3 py-2 rounded-lg text-sm transition-all duration-300">
            ← Prev
        </button>
        <div class="text-brand-white/70 text-sm">
            <span id="photo-counter">${Math.ceil((currentPhotoIndex + 1) / photosPerPage)} / ${Math.ceil(availablePhotos.length / photosPerPage)}</span>
        </div>
        <button id="next-photos" class="bg-brand-red/20 hover:bg-brand-red text-brand-red hover:text-white px-3 py-2 rounded-lg text-sm transition-all duration-300">
            Next →
        </button>
    `;

    photoGallery.appendChild(controlsDiv);

    // Add event listeners
    document.getElementById('prev-photos').addEventListener('click', () => {
        currentPhotoIndex = (currentPhotoIndex - photosPerPage + availablePhotos.length) % availablePhotos.length;
        displayPhotos(currentPhotoIndex);
    });

    document.getElementById('next-photos').addEventListener('click', () => {
        currentPhotoIndex = (currentPhotoIndex + photosPerPage) % availablePhotos.length;
        displayPhotos(currentPhotoIndex);
    });
};

const initializePhotoGallery = () => {
    displayPhotos(0);

    // Auto-cycle every 8 seconds if there are more photos than displayed
    if (availablePhotos.length > photosPerPage) {
        setInterval(() => {
            currentPhotoIndex = (currentPhotoIndex + photosPerPage) % availablePhotos.length;
            displayPhotos(currentPhotoIndex);
        }, 8000);
    }
};

const loadPhotoGallery = () => {
    loadAvailablePhotos();
};

// Initialize the application
loadMenuItems();
loadPhotoGallery();