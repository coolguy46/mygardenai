"use client"

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

interface ImageUploadProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
}

export default function ImageUpload({ onUpload, isLoading }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onUpload(file);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    disabled: isLoading
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
        ${isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300'}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <input {...getInputProps()} />
      {preview ? (
        <div className="relative h-48 w-full">
          <Image
            src={preview}
            alt="Upload preview"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      ) : (
        <>
          <p className="text-gray-500 mb-2">Drop an image here or click to select</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Select File'}
          </button>
        </>
      )}
    </div>
  );
}
