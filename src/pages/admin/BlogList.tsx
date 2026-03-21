import { Link } from 'react-router-dom';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useBlogPosts } from '../../hooks/useBlogPosts';

export default function BlogList() {
  const { posts, loading } = useBlogPosts(true);

  const togglePublished = async (slug: string, current: boolean) => {
    await updateDoc(doc(db, 'blog_posts', slug), { published: !current });
  };

  const deletePost = async (slug: string) => {
    if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return;
    await deleteDoc(doc(db, 'blog_posts', slug));
  };

  if (loading) return <div className="admin-loading">Loading posts…</div>;

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h1 className="admin-page-title">Blog Posts</h1>
        <Link to="/admin/blog/new" className="admin-btn-primary">+ New Post</Link>
      </div>
      <table className="admin-table">
        <thead>
          <tr><th>Title</th><th>Date</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {posts.map(p => (
            <tr key={p.slug}>
              <td>{p.title}</td>
              <td>{p.date}</td>
              <td>
                <button
                  className={`admin-toggle ${(p as any).published ? 'published' : 'draft'}`}
                  onClick={() => togglePublished(p.slug, (p as any).published)}
                >
                  {(p as any).published ? 'Published' : 'Draft'}
                </button>
              </td>
              <td className="admin-table-actions">
                <Link to={`/admin/blog/${p.slug}`} className="admin-btn-sm">Edit</Link>
                <button className="admin-btn-sm danger" onClick={() => deletePost(p.slug)}>Delete</button>
              </td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr><td colSpan={4} className="admin-empty">No posts yet. <Link to="/admin/blog/new">Create one →</Link></td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
