import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Nav from './components/Nav';
import Footer from './components/Footer';

// Public pages — each becomes its own JS chunk
const Home         = lazy(() => import('./pages/Home'));
const HowToPlay    = lazy(() => import('./pages/HowToPlay'));
const RunAnEvent   = lazy(() => import('./pages/RunAnEvent'));
const BannedList   = lazy(() => import('./pages/BannedList'));
const Blog         = lazy(() => import('./pages/Blog'));
const BlogPost     = lazy(() => import('./pages/BlogPost'));

// Admin pages — heavy (TipTap, editors) — never sent to public visitors
const AdminLayout    = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const BlogList       = lazy(() => import('./pages/admin/BlogList'));
const BlogEditor     = lazy(() => import('./pages/admin/BlogEditor'));
const BanListEditor  = lazy(() => import('./pages/admin/BanListEditor'));
const WatchlistEditor = lazy(() => import('./pages/admin/WatchlistEditor'));
const UserManager    = lazy(() => import('./pages/admin/UserManager'));

/** Minimal full-page fade shown while a lazy chunk is downloading */
function PageSkeleton() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text2)',
      fontSize: '0.875rem',
      letterSpacing: '0.1em',
    }}>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PublicLayout() {
  return (
    <>
      <Nav />
      <div id="page-content">
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/"             element={<Home />} />
            <Route path="/how-to-play"  element={<HowToPlay />} />
            <Route path="/run-an-event" element={<RunAnEvent />} />
            <Route path="/banned-list"  element={<BannedList />} />
            <Route path="/blog"         element={<Blog />} />
            <Route path="/blog/:slug"   element={<BlogPost />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/admin" element={
          <Suspense fallback={<PageSkeleton />}>
            <AdminLayout />
          </Suspense>
        }>
          <Route index            element={<AdminDashboard />} />
          <Route path="blog"      element={<BlogList />} />
          <Route path="blog/new"  element={<BlogEditor />} />
          <Route path="blog/:slug" element={<BlogEditor />} />
          <Route path="banlist"   element={<BanListEditor />} />
          <Route path="watchlist" element={<WatchlistEditor />} />
          <Route path="users"     element={<UserManager />} />
        </Route>
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </>
  );
}
