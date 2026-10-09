export async function processStickerImage(imageSrc: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('Não foi possível obter o contexto 2D do canvas.');

      // Limpa o canvas para garantir fundo transparente
      ctx.clearRect(0, 0, 512, 512);

      // Calcula dimensões para manter a proporção dentro de 512x512
      const scale = Math.min(512 / img.width, 512 / img.height);
      const width = img.width * scale;
      const height = img.height * scale;
      const x = (512 - width) / 2;
      const y = (512 - height) / 2;

      // Desenha a imagem centralizada
      ctx.drawImage(img, x, y, width, height);

      // Exporta em formato WebP
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject('Erro ao converter imagem para WebP.');
        },
        'image/webp',
        0.8 // Qualidade para manter o ficheiro < 100KB
      );
    };
    img.onerror = (err) => reject(err);
    img.src = imageSrc;
  });
}

export async function shareToWhatsApp(stickerBlob: Blob, fileName = 'figurinha.webp') {
  const file = new File([stickerBlob], fileName, { type: 'image/webp' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'Minha Figurinha',
        text: 'Confira minha nova figurinha!'
      });
    } catch (err) {
      console.log('Compartilhamento cancelado ou não suportado', err);
    }
  } else {
    alert('O seu navegador não suporta o compartilhamento direto de ficheiros.');
  }
}