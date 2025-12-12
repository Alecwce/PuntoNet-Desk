import React from "react";
import { Ticket } from "../../../types";
import { Icon } from "../../../components/Icon";
import api from "../../../lib/api";

interface AttachmentsTabProps {
  ticket: Ticket;
  refreshTicket: () => void;
}

export const AttachmentsTab: React.FC<AttachmentsTabProps> = ({
  ticket,
  refreshTicket,
}) => {
  return (
    <div className="p-4">
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Subir archivo
        </h4>
        <div className="flex gap-2">
          <input
            type="file"
            id="file-upload"
            className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary file:text-white
                        hover:file:bg-primary/90"
            onChange={async (e) => {
              if (e.target.files?.[0]) {
                const userStr = localStorage.getItem("user");
                const user = userStr ? JSON.parse(userStr) : null;
                const uploaderId = user?.id;

                if (!uploaderId) {
                  console.error("User not found");
                  return;
                }

                const formData = new FormData();
                formData.append("file", e.target.files[0]);
                formData.append("uploaderId", uploaderId);
                try {
                  await api.post(
                    `/tickets/${ticket.id}/attachments`,
                    formData,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    }
                  );
                  refreshTicket();
                } catch (error) {
                  console.error("Error uploading:", error);
                }
              }
            }}
          />
        </div>
      </div>

      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
        Archivos Adjuntos
      </h4>
      {(ticket as any).attachments && (ticket as any).attachments.length > 0 ? (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {(ticket as any).attachments.map((att: any) => (
            <li key={att.id} className="py-3 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Icon name="description" className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {att.filename}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(att.size / 1024).toFixed(1)} KB •{" "}
                    {new Date(att.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <a
                href={
                  `${
                    import.meta.env.VITE_API_URL || "http://localhost:3001/api"
                  }`.replace("/api", "") + att.path
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                Descargar
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No hay archivos adjuntos.</p>
      )}
    </div>
  );
};
