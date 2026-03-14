import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { user, logout } = useAuth();

  const avatarLetter = (user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Dynamic page title based on current path
  const getPageTitle = () => {
    if (currentPath === '/dashboard') return 'Dashboard';
    if (currentPath === '/stock') return 'Stock';
    if (currentPath === '/history') return 'Move History';
    if (currentPath === '/settings/warehouse') return 'Warehouse';
    if (currentPath === '/settings/location') return 'Location';
    return 'Dashboard';
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    {
      name: 'Operations',
      path: '#',
      subLinks: [
        { name: 'Receipt', path: '/operations/receipt' },
        { name: 'Delivery', path: '/operations/delivery' },
        { name: 'Adjustment', path: '/operations/adjustment' }
      ]
    },
    { name: 'Stock', path: '/stock' },
    { name: 'Move History', path: '/history' },
    {
      name: 'Settings',
      path: '#',
      subLinks: [
        { name: 'Warehouse', path: '/settings/warehouse' },
        { name: 'Location', path: '/settings/location' }
      ]
    },
  ];

  return (
    <nav className="bg-[#16171d] border-b border-[#2e303a] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Left side: Navigation Links */}
      <div className="flex space-x-6 items-center">
        {navLinks.map((link) => (
          <div key={link.name} className="relative group">
            {link.subLinks ? (
              <>
                <button
                  className={`flex items-center text-sm font-medium transition-colors hover:text-purple-400 ${currentPath.startsWith(link.path === '#' ? `/${link.name.toLowerCase()}` : link.path)
                    ? 'text-purple-400'
                    : 'text-gray-400'
                    }`}
                >
                  {link.name}
                  <ChevronDown className="ml-1 w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute left-0 top-full pt-4 hidden group-hover:block z-50">
                  <div className="bg-[#1f2028] border border-[#2e303a] rounded-lg shadow-xl overflow-hidden min-w-[160px] whitespace-nowrap animate-in fade-in slide-in-from-top-2 duration-200">
                    {link.subLinks.map((subLink) => (
                      <Link
                        key={subLink.name}
                        to={subLink.path}
                        className="block px-4 py-3 text-sm text-gray-400 hover:text-purple-400 hover:bg-[#2e303a] transition-colors"
                      >
                        {subLink.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <Link
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-purple-400 ${currentPath === link.path ? 'text-purple-400' : 'text-gray-400'
                  }`}
              >
                {link.name}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Right side: Page Title, Avatar & Logout */}
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-white tracking-wide">
          {getPageTitle()}
        </h1>
        <div className="flex items-center space-x-3">
          <div className="relative group/avatar">
            <div className="h-10 w-10 rounded-lg bg-[#2e303a] border border-[#3e404a] flex items-center justify-center text-white font-bold shadow-[0_0_10px_rgba(168,85,247,0.2)] cursor-default select-none hover:border-purple-500/60 transition-colors">
              {avatarLetter}
            </div>
            {/* Hover Tooltip */}
            <div className="absolute right-0 top-full mt-3 w-56 hidden group-hover/avatar:block z-50">
              <div className="bg-[#1f2028] border border-[#2e303a] rounded-xl shadow-2xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center gap-3 pb-3 border-b border-[#2e303a]">
                  <div className="h-9 w-9 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-sm shrink-0">
                    {avatarLetter}
                  </div>
                  <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Profile</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">Login ID</p>
                    <p className="text-xs font-mono text-purple-300 truncate">{user?.name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">Email</p>
                    <p className="text-xs text-gray-200 truncate">{user?.email || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">Role</p>
                    <p className="text-xs text-gray-200 truncate">{user?.role || '—'}</p>
                  </div>
                </div>
              </div>
              {/* Arrow */}
              <div className="absolute -top-1.5 right-3 w-3 h-3 bg-[#1f2028] border-l border-t border-[#2e303a] rotate-45"></div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-[#2e303a] transition-colors bg-transparent border-none cursor-pointer"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

