import React from 'react'
import 'jest-dom/extend-expect'
import loadjs from 'loadjs'
import 'react-testing-library/cleanup-after-each'
import {render, wait, cleanup, flushEffects} from 'react-testing-library'
import {InfoWindow, MapBox} from '../..'
import {GoogleMapProvider} from '../../contexts/GoogleMapContext'
import {defineGlobalVariable} from '../../__test__helpers__'

describe('InfoWindow', () => {
  beforeEach(() => {
    defineGlobalVariable()
    jest.spyOn(console, 'error')
    jest.spyOn(loadjs, 'reset')
  })

  afterEach(() => {
    cleanup()
    Object.defineProperty(global, 'google', {value: undefined})
    jest.restoreAllMocks()
  })

  it('renders inside a MapBox', async () => {
    const {container, rerender} = render(
      <GoogleMapProvider>
        <MapBox apiKey="A_FAKE_API_KEY" />
        <InfoWindow
          opts={{
            content: 'This is an info window',
            position: {lat: 39, lng: 116},
          }}
        />
      </GoogleMapProvider>,
    )
    expect(container.innerHTML).toMatch('Loading...')
    await wait(() => {
      expect(container.innerHTML).not.toMatch('Loading...')
    })
    flushEffects()
    rerender(
      <GoogleMapProvider>
        <MapBox apiKey="A_FAKE_API_KEY" />
        <InfoWindow
          opts={{
            position: {lat: 39, lng: 116},
            zIndex: 10,
          }}
          anchor={new google.maps.Marker({position: {lat: 39, lng: 116}})}
          visible
        />
      </GoogleMapProvider>,
    )
    flushEffects()
    rerender(
      <GoogleMapProvider>
        <MapBox apiKey="A_FAKE_API_KEY" />
        <InfoWindow
          opts={{
            content: 'This is an info window',
            position: {lat: 38, lng: 116},
          }}
          visible={false}
        />
      </GoogleMapProvider>,
    )
  })
})
