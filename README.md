# FMMosquit

Simple React demo that plays an FM-modulated tone intended for mosquito repellence.
Users can start or stop the sound, log feedback, view submissions on a world map,
and export the collected feedback.

## Features
- FM synthesis with adjustable modulation index
- Animated mosquito icon
- Local feedback logging with export
- Leaflet map with markers for feedback
- Twitter sharing link after feedback submission
- Buy Me A Coffee support link

## Development
This project has no build step.  All dependencies are loaded from CDNs.

1. Open `index.html` in a browser, or run a small static server:
   ```bash
   npx serve .
   ```
2. Visit `http://localhost:3000` and interact with the app.

## Deploying to GitHub Pages
Push this repository to GitHub and enable GitHub Pages for the `main` branch.
The app will be served from `https://<your-username>.github.io/FMMosquit/`.

## Exported Feedback
Click **Export Feedback** to download a `feedback.json` file containing
all feedback entries collected in the current session.

## License
MIT
