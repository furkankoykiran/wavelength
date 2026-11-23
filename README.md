# 🌊 Wavelength

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/furkankoykiran/wavelength/actions/workflows/ci.yml/badge.svg)](https://github.com/furkankoykiran/wavelength/actions/workflows/ci.yml)

> 🎮 The mind-reading party game in your browser!

![Wavelength Logo](images/logo.png)

**Play: [furkankoykiran.com.tr/wavelength](https://furkankoykiran.com.tr/wavelength/)**

## 📖 About

Wavelength is a digital adaptation of the popular mind-reading party game. Players try to read their teammates' minds by guessing where on a spectrum a hidden target is located based on clues provided by their team captain.

## 🌐 Supported Languages

Wavelength currently supports 10 languages:

- 🇺🇸 English
- 🇹🇷 Turkish (Türkçe)
- 🇪🇸 Spanish (Español)
- 🇨🇳 Chinese (中文)
- 🇮🇳 Hindi (हिन्दी)
- 🇧🇷 Portuguese (Português)
- 🇧🇩 Bengali (বাংলা)
- 🇷🇺 Russian (Русский)
- 🇯🇵 Japanese (日本語)
- 🇻🇳 Vietnamese (Tiếng Việt)

## 🎯 How to Play

1. Form teams (1-8 teams supported)
2. The active player sees two opposite concepts on a spectrum
3. The player knows where the target is on the spectrum and gives a clue
4. Teammates try to guess the target location by moving the needle
5. Points are awarded based on how close the guess is to the target
6. Teams take turns until the game ends

## ⚙️ Features

- 🎨 Light/Dark theme toggle
- 🌍 Multiple language support
- 📱 Responsive design for all devices
- 🎲 Random concept generation
- 📊 Real-time scoring

## 🚀 Getting Started

### Play Online

Visit [https://furkankoykiran.com.tr/wavelength/](https://furkankoykiran.com.tr/wavelength/) to play the game directly in your browser.

### Run Locally

To run the game locally:

```bash
# Clone the repository
git clone https://github.com/furkankoykiran/wavelength.git

# Navigate to the project directory
cd wavelength

# Open index.html in your browser
# You can use any local server or simply open the file directly
```

No build process or dependencies required! Simply open `index.html` in any modern web browser.

## 🧰 Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- No external libraries or frameworks

## 🔍 SEO, AI discovery and checks

- Descriptive title and description, canonical URL, Open Graph and Twitter cards with a generated 1200×630 `og-image.png`.
- `WebApplication` + `Game` JSON-LD with author, licence and repository links.
- `robots.txt`, `sitemap.xml`, `llms.txt`, `ai.txt`, `.well-known/security.txt` and a web manifest in the repository root.
- `document.documentElement.lang` and `document.title` follow the language picker.
- `.nojekyll` keeps GitHub Pages from hiding `.well-known/` and other dot paths.
- `node scripts/verify-site.mjs` (also run by CI) checks the metadata, the discovery files and that every local asset referenced by `index.html` exists.

`robots.txt` is only authoritative at a host root. On
`furkankoykiran.com.tr/wavelength/` the portfolio's root `robots.txt` wins; the
file here keeps the repository self-contained for standalone deployments.

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

Furkan Köykıran - [Website](https://furkankoykiran.com.tr)

Project Link: [https://github.com/furkankoykiran/wavelength](https://github.com/furkankoykiran/wavelength)