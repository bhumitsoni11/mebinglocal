import { api } from '@/lib/api';
import { PulsePost } from './types';

export async function getPulsePosts(city?: string, category?: string): Promise<PulsePost[]> {
  try {
    const params: any = {};
    if (city && city !== 'all') params.city = city;
    if (category && category !== 'all') params.category = category;
    const res: any = await api.get('/pulse', { params });
    if (res && Array.isArray(res.items)) {
      return res.items.map((p: any) => ({
        id: p.id,
        authorName: p.author?.name || 'Local Resident',
        authorAvatar: p.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        authorRole: p.author?.localProfile?.tagline || 'Verified Resident',
        city: p.city || 'Tokyo',
        title: p.title,
        content: p.content,
        image: p.mediaUrl || undefined,
        category: p.category || 'General',
        upvotesCount: p.upvotesCount || 0,
        commentsCount: p.commentsCount || 0,
        timeAgo: 'Recently',
        isVerifiedHost: !!p.author?.localProfile,
      }));
    }
    return [];
  } catch (err) {
    console.warn('Failed to fetch pulse posts from backend:', err);
    return [];
  }
}

export async function upvotePulsePost(id: string): Promise<any> {
  return api.post(`/pulse/${id}/upvote`);
}
