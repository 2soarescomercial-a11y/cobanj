import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLive } from '../context/LiveContext';
import { Radio, Send, Book, Megaphone, Music } from 'lucide-react';

export default function LiveService() {
  const { user } = useAuth();
  const { liveData, publishToLive } = useLive();
  const isMedia = user?.role === 'Pastor' || user?.role === 'Master' || user?.role === 'Mídia';

  const [publishType, setPublishType] = useState('leitura');
  const [publishTitle, setPublishTitle] = useState('');
  const [publishContent, setPublishContent] = useState('');

  const handlePublish = (e) => {
    e.preventDefault();
    publishToLive(publishType, publishTitle, publishContent);
    alert('Enviado para a tela de todos os membros! (Navegue para o Culto Ao Vivo para ver)');
    setPublishTitle('');
    setPublishContent('');
  };

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Radio size={28} className="animate-pulse" /> Acompanhar Culto (Ao Vivo)
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Mantenha esta tela aberta durante o culto para acompanhar as leituras e avisos.</p>
        </div>
      </div>

      {/* Tela do Membro (O que está passando agora) */}
      <div className="card" style={{ marginBottom: '2rem', border: '2px solid #EF4444', backgroundColor: '#FEF2F2' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <span style={{ backgroundColor: '#EF4444', color: 'white', padding: '0.25rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }} className="animate-pulse"></span>
            NO TELÃO
          </span>

          {liveData.type === 'leitura' && <Book size={48} color="#EF4444" style={{ margin: '0 auto 1rem' }} />}
          {liveData.type === 'aviso' && <Megaphone size={48} color="#EF4444" style={{ margin: '0 auto 1rem' }} />}
          {liveData.type === 'louvor' && <Music size={48} color="#EF4444" style={{ margin: '0 auto 1rem' }} />}
          
          <h2 style={{ fontSize: '2.5rem', color: '#7F1D1D', marginBottom: '1rem', marginTop: 0 }}>
            {liveData.title}
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#991B1B', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto' }}>
            {liveData.content}
          </p>
        </div>
      </div>

      {/* Painel de Controle (Apenas Pastor/Mídia) */}
      {isMedia && (
        <div className="card" style={{ backgroundColor: 'white' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Painel de Controle da Mídia
          </h3>
          <form onSubmit={handlePublish}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="type" value="leitura" checked={publishType === 'leitura'} onChange={e => setPublishType(e.target.value)} /> 📖 Leitura Bíblica
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="type" value="louvor" checked={publishType === 'louvor'} onChange={e => setPublishType(e.target.value)} /> 🎵 Louvor
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="type" value="aviso" checked={publishType === 'aviso'} onChange={e => setPublishType(e.target.value)} /> 📢 Aviso
              </label>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                {publishType === 'leitura' ? 'Referência (Ex: João 3:16)' : publishType === 'louvor' ? 'Nome do Hino/Música' : 'Título do Aviso'}
              </label>
              <input 
                type="text" required 
                value={publishTitle} onChange={e => setPublishTitle(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)' }} 
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                {publishType === 'leitura' ? 'Texto do Versículo' : 'Conteúdo / Letra'}
              </label>
              <textarea 
                required 
                value={publishContent} onChange={e => setPublishContent(e.target.value)}
                style={{ width: '100%', minHeight: '120px', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)', resize: 'vertical' }} 
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#EF4444' }}>
                <Send size={18} /> Transmitir para a Igreja
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
