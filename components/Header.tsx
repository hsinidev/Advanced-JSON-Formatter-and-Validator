import React from 'react';

interface HeaderProps {
    navItems: string[];
    onNavClick: (id: string) => void;
}

const Header: React.FC<HeaderProps> = ({ navItems, onNavClick }) => {
  return (
    <header className="w-full bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
             <h1 className="text-2xl font-bold text-white">Advanced JSON Formatter & Validator</h1>
          </div>
          <nav className="hidden md:flex md:space-x-4">
             {navItems.map(item => (
                <button 
                    key={item} 
                    onClick={() => onNavClick(item)} 
                    className="capitalize text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                    {item}
                </button>
             ))}
          </nav>
          {/* Mobile menu button can be added here if needed */}
        </div>
      </div>
    </header>
  );
};

export default Header;