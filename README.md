# StreetSafe

A web application that provides crime data visualization, safe route planning, and educational resources to help users stay informed about local safety conditions.

## Features

**Interactive Crime Map** - Visualize crime data on an interactive map with hexagonal overlays  
**Safe Route Planning** - Get walking directions with real-time navigation  
**Crime Analytics** - View crime trends through interactive charts and visualizations  
**Educational Resources** - Access personalized safety guides and crime prevention materials  
**User Authentication** - Secure login and registration system  
**Responsive Design** - Optimized for desktop and mobile devices  

## Tech Stack

- **Frontend**: React 19 with React Router 7
- **Styling**: Tailwind CSS with custom theme
- **Maps**: MapLibre GL with react-map-gl
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **Testing**: Vitest with browser testing
- **Build Tool**: Vite


```

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

### Environment Setup

The application expects an API server running at:
- Development: `http://localhost:3000/api`
- Production: `/api`

## Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run test` - Run test suite
- `npm run coverage` - Generate test coverage report


## Testing

The project uses Vitest for testing with browser-based testing capabilities:

```bash
# Run tests
npm run test

# Run tests with coverage
npm run coverage
```

Test files are located in the `tests/` directory.

## Deployment

### Docker Deployment

Build and run using Docker:

```bash
docker build -t streetsafe-client .
docker run -p 3000:3000 streetsafe-client
```

### Production Build

Create a production build:

```bash
npm run build
```

Deploy the contents of the `build/` directory to your hosting platform.



