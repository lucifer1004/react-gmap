import React, {useContext, useEffect, useState} from 'react'
import {useGoogleListener} from '../hooks'
import {DEFAULT_POLYLINE_OPTIONS} from '../common/constants'
import {PolylineProps} from '../common/types'
import {GoogleMapContext} from '../contexts/GoogleMapContext'

export default ({
  id,
  opts = DEFAULT_POLYLINE_OPTIONS,
  onClick,
  onDoubleClick,
  onDrag,
  onDragEnd,
  onDragStart,
  onMouseDown,
  onMouseOut,
  onMouseOver,
  onMouseUp,
  onRightClick,
}: PolylineProps) => {
  const {state, dispatch} = useContext(GoogleMapContext)
  const [polyline, setPolyline] = useState(
    (undefined as unknown) as google.maps.Polyline,
  )
  const addPolyline = (polyline: google.maps.Polyline) => {
    if (!state.objects.has(id))
      dispatch({type: 'add_object', object: polyline, id: id})
  }
  const removePolyline = () => dispatch({type: 'remove_object', id: id})

  useEffect(() => {
    if (state.map === undefined) return
    setPolyline(
      new google.maps.Polyline({
        ...opts,
        map: state.map,
      }),
    )
  }, [state.map])

  useEffect(() => {
    if (polyline === undefined) return

    // Add the polyline to state.objects
    addPolyline(polyline)

    // Remove the polyline when the component is unmounted
    return () => removePolyline()
  }, [polyline])

  // Register google map event listeners
  useGoogleListener(polyline, [
    {name: 'click', handler: onClick},
    {name: 'dblclick', handler: onDoubleClick},
    {name: 'drag', handler: onDrag},
    {name: 'dragend', handler: onDragEnd},
    {name: 'dragstart', handler: onDragStart},
    {name: 'mousedown', handler: onMouseDown},
    {name: 'mouseout', handler: onMouseOut},
    {name: 'mouseover', handler: onMouseOver},
    {name: 'mouseup', handler: onMouseUp},
    {name: 'rightclick', handler: onRightClick},
  ])

  // Modify the google.maps.Polyline object when component props change
  useEffect(() => {
    if (polyline === undefined) return
    polyline.setOptions(opts)
  }, [opts])

  return null
}
