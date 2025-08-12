import type { FileDto } from '../lib/hooks/useJobMatch';

export const downloadTailoredCv = (file: FileDto): void => {
  const byteCharacters = atob(file.content);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: file.contentType });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = file.fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};