import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Node, Mark, mergeAttributes } from '@tiptap/core';
import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import type { NodeViewProps, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';

// ── Types ────────────────────────────────────────────────────────
interface GalleryImage { src: string; alt: string; title: string; }
interface PostMeta {
  titleEn: string; titleFr: string;
  excerptEn: string; excerptFr: string;
  date: string; coverImage: string; coverAlt: string; published: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────
function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
function isTipTapEmpty(html: string) { return !html || html === '<p></p>'; }
function wordCount(html: string) {
  return html.replace(/<[^>]+>/g, '').trim().split(/\s+/).filter(Boolean).length;
}

// ── Gallery NodeView (React component rendered inside TipTap) ────
function GalleryView({ node, deleteNode }: NodeViewProps) {
  const images: GalleryImage[] = node.attrs.images ?? [];
  const galleryType: string    = node.attrs.galleryType ?? 'img';
  const isCard = galleryType === 'card';

  const [loaded, setLoaded] = useState<boolean[]>(() => images.map(() => false));
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

  // Handle images already cached in the browser (onLoad won't fire for them)
  useEffect(() => {
    imgRefs.current.forEach((el, i) => {
      if (el?.complete) setLoaded(prev => { const n = [...prev]; n[i] = true; return n; });
    });
  }, []);

  const markLoaded = (i: number) =>
    setLoaded(prev => { const n = [...prev]; n[i] = true; return n; });

  return (
    <NodeViewWrapper>
      <div className={`editor-gallery-block${isCard ? ' editor-gallery-card' : ''}`} contentEditable={false}>
        <div className="editor-gallery-badge">
          <span>{isCard ? 'Card Gallery' : 'Photo Gallery'} · {images.length} image{images.length !== 1 ? 's' : ''}</span>
          <button className="editor-gallery-delete" onClick={deleteNode} title="Remove gallery">×</button>
        </div>
        <div className={isCard ? 'card-gallery' : 'img-gallery'}>
          {images.map((img, i) => (
            <div key={i} className="editor-gallery-img-wrap">
              {!loaded[i] && <div className="editor-gallery-skel" />}
              <img
                ref={el => { imgRefs.current[i] = el; }}
                src={img.src} alt={img.alt} title={img.title}
                style={{ opacity: loaded[i] ? 1 : 0 }}
                onLoad={() => markLoaded(i)}
              />
            </div>
          ))}
        </div>
      </div>
    </NodeViewWrapper>
  );
}

// ── Gallery TipTap extension ─────────────────────────────────────
const Gallery = Node.create({
  name: 'gallery',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      galleryType: {
        default: 'img',
        parseHTML: el => el.classList.contains('card-gallery') ? 'card' : 'img',
        renderHTML: () => ({}),
      },
      images: {
        default: [],
        parseHTML: el =>
          Array.from(el.querySelectorAll('img')).map(img => ({
            src: img.getAttribute('src') ?? '',
            alt: img.getAttribute('alt') ?? '',
            title: img.getAttribute('title') ?? '',
          })),
        renderHTML: () => ({}),
      },
    };
  },

  parseHTML() {
    return [
      { tag: 'div.img-gallery' },
      { tag: 'div.card-gallery' },
    ];
  },

  renderHTML({ node }) {
    const images: GalleryImage[] = node.attrs.images ?? [];
    const galleryType: string    = node.attrs.galleryType ?? 'img';
    const cls = galleryType === 'card' ? 'card-gallery' : 'img-gallery';
    const imgSpecs = images.map(img =>
      ['img', { src: img.src, alt: img.alt, title: img.title }] as [string, Record<string, string>]
    );
    return ['div', { class: cls }, ...imgSpecs] as unknown as [string, ...unknown[]];
  },

  addNodeView() {
    return ReactNodeViewRenderer(GalleryView);
  },
});

// ── CardTooltip Mark ─────────────────────────────────────────────
const CardTooltip = Mark.create({
  name: 'cardTooltip',
  addAttributes() {
    return {
      cardName: {
        default: null,
        parseHTML: el => el.getAttribute('data-card'),
        renderHTML: attrs => ({ 'data-card': attrs.cardName, class: 'card-ref' }),
      },
    };
  },
  parseHTML() { return [{ tag: 'span[data-card]' }]; },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0];
  },
});

