    /* ---------- SIDE MENU LOGIC ---------- */
const menuBtn = document.getElementById('menuBtn');
const sideMenu = document.getElementById('sideMenu');
const menuOverlay = document.getElementById('menuOverlay');
const closeMenuBtn = document.getElementById('closeMenuBtn');

function toggleSideMenu() {
    if (!sideMenu || !menuOverlay) return;
    const isOpen = sideMenu.classList.toggle('open');
    menuOverlay.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

menuBtn?.addEventListener('click', toggleSideMenu);
closeMenuBtn?.addEventListener('click', toggleSideMenu);
menuOverlay?.addEventListener('click', toggleSideMenu);
menuOverlay.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleSideMenu();
});
/* ---------- CREATE MULTI-ROW UI ---------- */
function createRow(size, key) {
    return `
    <div class="card" data-size="${key}">
        <h2>${size}</h2>

        <div class="rows"></div>

        <button type="button" class="addRowBtn">+ Add Row</button>
    </div>`;
}

function createEntry(key) {
    return `
    <div class="grid entry">

        <label>Trays</label>
        <div class="number-control">
            <button type="button" data-action="dec">-</button>
            <input type="number" name="tray${key}" min="0">
            <button type="button" data-action="inc">+</button>
        </div>

        <label>Dough</label>
        <div class="number-control">
            <button type="button" data-action="dec">-</button>
            <input type="number" name="dough${key}" min="0">
            <button type="button" data-action="inc">+</button>
        </div>

        <label>Date</label>
        <select name="date${key}">
            <option value="N/A">Select</option>
            <option value="Lun-Sam">Lun-Sam</option>
            <option value="Mar-Dim">Mar-Dim</option>
            <option value="Mer-Lun">Mer-Lun</option>
            <option value="Jeu-Mar">Jeu-Mar</option>
            <option value="Ven-Mer">Ven-Mer</option>
            <option value="Sam-Jeu">Sam-Jeu</option>
            <option value="Dim-Ven">Dim-Ven</option>
        </select>

        <button type="button" class="removeRow">✕</button>

    </div>`;
}

const inputsDiv = document.getElementById("inputs");

inputsDiv.innerHTML =
    createRow(10+"\"",10) +
    createRow(12+"\"",12) +
    createRow(14+"\"",14) +
    createRow(16+"\"",16) +
    createRow("PAN","Pan");

/* Add default row to each */
document.querySelectorAll(".card").forEach(card => {
    const key = card.dataset.size;
    const rows = card.querySelector(".rows");
    rows.innerHTML = createEntry(key);
});

/* ---------- ADD / REMOVE ROW ---------- */
document.addEventListener("click", e => {

    /* Add row */
    if (e.target.classList.contains("addRowBtn")) {
    const card = e.target.closest(".card");
    const key = card.dataset.size;
    const rows = card.querySelector(".rows");

    // set current height
    rows.style.maxHeight = rows.scrollHeight + "px";

    // add row
    rows.insertAdjacentHTML("beforeend", createEntry(key));

    // force reflow (important)
    rows.offsetHeight;

    // animate to new height
    rows.style.maxHeight = rows.scrollHeight + "px";
}

    /* Remove row */
    if (e.target.classList.contains("removeRow")) {
    const entry = e.target.closest(".entry");
    const rows = entry.parentElement;

    // set current height
    rows.style.maxHeight = rows.scrollHeight + "px";

    // remove
    entry.remove();

    // force reflow
    rows.offsetHeight;

    // animate shrink
    rows.style.maxHeight = rows.scrollHeight + "px";

    calc();
}

    /* +/- buttons */
    if (e.target.dataset.action) {
        const input = e.target.parentElement.querySelector("input");
        let value = parseInt(input.value) || 0;

        if (e.target.dataset.action === "inc") value++;
        else value = Math.max(0, value - 1);

        input.value = value;
        calc();
    }
});

/* HOLD WITH ACCELERATION (MOBILE + DESKTOP) */
let holdTimeout;
let holdInterval;
let speed = 120;
let currentTarget = null;

function startHold(target) {
    if (!target.dataset.action) return;

    currentTarget = target;
    speed = 120;

    holdTimeout = setTimeout(() => {
        holdInterval = setInterval(() => {
            currentTarget.click();

            // accelerate
            if (speed > 30) {
                speed -= 10;
                clearInterval(holdInterval);
                holdInterval = setInterval(() => {
                    currentTarget.click();
                }, speed);
            }

        }, speed);
    }, 300);
}

function stopHold() {
    clearTimeout(holdTimeout);
    clearInterval(holdInterval);
    currentTarget = null;
}

/* Desktop */
document.addEventListener("mousedown", e => startHold(e.target));
document.addEventListener("mouseup", stopHold);
document.addEventListener("mouseleave", stopHold);

/* Mobile */
document.addEventListener("touchstart", e => {
    const target = e.target;
    startHold(target);
}, { passive: true });

document.addEventListener("touchend", stopHold);
document.addEventListener("touchcancel", stopHold);

/* ---------- DATA ---------- */
const traySizes = {10:10,12:8,14:6,16:5,pan:8};

