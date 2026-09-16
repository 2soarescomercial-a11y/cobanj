import { useState, useEffect } from 'react';
import { Megaphone, Plus, Trash, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.system_role === 'admin' || user?.system_role === 'master' || user?.system_role === 'editor';

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  const fetchAnnouncements = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('date', { ascending: false });
    
    if (data) setAnnouncements(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    await supabase.from('announcements').insert([{
      title: formData.title,
      content: formData.content,
      author: user?.username || user?.name || 'Liderança',
      date: new Date().toISOString()
    }]);
    
    fetchAnnouncements();
    setShowModal(false);
    setFormData({ title: '', content: '' });
  };

  const handleDelete = async (id) => {
    if(confirm('Apagar este aviso?')) {
      await supabase.from('announcements').delete().eq('id', id);
      fetchAnnouncements();
    }
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--color-primary)' }}>Bem-vindo, {user?.name || user?.username || 'Membro'}!</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Fique por dentro do que está acontecendo na COBANJ.</p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-primary)' }}>
            <Megaphone size={28} />
            <h2 style={{ margin: 0 }}>Quadro de Avisos Gerais</h2>
          </div>
          {isAdmin && (
            <button className="btn-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={20} /> Publicar Aviso
            </button>
          )}
        </div>

        {loading ? (
          <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '2rem 0' }}>Carregando avisos...</p>
        ) : announcements.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '2rem 0' }}>Nenhum aviso no momento.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {announcements.map(aviso => (
              <div key={aviso.id} style={{ padding: '1.5rem', backgroundColor: '#F9FAFB', borderLeft: '4px solid var(--color-primary)', borderRadius: '0.5rem', position: 'relative' }}>
                {isAdmin && (
                  <button onClick={() => handleDelete(aviso.id)} style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Trash size={18} />
                  </button>
                )}
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text-primary)' }}>{aviso.title}</h3>
                <p style={{ color: 'var(--color-text-primary)', marginBottom: '1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{aviso.content}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Megaphone size={14} /> {aviso.author}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {new Date(aviso.date).toLocaleString('pt-BR')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
          <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Novo Aviso Geral</h3>
            <form onSubmit={handleCreateAnnouncement}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Título do Aviso</label>
                <input 
                  type="text" required placeholder="Ex: Aviso Importante, Mudança de Horário..."
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)' }} 
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Mensagem</label>
                <textarea 
                  required placeholder="Escreva os detalhes do aviso aqui..."
                  value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}
                  style={{ width: '100%', minHeight: '120px', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)', resize: 'vertical' }} 
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1rem', color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" className="btn-primary">Publicar Aviso</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
