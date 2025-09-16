import React, { useState } from 'react';
import { MagicWandIcon } from './icons';

interface LoginScreenProps {
  onLogin: (password: string) => boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(password);
    if (!success) {
      setError('Mật khẩu không đúng. Vui lòng thử lại.');
      setPassword('');
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-4">
            <MagicWandIcon />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              ẢNH THẺ PHOTO DŨNG
            </h1>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold text-center text-gray-300">Đăng nhập</h2>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />
            </div>

            {error && (
              <p className="text-sm text-center text-red-400 bg-red-900/50 p-3 rounded-lg border border-red-500">
                {error}
              </p>
            )}

            <div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 duration-300 ease-in-out shadow-lg"
              >
                Truy cập
              </button>
            </div>
          </form>
        </div>
        <footer className="text-center mt-8 text-gray-500 text-sm">
            <p>164 Trần Hưng Đạo, Ayunpa. Hotline 0905590404</p>
        </footer>
      </div>
    </div>
  );
};

export default LoginScreen;