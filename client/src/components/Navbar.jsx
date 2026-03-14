import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const Navbar = ({ user = { loginId: 'admin' } }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Derive the first letter of the user's loginId for the avatar
  const avatarLetter = (user?.loginId?.[0] || 'U').toUpperCase();

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

      {/* Right side: Page Title & Avatar */}
      <div className="flex items-center space-x-6">
        <h1 className="text-xl font-bold text-white tracking-wide">
          Dashboard
        </h1>
        <div className="h-10 w-10 rounded-lg bg-[#2e303a] border border-[#3e404a] flex items-center justify-center text-white font-bold shadow-[0_0_10px_rgba(168,85,247,0.2)]">
          {avatarLetter}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
