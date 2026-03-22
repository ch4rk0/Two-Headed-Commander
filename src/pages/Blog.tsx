import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLang } from '../contexts/LangContext';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { PageParticles } from '../components/Particles';
import type { BlogPost } from '../data/blog-posts.seed';

function readingTime(post: BlogPost): number {
  const html = post.contentHtml;
  const raw = typeof html === 'string' ? html : (html?.en ?? '');
  const text = raw.replace(/<[^>]+>/g, '').trim();
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
}

export default function Blog() {
  const { L } = useLang();
  const { posts, loading } = useBlogPosts(false);

  if (loading) return (
    <section className="blog-section">
      <div className="container">
        <div className="blog-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton-card" style={{ height: 260 }} />
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <>
      <Helmet>
        <title>Blog — Two-Headed Commander</title>
        <meta name="description" content="Ideas, perspectives, and format thinking — presented as starting points, not conclusions." />
        <link rel="canonical" href="https://twoheadedcommander.com/blog" />
        <meta property="og:url"         content="https://twoheadedcommander.com/blog" />
        <meta property="og:title"       content="Blog — Two-Headed Commander" />
        <meta property="og:description" content="Ideas, perspectives, and format thinking — presented as starting points, not conclusions." />
        <meta property="og:image"       content="https://twoheadedcommander.com/favicon/apple-touch-icon.png" />
      </Helmet>
      <PageParticles />
      <section className="blog-section">
        <div className="container">
          <div className="sec-label">Reflections</div>
          <h1 className="sec-title">Blog</h1>
          <p className="sec-intro">Ideas, perspectives, and format thinking — presented as starting points, not conclusions.</p>
          <div className="blog-grid">
            {posts.map((post, idx) => {
              const mins = readingTime(post);
              const isFeatured = idx === 0 && !!post.coverImage;
              return (
                <Link key={post.slug} to={`/blog/${post.slug}`} className={`blog-card${isFeatured ? ' featured' : ''}`}>
                  {post.coverImage ? (
                    <div className="blog-card-cover">
                      <img src={post.coverImage} alt={post.coverAlt || L(post.title)} />
                    </div>
                  ) : (
                    <div className="blog-card-cover blog-card-cover-empty" />
                  )}
                  <div className="blog-card-body">
                    <div className="blog-card-meta">
                      <div className="blog-card-date">{post.date}</div>
                      <span className="blog-readtime">· {mins} min read</span>
                    </div>
                    <div className="blog-card-title">{L(post.title)}</div>
                    <p className="blog-card-excerpt">{L(post.excerpt)}</p>
                    <div className="blog-card-cta">Read more →</div>
                  </div>
                </Link>
              );
            })}
            {posts.length === 0 && (
              <p style={{ color: 'var(--text2)', fontStyle: 'italic' }}>No posts yet.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
