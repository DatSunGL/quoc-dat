import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import LoginScreen from './components/LoginScreen'; // Import a tela de login
import { removeBackground, upscaleImage } from './services/geminiService';

type ProcessingOption = 'blue' | 'white' | 'men_white_shirt' | 'women_white_shirt' | 'men_vest' | 'women_vest';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isUpscaling, setIsUpscaling] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [processingMessage, setProcessingMessage] = useState<string>('');
  
  // Mật khẩu để truy cập ứng dụng
  const CORRECT_PASSWORD = '213213213';

  const handleLogin = (password: string): boolean => {
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleImageUpload = (file: File) => {
    setOriginalImage(file);
    setProcessedImage(null);
    setError(null);
  };

  const handleProcessingRequest = useCallback(async (option: ProcessingOption) => {
    if (!originalImage) return;

    setIsProcessing(true);
    setProcessedImage(null);
    setError(null);

    const aspectRatioPrompt = 'Quan trọng: Giữ nguyên tỷ lệ khung hình của ảnh gốc, không cắt xén hay mở rộng ảnh.';
    const blueBackgroundPrompt = 'nền xanh dương chuẩn ảnh thẻ Việt Nam (mã màu hex #0073e6)';

    let basePrompt = '';
    let message = '';
    switch (option) {
      case 'blue':
        basePrompt = `xóa nền và thay bằng ${blueBackgroundPrompt}. Giữ lại chi tiết tóc tối đa.`;
        message = 'Đang thay nền xanh...';
        break;
      case 'white':
        basePrompt = `xóa nền và thay bằng nền màu trắng đồng nhất.`;
        message = 'Đang thay nền trắng...';
        break;
      case 'men_white_shirt':
        basePrompt = `giữ nguyên khuôn mặt và kiểu tóc, thay thế phần còn lại của cơ thể bằng một chiếc áo sơ mi trắng của nam giới trên ${blueBackgroundPrompt}.`;
        message = 'Đang thay trang phục áo sơ mi nam...';
        break;
      case 'women_white_shirt':
        basePrompt = `giữ nguyên khuôn mặt và kiểu tóc, thay thế phần còn lại của cơ thể bằng một chiếc áo sơ mi trắng của phụ nữ trên ${blueBackgroundPrompt}.`;
        message = 'Đang thay trang phục áo sơ mi nữ...';
        break;
      case 'men_vest':
        basePrompt = `giữ nguyên khuôn mặt và kiểu tóc, thay thế phần còn lại của cơ thể bằng một bộ vest nam màu đen, áo sơ mi trắng và cà vạt đen trên ${blueBackgroundPrompt}.`;
        message = 'Đang thay trang phục vest nam...';
        break;
      case 'women_vest':
        basePrompt = `giữ nguyên khuôn mặt và kiểu tóc, thay thế phần còn lại của cơ thể bằng một bộ vest nữ công sở màu đen và áo sơ mi trắng bên trong (không có cà vạt) trên ${blueBackgroundPrompt}.`;
        message = 'Đang thay trang phục vest nữ...';
        break;
    }
    setProcessingMessage(message);
    const finalPrompt = `${basePrompt} ${aspectRatioPrompt}`;

    try {
      const reader = new FileReader();
      const fileReadPromise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(originalImage);
      });
      const base64Data = await fileReadPromise;

      const resultBase64 = await removeBackground(base64Data, originalImage.type, finalPrompt);
      if (resultBase64) {
        setProcessedImage(`data:image/png;base64,${resultBase64}`);
      } else {
        throw new Error("AI không trả về kết quả hình ảnh.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định.");
    } finally {
      setIsProcessing(false);
      setProcessingMessage('');
    }
  }, [originalImage]);

  const handleUpscaleRequest = useCallback(async () => {
    if (!processedImage) return;

    setIsUpscaling(true);
    setError(null);

    try {
      const base64Data = processedImage.split(',')[1];
      const mimeType = processedImage.match(/:(.*?);/)?.[1] || 'image/png';

      const resultBase64 = await upscaleImage(base64Data, mimeType);
      
      if (resultBase64) {
        setProcessedImage(`data:image/png;base64,${resultBase64}`);
      } else {
        throw new Error("AI không trả về kết quả hình ảnh sau khi nâng cấp.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định khi nâng cấp.");
    } finally {
      setIsUpscaling(false);
    }
  }, [processedImage]);


  const getOutputFilename = (): string => {
    if (!originalImage) return 'download.png';
    const nameWithoutExtension = originalImage.name.split('.').slice(0, -1).join('.');
    return `${nameWithoutExtension}-processed.png`;
  };
  
  const ActionButton: React.FC<{ onClick: () => void; disabled: boolean; children: React.ReactNode; className?: string }> = ({ onClick, disabled, children, className = 'bg-blue-600 hover:bg-blue-700' }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full ${className} disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 duration-300 ease-in-out shadow-lg`}
    >
      {children}
    </button>
  );

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <Header />
        <main className="mt-8 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-300 mb-4">1. Tải ảnh lên</h2>
              <ImageUploader onImageUpload={handleImageUpload} originalImage={originalImage} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-300 mb-4 text-center">2. Chọn tùy chọn</h2>
              <div className="space-y-4">
                 <div>
                  <h3 className="text-lg font-medium text-gray-400 mb-2">Thay đổi nền</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ActionButton onClick={() => handleProcessingRequest('blue')} disabled={!originalImage || isProcessing} className="bg-blue-600 hover:bg-blue-700">
                      Nền Xanh (Ảnh thẻ)
                    </ActionButton>
                    <ActionButton onClick={() => handleProcessingRequest('white')} disabled={!originalImage || isProcessing} className="bg-white hover:bg-gray-200 text-gray-900">
                      Nền Trắng
                    </ActionButton>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-400 mb-2">Thay đổi trang phục (trên nền xanh)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ActionButton onClick={() => handleProcessingRequest('men_white_shirt')} disabled={!originalImage || isProcessing}>
                      Áo Sơ mi trắng (Nam)
                    </ActionButton>
                    <ActionButton onClick={() => handleProcessingRequest('women_white_shirt')} disabled={!originalImage || isProcessing}>
                      Áo Sơ mi trắng (Nữ)
                    </ActionButton>
                    <ActionButton onClick={() => handleProcessingRequest('men_vest')} disabled={!originalImage || isProcessing}>
                      Vest & Cà vạt (Nam)
                    </ActionButton>
                    <ActionButton onClick={() => handleProcessingRequest('women_vest')} disabled={!originalImage || isProcessing}>
                      Vest Nữ
                    </ActionButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10">
            {isProcessing && <LoadingSpinner message={processingMessage} />}
            {error && <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg border border-red-500">{error}</div>}
            {processedImage && (
                <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-400">Kết quả</h2>
                    <ResultDisplay 
                        imageSrc={processedImage} 
                        filename={getOutputFilename()}
                        onUpscale={handleUpscaleRequest}
                        isUpscaling={isUpscaling}
                    />
                </div>
            )}
          </div>

        </main>
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>164 Trần Hưng Đạo, Ayunpa. Hotline 0905590404</p>
        </footer>
      </div>
    </div>
  );
};

export default App;