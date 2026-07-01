import { createFileRoute } from '@tanstack/react-router'
import { NewChatPage } from '@/features/chats/new-chat-page'

export const Route = createFileRoute('/_authenticated/chats/new-chat')({
  component: NewChatPage,
})
