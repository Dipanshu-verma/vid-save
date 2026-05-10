import { Link } from 'react-router-dom';
import { ArrowRight, Clock, ArrowLeft } from 'lucide-react';
import { posts } from '../data/blogContent';

const categoryColors: Record<string, string> = {
  YouTube: 'text-red-400',
  Instagram: 'text-pink-400',
  Facebook: 'text-blue-400',
  WhatsApp: 'text-green-400',
  Android: 'text-sky-400',
};

export default function BlogListing() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Back to app */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Save It Pro
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Blog</h1>
          <p className="text-sm text-slate-400 mt-1">
            Guides and tips for downloading videos from YouTube, Instagram, Facebook and WhatsApp
          </p>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="block p-5 rounded-2xl bg-slate-800/50 border border-slate-700/30 hover:border-sky-500/40 hover:bg-slate-800 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${categoryColors[post.category] || 'text-sky-400'}`}>
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Clock className="w-3 h-3" /> {post.readTime}
                </span>
              </div>
              <h2 className="text-sm font-bold text-white leading-snug mb-1.5 group-hover:text-sky-300 transition-colors">
                {post.title}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500">{post.date}</span>
                <span className="flex items-center gap-1 text-xs text-sky-400 font-medium">
                  Read more <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}