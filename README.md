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
This project uses [Create React App](https://create-react-app.dev/).

```bash
npm install
npm start       # start development server
npm run build   # build for production
```

## Deploying to GitHub Pages
Deployment is handled by the `gh-pages` package.

```bash
npm run deploy
```

The `homepage` field in `package.json` is set to
`https://kg-ninja.github.io/FMMosquit` so built assets work on GitHub Pages.

## Exported Feedback
Click **Export Feedback** to download a `feedback.json` file containing all
feedback entries collected in the current session.

## License
MIT
