import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, ArrowRight } from 'lucide-react';
import { posts, getPostBySlug } from '../data/blogContent';

const categoryColors: Record<string, string> = {
  YouTube: 'text-red-400',
  Instagram: 'text-pink-400',
  Facebook: 'text-blue-400',
  WhatsApp: 'text-green-400',
  Android: 'text-sky-400',
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug || '');

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-slate-400">Post not found.</p>
          <Link to="/blog" className="text-sky-400 text-sm hover:underline">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  const otherPosts = posts.filter(p => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Back */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Blog
        </Link>

        {/* Title */}
        <div className="space-y-3 mb-6">
          <span className={`text-[10px] font-bold uppercase tracking-widest ${categoryColors[post.category] || 'text-sky-400'}`}>
            {post.category}
          </span>
          <h1 className="text-xl font-bold text-white leading-snug">{post.title}</h1>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
            <span>{post.date}</span>
          </div>
        </div>

        <div className="h-px bg-slate-700/50 mb-6" />

        {/* Content */}
        <article className="space-y-5 mb-10">
          {post.paragraphs.map((para, i) => (
            <p key={i} className="text-sm text-slate-300 leading-[1.85]">{para}</p>
          ))}
        </article>

        {/* CTA */}
        <div className="rounded-2xl bg-sky-500/10 border border-sky-500/20 p-5 space-y-3 mb-10">
          <p className="text-base font-bold text-white">Try Save It Pro — Free</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Download videos from YouTube, Instagram, Facebook, and save WhatsApp statuses — all in one free app. No login required.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-sky-500 text-black px-4 py-2 rounded-lg hover:bg-sky-400 transition-colors"
            >
              Use Web App <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="https://github.com/Dipanshu-verma/vid-save/releases/latest/download/Save.It.Pro.apk"
              className="inline-flex items-center gap-1.5 text-xs font-semibold border border-slate-600 text-slate-300 px-4 py-2 rounded-lg hover:border-sky-500/50 hover:text-white transition-colors"
            >
              Download APK
            </Link>
          </div>
        </div>

        {/* More Posts */}
        {otherPosts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white border-b border-slate-700/50 pb-2">More Articles</h2>
            <div className="space-y-3">
              {otherPosts.map(p => (
                <Link
                  key={p.slug}
                  to={`/blog/${p.slug}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/30 hover:border-sky-500/30 transition-all group"
                >
                  <div>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${categoryColors[p.category] || 'text-sky-400'}`}>
                      {p.category}
                    </span>
                    <p className="text-xs font-semibold text-white mt-0.5 group-hover:text-sky-300 transition-colors leading-snug">
                      {p.title}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0 ml-3 group-hover:text-sky-400 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}