// ── Card Insert Dialog ────────────────────────────────────────────
function CardInsertDialog({ selectedText, onInsert, onClose }: {
  selectedText: string;
  onInsert: (cardName: string, displayText: string) => void;
  onClose: () => void;
}) {
  const [cardName, setCardName]       = useState(selectedText);
  const [displayText, setDisplayText] = useState(selectedText);
  const [preview, setPreview]         = useState<string | null>(null);
  const [checking, setChecking]       = useState(false);
  const [error, setError]             = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const check = async () => {
    if (!cardName.trim()) return;
    setChecking(true); setError(''); setPreview(null);
    try {
      const res = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName.trim())}`);
      if (!res.ok) { setError('Card not found'); return; }
      const data = await res.json();
      setPreview(data.image_uris?.small ?? data.card_faces?.[0]?.image_uris?.small ?? null);
      if (!displayText || displayText === selectedText) setDisplayText(data.name);
      setCardName(data.name); // normalize to exact name
    } catch { setError('Network error'); }
    finally { setChecking(false); }
  };

  return (
    <div className="card-insert-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="card-insert-dialog">
        <div className="card-insert-title">Insert Card Reference</div>
        <div className="card-insert-row">
          <label>Card name</label>
          <div style={{ display: 'flex', gap: '.5rem' }}>
            <input ref={inputRef} className="admin-input" value={cardName}
              onChange={e => { setCardName(e.target.value); setPreview(null); setError(''); }}
              onKeyDown={e => { if (e.key === 'Enter') check(); if (e.key === 'Escape') onClose(); }}
              placeholder="e.g. Sol Ring" />
            <button className="admin-btn-sm" onClick={check} disabled={checking}>
              {checking ? '…' : 'Check'}
            </button>
          </div>
        </div>
        <div className="card-insert-row">
          <label>Display text</label>
          <input className="admin-input" value={displayText}
            onChange={e => setDisplayText(e.target.value)}
            placeholder="Defaults to card name" />
        </div>
        {error && <div className="card-insert-error">{error}</div>}
        {preview && <img className="card-insert-preview" src={preview} alt={cardName} />}
        <div className="card-insert-actions">
          <button className="admin-btn-sm" onClick={onClose}>Cancel</button>
          <button className="admin-btn-primary" disabled={!cardName.trim()}
            onClick={() => onInsert(cardName.trim(), displayText.trim() || cardName.trim())}>
            Insert
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Toolbar ──────────────────────────────────────────────────────
interface ToolbarProps {
  editor: Editor | null;
  onImage: () => void; onGallery: () => void; onCards: () => void; onCardRef: () => void;
  uploading: boolean; uploadMsg: string;
}
function Toolbar({ editor, onImage, onGallery, onCards, onCardRef, uploading, uploadMsg }: ToolbarProps) {
  if (!editor) return null;
  const btn = (label: string, active: boolean, onClick: () => void, title?: string) => (
    <button onClick={onClick} className={active ? 'active' : ''} title={title ?? label}>{label}</button>
  );
  const insertLabel = uploading && uploadMsg && !uploadMsg.includes('cover') ? uploadMsg : '+ Image';
  return (
    <div className="tiptap-toolbar">
      {btn('B',  editor.isActive('bold'),      () => editor.chain().focus().toggleBold().run(), 'Bold')}
      {btn('I',  editor.isActive('italic'),    () => editor.chain().focus().toggleItalic().run(), 'Italic')}
      {btn('S̶',  editor.isActive('strike'),    () => editor.chain().focus().toggleStrike().run(), 'Strikethrough')}
      <div className="tiptap-toolbar-sep" />
      {btn('H2', editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), 'Heading 2')}
      {btn('H3', editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), 'Heading 3')}
      <div className="tiptap-toolbar-sep" />
      {btn('•',  editor.isActive('bulletList'),  () => editor.chain().focus().toggleBulletList().run(), 'Bullet list')}
      {btn('1.', editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), 'Numbered list')}
      <div className="tiptap-toolbar-sep" />
      {btn('❝❞', editor.isActive('blockquote'), () => editor.chain().focus().toggleBlockquote().run(), 'Blockquote')}
      {btn('`',  editor.isActive('code'),        () => editor.chain().focus().toggleCode().run(), 'Inline code')}
      {btn('—',  false, () => editor.chain().focus().setHorizontalRule().run(), 'Horizontal rule')}
      <div className="tiptap-toolbar-sep" />
      <button onClick={onImage} disabled={uploading} title="Insert single image at cursor">{insertLabel}</button>
      <button onClick={onGallery} disabled={uploading} title="Insert photo gallery at cursor">Gallery</button>
      <button onClick={onCards} disabled={uploading} title="Upload card images as a card gallery">Cards</button>
      <button onClick={onCardRef} className={editor?.isActive('cardTooltip') ? 'active' : ''} title="Insert card hover reference">Card ref</button>
    </div>
  );
}

