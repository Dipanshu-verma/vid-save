import { Youtube, Instagram, Facebook, MessageCircle, Twitter, Globe } from 'lucide-react';
import type { Platform } from '../types';

const configs: Record<Platform | 'twitter' | 'tiktok', { icon: React.ComponentType<{ className?: string }>, color: string, bg: string, label: string }> = {
  youtube: { icon: Youtube, color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20', label: 'YouTube' },
  instagram: { icon: Instagram, color: 'text-pink-400', bg: 'bg-pink-400/10 border-pink-400/20', label: 'Instagram' },
  facebook: { icon: Facebook, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20', label: 'Facebook' },
  whatsapp: { icon: MessageCircle, color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20', label: 'WhatsApp' },
//   twitter: { icon: Twitter, color: 'text-sky-400', bg: 'bg-sky-400/10 border-sky-400/20', label: 'Twitter/X' },
//   tiktok: { icon: Globe, color: 'text-slate-300', bg: 'bg-slate-300/10 border-slate-300/20', label: 'TikTok' },
};

interface PlatformBadgeProps {
  platform: Platform | string;
  size?: 'sm' | 'md';
}

export default function PlatformBadge({ platform, size = 'sm' }: PlatformBadgeProps) {
  const config = configs[platform as Platform] ?? {
    icon: Globe,
    color: 'text-slate-400',
    bg: 'bg-slate-400/10 border-slate-400/20',
    label: platform,
  };
  const Icon = config.icon;
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs';

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-medium ${config.bg} ${config.color} ${textSize}`}>
      <Icon className={iconSize} />
      {config.label}
    </span>
  );
}

export function detectPlatform(url: string): Platform | null {
  const lower = url.toLowerCase();
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
  if (lower.includes('instagram.com')) return 'instagram';
  if (lower.includes('facebook.com') || lower.includes('fb.watch')) return 'facebook';
//   if (lower.includes('tiktok.com')) return 'tiktok';
//   if (lower.includes('twitter.com') || lower.includes('x.com')) return 'twitter';
  return null;
}
