'use client'

import type { ToolUIPart } from 'ai'
import { PresentCommunities } from './present-communities'
import { memo } from 'react'

interface Props {
  part: ToolUIPart
}

export const ToolUI = memo(function ToolUI({ part }: Props) {
  const { type, state, output } = part

  // Special handling for presentCommunities tool - render custom UI
  const toolTypeStr = String(type)
  const isPresentCommunities = 
    toolTypeStr === 'tool-presentCommunities' || 
    toolTypeStr === 'tool-present-communities'

  if (isPresentCommunities) {
    // Only render when output is available (tool execution completed)
    if (state === 'output-available' && output) {
      // Handle both object and string outputs
      let outputData: any = output
      
      // If output is a string, try to parse it
      if (typeof output === 'string') {
        try {
          // Try to extract JSON from markdown code blocks
          const jsonMatch = output.match(/```json\s*([\s\S]*?)\s*```/) || output.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            outputData = JSON.parse(jsonMatch[1] || jsonMatch[0])
          }
        } catch (e) {
          // Silent fail - output wasn't JSON
        }
      }

      // Check if outputData has communities array
      if (outputData && typeof outputData === 'object' && Array.isArray(outputData.communities)) {
        return (
          <PresentCommunities
            message={{
              communities: outputData.communities,
            }}
          />
        )
      }
    }
    // During other states, return null
    return null
  }

  // For other tools, don't render anything (or render minimal output if needed)
  return null
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  // Only re-render if state changes or output becomes available
  return (
    prevProps.part.state === nextProps.part.state &&
    prevProps.part.output === nextProps.part.output
  )
})
