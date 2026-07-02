import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '../HomeView.vue'

describe('HomeView', () => {
  it('renders the developer toolbox title and available tools', () => {
    const wrapper = mount(HomeView)

    expect(wrapper.text()).toContain('Developer Toolbox')
    expect(wrapper.text()).toContain('JSON Formatter')
    expect(wrapper.text()).toContain('JWT Decoder')
    expect(wrapper.text()).toContain('Cron Builder')
  })
})
