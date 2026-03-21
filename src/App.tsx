import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import HowToPlay from './pages/HowToPlay';
import RunAnEvent from './pages/RunAnEvent';
import BannedList from './pages/BannedList';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import BlogList from './pages/admin/BlogList';
import BlogEditor from './pages/admin/BlogEditor';
import BanListEditor from './pages/admin/BanListEditor';
import WatchlistEditor from './pages/admin/WatchlistEditor';
import UserManager from './pages/admin/UserManager';

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
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/how-to-play"  element={<HowToPlay />} />
          <Route path="/run-an-event" element={<RunAnEvent />} />
          <Route path="/banned-list"  element={<BannedList />} />
          <Route path="/blog"         element={<Blog />} />
          <Route path="/blog/:slug"   element={<BlogPost />} />
        </Routes>
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
        <Route path="/admin"       element={<AdminLayout />}>
          <Route index             element={<AdminDashboard />} />
          <Route path="blog"       element={<BlogList />} />
          <Route path="blog/new"   element={<BlogEditor />} />
          <Route path="blog/:slug" element={<BlogEditor />} />
          <Route path="banlist"    element={<BanListEditor />} />
          <Route path="watchlist"  element={<WatchlistEditor />} />
          <Route path="users"      element={<UserManager />} />
        </Route>
        <Route path="/*"           element={<PublicLayout />} />
      </Routes>
    </>
  );
}
