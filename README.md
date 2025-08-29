# FMMosquit

React demo that plays an FM‑modulated tone intended for mosquito repellence.
Users can start or stop the sound, log feedback, view submissions on a world
map, and export collected feedback.

## Features
- FM synthesis with adjustable modulation index
- Animated mosquito icon
- Local feedback logging with export
- Leaflet map with markers for feedback
- Twitter sharing link after feedback submission
- Buy Me A Coffee support link

## Development
This project uses [Vite](https://vitejs.dev/) with React 18.

```bash
npm install
npm run dev # start development server
npm run build # build for production (GitHub Pages)
```

## Deploying to GitHub Pages
The project builds to the `dist` folder. Push the `dist` contents to the
`gh-pages` branch or configure GitHub Pages to serve from the `dist` directory
of the main branch. The `homepage` field in `package.json` is set to
`https://kg-ninja.github.io/FMMosquit`.

## Exported Feedback
Click **Export Feedback** to download a `feedback.json` file containing all
feedback entries collected in the current session.

## License
MIT
