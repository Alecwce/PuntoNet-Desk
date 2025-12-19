import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Icon } from "./Icon";
import { toast } from "sonner";
import api from "@/lib/api";

interface FileUploadDropzoneProps {
  ticketId: string;
  onUploadSuccess: () => void;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  ticketId,
  onUploadSuccess,
}) => {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Max file size: 10MB
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Archivo demasiado grande (máx. 10MB)");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("ticketId", ticketId);

      try {
        await api.post(`/tickets/${ticketId}/attachments`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success(`Archivo "${file.name}" subido correctamente`);
        onUploadSuccess();
      } catch (error) {
        console.error("Error uploading:", error);
        toast.error("Error al subir archivo");
      }
    },
    [ticketId, onUploadSuccess]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
        ${
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800/50"
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        <Icon
          name="cloud_upload"
          className={`text-4xl ${
            isDragActive ? "text-primary" : "text-gray-400"
          }`}
        />
        {isDragActive ? (
          <p className="text-sm text-primary font-medium">
            Suelta el archivo aquí...
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="text-primary font-medium">
                Click para seleccionar
              </span>{" "}
              o arrastra un archivo
            </p>
            <p className="text-xs text-gray-500">Máximo 10MB</p>
          </>
        )}
      </div>
    </div>
  );
};