const dates_hours = {
    'Lun-Sam': {0:"N/A",1:"2/6",2:"2/4",3:"1/2",4:"0/1",5:"0/1-2",6:"0/0"},
    'Mar-Dim': {0:"0/0",1:"N/A",2:"2/6",3:"2/4",4:"1/2",5:"0/1",6:"0/1-2"},
    'Mer-Lun': {0:"0/1-2",1:"0/0",2:"N/A",3:"2/6",4:"2/4",5:"1/2",6:"0/1"},
    'Jeu-Mar': {0:"0/1",1:"0/1-2",2:"0/0",3:"N/A",4:"2/6",5:"2/4",6:"1/2"},
    'Ven-Mer': {0:"1/2",1:"0/1",2:"0/1-2",3:"0/0",4:"N/A",5:"2/6",6:"2/4"},
    'Sam-Jeu': {0:"2/4",1:"1/2",2:"0/1",3:"0/1-2",4:"0/0",5:"N/A",6:"2/6"},
    'Dim-Ven': {0:"2/6",1:"2/4",2:"1/2",3:"0/1",4:"0/1-2",5:"0/0",6:"N/A"},
    'N/A': {0:"--",1:"--",2:"--",3:"--",4:"--",5:"--",6:"--"}
};

const form = document.getElementById("form");
const results = document.getElementById("results");

/* ---------- CALC ---------- */

function calc() {
    const today = new Date().getDay();
    let rows = "";

    function processSize(key, traySize, label) {
        const card = document.querySelector(`[data-size="${key}"]`);
        let grouped = {};

        card.querySelectorAll(".entry").forEach(entry => {
            const trays = parseInt(entry.querySelector(`[name="tray${key}"]`).value) || 0;
            const dough = parseInt(entry.querySelector(`[name="dough${key}"]`).value) || 0;
            const date = entry.querySelector(`[name="date${key}"]`).value;

            if (date === "N/A") return;

            const total = trays * traySize + dough;

            if (!grouped[date]) grouped[date] = 0;
            grouped[date] += total;
        });

        Object.entries(grouped).forEach(([date, total]) => {
            const hours = dates_hours[date]?.[today] || "--";

            rows += `
                <div class="result-row">
                    <div class="col-size">${label}"</div>
                    <div class="col-date">${date}</div>
                    <div class="col-total">${total}</div>
                    <div class="col-hours">${hours}</div>
                </div>
            `;
        });
    }

    processSize(10,10,10);
    processSize(12,8,12);
    processSize(14,6,14);
    processSize(16,5,16);
    processSize("Pan",8,"PAN");

    if (!rows) {
        results.innerHTML = `<div class="empty">— No data —</div>`;
        return;
    }

    results.innerHTML = `
        <div class="result-header">
            <div>Size</div>
            <div>Date</div>
            <div style="text-align:right;">Qty</div>
            <div style="text-align:right;">Time</div>
        </div>
        ${rows}
    `;
}

const loadBtn = document.getElementById("loadBtn");
const clearBtn = document.getElementById("clearBtn");

/* ---------- SAVE DATA ---------- */
function saveData() {
    const data = [];

    document.querySelectorAll(".entry").forEach(entry => {
        const inputs = entry.querySelectorAll("input, select");

        const row = {};
        inputs.forEach(input => {
            row[input.name] = input.value;
        });

        data.push(row);
    });

    localStorage.setItem("doughData", JSON.stringify(data));
}

/* ---------- LOAD DATA ---------- */
function loadData() {
    const data = JSON.parse(localStorage.getItem("doughData") || "[]");

    if (!data.length) return;

    // Clear existing rows
    document.querySelectorAll(".rows").forEach(r => r.innerHTML = "");

    data.forEach(row => {
        const key = Object.keys(row)[0].replace(/[^\dA-Za-z]/g, "").replace("tray", "");

        const card = document.querySelector(`[data-size="${key}"]`);
        if (!card) return;

        const rowsDiv = card.querySelector(".rows");
        rowsDiv.insertAdjacentHTML("beforeend", createEntry(key));

        const newEntry = rowsDiv.lastElementChild;

        Object.entries(row).forEach(([name, value]) => {
            const input = newEntry.querySelector(`[name="${name}"]`);
            if (input) input.value = value;
        });
    });

    calc();
}

/* ---------- CLEAR DATA ---------- */
function clearData() {
    // localStorage.removeItem("doughData");

    document.querySelectorAll(".rows").forEach(rows => {
        const key = rows.closest(".card").dataset.size;
        rows.innerHTML = createEntry(key); // reset to 1 row
    });

    calc();
}

/* ---------- EVENTS ---------- */
loadBtn.addEventListener("click", loadData);
clearBtn.addEventListener("click", clearData);

/* Auto-save on change */
form.addEventListener("input", saveData);

form.addEventListener("input", calc);
calc();

// rows.addEventListener("transitionend", () => {
//     rows.style.maxHeight = "none";
// }, { once: true });

let deferredPrompt;
const installBtn = document.getElementById("installBtn");

installBtn.style.display = "none";

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = "block";
});

installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) {
        alert("Install not available");
        return;
}

deferredPrompt.prompt();

const result = await deferredPrompt.userChoice;

if (result.outcome === "accepted") {
    console.log("Installed");
}

deferredPrompt = null;
    installBtn.style.display = "none";
});

window.addEventListener("appinstalled", () => {
    installBtn.style.display = "none";
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("../sw.js")
    .then(() => console.log("SW registered"))
    .catch(err => console.log("SW error:", err));
}