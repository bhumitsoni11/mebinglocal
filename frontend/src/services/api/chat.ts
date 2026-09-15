import { api } from '@/lib/api';

export async function getConversations(): Promise<any[]> {
  try {
    const res: any = await api.get('/chat/conversations');
    return Array.isArray(res) ? res : res?.items || [];
  } catch (err) {
    return [];
  }
}

export async function getMessages(conversationId: string): Promise<any[]> {
  try {
    const res: any = await api.get(`/chat/conversations/${conversationId}/messages`);
    return Array.isArray(res) ? res : res?.items || [];
  } catch (err) {
    return [];
  }
}

export async function sendMessage(conversationId: string, content: string): Promise<any> {
  return api.post(`/chat/conversations/${conversationId}/messages`, { content });
}
