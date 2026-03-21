import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
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
  contentHtml?: string;
  published?: boolean;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { L } = useLang();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getDoc(doc(db, 'blog_posts', slug)).then(snap => {
      if (snap.exists()) setPost(snap.data() as PostData);
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>Loading…</div>;
  if (!post)   return <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>Post not found. <Link to="/blog">← Back</Link></div>;

  return (
    <>
      <PageParticles />
      <article className="blog-post-article">
        {post.coverImage && (
          <div className="blog-post-hero" style={{ backgroundImage: `url('${post.coverImage}')` }}>
            {post.coverAlt && <span className="sr-only">{post.coverAlt}</span>}
          </div>
        )}
        <div className="container blog-post-body">
          <Link to="/blog" className="blog-post-back">← Back to Blog</Link>
          <div className="blog-post-date">{post.date}</div>
          <h1 className="blog-post-title">{L(post.title)}</h1>
          {post.contentHtml
            ? <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
            : <p className="blog-post-content" style={{ color: 'var(--text2)', fontStyle: 'italic' }}>{L(post.excerpt)}</p>
          }
        </div>
      </article>
    </>
  );
}
