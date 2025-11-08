
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 px-4 sm:px-6 lg:px-8">
      <div className="text-center text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} All Rights Reserved.
        </p>
        <p className="mt-1">
          Powered by{' '}
          <a
            href="https://github.com/hsinidev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-yellow-500 hover:text-yellow-400 transition"
          >
            HSINI MOHAMED
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
