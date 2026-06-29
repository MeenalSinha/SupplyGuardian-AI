'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'

export interface LiveEvent {
  type: string
  timestamp?: string
  [key: string]: unknown
}

export function useWebSocket(path: string = '/ws/live') {
  const [events, setEvents] = useState<LiveEvent[]>([])
  const [connected, setConnected] = useState(false)
  const [latestEvent, setLatestEvent] = useState<LiveEvent | null>(null)
  const ws = useRef<WebSocket | null>(null)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket(`${WS_URL}${path}`)

      ws.current.onopen = () => {
        setConnected(true)
        if (reconnectTimer.current) {
          clearTimeout(reconnectTimer.current)
          reconnectTimer.current = null
        }
      }

      ws.current.onmessage = (e) => {
        try {
          const event: LiveEvent = JSON.parse(e.data)
          setLatestEvent(event)
          setEvents((prev) => [event, ...prev].slice(0, 50))
        } catch {}
      }

      ws.current.onclose = () => {
        setConnected(false)
        // Reconnect after 3 seconds
        reconnectTimer.current = setTimeout(connect, 3000)
      }

      ws.current.onerror = () => {
        ws.current?.close()
      }
    } catch {
      // WebSocket not available (SSR) - skip
    }
  }, [path])

  useEffect(() => {
    connect()
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
      ws.current?.close()
    }
  }, [connect])

  const send = useCallback((data: object) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data))
    }
  }, [])

  return { events, connected, latestEvent, send }
}
