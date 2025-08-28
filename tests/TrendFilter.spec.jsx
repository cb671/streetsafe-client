import { describe, it, expect, vi, beforeEach } from 'vitest'
import TrendFilter from '../app/components/TrendFilter.jsx'
import { render } from 'vitest-browser-react'
import * as api from '../app/api/api.js'
import {TreeDeciduous} from "lucide-react";
import {userEvent} from "@vitest/browser/context";
import {waitFor} from "@testing-library/react";

describe('TrendFilter', () => {
  it('calls handleFilter', async () => {
    const handleFilter = vi.fn();
    const page = render(<TrendFilter handleFilter={handleFilter} filter={{crimeTypes:[]}}/>)
    await expect.element(page.getByText('Filter')).toBeInTheDocument()
    await userEvent.click(page.getByText('Filter'));
    await waitFor(()=>expect(handleFilter).toBeCalled());
  })
})
