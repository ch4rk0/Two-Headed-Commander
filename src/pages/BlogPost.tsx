import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import { db } from '../firebase';
import { useLang } from '../contexts/LangContext';
import { PageParticles } from '../components/Particles';

interface PostData {
  slug: string;
  title: { en: string; fr: string } | string;
  excerpt: { en: string; fr: string } | string;
  date: string;
  coverImage?: string;
  coverAlt?: string;
  contentHtml?: string | { en: string; fr: string };
  published?: boolean;
}

function readingTime(html?: string | { en: string; fr: string }): number {
  const raw = typeof html === 'string' ? html : (html?.en ?? '');
  const text = raw.replace(/<[^>]+>/g, '').trim();
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { L, lang } = useLang();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    getDoc(doc(db, 'blog_posts', slug)).then(snap => {
      if (snap.exists()) setPost(snap.data() as PostData);
      setLoading(false);
    });
  }, [slug]);

  // Scroll progress bar
  useEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;
    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      bar.style.width = total > 0 ? `${(window.scrollY / total) * 100}%` : '0%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Image lightbox via event delegation
  useEffect(() => {
    const div = contentRef.current;
    if (!div) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'IMG') return;
      if (target.closest('.card-gallery')) return; // skip card galleries
      setLightboxSrc((target as HTMLImageElement).src);
      setLightboxAlt((target as HTMLImageElement).alt);
    };
    div.addEventListener('click', onClick);
    return () => div.removeEventListener('click', onClick);
  }, [post]); // re-bind after post loads

  // Escape closes lightbox
  useEffect(() => {
    if (!lightboxSrc) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxSrc(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxSrc]);

  // Resolve bilingual content body
  const resolveContent = (html?: string | { en: string; fr: string }): string => {
    if (!html) return '';
    if (typeof html === 'string') return html; // legacy EN-only
    return (lang === 'fr' && html.fr) ? html.fr : html.en;
  };

  const siteUrl = 'https://twoheadedcommander.com';

  if (loading) return (
    <>
      <div ref={progressRef} id="read-progress" />
      <PageParticles />
      <article className="blog-post-article">
        <div className="blog-post-body" style={{ paddingTop: '3rem' }}>
          <div className="skeleton-card" style={{ height: 28, width: 100, marginBottom: '2rem' }} />
          <div className="skeleton-card" style={{ height: 16, width: 120, marginBottom: '.75rem' }} />
          <div className="skeleton-card" style={{ height: 42, width: '70%', marginBottom: '1.5rem' }} />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-card" style={{ height: 16, width: i % 3 === 2 ? '60%' : '100%', marginBottom: '.75rem' }} />
          ))}
        </div>
      </article>
    </>
  );

  if (!post) return (
    <>
      <PageParticles />
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        Post not found. <Link to="/blog">← Back</Link>
      </div>
    </>
  );

  const title = L(post.title);
  const excerpt = L(post.excerpt);
  const mins = readingTime(post.contentHtml);
  const content = resolveContent(post.contentHtml);

  return (
    <>
      <Helmet>
        <title>{title} — Two-Headed Commander</title>
        <meta name="description" content={excerpt} />
        <meta property="og:type"        content="article" />
        <meta property="og:title"       content={title} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:url"         content={`${siteUrl}/blog/${post.slug}`} />
        <link rel="canonical"           href={`${siteUrl}/blog/${post.slug}`} />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
        <meta property="article:published_time" content={post.date} />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={title} />
        <meta name="twitter:description" content={excerpt} />
        {post.coverImage && <meta name="twitter:image" content={post.coverImage} />}
      </Helmet>

      <div ref={progressRef} id="read-progress" />
      <PageParticles />

      <article className="blog-post-article">
        {post.coverImage && (
          <div className="blog-post-hero" style={{ backgroundImage: `url('${post.coverImage}')` }}>
            {post.coverAlt && <span className="sr-only">{post.coverAlt}</span>}
          </div>
        )}
        <div className="blog-post-body">
          <Link to="/blog" className="blog-post-back">← Back to Blog</Link>
          <div className="blog-post-date">{post.date}</div>
          <div className="blog-post-readtime">{mins} min read</div>
          <h1 className="blog-post-title">{title}</h1>
          {content
            ? <div ref={contentRef} className="blog-post-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content, { USE_PROFILES: { html: true } }) }} />
            : <p className="blog-post-content" style={{ color: 'var(--text2)', fontStyle: 'italic' }}>{excerpt}</p>
          }
        </div>
      </article>

      {lightboxSrc && (
        <div className="lightbox" onClick={() => setLightboxSrc(null)}>
          <button className="lightbox-close" onClick={() => setLightboxSrc(null)} aria-label="Close">×</button>
          <img src={lightboxSrc} alt={lightboxAlt} onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