// ── Cover Crop Modal ─────────────────────────────────────────────
const CANVAS_W = 480;
const CANVAS_H = 270;

function CoverCropModal({ file, onApply, onCancel }: {
  file: File; onApply: (blob: Blob) => void; onCancel: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [img, setImg]         = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom]       = useState(1);
  const [minZoom, setMinZoom] = useState(0.1);
  const [offset, setOffset]   = useState({ x: 0, y: 0 });
  const dragging  = useRef(false);
  const dragStart = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });

  useEffect(() => {
    let cancelled = false;
    const reader = new FileReader();
    reader.onload = e => {
      if (cancelled) return;
      const dataUrl = e.target?.result as string;
      const image = new window.Image();
      image.onload = () => {
        if (cancelled) return;
        const fill = Math.max(CANVAS_W / image.naturalWidth, CANVAS_H / image.naturalHeight);
        setMinZoom(fill); setZoom(fill); setOffset({ x: 0, y: 0 }); setImg(image);
      };
      image.src = dataUrl;
    };
    reader.readAsDataURL(file);
    return () => { cancelled = true; };
  }, [file]);

  const clamp = useCallback((ox: number, oy: number, z: number, image: HTMLImageElement) => {
    const w = image.naturalWidth * z;
    const h = image.naturalHeight * z;
    const maxX = Math.max(0, (w - CANVAS_W) / 2);
    const maxY = Math.max(0, (h - CANVAS_H) / 2);
    return { x: Math.max(-maxX, Math.min(maxX, ox)), y: Math.max(-maxY, Math.min(maxY, oy)) };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d')!;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    if (!img) {
      ctx.fillStyle = 'rgba(20,20,30,1)'; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '13px sans-serif';
      ctx.textAlign = 'center'; ctx.fillText('Loading image…', CANVAS_W / 2, CANVAS_H / 2);
      return;
    }
    const w = img.naturalWidth * zoom, h = img.naturalHeight * zoom;
    const x = (CANVAS_W - w) / 2 + offset.x, y = (CANVAS_H - h) / 2 + offset.y;
    ctx.drawImage(img, x, y, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    for (let i = 1; i < 3; i++) {
      ctx.beginPath(); ctx.moveTo(CANVAS_W * i / 3, 0); ctx.lineTo(CANVAS_W * i / 3, CANVAS_H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, CANVAS_H * i / 3); ctx.lineTo(CANVAS_W, CANVAS_H * i / 3); ctx.stroke();
    }
    ctx.setLineDash([]);
    const C = 14; ctx.strokeStyle = 'rgba(212,176,90,0.9)'; ctx.lineWidth = 2.5;
    const corners: [number, number, number, number, number, number][] = [
      [0, 0, C, 0, 0, C], [CANVAS_W, 0, CANVAS_W-C, 0, CANVAS_W, C],
      [0, CANVAS_H, C, CANVAS_H, 0, CANVAS_H-C], [CANVAS_W, CANVAS_H, CANVAS_W-C, CANVAS_H, CANVAS_W, CANVAS_H-C],
    ];
    for (const [sx, sy, ex1, ey1, ex2, ey2] of corners) {
      ctx.beginPath(); ctx.moveTo(ex1, ey1); ctx.lineTo(sx, sy); ctx.lineTo(ex2, ey2); ctx.stroke();
    }
    ctx.font = 'bold 10px monospace'; ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, CANVAS_H - 20, 108, 20); ctx.fillStyle = 'rgba(212,176,90,0.9)';
    ctx.textAlign = 'left'; ctx.fillText('  CROP FRAME · 1200×630', 0, CANVAS_H - 7);
  }, [img, zoom, offset]);

  const startDrag = (mx: number, my: number) => { dragging.current = true; dragStart.current = { mx, my, ox: offset.x, oy: offset.y }; };
  const moveDrag  = (mx: number, my: number) => {
    if (!dragging.current || !img) return;
    setOffset(clamp(dragStart.current.ox + (mx - dragStart.current.mx), dragStart.current.oy + (my - dragStart.current.my), zoom, img));
  };
  const endDrag = () => { dragging.current = false; };
  const handleZoom = (z: number) => { setZoom(z); if (img) setOffset(o => clamp(o.x, o.y, z, img)); };

  const apply = () => {
    if (!img) return;
    const OUT_W = 1200, OUT_H = 630, scale = OUT_W / CANVAS_W;
    const offscreen = document.createElement('canvas');
    offscreen.width = OUT_W; offscreen.height = OUT_H;
    const ctx = offscreen.getContext('2d')!;
    const w = img.naturalWidth * zoom * scale, h = img.naturalHeight * zoom * scale;
    ctx.drawImage(img, (OUT_W - w) / 2 + offset.x * scale, (OUT_H - h) / 2 + offset.y * scale, w, h);
    offscreen.toBlob(blob => blob && onApply(blob), 'image/jpeg', 0.92);
  };

  return (
    <div className="cover-crop-overlay" onClick={e => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="cover-crop-modal">
        <div className="cover-crop-title">Reframe Cover Image</div>
        <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="cover-crop-canvas"
          onMouseDown={e => startDrag(e.clientX, e.clientY)} onMouseMove={e => moveDrag(e.clientX, e.clientY)}
          onMouseUp={endDrag} onMouseLeave={endDrag}
          onTouchStart={e => { const t = e.touches[0]; startDrag(t.clientX, t.clientY); }}
          onTouchMove={e => { const t = e.touches[0]; moveDrag(t.clientX, t.clientY); }}
          onTouchEnd={endDrag} />
        <div className="cover-crop-hint">Drag to reframe · use slider to zoom</div>
        <div className="cover-crop-zoom">
          <label>Zoom</label>
          <input type="range" min={minZoom} max={Math.max(minZoom * 4, 3)} step={0.01} value={zoom}
            onChange={e => handleZoom(Number(e.target.value))} />
          <span style={{ fontSize: '.78rem', color: 'var(--text2)', minWidth: '3rem' }}>
            {Math.round(zoom / minZoom * 100)}%
          </span>
        </div>
        <div className="cover-crop-actions">
          <button className="admin-btn-sm" onClick={onCancel}>Cancel</button>
          <button className="admin-btn-primary" onClick={apply} disabled={!img}>Apply</button>
        </div>
      </div>
    </div>
  );
}

