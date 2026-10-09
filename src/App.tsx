import { useState, type ChangeEvent } from 'react'
import { processStickerImage, shareToWhatsApp } from './utils/sticker'
import './App.css'

export default function App() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [stickerBlob, setStickerBlob] = useState<Blob | null>(null)
  const [loading, setLoading] = useState(false)

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    const objectUrl = URL.createObjectURL(file)

    try {
      // Processa a imagem para 512x512 WebP
      const blob = await processStickerImage(objectUrl)
      setStickerBlob(blob)
      setImagePreview(URL.createObjectURL(blob))
    } catch (err) {
      alert('Erro ao processar imagem: ' + err)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = () => {
    if (stickerBlob) {
      shareToWhatsApp(stickerBlob)
    }
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Criador de Figurinhas</h1>
      <p>Selecione uma imagem para converter em figurinha do WhatsApp</p>

      <div style={{ margin: '1.5rem 0' }}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
        />
      </div>

      {loading && <p>A processar figurinha...</p>}

      {imagePreview && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Pré-visualização (512x512 WebP)</h3>
          <div style={{ 
            display: 'inline-block', 
            border: '2px dashed #ccc', 
            padding: '10px', 
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
          }}>
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{ width: '256px', height: '256px', objectFit: 'contain' }} 
            />
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <button 
              onClick={handleShare}
              style={{
                padding: '10px 20px',
                fontSize: '1rem',
                backgroundColor: '#25D366',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Partilhar no WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  )
}