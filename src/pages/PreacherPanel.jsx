import { useState, useEffect } from 'react';
import { useLive } from '../context/LiveContext';
import { useAuth } from '../context/AuthContext';
import { Book, Edit, MonitorPlay, Plus, Trash, Radio, Search, Save, ChevronLeft, CalendarX, Mic } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function PreacherPanel() {
  const { user } = useAuth();
  const { publishToLive } = useLive();
  
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentSermon, setCurrentSermon] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPreaching, setIsPreaching] = useState(false);

  const [searchVerse, setSearchVerse] = useState('');
  const [loadingVerse, setLoadingVerse] = useState(false);
  const [errorVerse, setErrorVerse] = useState('');

  // Simulação de banco de dados: verificando se o usuário logado está na escala de hoje.
  const isScheduledForToday = user?.system_role === 'admin' || user?.system_role === 'master' || user?.system_role === 'editor';

  const fetchSermons = async () => {
    setLoading(true);
    // Para sermões, podemos filtrar pelo autor logado ou mostrar todos se for admin
    let query = supabase.from('sermons').select('*').order('date', { ascending: false });
    
    if (user?.system_role !== 'master' && user?.system_role !== 'admin' && user?.username) {
       query = query.eq('author', user.username);
    }
    
    const { data, error } = await query;
    if (data) {
      setSermons(data.map(s => ({
        ...s,
        blocks: s.content ? JSON.parse(s.content) : []
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSermons();
  }, [user]);

  const handleCreateNew = () => {
    setCurrentSermon({
      id: null,
      title: 'Novo Sermão',
      blocks: [{ id: Date.now(), type: 'text', content: '' }]
    });
    setIsEditing(true);
    setIsPreaching(false);
  };

  const handleEditSermon = (sermon) => {
    setCurrentSermon(sermon);
    setIsEditing(true);
    setIsPreaching(false);
  };

  const handleSave = async () => {
    if (currentSermon.id) {
      await supabase.from('sermons').update({
        title: currentSermon.title,
        content: JSON.stringify(currentSermon.blocks)
      }).eq('id', currentSermon.id);
    } else {
      await supabase.from('sermons').insert([{
        title: currentSermon.title,
        content: JSON.stringify(currentSermon.blocks),
        author: user?.username || user?.name || 'Autor Desconhecido',
        date: new Date().toISOString()
      }]);
    }
    fetchSermons();
    setIsEditing(false);
  };

  const handleDeleteSermon = async (id) => {
    if (confirm('Tem certeza que deseja excluir este sermão do seu histórico?')) {
      await supabase.from('sermons').delete().eq('id', id);
      fetchSermons();
    }
  };

  const handleAddTextBlock = () => {
    setCurrentSermon({
      ...currentSermon,
      blocks: [...currentSermon.blocks, { id: Date.now(), type: 'text', content: '' }]
    });
  };

  const handleAddVerse = async (e) => {
    e.preventDefault();
    if (!searchVerse) return;
    setLoadingVerse(true);
    setErrorVerse('');
    
    try {
      const response = await fetch(`https://bible-api.com/${encodeURIComponent(searchVerse)}?translation=almeida`);
      if (!response.ok) throw new Error('Versículo não encontrado. Use o formato Livro Capítulo:Versículo (ex: Romanos 8:28)');
      const data = await response.json();
      
      const verseText = data.text.trim();
      setCurrentSermon({
        ...currentSermon,
        blocks: [
          ...currentSermon.blocks,
          { id: Date.now(), type: 'verse', reference: data.reference, text: verseText }
        ]
      });
      setSearchVerse('');
    } catch (err) {
      setErrorVerse(err.message);
    } finally {
      setLoadingVerse(false);
    }
  };

  const handleUpdateBlock = (id, newContent) => {
    setCurrentSermon({
      ...currentSermon,
      blocks: currentSermon.blocks.map(b => b.id === id ? { ...b, content: newContent } : b)
    });
  };

  const handleDeleteBlock = (id) => {
    setCurrentSermon({
      ...currentSermon,
      blocks: currentSermon.blocks.filter(b => b.id !== id)
    });
  };

  const projectVerse = (reference, text) => {
    if (publishToLive) {
      publishToLive('leitura', reference, text);
      alert('Enviado para o telão!');
    }
  };

  // MODO PREGAÇÃO
  if (isPreaching && currentSermon) {
    if (!isScheduledForToday) {
      return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
          <CalendarX size={64} color="var(--color-text-secondary)" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Acesso Negado</h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px', marginBottom: '2rem' }}>
            O Modo Pregação é liberado apenas nos dias em que a secretaria escalar você como Preletor(a).
          </p>
          <button onClick={() => setIsPreaching(false)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ChevronLeft size={20} /> Voltar para o Editor
          </button>
        </div>
      );
    }

    return (
      <div className="container" style={{ paddingBottom: '5rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', position: 'sticky', top: 0, backgroundColor: 'var(--color-background)', padding: '1rem 0', zIndex: 10, borderBottom: '1px solid var(--color-border)' }}>
          <h1 style={{ color: 'var(--color-primary)', margin: 0 }}>{currentSermon.title}</h1>
          <button onClick={() => setIsPreaching(false)} className="btn-primary" style={{ backgroundColor: '#4B5563', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Edit size={20} /> Fechar
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {currentSermon.blocks.map((block) => {
            if (block.type === 'text') {
              return (
                <div key={block.id} style={{ fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap' }}>
                  {block.content}
                </div>
              );
            }
            if (block.type === 'verse') {
              return (
                <div key={block.id} style={{ backgroundColor: '#FEF2F2', borderLeft: '4px solid #EF4444', padding: '1.5rem', borderRadius: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, color: '#7F1D1D', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Book size={20} /> {block.reference}
                    </h3>
                    <button 
                      onClick={() => projectVerse(block.reference, block.text)}
                      className="btn-primary" 
                      style={{ backgroundColor: '#EF4444', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Radio size={18} className="animate-pulse" /> Projetar
                    </button>
                  </div>
                  <p style={{ margin: 0, fontSize: '1.25rem', lineHeight: '1.8', color: '#991B1B', fontStyle: 'italic' }}>
                    "{block.text}"
                  </p>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  }

  // MODO EDIÇÃO
  if (isEditing && currentSermon) {
    return (
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <button onClick={() => { setIsEditing(false); setCurrentSermon(null); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <ChevronLeft size={24} /> Voltar para o Histórico
          </button>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => setIsPreaching(true)} 
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isScheduledForToday ? 1 : 0.5, cursor: isScheduledForToday ? 'pointer' : 'not-allowed' }}
              title={isScheduledForToday ? "Iniciar Pregação" : "Você precisa estar escalado hoje para usar o Modo Pregação"}
            >
              {isScheduledForToday ? <MonitorPlay size={20} /> : <CalendarX size={20} />}
              {isScheduledForToday ? "Modo Pregação" : "Pregação Bloqueada"}
            </button>
            <button onClick={handleSave} className="btn-primary" style={{ backgroundColor: '#10B981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={20} /> Salvar Esboço
            </button>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <input 
            type="text" 
            value={currentSermon.title}
            onChange={(e) => setCurrentSermon({ ...currentSermon, title: e.target.value })}
            placeholder="Título da Pregação..."
            style={{ fontSize: '2rem', fontWeight: 'bold', border: 'none', outline: 'none', width: '100%', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', color: 'var(--color-text-primary)' }} 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {currentSermon.blocks.map((block) => (
            <div key={block.id} style={{ position: 'relative', border: '1px solid var(--color-border)', borderRadius: '0.5rem', overflow: 'hidden' }}>
              <button 
                onClick={() => handleDeleteBlock(block.id)}
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: '#DC2626', padding: '0.25rem', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                title="Remover Bloco"
              >
                <Trash size={18} />
              </button>
              
              {block.type === 'text' ? (
                <textarea 
                  value={block.content}
                  onChange={(e) => handleUpdateBlock(block.id, e.target.value)}
                  placeholder="Escreva seu esboço aqui..."
                  style={{ width: '100%', minHeight: '120px', padding: '1rem', border: 'none', resize: 'vertical', fontSize: '1rem', outline: 'none' }}
                />
              ) : (
                <div style={{ backgroundColor: '#F9FAFB', padding: '1rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Book size={18} /> {block.reference}
                  </h4>
                  <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{block.text}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', backgroundColor: '#F3F4F6', padding: '1rem', borderRadius: '0.5rem' }}>
          <button onClick={handleAddTextBlock} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'white', border: '1px solid var(--color-border)', borderRadius: '0.375rem', fontWeight: 500, cursor: 'pointer' }}>
            <Plus size={18} /> Novo Texto
          </button>
          
          <form onSubmit={handleAddVerse} style={{ display: 'flex', flex: 1, gap: '0.5rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Ex: Romanos 8:28..." 
                value={searchVerse}
                onChange={e => setSearchVerse(e.target.value)}
                style={{ width: '100%', padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)' }}
              />
            </div>
            <button type="submit" disabled={loadingVerse || !searchVerse} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '0.375rem', fontWeight: 500, cursor: 'pointer' }}>
              {loadingVerse ? 'Buscando...' : 'Anexar Versículo'}
            </button>
          </form>
        </div>
        {errorVerse && <p style={{ color: '#DC2626', fontSize: '0.875rem', marginTop: '0.5rem' }}>{errorVerse}</p>}
      </div>
    );
  }

  // LISTA DE HISTÓRICO
  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--color-primary)' }}>Histórico de Sermões</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Crie, guarde e prepare seus esboços para quando for escalado.</p>
        </div>
        <button onClick={handleCreateNew} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} /> Novo Sermão
        </button>
      </div>

      {loading ? (
         <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '2rem 0' }}>Carregando sermões...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {sermons.map(sermon => (
              <div key={sermon.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>{sermon.title}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEditSermon(sermon)} style={{ color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }} title="Editar">
                      <Edit size={20} />
                    </button>
                    <button onClick={() => handleDeleteSermon(sermon.id)} style={{ color: '#F87171', background: 'none', border: 'none', cursor: 'pointer' }} title="Excluir">
                      <Trash size={20} />
                    </button>
                  </div>
                </div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', flex: 1 }}>
                  Última atualização: {new Date(sermon.date).toLocaleDateString()}
                  {sermon.author && <span style={{ display: 'block', marginTop: '0.25rem' }}>Por: {sermon.author}</span>}
                </p>
                <button 
                  onClick={() => {
                    setCurrentSermon(sermon);
                    setIsPreaching(true);
                  }}
                  className="btn-primary" 
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', backgroundColor: isScheduledForToday ? 'var(--color-primary)' : '#9CA3AF' }}
                  title={isScheduledForToday ? "Iniciar Pregação" : "Você não está na escala de hoje"}
                >
                  {isScheduledForToday ? <MonitorPlay size={20} /> : <CalendarX size={20} />}
                  {isScheduledForToday ? "Modo Pregação" : "Pregação Bloqueada"}
                </button>
              </div>
            ))}
          </div>
          {sermons.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', backgroundColor: 'var(--color-background)', borderRadius: '0.5rem', border: '1px dashed var(--color-border)' }}>
              <Mic size={48} color="var(--color-text-secondary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p style={{ color: 'var(--color-text-secondary)' }}>Você ainda não criou nenhum sermão.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
