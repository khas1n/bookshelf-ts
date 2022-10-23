import React from 'react'
import { client } from '@/utils/api-client'

let queue: Record<PropertyKey, unknown>[] = []

setInterval(sendProfileQueue, 5000)

function sendProfileQueue() {
  if (!queue.length) {
    return Promise.resolve({ success: true })
  }
  const queueToSend = [...queue]
  queue = []
  return client('profile', { data: queueToSend })
}

interface ProfileProps extends Omit<React.ProfilerProps, 'onRender'> {
  metadata?: any
  phases?: string[]
}
const Profiler: React.FC<ProfileProps> = ({ metadata, phases, ...props }) => {
  const reportProfile: React.ProfilerOnRenderCallback = (
    id, // the "id" prop of the Profiler tree that has just committed
    phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
    actualDuration, // time spent rendering the committed update
    baseDuration, // estimated time to render the entire subtree without memoization
    startTime, // when React began rendering this update
    commitTime, // when React committed this update
    interactions, // the Set of interactions belonging to this update
  ) => {
    if (!phases || phases.includes(phase)) {
      queue.push({
        metadata,
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
      })
    }
  }
  return <React.Profiler {...props} onRender={reportProfile} />
}

export { Profiler }
