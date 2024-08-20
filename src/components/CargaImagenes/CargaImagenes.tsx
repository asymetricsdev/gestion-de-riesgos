import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Swal from 'sweetalert2';
import { showAlert } from '../functions';
import withReactContent from 'sweetalert2-react-content';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import './CargaImagenes.css'; 

const MySwal = withReactContent(Swal);

interface CargaImagenesProps {
  onFileUpload: (base64: string) => void;
  uploadUrl: string;
  onUploadSuccess: (url: string) => void;
  fileExtension?: string;
  onImageUpload: (base64: string, fileType: string) => void;
  file: (base64: string, fileType: string) => void;
}

const CargaImagenes: React.FC<CargaImagenesProps> = ({ onFileUpload, uploadUrl, onUploadSuccess, onImageUpload, file }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ base64: string, type: string }[]>([]);
  const [fileExtension, setFileExtension] = useState<string>("");

  const extractFileExtension = (file: File): string => {
    const extensionMap: { [key: string]: string } = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'application/pdf': 'pdf',
    };
    return extensionMap[file.type] || 'unknown';
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setLoading(true);

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const fileType = acceptedFiles[0].type;
        const file = { base64, type: fileType };

        const extension = extractFileExtension(acceptedFiles[0]);
        setFileExtension(extension);

        setUploadedFiles(prevFiles => [...prevFiles, file]);
        onUploadSuccess(file.base64);
        setLoading(false);

        setTimeout(() => {
          MySwal.fire({
            title: 'Éxito',
            text: 'Archivo subido exitosamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        }, 2000);
      };
      reader.readAsDataURL(acceptedFiles[0]);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
    },
  });

  return (
    <div>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Carga los archivos acá ...</p>
        ) : (
          <p>Puede arrastrar y soltar archivos aquí para añadirlos</p>
        )}

        {loading ? (
          <p>Cargando...</p>
        ) : (
          selectedFile && selectedFile.type.startsWith('image/') && (
            <img src={URL.createObjectURL(selectedFile)} alt="" 
              style={{
                width: '50%',
                height: 'auto'
              }}
            />
          )
        )}
      </div>
      <p className='text-parrafo-dropzone mt-1'>Tamaño máximo de archivo: 500kb, número máximo de archivos: 2</p>
      <p><strong>Tipo de Archivos aceptados</strong>: .jpeg, .jpg, .png, .gif, .pdf</p>

      {uploadedFiles.length > 0 && (
        <div>
            <tbody>
              {uploadedFiles.map((file, index) => (
                <tr key={index}>
                  <td>
                    {file.type.startsWith('image/') ? (
                      <img src={file.base64} alt={`Archivo ${index + 1}`} 
                        style={{ width: '100px', height: 'auto' }} 
                      />
                    ) : (
                      <p>Archivo PDF {index + 1}</p>
                    )}
                  </td>
                  <td>
                    <button type="button"
                     className="btn btn-custom-editar m-2" onClick={() => {
                      const link = document.createElement('a');
                      link.href = file.base64;
                      link.download = `archivo_${index + 1}${file.type.startsWith('image/') ? '.png' : '.pdf'}`;
                      link.click();
                    }}>
                      <FontAwesomeIcon icon={faDownload} /> Descargar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
        </div>
      )}
    </div>
  );
};

export default CargaImagenes;