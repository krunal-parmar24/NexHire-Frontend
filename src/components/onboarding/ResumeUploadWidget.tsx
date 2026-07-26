import React, { useState } from "react";
import { useParseResumeMutation } from "../../api/hooks/useOnboarding";

interface ResumeUploadWidgetProps {
  onParseSuccess: (parsedData: any) => void;
}

export default function ResumeUploadWidget({ onParseSuccess }: ResumeUploadWidgetProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const parseMutation = useParseResumeMutation();

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
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError(null);
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.size > 1024 * 1024) {
      setError("File exceeds 1MB limit.");
      return;
    }
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      setError("Only PDF or DOCX files are supported.");
      return;
    }

    parseMutation.mutate(file, {
      onSuccess: (data) => {
        onParseSuccess(data.parsedFields);
      },
      onError: () => {
        setError("Failed to parse resume. Please try again or fill manually.");
      },
    });
  };

  return (
    <div className="w-full">
      <div
        className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl transition-all duration-300 ${
          dragActive
            ? "border-brand-purple bg-brand-purple/5 scale-[1.02]"
            : "border-gray-300 bg-gray-50/50 hover:bg-gray-50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf,.docx"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          disabled={parseMutation.isPending}
        />
        {parseMutation.isPending ? (
          <div className="flex flex-col items-center space-y-4 animate-pulse">
            <i className="pi pi-sparkles text-3xl text-brand-purple animate-spin"></i>
            <p className="text-gray-700 font-medium">AI Auto-filling...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2 pointer-events-none">
            <i className="pi pi-cloud-upload text-4xl text-brand-purple opacity-80"></i>
            <p className="text-gray-700 font-medium text-center">
              Drag & Drop your resume <br />
              <span className="text-sm text-gray-500 font-normal">or click to browse (PDF/DOCX max 1MB)</span>
            </p>
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-red-500 text-sm font-medium text-center">{error}</p>}
    </div>
  );
}
