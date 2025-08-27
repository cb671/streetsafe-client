import { describe, it } from 'vitest'
import React from 'react'
import ReactDOM from 'react-dom/client'
import ChartPage from '../pages/ChartPage'

describe('ChartPage', () => {
  it('renders without crashing', () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = ReactDOM.createRoot(container)
    root.render(<ChartPage />)
  })
})
