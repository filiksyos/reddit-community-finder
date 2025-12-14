import type { ChatUIMessage } from '@/lib/chat-context'
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  type UIMessage,
} from 'ai'
import { getOpenRouterModel, getModelId } from '@/ai/openrouter'
import { tools } from '@/ai/tools'
import prompt from './prompt.md'

interface BodyData {
  messages: ChatUIMessage[]
  modelId?: string
}

export async function POST(req: Request) {
  let messages: ChatUIMessage[], modelId: string | undefined

  try {
    const body = await req.text()
    console.log('📋 Raw request body length:', body?.length || 0)

    if (!body) {
      console.error('❌ Empty request body received')
      return Response.json(
        { error: 'BAD_REQUEST', message: 'Empty request body' },
        { status: 400 }
      )
    }

    const parsed = JSON.parse(body) as BodyData
    messages = parsed.messages
    modelId = parsed.modelId

    console.log('🔍 API Request - messages:', messages.length)
  } catch (error) {
    console.error('❌ JSON parsing error:', error)
    return Response.json(
      { error: 'BAD_REQUEST', message: 'Invalid JSON in request body' },
      { status: 400 }
    )
  }

  const actualModelId = modelId || getModelId()
  const model = getOpenRouterModel()

  // Log user's query/intent
  const lastUserMessage = messages.filter((m) => m.role === 'user').pop()
  const userQuery = lastUserMessage?.parts?.find(
    (p) => p.type === 'text'
  ) as { type: 'text'; text: string } | undefined
  if (userQuery?.text) {
    console.log('🤔 User Query/Intent:', userQuery.text)
  } else if (lastUserMessage?.text) {
    // Fallback to text property if parts is not available
    console.log('🤔 User Query/Intent:', lastUserMessage.text)
  }

  // Transform ChatUIMessage to UIMessage format
  const transformedMessages: UIMessage[] = messages.map((msg) => ({
    id: msg.id,
    role: msg.role,
    parts: msg.parts.map((part) => {
      // Transform data parts from { type: 'data', content: [...] } to { type: 'data-communities', data: ... }
      if (part.type === 'data' && 'content' in part) {
        const content = part.content
        // Check if it's a communities data part
        if (Array.isArray(content) && content.length > 0 && content[0]?.type === 'communities') {
          return {
            type: 'data-communities' as const,
            data: content,
          }
        }
        // Fallback for other data types
        return {
          type: 'data-unknown' as const,
          data: content,
        }
      }
      // Pass through other parts as-is
      return part as any
    }),
  }))

  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      originalMessages: transformedMessages,
      execute: ({ writer }) => {
        const result = streamText({
          model,
          system: prompt,
          messages: convertToModelMessages(transformedMessages),
          maxOutputTokens: 50000,
          stopWhen: stepCountIs(40), // Allow up to 40 steps for multiple searches
          tools: tools({ writer }),
          onStepFinish: (step) => {
            // Log AI's step/tool call actions
            if (step.toolCalls && step.toolCalls.length > 0) {
              step.toolCalls.forEach((toolCall) => {
                console.log('🔧 AI Tool Call:', {
                  tool: toolCall.toolCallId,
                  toolName: toolCall.toolName,
                  args: JSON.stringify(toolCall.input, null, 2),
                })
              })
            }
            if (step.toolResults && step.toolResults.length > 0) {
              step.toolResults.forEach((toolResult) => {
                console.log('✅ AI Tool Result:', {
                  tool: toolResult.toolCallId,
                  toolName: toolResult.toolName,
                  result:
                    typeof toolResult.output === 'string'
                      ? toolResult.output.substring(0, 200) +
                        (toolResult.output.length > 200 ? '...' : '')
                      : JSON.stringify(toolResult.output).substring(0, 200) +
                        '...',
                })
              })
            }
            if (step.text) {
              console.log('💬 AI Text Generation:', {
                text:
                  step.text.substring(0, 200) +
                  (step.text.length > 200 ? '...' : ''),
              })
            }
          },
          onError: (error) => {
            console.error('❌ Error communicating with AI')
            console.error(JSON.stringify(error, null, 2))
          },
          onFinish: async (result) => {
            // Log final AI response summary
            console.log('🎯 AI Response Complete:', {
              steps: result.steps?.length || 0,
              toolCalls:
                result.steps?.filter((s) => s.toolCalls && s.toolCalls.length > 0)
                  .length || 0,
              textLength: result.text?.length || 0,
            })
          },
        })
        // Merge the stream
        writer.merge(
          result.toUIMessageStream({
            sendReasoning: false,
            sendStart: false,
            messageMetadata: () => ({
              model: actualModelId,
            }),
          })
        )
      },
    }),
  })
}
