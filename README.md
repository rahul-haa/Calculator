# 🧮 Calculator — Premium Glass UI

A beautifully designed calculator web application featuring a **glassmorphism UI** with animated backgrounds, smooth micro-interactions, dark/light theme support, and full keyboard input.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## ✨ Features

- **Glassmorphism Design** — Frosted glass effect with backdrop blur and translucent layers
- **Animated Background** — Floating gradient orbs that move smoothly behind the calculator
- **Dark / Light Theme** — Toggle between themes with smooth transitions, persisted via `localStorage`
- **Calculation History** — View, reuse, and clear past calculations (stored in `localStorage`)
- **Keyboard Support** — Full keyboard input with visual button feedback
- **Ripple Effects** — Material-style ripple animation on every button click
- **Responsive** — Works seamlessly on desktop, tablet, and mobile devices
- **Extra Functions** — Percentage (%), toggle sign (±), and backspace support

---

## 🚀 Getting Started

### Option 1: Open directly
Simply open `index.html` in any modern browser:

```bash
open index.html
```

### Option 2: Use a local server
```bash
# Python 3
python3 -m http.server 8080

# Then visit http://localhost:8080
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `0` – `9` | Input numbers |
| `+` `-` `*` `/` | Operators |
| `.` | Decimal point |
| `Enter` or `=` | Calculate result |
| `Backspace` | Delete last digit |
| `Escape` or `Delete` | Clear all |
| `%` | Percentage |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic structure |
| **CSS3** | Glassmorphism, animations, CSS Grid, custom properties |
| **JavaScript** | Calculator logic, history, theming, ripple effects |
| **Google Fonts** | Outfit + JetBrains Mono typography |

---

## 📁 Project Structure

```
Calculator/
├── index.html            # Main HTML file
├── styles/
│   └── style.css         # Unified stylesheet (dark + light themes)
├── scripts/
│   └── script.js         # Calculator logic & interactions
├── assets/
│   └── calculator.ico    # Favicon
└── README.md             # This file
```

---

## 📄 License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).
