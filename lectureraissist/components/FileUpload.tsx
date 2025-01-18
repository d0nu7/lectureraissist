import React, { useRef } from 'react';

interface FileUploadProps {
  onFileUpload: (uploadedFiles: { name: string; url: string }[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const uploadedFiles = Array.from(files).map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }));
      onFileUpload(uploadedFiles);
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button onClick={() => fileInputRef.current?.click()}>
        Upload Files
      </button>
    </div>
  );
};

export default FileUpload;