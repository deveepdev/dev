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
    },
    civic: {
        "--background": "#050607",        // near-black (matches background)
        "--primary": "#1a1d20",           // deep charcoal (body shadows)
        "--secondary": "#2c3136",         // mid gray (body panels)
        "--accent": "#6b7280",            // metallic highlight (edges/reflections)
        "--border": "rgba(255, 255, 255, 0.06)",
        "--red": "#ff3b3b",               // sharper red (taillight vibe)
        "--text": "#f1f5f9"               // crisp white for contrast
    }
    // civic: {
    //     // The --background property uses both an image and a fallback color (#0f1418).
    //     // If the image fails to load, the fallback color will be used.
    //     "--background": "#0f1418",
    //     "--primary": "#5f6f7a",           // main body gray-blue
    //     "--secondary": "#7f919d",         // lighter metallic tone
    //     "--accent": "#a9bcc8",            // highlight/reflection color
    //     "--border": "rgba(255, 255, 255, 0.08)",
    //     "--red": "#d94b4b",               // slightly muted red to match tone
    //     "--text": "#e3eaf0"               // soft white (not harsh)
    // }
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
    if (nextTheme === "civic") {
        document.querySelector(".civic").style.display = "block";
    } else {
        document.querySelector(".civic").style.display = "none";
    }
    button.textContent = `Color Scheme: ${nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1)}`;
});