import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';

interface PostMeta {
  titleEn: string;
  titleFr: string;
  excerptEn: string;
  excerptFr: string;
  date: string;
  coverImage: string;
  coverAlt: string;
  published: boolean;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function BlogEditor() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const isNew     = !slug;
  const imgRef    = useRef<HTMLInputElement>(null);

  const [meta, setMeta] = useState<PostMeta>({
    titleEn: '', titleFr: '', excerptEn: '', excerptFr: '',
    date: new Date().toISOString().slice(0, 10),
    coverImage: '', coverAlt: '', published: false,
  });
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved]       = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Start writing your post…' }),
    ],
  });

  // Load existing post
  useEffect(() => {
    if (!slug) return;
    getDoc(doc(db, 'blog_posts', slug)).then(snap => {
      if (!snap.exists()) return;
      const d = snap.data();
      setMeta({
        titleEn:    d.title?.en   ?? d.title   ?? '',
        titleFr:    d.title?.fr   ?? '',
        excerptEn:  d.excerpt?.en ?? d.excerpt ?? '',
        excerptFr:  d.excerpt?.fr ?? '',
        date:       d.date        ?? '',
        coverImage: d.coverImage  ?? '',
        coverAlt:   d.coverAlt    ?? '',
        published:  d.published   ?? false,
      });
      if (editor && d.contentHtml) {
        editor.commands.setContent(d.contentHtml);
      }
    });
  }, [slug, editor]);

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const path = `blog/${Date.now()}-${file.name}`;
      const snap = await uploadBytes(ref(storage, path), file);
      const url  = await getDownloadURL(snap.ref);
      editor?.chain().focus().setImage({ src: url }).run();
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!meta.titleEn) return alert('EN title is required');
    setSaving(true);
    const postSlug = isNew ? slugify(meta.titleEn) : slug!;
    const contentHtml = editor?.getHTML() ?? '';
    await setDoc(doc(db, 'blog_posts', postSlug), {
      slug:       postSlug,
      title:      { en: meta.titleEn, fr: meta.titleFr || meta.titleEn },
      excerpt:    { en: meta.excerptEn, fr: meta.excerptFr || meta.excerptEn },
      date:       meta.date,
      coverImage: meta.coverImage,
      coverAlt:   meta.coverAlt,
      published:  meta.published,
      contentHtml,
      authorEmail: user?.email ?? '',
      updatedAt:  serverTimestamp(),
    }, { merge: true });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    if (isNew) navigate(`/admin/blog/${postSlug}`);
  };

  const set = (k: keyof PostMeta) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setMeta(m => ({ ...m, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  return (
    <div className="admin-editor">
      <div className="admin-editor-toolbar">
        <h1 className="admin-page-title">{isNew ? 'New Post' : 'Edit Post'}</h1>
        <div className="admin-editor-actions">
          <label className="admin-toggle-label">
            <input type="checkbox" checked={meta.published} onChange={set('published')} />
            {meta.published ? 'Published' : 'Draft'}
          </label>
          <button className="admin-btn-primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
          </button>
        </div>
      </div>

      <div className="admin-editor-meta">
        <div className="admin-field-row">
          <label>Title (EN) *</label>
          <input className="admin-input" value={meta.titleEn} onChange={set('titleEn')} placeholder="Post title in English" />
        </div>
        <div className="admin-field-row">
          <label>Title (FR)</label>
          <input className="admin-input" value={meta.titleFr} onChange={set('titleFr')} placeholder="Titre en français (optionnel)" />
        </div>
        <div className="admin-field-row">
          <label>Excerpt (EN)</label>
          <textarea className="admin-input" rows={2} value={meta.excerptEn} onChange={set('excerptEn')} placeholder="Short description in English" />
        </div>
        <div className="admin-field-row">
          <label>Excerpt (FR)</label>
          <textarea className="admin-input" rows={2} value={meta.excerptFr} onChange={set('excerptFr')} placeholder="Description courte en français" />
        </div>
        <div className="admin-field-row">
          <label>Date</label>
          <input className="admin-input" type="date" value={meta.date} onChange={set('date')} />
        </div>
        <div className="admin-field-row">
          <label>Cover Image URL</label>
          <input className="admin-input" value={meta.coverImage} onChange={set('coverImage')} placeholder="https://…" />
        </div>
      </div>

      <div className="admin-editor-body">
        <div className="admin-editor-image-btn">
          <button className="admin-btn-sm" onClick={() => imgRef.current?.click()} disabled={uploading}>
            {uploading ? 'Uploading…' : '+ Insert Image'}
          </button>
          <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} />
        </div>

        {editor && (
          <div className="tiptap-toolbar">
            <button onClick={() => editor.chain().focus().toggleBold().run()}        className={editor.isActive('bold')        ? 'active' : ''}><strong>B</strong></button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()}      className={editor.isActive('italic')      ? 'active' : ''}><em>I</em></button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}>H2</button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}>H3</button>
            <button onClick={() => editor.chain().focus().toggleBlockquote().run()}  className={editor.isActive('blockquote')  ? 'active' : ''}>&#8220;&#8221;</button>
          </div>
        )}

        <EditorContent editor={editor} className="tiptap-editor" />
      </div>
    </div>
  );
}
