const button = document.querySelector(".color-scheme-button");
const civic = document.querySelector(".civic");

const wrapper = document.querySelector(".civic-wrapper");
const rims = document.querySelectorAll(".rim");

let animationId = null;
let isCivicActive = false;
let civicX = -200;

const schemes = {
    classic: {
        "--background": "#000d13",
        "--primary": "#003146",
        "--secondary": "#003951",
        "--accent": "#0284c7",
        "--border": "rgba(255, 255, 255, 0.1)",
        "--red": "#ef4444",
        "--text": "#e6edf3"
    },
    dark: {
        "--background": "#0b141a",
        "--primary": "#10232b",
        "--secondary": "#13313b",
        "--accent": "#13313b",
        "--border": "rgba(255, 255, 255, 0.05)",
        "--red": "#ef4444",
        "--text": "#e6edf3"
    },
    light: {
        "--background": "#91b9e1",
        "--primary": "#d1e3f0",
        "--secondary": "#8ec4e3",
        "--accent": "#4aabdc",
        "--border": "rgba(0, 0, 0, 0.1)",
        "--red": "#ec7f7f",
        "--text": "#0b141a"
    },
    civic: {
        "--background": "#050607",
        "--primary": "#1a1d20",
        "--secondary": "#2c3136",
        "--accent": "#6b7280",
        "--border": "rgba(255, 255, 255, 0.06)",
        "--red": "#ff3b3b",
        "--text": "#f1f5f9"
    }
};

const schemeNames = Object.keys(schemes);

const applyScheme = (name) => {
    const root = document.documentElement;
    const colors = schemes[name];

    for (const [prop, value] of Object.entries(colors)) {
        root.style.setProperty(prop, value);
    }

    localStorage.setItem("selected-theme", name);

    // ✅ ADD THIS LINE RIGHT HERE
    document.body.classList.toggle("civic-active", name === "civic");

    // 🚗 Handle civic activation
    if (name === "civic") {
        isCivicActive = true;
        document.querySelector(".header h1").textContent = "Honda Civic Proofing";

        if (!animationId) {
            civicloop();
        }
    } else {
        isCivicActive = false;
        document.querySelector(".header h1").textContent = "Dough Proofing";

        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }
};

// --- INIT ---
const savedThemeRaw = localStorage.getItem("selected-theme");
const savedTheme = schemeNames.includes(savedThemeRaw) ? savedThemeRaw : "classic";
let currentIndex = schemeNames.indexOf(savedTheme);
applyScheme(savedTheme);

// --- BUTTON ---
button.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % schemeNames.length;
    const nextTheme = schemeNames[currentIndex];
    applyScheme(nextTheme);

    button.textContent = `Color Scheme: ${nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1)}`;
});
function civicloop() {
    if (!isCivicActive) return;

    // 🚗 move entire car + rims together
    wrapper.style.transform = `translate(${civicX}%, -100%)`;

    // 🛞 spin rims based on movement (feels realistic)
    const rotation = civicX * 12.2/1.5;

    rims.forEach(rim => {
        rim.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
    });

    civicX += 0.2;
    if (civicX > 150) civicX = -200;

    animationId = requestAnimationFrame(civicloop);
}