const button = document.querySelector(".color-scheme-button");

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
    }
};
// 1. Get an array of the theme names ['classic', 'dark', 'light']
const schemeNames = Object.keys(schemes);

// --- 1. THE APPLY FUNCTION ---
// A reusable function to apply a scheme by name
const applyScheme = (name) => {
    const root = document.documentElement;
    const colors = schemes[name];
    
    for (const [prop, value] of Object.entries(colors)) {
        root.style.setProperty(prop, value);
    }
    
    // Save to local storage
    localStorage.setItem("selected-theme", name);
};

// --- 2. THE INITIALIZATION ---
// When the script runs, check if there's a saved theme; 
// otherwise, default to 'classic'
const savedTheme = localStorage.getItem("selected-theme") || "classic";
let currentIndex = schemeNames.indexOf(savedTheme);
applyScheme(savedTheme);

// --- 3. THE EVENT LISTENER ---
button.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % schemeNames.length;
    const nextTheme = schemeNames[currentIndex];
    applyScheme(nextTheme);
    button.textContent = `Color Scheme: ${nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1)}`;
});