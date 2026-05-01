import { useState } from 'react';
import { ArrowRight, Clock, User } from 'lucide-react';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

const posts: BlogPost[] = [
  {
    slug: 'how-to-download-youtube-videos-2026',
    title: 'How to Download YouTube Videos in 2026 (Complete Guide)',
    excerpt: 'Learn how to save your favorite YouTube videos for offline viewing. Step-by-step guide for Android, iPhone, and PC users.',
    author: 'Save It Pro Team',
    date: 'April 28, 2026',
    readTime: '5 min read',
    category: 'YouTube',
  },
  {
    slug: 'how-to-save-instagram-reels',
    title: 'How to Save Instagram Reels to Your Phone (2026)',
    excerpt: 'Instagram does not let you download Reels directly. Here are the best ways to save Instagram Reels and posts to your gallery.',
    author: 'Save It Pro Team',
    date: 'April 25, 2026',
    readTime: '4 min read',
    category: 'Instagram',
  },
  {
    slug: 'how-to-save-whatsapp-status',
    title: 'How to Save WhatsApp Status Videos and Photos',
    excerpt: 'WhatsApp statuses disappear after 24 hours. Learn how to save them before they expire using Save It Pro Android app.',
    author: 'Save It Pro Team',
    date: 'April 22, 2026',
    readTime: '3 min read',
    category: 'WhatsApp',
  },
  {
    slug: 'best-video-downloader-android-2026',
    title: 'Best Video Downloader Apps for Android in 2026',
    excerpt: 'Looking for the best video downloader for Android? We compare the top apps for downloading videos from YouTube, Instagram and Facebook.',
    author: 'Save It Pro Team',
    date: 'April 20, 2026',
    readTime: '6 min read',
    category: 'Android',
  },
  {
    slug: 'how-to-download-facebook-videos',
    title: 'How to Download Facebook Videos on Android (2026)',
    excerpt: 'Facebook does not have a built-in download button. Here is how you can easily save Facebook videos to your phone gallery.',
    author: 'Save It Pro Team',
    date: 'April 18, 2026',
    readTime: '4 min read',
    category: 'Facebook',
  },
];

const fullPosts: Record<string, string[]> = {
  'how-to-download-youtube-videos-2026': [
    'YouTube is the world\'s largest video platform with over 800 million videos. Many users want to download videos for offline viewing, especially when travelling or in areas with poor internet connectivity.',
    'Save It Pro makes it easy to download YouTube videos directly to your Android device. Simply copy the video URL from the YouTube app or browser, paste it into Save It Pro, choose your preferred quality, and tap download.',
    'YouTube videos are available in multiple qualities including 360p, 720p HD, and 1080p Full HD. Higher quality videos take more storage space but offer better viewing experience on larger screens.',
    'To copy a YouTube video link on Android: open the YouTube app, tap Share below the video, then tap Copy link. You can then paste this link directly into Save It Pro.',
    'Save It Pro supports all types of YouTube content including regular videos, YouTube Shorts, and music videos. Downloads are saved directly to your Downloads folder for easy access.',
    'Remember to only download videos that you have permission to download or that are available under a Creative Commons license. Always respect copyright and the rights of content creators.',
  ],
  'how-to-save-instagram-reels': [
    'Instagram Reels have become one of the most popular forms of short video content. With millions of Reels posted every day, many users want to save their favourite content for offline viewing.',
    'Unlike some other platforms, Instagram does not provide a native download button for Reels or posts. This is where Save It Pro comes in, making it simple to download any public Instagram Reel.',
    'To save an Instagram Reel using Save It Pro: open Instagram and find the Reel you want to save, tap the three dots menu, select Copy Link, then paste the link into Save It Pro.',
    'Save It Pro downloads Instagram Reels in their original quality, preserving the full resolution and audio. Videos are saved as MP4 files that can be played in any video player.',
    'You can also save Instagram photos and carousel posts using Save It Pro. The process is the same — copy the post link and paste it into the downloader.',
    'Note that private Instagram accounts cannot be downloaded as the content is not publicly accessible. Save It Pro only works with public Instagram content.',
  ],
  'how-to-save-whatsapp-status': [
    'WhatsApp Status allows users to share photos, videos, and GIFs that disappear after 24 hours. Many users want to save interesting or memorable statuses before they expire.',
    'WhatsApp does not provide a direct way to save other people\'s statuses. However, the Save It Pro Android app includes a built-in WhatsApp Status Saver feature.',
    'To use the WhatsApp Status Saver: first open WhatsApp and view the statuses you want to save. This is important because WhatsApp only stores statuses you have viewed.',
    'After viewing statuses in WhatsApp, open Save It Pro and go to the WhatsApp section. Tap Select Status Files and navigate to the WhatsApp statuses folder on your device.',
    'The statuses folder is located at: Internal Storage → Android → media → com.whatsapp → WhatsApp → Media → .Statuses. You may need to enable "Show hidden files" in your file manager.',
    'Select the photos or videos you want to save and tap the download button. Your selected statuses will be saved to your Downloads folder immediately.',
  ],
  'best-video-downloader-android-2026': [
    'Finding a reliable video downloader for Android in 2026 can be challenging. Many apps are filled with ads, require payment, or simply do not work with popular platforms.',
    'Save It Pro is a free Android app that supports downloading videos from YouTube, Instagram, Facebook, and saving WhatsApp statuses. It is available as a direct APK download.',
    'Key features to look for in a video downloader include support for multiple platforms, HD quality downloads, fast download speeds, and a clean interface without excessive ads.',
    'Save It Pro offers downloads in multiple quality options including 360p, 720p HD, and 1080p Full HD where available. Choose lower quality for faster downloads and less storage usage.',
    'Unlike many video downloaders that require an account or subscription, Save It Pro is completely free to use with no login required. Simply paste a video link and download.',
    'The app also includes a WhatsApp Status Saver, allowing you to save photos and videos from WhatsApp statuses before they expire after 24 hours.',
  ],
  'how-to-download-facebook-videos': [
    'Facebook is home to billions of videos including news clips, funny moments, tutorials, and live streams. Downloading Facebook videos lets you watch them offline at any time.',
    'Facebook does not have a built-in video download option for most users. Save It Pro provides a simple way to download public Facebook videos directly to your Android device.',
    'To download a Facebook video: find the video on Facebook, tap the three dots menu on the post, select Copy Link, then paste the link into Save It Pro.',
    'Save It Pro supports Facebook videos in HD and SD quality. HD videos offer better picture quality while SD videos download faster and use less storage space.',
    'Facebook Reels can also be downloaded using Save It Pro. The process is identical — copy the Reel link and paste it into the downloader to get download options.',
    'Please note that private Facebook videos and videos from private profiles cannot be downloaded as they are not publicly accessible. Only public Facebook content can be downloaded.',
  ],
};

