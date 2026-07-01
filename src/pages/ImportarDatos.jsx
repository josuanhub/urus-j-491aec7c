import { useState, useRef, useCallback } from "react";
import {
  Upload,
  FileSpreadsheet,
  FileText,
  Image,
  File,
  CheckCircle,
  XCircle,
  Trash2,
  CloudUpload,
  AlertCircle,
  Table,
  Hash,
} from "lucide-react";

const UPLOAD_URL =
  "https://www.urusverify.com/v1/factory/project/491aec7c-4945-4267-8778-b3719e15951f/upload-data";
const FACTORY_KEY = "factory2026";

const ACCEPTED_TYPES = [
  ".xlsx",
  ".xls",
  ".csv",
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
];

const ACCEPTED_MIME = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
  "application/pdf",
  "image/png",
  "image/jpeg",
];

function getFileIcon(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".xlsx") || name.endsWith(".xls") || name.endsWith(".csv"))
    return <FileSpreadsheet className="w-8 h-8 text-[#00D4AA]" />;
  if (name.endsWith(".pdf"))
    return <FileText className="w-8 h-8 text-red-400" />;
  if (name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg"))
    return <Image className="w-8 h-8 text-[#6C63FF]" />;
  return <File className="w-8 h-8 text-gray-400" />;
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function isValidFile(file) {
  return ACCEPTED_MIME.includes(file.type) || ACCEPTED_TYPES.some((ext) => file.name.toLowerCase().endsWith(ext));
}

export default function ImportarDatos() {
  const [status, setStatus] = useState("idle");
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);
  const dragCounterRef = useRef(0);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current === 0) setDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const processFile = (file) => {
    setFileError("");
    if (!isValidFile(file)) {
      setFileError(`Tipo de archivo no aceptado. Use: ${ACCEPTED_TYPES.join(", ")}`);
      return;
    }
    setSelectedFile(file);
    setStatus("idle");
    setResult(null);
    setErrorMsg("");
    setProgress(0);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setStatus("uploading");
    setProgress(0);
    setResult(null);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await new Promise((resolve) => {
        let p = 0;
        const interval = setInterval(() => {
          p += Math.random() * 18 + 5;
          if (p >= 85) {
            clearInterval(interval);
            setProgress(85);
            resolve();
          } else {
            setProgress(Math.round(p));
          }
        }, 200);
      });

      const response = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: {
          "x-factory-key": FACTORY_KEY,
        },
        body: formData,
      });

      setProgress(100);

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setResult(data);
        setStatus("success");
      } else {
        setErrorMsg(
          data?.message ||
            data?.error ||
            `Error del servidor (${response.status})`
        );
        setStatus("error");
      }
    } catch (err) {
      setProgress(100);
      setErrorMsg(err.message || "Error de conexión con el servidor");
      setStatus("error");
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setStatus("idle");
    setProgress(0);
    setResult(null);
    setErrorMsg("");
    setFileError("");
    dragCounterRef.current = 0;
    setDragging(false);
  };

  const isUploading = status === "uploading";

  return (
    <div className="min-h-screen bg-[#0A0A0F] px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center shadow-lg">
              <CloudUpload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Importar Datos
              </h1>
              <p className="text-sm text-gray-400">Sistema j</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-3 leading-relaxed">
            Sube archivos para importar datos al sistema. Arrastra y suelta o
            selecciona manualmente.
          </p>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer
            transition-all duration-300 select-none
            ${dragging
              ? "border-[#6C63FF] bg-[#6C63FF]/10 scale-[1.01]"
              : "border-[#1A1A2E] bg-[#1A1A2E]/40 hover:border-[#6C63FF]/50 hover:bg-[#6C63FF]/5"
            }
            ${isUploading ? "pointer-events-none opacity-70" : ""}
          `}
        >
          {/* Glow effect when dragging */}
          {dragging && (
            <div className="absolute inset-0 rounded-2xl bg-[#6C63FF]/5 blur-xl pointer-events-none" />
          )}

          <div className="flex flex-col items-center gap-4">
            <div
              className={`
              w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
              ${dragging
                  ? "bg-[#6C63FF]/20 scale-110"
                  : "bg-[#1A1A2E]"
                }
            `}
            >
              <Upload
                className={`w-7 h-7 transition-colors duration-300 ${dragging ? "text-[#6C63FF]" : "text-gray-500"
                  }`}
              />
            </div>

            <div>
              <p className="text-white font-semibold text-lg mb-1">
                {dragging ? "Suelta el archivo aquí" : "Arrastra tu archivo aquí"}
              </p>
              <p className="text-gray-400 text-sm">
                o{" "}
                <span className="text-[#6C63FF] font-medium hover:text-[#00D4AA] transition-colors">
                  selecciona desde tu dispositivo
                </span>
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-1">
              {ACCEPTED_TYPES.map((ext) => (
                <span
                  key={ext}
                  className="px-2 py-0.5 rounded-md bg-[#1A1A2E] border border-[#2A2A3E] text-gray-400 text-xs font-mono"
                >
                  {ext}
                </span>
              ))}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        {/* File type error */}
        {fileError && (
          <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{fileError}</p>
          </div>
        )}

        {/* Selected File Card */}
        {selectedFile && (
          <div className="mt-4 p-4 rounded-2xl bg-[#1A1A2E] border border-[#2A2A3E]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#0A0A0F] flex items-center justify-center flex-shrink-0">
                {getFileIcon(selectedFile)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">
                  {selectedFile.name}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {formatSize(selectedFile.size)}
                </p>
              </div>
              {!isUploading && status !== "success" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  className="w-8 h-8 rounded-lg bg-[#0A0A0F] flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Progress Bar */}
            {(isUploading || status === "success" || status === "error") && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-gray-400">
                    {isUploading ? "Subiendo..." : status === "success" ? "Completado" : "Error"}
                  </span>
                  <span className="text-xs font-mono text-gray-400">{progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#0A0A0F] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${status === "error"
                        ? "bg-red-500"
                        : "bg-gradient-to-r from-[#6C63FF] to-[#00D4AA]"
                      }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Upload Button */}
        {selectedFile && status !== "success" && (
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`
              mt-4 w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200
              flex items-center justify-center gap-2
              ${isUploading
                ? "bg-[#1A1A2E] text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] text-white hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-[#6C63FF]/20"
              }
            `}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Procesando archivo...
              </>
            ) : (
              <>
                <CloudUpload className="w-4 h-4" />
                Subir archivo
              </>
            )}
          </button>
        )}

        {/* Success Result */}
        {status === "success" && result && (
          <div className="mt-4 p-5 rounded-2xl bg-[#00D4AA]/8 border border-[#00D4AA]/20">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-[#00D4AA]" />
              <p className="text-[#00D4AA] font-semibold">
                Importación exitosa
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {result.filas_insertadas !== undefined && (
                <div className="p-3 rounded-xl bg-[#0A0A0F] border border-[#1A1A2E]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Hash className="w-3.5 h-3.5 text-[#00D4AA]" />
                    <p className="text-gray-400 text-xs">Filas insertadas</p>
                  </div>
                  <p className="text-white font-bold text-xl">
                    {result.filas_insertadas}
                  </p>
                </div>
              )}
              {result.tabla && (
                <div className="p-3 rounded-xl bg-[#0A0A0F] border border-[#1A1A2E]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Table className="w-3.5 h-3.5 text-[#6C63FF]" />
                    <p className="text-gray-400 text-xs">Tabla</p>
                  </div>
                  <p className="text-white font-semibold text-sm truncate">
                    {result.tabla}
                  </p>
                </div>
              )}
              {result.errores !== undefined && (
                <div className="p-3 rounded-xl bg-[#0A0A0F] border border-[#1A1A2E]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />
                    <p className="text-gray-400 text-xs">Errores</p>
                  </div>
                  <p
                    className={`font-bold text-xl ${result.errores > 0 ? "text-yellow-400" : "text-[#00D4AA]"}`}
                  >
                    {result.errores}
                  </p>
                </div>
              )}
            </div>

            {/* Extra fields from response */}
            {Object.entries(result).filter(
              ([k]) => !["filas_insertadas", "tabla", "errores"].includes(k)
            ).length > 0 && (
              <div className="mt-3 p-3 rounded-xl bg-[#0A0A0F] border border-[#1A1A2E]">
                <p className="text-gray-400 text-xs mb-2">Detalles adicionales</p>
                {Object.entries(result)
                  .filter(([k]) => !["filas_insertadas", "tabla", "errores"].includes(k))
                  .map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center py-1">
                      <span className="text-gray-500 text-xs capitalize">{key}</span>
                      <span className="text-gray-300 text-xs font-mono">
                        {typeof val === "object" ? JSON.stringify(val) : String(val)}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Error Result */}
        {status === "error" && (
          <div className="mt-4 p-4 rounded-2xl bg-red-500/8 border border-red-500/20">
            <div className="flex items-start gap-2">
              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-semibold text-sm">
                  Error en la importación
                </p>
                <p className="text-red-300/70 text-sm mt-1">{errorMsg}</p>
              </div>
            </div>
          </div>
        )}

        {/* Clear Button */}
        {(status === "success" || status === "error") && (
          <button
            onClick={handleClear}
            className="mt-4 w-full py-3 rounded-xl font-medium text-sm border border-[#2A2A3E] text-gray-400 hover:text-white hover:border-[#6C63FF]/50 hover:bg-[#6C63FF]/5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Limpiar y volver a subir
          </button>
        )}

        {/* Footer hint */}
        <p className="text-center text-gray-600 text-xs mt-6">
          Tamaño máximo recomendado: 50 MB · Los datos se procesan de forma segura
        </p>
      </div>
    </div>
  );
}