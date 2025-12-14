import { memo } from 'react'

interface Props {
  part: { type: 'text'; text: string }
}

export const Text = memo(function Text({ part }: Props) {
  if (!part.text) {
    return null
  }

  return (
    <div className="px-4 py-3 rounded-lg bg-muted text-foreground">
      <div className="whitespace-pre-wrap">{part.text}</div>
    </div>
  )
})
