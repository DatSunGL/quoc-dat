import React, { useRef, useCallback } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  originalImage: File | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, originalImage }) => {
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (files && files[0]) {
      if (files[0].type.startsWith('image/')) {
        onImageUpload(files[0]);
      } else {
        alert("Vui lòng chỉ chọn tệp hình ảnh.");
      }
    }
  }, [onImageUpload]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    handleFiles(e.target.files);
  };
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  if (originalImage) {
    return (
        <div className="w-full text-center p-4 border-2 border-dashed border-gray-600 rounded-lg">
            <img 
                src={URL.createObjectURL(originalImage)} 
                alt="Ảnh gốc" 
                className="max-h-64 mx-auto rounded-md mb-4"
            />
            <button
                onClick={onButtonClick}
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 border border-gray-600 rounded-lg shadow-sm"
            >
                Thay đổi ảnh
            </button>
             <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
            />
        </div>
    )
  }

  return (
    <div 
      className={`w-full h-64 p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400 transition-colors duration-300 ${dragActive ? 'border-green-400 bg-gray-700/50' : 'border-gray-600 hover:border-gray-500'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <div className="text-center p-4 cursor-pointer" onClick={onButtonClick}>
        <UploadIcon />
        <p className="mt-2">Kéo và thả ảnh vào đây</p>
        <p className="my-2 text-sm">hoặc</p>
        <span
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 border border-gray-600 rounded-lg shadow-sm"
        >
          Chọn tệp
        </span>
      </div>
    </div>
  );
};

export default ImageUploader;