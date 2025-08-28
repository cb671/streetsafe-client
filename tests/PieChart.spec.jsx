import { describe, it, expect, vi, beforeEach } from 'vitest'
import PieChart from '../app/components/PieChart.jsx'
import { render } from 'vitest-browser-react'
import * as api from '../app/api/api.js'

// Mock getBarChartData (path matches component import)
vi.mock('../app/api/api.js', () => ({
  getPieChartData: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('PieChart', () => {
  it('shows loading initially', async () => {
    const page = render(<PieChart filter={{}} />)
    await expect.element(page.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders chart after data is fetched', async () => {
    api.getPieChartData.mockResolvedValueOnce([
      { category: 'Theft', count: 10 },
      { category: 'Burglary', count: 5 },
    ])

    const page = render(<PieChart filter={{}} />)

    // Wait for useEffect to resolve and re-render
    await new Promise((resolve) => setTimeout(resolve, 0))

    await expect.element(page.getByText('Loading...')).not.toBeInTheDocument()
    expect(page.container.querySelector('canvas')).not.toBeNull()
  })
})
