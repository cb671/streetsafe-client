import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import React from 'react'
import ReactDOM from 'react-dom/client'
import LineChart from '../app/components/LineChart'
import * as api from '../app/api/api.js'

// Mock getLineChartData
vi.mock('../app/api/api.js', () => ({
  getLineChartData: vi.fn(),
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

describe('LineChart', () => {
  it('shows loading initially', () => {
    render(<LineChart filter={{}} />)
    expect(container.textContent).toContain('Loading...')
  })

  it('renders chart after data is fetched', async () => {
    api.getLineChartData.mockResolvedValueOnce([
      { period: '2021-01', total_crimes: 12 },
      { period: '2021-02', total_crimes: 7 },
    ])

    render(<LineChart filter={{}} />)

    // wait for useEffect
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(container.textContent).not.toContain('Loading...')
    expect(container.querySelector('canvas')).not.toBeNull()
  })

  it('handles API error gracefully', async () => {
    api.getLineChartData.mockRejectedValueOnce(new Error('API error'))

    render(<LineChart filter={{}} />)

    await new Promise((resolve) => setTimeout(resolve, 0))

    // still shows loading (since no data set)
    expect(container.textContent).toContain('Loading...')
  })
})
