# StreetSafe

A web application that provides crime data visualization, safe route planning, and educational resources to help users stay informed about local safety conditions.

## Features

- **Interactive Crime Map**: Visualize crime data on an interactive map with hexagonal overlays
- **Safe Route Planning**: Get walking directions with real-time navigation
- **Crime Analytics**: View crime trends through interactive charts and visualizations
- **Educational Resources**: Access personalized safety guides and crime prevention materials
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Optimized for desktop and mobile devices

## Tech Stack

- **Frontend**: React 19 with React Router 7
- **Styling**: Tailwind CSS with custom theme
- **Maps**: MapLibre GL with react-map-gl
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **Testing**: Vitest with browser testing
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd streetsafe-client
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Local Development

By default, the dev server proxies `/api` requests to `http://localhost:3000`.
If your backend runs elsewhere locally, set `VITE_DEV_API_PROXY_TARGET`.

Example:

```bash
VITE_DEV_API_PROXY_TARGET=http://localhost:4000 npm run dev
```

## Production Environment

The frontend reads `VITE_API_URL` at build time.

Example:

```bash
VITE_API_URL=https://streetsafe-z3mu.onrender.com/api
```

If `VITE_API_URL` is not set, production falls back to the deployed StreetSafe backend URL.

## Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run test` - Run test suite
- `npm run coverage` - Generate test coverage report

## Testing

The project uses Vitest for testing with browser-based testing capabilities:

```bash
npm run test
npm run coverage
```

Test files are located in the `tests/` directory.

## Render Deployment

If the existing Render project already has the StreetSafe backend deployed, add this repo as a separate Web Service for the client with:

- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Environment: `Node`
- Node version: `20`

Set this environment variable on the frontend service:

- `VITE_API_URL=https://streetsafe-z3mu.onrender.com/api`

Because this client sends authenticated requests with `credentials: 'include'`, the backend must also allow the frontend's Render URL as an allowed origin and support credentials in CORS/cookie settings.

Example backend setting:

```bash
FRONTEND_URLS=https://streetsafe-client.onrender.com,http://localhost:5173
```

## Docker

Build and run using Docker:

```bash
docker build -t streetsafe-client .
docker run -p 3000:3000 streetsafe-client
```

This repo also includes a `Dockerfile` if you prefer deploying the client as a Docker-based Render Web Service instead of using the native Node runtime.
