import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import React from 'react'
import ReactDOM from 'react-dom/client'
import Barchart from '../app/components/BarChart.jsx'
import * as api from '../app/api/api.js'

// Mock getBarChartData
vi.mock('../api/api.js', () => ({
  getBarChartData: vi.fn(),
}))

let container
beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})
afterEach(() => {
  document.body.removeChild(container)
  container = null
  vi.clearAllMocks()
})

function render(ui) {
  const root = ReactDOM.createRoot(container)
  root.render(ui)
  return root
}

describe('Barchart', () => {
it('shows loading initially', async () => {
    render(<Barchart filter={{}} />)
    await Promise.resolve()
    expect(container.textContent).toContain('Loading')
  })

  it('renders chart after data is fetched', async () => {
    api.getBarChartData.mockResolvedValueOnce([
      { category: 'Theft', count: 10 },
      { category: 'Burglary', count: 5 },
    ])

    render(<Barchart filter={{}} />)

    // Wait for useEffect async call to finish
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(container.textContent).not.toContain('Loading')
    // react-chartjs-2 Bar renders a canvas
    expect(container.querySelector('canvas')).not.toBeNull()
  })
})