// ── Editor extensions (stable reference — defined outside component) ──
const EXTENSIONS = [
  StarterKit,
  Image,
  Gallery,
  CardTooltip,
  Link.configure({ openOnClick: false }),
];

// ── Main component ───────────────────────────────────────────────
export default function BlogEditor() {
  const { slug }  = useParams<{ slug?: string }>();
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const isNew     = !slug;

  const imgRef        = useRef<HTMLInputElement>(null);
  const galleryRef    = useRef<HTMLInputElement>(null);
  const cardsRef      = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [activeLang, setActiveLang] = useState<'en' | 'fr'>('en');
  const [meta, setMeta] = useState<PostMeta>({
    titleEn: '', titleFr: '', excerptEn: '', excerptFr: '',
    date: new Date().toISOString().slice(0, 10),
    coverImage: '', coverAlt: '', published: false,
  });
  const [coverImgError, setCoverImgError] = useState(false);
  const [cropFile, setCropFile]     = useState<File | null>(null);
  const [saving, setSaving]         = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [uploadMsg, setUploadMsg]   = useState('');
  const [saved, setSaved]           = useState(false);
  const [cardDialog, setCardDialog] = useState<{ selectedText: string } | null>(null);

  const editorEn = useEditor({
    extensions: [
      ...EXTENSIONS,
      Placeholder.configure({ placeholder: 'Start writing your post in English…' }),
    ],
  });
  const editorFr = useEditor({
    extensions: [
      ...EXTENSIONS,
      Placeholder.configure({ placeholder: 'Commencez à écrire votre article en français…' }),
    ],
  });

  const activeEditor = activeLang === 'en' ? editorEn : editorFr;
  const activeHtml   = activeEditor?.getHTML() ?? '';
  const mins = Math.max(1, Math.ceil(wordCount(activeHtml) / 200));

  // Load existing post
  useEffect(() => {
    if (!slug) return;
    getDoc(doc(db, 'blog_posts', slug)).then(snap => {
      if (!snap.exists()) return;
      const d = snap.data();
      setMeta({
        titleEn: d.title?.en ?? d.title ?? '', titleFr: d.title?.fr ?? '',
        excerptEn: d.excerpt?.en ?? d.excerpt ?? '', excerptFr: d.excerpt?.fr ?? '',
        date: d.date ?? '', coverImage: d.coverImage ?? '',
        coverAlt: d.coverAlt ?? '', published: d.published ?? false,
      });
      const html = d.contentHtml;
      const enHtml = typeof html === 'string' ? html : (html?.en ?? '');
      const frHtml = typeof html === 'string' ? '' : (html?.fr ?? '');
      if (editorEn && enHtml) editorEn.commands.setContent(enHtml);
      if (editorFr && frHtml) editorFr.commands.setContent(frHtml);
    });
  }, [slug, editorEn, editorFr]);

  useEffect(() => { setCoverImgError(false); }, [meta.coverImage]);

  // ── Image upload (single) ────────────────────────────────────
  const uploadImage = async (file: File) => {
    setUploading(true); setUploadMsg('Uploading…');
    try {
      const path = `blog/${Date.now()}-${file.name}`;
      const snap = await uploadBytes(ref(storage, path), file);
      const url  = await getDownloadURL(snap.ref);
      activeEditor?.chain().focus().setImage({ src: url }).run();
    } finally { setUploading(false); setUploadMsg(''); }
  };

  // ── Photo gallery upload ─────────────────────────────────────
  const uploadGallery = async (files: FileList) => {
    const total = files.length;
    let done = 0;
    setUploading(true); setUploadMsg(`Uploading 0/${total}…`);
    try {
      const images: GalleryImage[] = [];
      for (const file of Array.from(files)) {
        const path = `blog/gallery/${Date.now()}-${file.name}`;
        const snap = await uploadBytes(ref(storage, path), file);
        images.push({ src: await getDownloadURL(snap.ref), alt: '', title: '' });
        done++; setUploadMsg(`Uploading ${done}/${total}…`);
      }
      activeEditor?.chain().focus().insertContent({
        type: 'gallery',
        attrs: { images, galleryType: 'img' },
      }).run();
    } finally { setUploading(false); setUploadMsg(''); }
  };

  // ── Cover upload + crop ──────────────────────────────────────
  const applyCrop = async (blob: Blob) => {
    setCropFile(null); setUploading(true); setUploadMsg('Uploading cover…');
    try {
      const path = `blog/covers/${Date.now()}.jpg`;
      const snap = await uploadBytes(ref(storage, path), blob);
      const url  = await getDownloadURL(snap.ref);
      setMeta(m => ({ ...m, coverImage: url }));
    } finally { setUploading(false); setUploadMsg(''); }
  };

  // ── Card gallery upload ───────────────────────────────────────
  const uploadCardGallery = async (files: FileList) => {
    const total = files.length;
    let done = 0;
    setUploading(true); setUploadMsg(`Uploading 0/${total}…`);
    try {
      const images: GalleryImage[] = [];
      for (const file of Array.from(files)) {
        const path = `blog/cards/${Date.now()}-${file.name}`;
        const snap = await uploadBytes(ref(storage, path), file);
        images.push({ src: await getDownloadURL(snap.ref), alt: file.name.replace(/\.[^.]+$/, ''), title: '' });
        done++; setUploadMsg(`Uploading ${done}/${total}…`);
      }
      activeEditor?.chain().focus().insertContent({
        type: 'gallery',
        attrs: { images, galleryType: 'card' },
      }).run();
    } finally { setUploading(false); setUploadMsg(''); }
  };

  // ── Card reference ───────────────────────────────────────────
  const openCardDialog = () => {
    const selectedText = activeEditor?.state.selection.empty
      ? ''
      : activeEditor?.state.doc.textBetween(
          activeEditor.state.selection.from,
          activeEditor.state.selection.to,
        ) ?? '';
    setCardDialog({ selectedText });
  };

  const insertCardRef = (cardName: string, displayText: string) => {
    if (!activeEditor) return;
    const { from, to } = activeEditor.state.selection;
    activeEditor
      .chain()
      .focus()
      .deleteRange({ from, to })
      .insertContent({
        type: 'text',
        text: displayText,
        marks: [{ type: 'cardTooltip', attrs: { cardName } }],
      })
      .run();
    setCardDialog(null);
  };

  // ── Save ─────────────────────────────────────────────────────
  const save = async () => {
    if (!meta.titleEn) return alert('EN title is required');
    setSaving(true);
    const postSlug = isNew ? slugify(meta.titleEn) : slug!;
    const enHtml = editorEn?.getHTML() ?? '';
    const frHtml = editorFr?.getHTML() ?? '';
    const contentHtml = isTipTapEmpty(frHtml) ? { en: enHtml, fr: '' } : { en: enHtml, fr: frHtml };
    await setDoc(doc(db, 'blog_posts', postSlug), {
      slug: postSlug,
      title:   { en: meta.titleEn, fr: meta.titleFr || meta.titleEn },
      excerpt: { en: meta.excerptEn, fr: meta.excerptFr || meta.excerptEn },
      date: meta.date, coverImage: meta.coverImage, coverAlt: meta.coverAlt,
      published: meta.published, contentHtml,
      authorEmail: user?.email ?? '', updatedAt: serverTimestamp(),
    }, { merge: true });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    if (isNew) navigate(`/admin/blog/${postSlug}`);
  };

  const set = (k: keyof PostMeta) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setMeta(m => ({ ...m, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

const previewTitle  = activeLang === 'fr' ? (meta.titleFr || meta.titleEn) : meta.titleEn;

  return (
    <div className="admin-editor">

      {cropFile && <CoverCropModal file={cropFile} onApply={applyCrop} onCancel={() => setCropFile(null)} />}
      {cardDialog && (
        <CardInsertDialog
          selectedText={cardDialog.selectedText}
          onInsert={insertCardRef}
          onClose={() => setCardDialog(null)}
        />
      )}

      {/* Hidden file inputs */}
      <input ref={coverInputRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) { setCropFile(f); e.target.value = ''; } }} />
      <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} />
      <input ref={galleryRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
        onChange={e => e.target.files?.length && uploadGallery(e.target.files)} />
      <input ref={cardsRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
        onChange={e => e.target.files?.length && uploadCardGallery(e.target.files)} />

      {/* Top bar */}
      <div className="admin-editor-toolbar">
        <h1 className="admin-page-title">{isNew ? 'New Post' : 'Edit Post'}</h1>
        <div className="admin-editor-actions">
          <label className="admin-toggle-switch">
            <input type="checkbox" checked={meta.published} onChange={set('published')} />
            <span className="admin-toggle-track" />
            <span className="admin-toggle-text">{meta.published ? 'Published' : 'Draft'}</span>
          </label>
          {slug && (
            <a className="admin-btn-sm" href={`/blog/${slug}`} target="_blank" rel="noreferrer" title="Open public post in new tab">
              Preview
            </a>
          )}
          <button className="admin-btn-primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {/* Metadata: fields + cover sidebar */}
      <div className="admin-editor-meta">
        <div className="admin-editor-meta-fields">
          <div className="admin-field-row">
            <label>Title (EN) *</label>
            <input className="admin-input" value={meta.titleEn} onChange={set('titleEn')} placeholder="Post title in English" />
          </div>
          <div className="admin-field-row">
            <label>Title (FR)</label>
            <input className="admin-input" value={meta.titleFr} onChange={set('titleFr')} placeholder="Titre en français" />
          </div>
          <div className="admin-field-row">
            <label>Excerpt (EN)</label>
            <textarea className="admin-input" rows={2} value={meta.excerptEn} onChange={set('excerptEn')} placeholder="Short description in English" />
          </div>
          <div className="admin-field-row">
            <label>Excerpt (FR)</label>
            <textarea className="admin-input" rows={2} value={meta.excerptFr} onChange={set('excerptFr')} placeholder="Description courte en français" />
          </div>
          <div className="admin-field-row full-row">
            <label>Date</label>
            <input className="admin-input" type="date" value={meta.date} onChange={set('date')} style={{ maxWidth: 180 }} />
          </div>
          <div className="admin-field-row full-row">
            <label>Cover Alt Text</label>
            <input className="admin-input" value={meta.coverAlt} onChange={set('coverAlt')} placeholder="Describe the image for accessibility" />
          </div>
        </div>

        {/* Cover sidebar */}
        <div className="admin-editor-meta-cover">
          {meta.coverImage && !coverImgError ? (
            <img className="admin-editor-meta-cover-img" src={meta.coverImage} alt={meta.coverAlt || 'Cover'}
              title="Click to reframe" onError={() => setCoverImgError(true)}
              onClick={() => coverInputRef.current?.click()} />
          ) : (
            <div className="admin-editor-meta-cover-empty" onClick={() => coverInputRef.current?.click()}>
              <span>Upload cover image</span>
              <span style={{ opacity: .55, fontSize: '.68rem' }}>1200 × 630 recommended</span>
            </div>
          )}
          <button className="admin-btn-sm" style={{ width: '100%' }}
            onClick={() => coverInputRef.current?.click()} disabled={uploading}>
            {uploading && uploadMsg ? uploadMsg : meta.coverImage ? 'Replace & Reframe' : 'Upload Cover'}
          </button>
          <div className="admin-field-row" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '.72rem', opacity: .7 }}>or paste a URL</label>
            <input className="admin-input" value={meta.coverImage} onChange={set('coverImage')} placeholder="https://…" />
          </div>
        </div>
      </div>

      {/* Live post-header preview */}
      <div className="editor-preview-header">
        {meta.coverImage && !coverImgError
          ? <div className="editor-preview-hero" style={{ backgroundImage: `url('${meta.coverImage}')` }} />
          : <div className="editor-preview-empty-hero" />
        }
        <div className="editor-preview-body">
          <div className="blog-post-date">{meta.date || 'Date'}</div>
          <div className="blog-post-readtime">{mins} min read</div>
          <h1 className="blog-post-title" style={{ opacity: previewTitle ? 1 : 0.3, marginBottom: 0 }}>
            {previewTitle || 'Post title will appear here…'}
          </h1>
        </div>
      </div>

      {/* Editor body */}
      <div className="admin-editor-body">
        {/* Language tabs */}
        <div className="editor-lang-tabs">
          <button className={`editor-lang-tab${activeLang === 'en' ? ' active' : ''}`} onClick={() => setActiveLang('en')}>EN</button>
          <button className={`editor-lang-tab${activeLang === 'fr' ? ' active' : ''}`} onClick={() => setActiveLang('fr')}>FR</button>
        </div>

        {/* Sticky toolbar + card panel */}
        <Toolbar editor={activeEditor}
          onImage={() => imgRef.current?.click()}
          onGallery={() => galleryRef.current?.click()}
          onCards={() => cardsRef.current?.click()}
          onCardRef={openCardDialog}
          uploading={uploading} uploadMsg={uploadMsg} />

        {/* EN editor */}
        <div style={{ display: activeLang === 'en' ? 'block' : 'none' }}>
          <EditorContent editor={editorEn} className="tiptap-editor" />
        </div>
        {/* FR editor */}
        <div style={{ display: activeLang === 'fr' ? 'block' : 'none' }}>
          <EditorContent editor={editorFr} className="tiptap-editor" />
        </div>
      </div>
    </div>
  );
}
