import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LangContext';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { PageParticles } from '../components/Particles';

export default function Blog() {
  const { L } = useLang();
  const { posts, loading } = useBlogPosts(false);

  if (loading) return <div className="page-enter" style={{ padding: '4rem 2rem', textAlign: 'center' }}>Loading…</div>;

  return (
    <>
      <PageParticles />
      <section className="blog-section">
        <div className="container">
          <div className="sec-label">Reflections</div>
          <h2 className="sec-title">Blog</h2>
          <p className="sec-intro">Ideas, perspectives, and format thinking — presented as starting points, not conclusions.</p>
          <div className="blog-grid">
            {posts.map(post => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="blog-card">
                {post.coverImage && (
                  <div className="blog-card-img" style={{ backgroundImage: `url('${post.coverImage}')` }} />
                )}
                <div className="blog-card-body">
                  <div className="blog-card-date">{post.date}</div>
                  <div className="blog-card-title">{L(post.title)}</div>
                  <p className="blog-card-excerpt">{L(post.excerpt)}</p>
                </div>
              </Link>
            ))}
            {posts.length === 0 && (
              <p style={{ color: 'var(--text2)', fontStyle: 'italic' }}>No posts yet.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
