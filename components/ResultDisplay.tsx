import React from 'react';
import { DownloadIcon, SparklesIcon } from './icons';

interface ResultDisplayProps {
  imageSrc: string;
  filename: string;
  onUpscale: () => void;
  isUpscaling: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ imageSrc, filename, onUpscale, isUpscaling }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full bg-dots-pattern rounded-lg overflow-hidden shadow-lg border border-gray-700">
        <img src={imageSrc} alt="Kết quả đã xử lý" className="w-full h-auto object-contain" />
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          href={imageSrc}
          download={filename}
          className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 duration-300 ease-in-out shadow-lg"
        >
          <DownloadIcon />
          Tải xuống
        </a>
        <button
          onClick={onUpscale}
          disabled={isUpscaling}
          className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 duration-300 ease-in-out shadow-lg"
        >
          {isUpscaling ? (
            <>
              <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
              <span>Đang nâng cấp...</span>
            </>
          ) : (
            <>
              <SparklesIcon />
              <span>Nâng cấp 2K</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;
