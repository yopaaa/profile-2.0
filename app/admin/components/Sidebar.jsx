'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  User,
  Zap,
  Briefcase,
  Layers,
  Sparkles,
  Share2,
  Repeat,
  Search,
  FileCode,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import styles from './Sidebar.module.css';
import Cookie from 'js-cookie';

const contentNavItems = [
  { id: 'personal', label: 'Personal Info', href: '/admin?tab=personal', icon: User },
  { id: 'hero', label: 'Hero Section', href: '/admin?tab=hero', icon: Zap },
  { id: 'experiences', label: 'Experiences', href: '/admin?tab=experiences', icon: Briefcase },
  { id: 'projects', label: 'Projects', href: '/admin?tab=projects', icon: Layers },
  { id: 'about', label: 'About & Skills', href: '/admin?tab=about', icon: Sparkles },
  { id: 'socials', label: 'Social Links', href: '/admin?tab=socials', icon: Share2 },
  { id: 'marquee', label: 'Marquee Strip', href: '/admin?tab=marquee', icon: Repeat },
  { id: 'seo', label: 'SEO & Metadata', href: '/admin?tab=seo', icon: Search },
  { id: 'raw', label: 'Raw JSON Editor', href: '/admin?tab=raw', icon: FileCode },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams ? searchParams.get('tab') || 'personal' : 'personal';

  useEffect(() => {
    try {
      const rawUser = Cookie.get('userInfo');
      if (rawUser) {
        setUser(JSON.parse(rawUser));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      Cookie.remove('userInfo');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Button Mobile Toggle */}
      <button className={styles.toggleBtn} onClick={toggleSidebar} aria-label="Toggle menu">
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className={styles.overlay} onClick={toggleSidebar} />}

      {/* Sidebar Container */}
      <aside className={`${styles.sidebarContainer} ${isOpen ? styles.visible : styles.hidden}`}>
        {/* Brand Header */}
        <div className={styles.header}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandDot} />
            <span className={styles.brandText}>
              yopa<span className={styles.badge}>CMS</span>
            </span>
          </Link>

          <div className={styles.userCard}>
            <div className={styles.userAvatar}>
              {user?.nama ? user.nama.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.nama || 'Admin'}</span>
              <span className={styles.userRole}>{user?.email || 'admin@yopaaa.dev'}</span>
            </div>
          </div>
        </div>

        {/* Navigation Sections with Lucide Icons */}
        <nav className={styles.nav}>
          <div className={styles.navSectionLabel}>CONTENT SECTIONS</div>
          <div className={styles.navGroup}>
            {contentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === '/admin' && currentTab === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`${styles.link} ${isActive ? styles.activeLink : ''}`}
                >
                  <Icon size={16} className={styles.menuIcon} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className={styles.navSectionLabel} style={{ marginTop: '16px' }}>
            PREFERENCES
          </div>
          <div className={styles.navGroup}>
            <Link
              href="/admin/settings"
              onClick={() => setIsOpen(false)}
              className={`${styles.link} ${pathname === '/admin/settings' ? styles.activeLink : ''}`}
            >
              <Settings size={16} className={styles.menuIcon} />
              <span>Account Settings</span>
            </Link>
          </div>
        </nav>

        {/* Footer Actions */}
        <div className={styles.footer}>
          <Link href="/" target="_blank" className={styles.liveBtn}>
            <span className={styles.liveBtnInner}>
              <ExternalLink size={14} />
              <span>Lihat Website</span>
            </span>
            <span className={styles.arrowIcon}>↗</span>
          </Link>

          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={14} />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  );
}