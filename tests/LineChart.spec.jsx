import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import LineChart from '../app/components/LineChart'
import { render } from 'vitest-browser-react'
import * as api from '../app/api/api.js'

// Mock getLineChartData
vi.mock('../app/api/api.js', () => ({
  getLineChartData: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('LineChart', () => {
  it('shows loading initially', async () => {
    const page = render(<LineChart filter={{}} />)
    await expect.element(page.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders chart after data is fetched', async () => {
    api.getLineChartData.mockResolvedValueOnce([
      { period: '2021-01', total_crimes: 12 },
      { period: '2021-02', total_crimes: 7 },
    ])

    const page = render(<LineChart filter={{}} />)

    // wait for useEffect
    await new Promise((resolve) => setTimeout(resolve, 0))

    await expect.element(page.getByText('Loading...')).not.toBeInTheDocument()
    expect(page.container.querySelector('canvas')).not.toBeNull()
  })
})
