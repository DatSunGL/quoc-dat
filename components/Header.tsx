import React from 'react';
import { MagicWandIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="inline-flex items-center gap-4">
        <MagicWandIcon />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          ẢNH THẺ PHOTO DŨNG
        </h1>
      </div>
      <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
        164 Trần Hưng Đạo, Ayunpa. Hotline 0905590404
      </p>
    </header>
  );
};

export default Header;