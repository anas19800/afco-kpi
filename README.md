# AFCO KPI Dashboard (Static Edition)

This repository now ships a single static dashboard that can be hosted directly from GitHub Pages.
The page renders a curated set of KPIs and a city heatmap without requiring any build tooling or databases.

## Quick start

1. Open [`index.html`](./index.html) directly in your browser to preview the dashboard locally.
2. To publish the page on GitHub Pages, push the file to your `main` branch and enable Pages from the repository settings.

## Customising the data

All figures are defined in the `sample` object inside `index.html`.
Update the KPI thresholds, values, and city metrics, then refresh the page to see the changes instantly.

## Design notes

- Responsive layout with cards for high-level KPIs and a scrollable heatmap table for detailed city performance.
- Visual status badges (On Track, Watch, At Risk) adapt automatically based on the KPI band thresholds.
- Date stamps update dynamically in the browser to show when the snapshot was generated.

## License

Released under the MIT license.
