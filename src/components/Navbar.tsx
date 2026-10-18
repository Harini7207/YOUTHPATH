import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { 
  Compass, 
  Briefcase, 
  GraduationCap, 
  MessageSquare, 
  FileText, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  openChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate, openChat }) => {
  const { user, profile, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Explore Careers', path: '/careers', icon: Compass },
    { label: 'Find Jobs', path: '/jobs', icon: Briefcase },
    { label: 'Skill Hub', path: '/skills', icon: GraduationCap },
    { label: 'Mock Interviews', path: '/interview', icon: MessageSquare },
    { label: 'Resume Builder', path: '/resume-builder', icon: FileText },
    { label: 'About', path: '/about', icon: null },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          
          {/* Zone 1: Brand Wordmark with upward growth path icon */}
          <button 
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-2.5 text-left text-slate-900 group cursor-pointer focus:outline-none"
            aria-label="YouthPath Home"
          >
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <TrendingUp className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                Youth<span className="text-teal-600">Path</span>
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (single-line, clean text) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`cursor-pointer whitespace-nowrap transition-colors py-1 ${
                    isActive 
                      ? 'text-teal-600 font-semibold border-b-2 border-teal-600' 
                      : 'hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions (Notifications, Auth, Mobile Toggle) */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Notification Bell */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors relative cursor-pointer"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50">
                    <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900">Notifications</span>
                        <span className="text-xs text-slate-500 tabular-nums">({notifications.length})</span>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-teal-600 hover:text-teal-700 font-medium cursor-pointer"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markAsRead(n.id);
                              if (n.link) handleNavClick(n.link);
                              setNotificationsOpen(false);
                            }}
                            className={`p-3 text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                              !n.isRead ? 'bg-teal-50/40' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-semibold text-slate-800">{n.title}</span>
                              <span className="text-[10px] text-slate-400 tabular-nums shrink-0">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Authenticated User Menu or Sign In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-slate-800"
                  aria-label="User Account Menu"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase">
                    {(profile?.fullName || user.email || 'U')[0]}
                  </div>
                  <span className="hidden md:inline text-xs font-medium text-slate-700 max-w-[120px] truncate">
                    {profile?.fullName || user.email?.split('@')[0]}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{profile?.fullName || 'Youth Explorer'}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <div className="mt-2 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-teal-600 h-full transition-all duration-300" 
                          style={{ width: `${profile?.profileCompletion || 20}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 tabular-nums">
                        {profile?.profileCompletion || 20}% Profile Completed
                      </p>
                    </div>

                    <button
                      onClick={() => handleNavClick('/dashboard')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-500" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => handleNavClick('/profile')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                    >
                      <UserIcon className="w-4 h-4 text-slate-500" />
                      Edit Career Profile
                    </button>
                    <button
                      onClick={() => handleNavClick('/resume-builder')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                    >
                      <FileText className="w-4 h-4 text-slate-500" />
                      My Resumes
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={async () => {
                        await logout();
                        handleNavClick('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('/login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('/register')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap"
                >
                  Join YouthPath
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavClick(link.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left font-medium transition-colors cursor-pointer ${
                currentPath === link.path 
                  ? 'bg-teal-50 text-teal-700 font-semibold' 
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.icon && <link.icon className="w-4 h-4 text-slate-500" />}
              {link.label}
            </button>
          ))}

          {user && (
            <div className="pt-3 border-t border-slate-100 mt-2 space-y-1">
              <button
                onClick={() => handleNavClick('/dashboard')}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-500" />
                Dashboard
              </button>
              <button
                onClick={() => handleNavClick('/profile')}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                <UserIcon className="w-4 h-4 text-slate-500" />
                Profile Settings
              </button>
              <button
                onClick={async () => {
                  await logout();
                  handleNavClick('/');
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