interface BlogProps {
  onNavigate: (tab: string) => void;
}

export default function Blog({ onNavigate }: BlogProps) {
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const post = selectedPost ? posts.find(p => p.slug === selectedPost) : null;
  const content = selectedPost ? fullPosts[selectedPost] : null;

  if (post && content) {
    return (
      <div className="space-y-5 pb-4">
        <button
          onClick={() => setSelectedPost(null)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          ← Back to Blog
        </button>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-sky-400 uppercase tracking-widest">
            {post.category}
          </span>
          <h1 className="text-lg font-bold text-white leading-snug">{post.title}</h1>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
            <span>{post.date}</span>
          </div>
        </div>

        <div className="space-y-4">
          {content.map((paragraph, i) => (
            <p key={i} className="text-sm text-slate-300 leading-relaxed">{paragraph}</p>
          ))}
        </div>

        <div className="rounded-2xl bg-sky-500/10 border border-sky-500/20 p-4 space-y-3">
          <p className="text-sm font-semibold text-white">Try Save It Pro Free</p>
          <p className="text-xs text-slate-400">Download videos from YouTube, Instagram, Facebook and save WhatsApp statuses — all in one free app.</p>
          <button
            onClick={() => onNavigate('downloader')}
            className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
          >
            Start Downloading <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-4">
      <div>
        <h2 className="text-xl font-bold text-white">Blog</h2>
        <p className="text-sm text-slate-400 mt-0.5">Tips and guides for downloading videos</p>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <button
            key={post.slug}
            onClick={() => setSelectedPost(post.slug)}
            className="w-full text-left p-4 rounded-2xl bg-slate-800/50 border border-slate-700/30 hover:border-sky-500/30 hover:bg-slate-800 transition-all active:scale-[0.98] space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-sky-400 uppercase tracking-widest">
                {post.category}
              </span>
              <span className="text-[10px] text-slate-500">{post.readTime}</span>
            </div>
            <p className="text-sm font-semibold text-white leading-snug">{post.title}</p>
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{post.excerpt}</p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-500">{post.date}</span>
              <span className="flex items-center gap-1 text-xs text-sky-400 font-medium">
                Read more <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}