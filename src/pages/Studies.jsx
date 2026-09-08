import { useState } from 'react';
import { Sparkles, Edit, BookOpen, Save, Trash, Users, ChevronLeft, Send, Radio } from 'lucide-react';
import { useLive } from '../context/LiveContext';

export default function Studies() {
  const { publishToLive } = useLive();
  const [studies, setStudies] = useState([
    { id: 1, title: 'Estudo sobre a Graça', content: 'A graça nos salva mediante a fé. Não vem de nós, é dom de Deus.\n\nExercício:\n1. O que é a graça segundo Efésios 2?\n2. Como você aplica isso na sua vida?', targetGroup: 'Geral', date: '2026-09-08' },
    { id: 2, title: 'Liderança e Hombridade', content: 'Princípios de liderança cristã para homens. O líder deve ser servo.', targetGroup: 'Homens', date: '2026-09-07' }
  ]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [viewingStudy, setViewingStudy] = useState(null);
  const [currentStudy, setCurrentStudy] = useState({ id: null, title: '', content: '', targetGroup: 'Geral' });
  const [studentAnswer, setStudentAnswer] = useState('');

  const handleCreateNew = () => {
    setCurrentStudy({ id: null, title: '', content: '', targetGroup: 'Geral' });
    setViewingStudy(null);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (currentStudy.id) {
      setStudies(studies.map(s => s.id === currentStudy.id ? { ...currentStudy, date: s.date } : s));
    } else {
      setStudies([...studies, { ...currentStudy, id: Date.now(), date: new Date().toISOString().split('T')[0] }]);
    }
    setIsEditing(false);
  };

  const handleDelete = (id) => {
    if(confirm('Tem certeza que deseja apagar este material?')) {
      setStudies(studies.filter(s => s.id !== id));
    }
  };

  const handleImproveAI = () => {
    alert("Simulação Gemini: O texto está sendo melhorado pela IA...");
    setCurrentStudy({
      ...currentStudy,
      content: currentStudy.content + '\n\n[Dica gerada pela IA: Considere adicionar exemplos práticos de como viver esses princípios no dia a dia...]'
    });
  };

  const handleSubmitAnswer = () => {
    if(!studentAnswer.trim()) {
      alert('Por favor, escreva sua resposta antes de enviar.');
      return;
    }
    alert('Suas respostas foram enviadas com sucesso para os professores!');
    setStudentAnswer('');
  };

  const handleProjectStudy = () => {
    if (publishToLive) {
      publishToLive('leitura', viewingStudy.title, viewingStudy.content);
      alert('O esboço foi enviado para o telão do Culto Ao Vivo!');
    }
  };

  if (viewingStudy) {
    return (
      <div className="container" style={{ paddingBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <button onClick={() => setViewingStudy(null)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)' }}>
            <ChevronLeft size={24} /> Voltar para a lista
          </button>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleProjectStudy} className="btn-primary" style={{ backgroundColor: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Radio size={20} className="animate-pulse" /> Transmitir no Culto
            </button>
            <button onClick={() => { setCurrentStudy(viewingStudy); setViewingStudy(null); setIsEditing(true); }} style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Edit size={20} /> Editar Material
            </button>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{viewingStudy.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Publicado em: {new Date(viewingStudy.date).toLocaleDateString('pt-BR')}</span>
            <span style={{ backgroundColor: '#F3F4F6', color: '#374151', padding: '0.1rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Users size={12} /> {viewingStudy.targetGroup}
            </span>
          </div>

          <div style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap' }}>
            {viewingStudy.content}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Prova / Exercícios de Fixação</h3>
          <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>Responda às questões propostas no estudo acima e envie para correção.</p>
          <textarea 
            placeholder="Digite suas respostas aqui..."
            value={studentAnswer}
            onChange={e => setStudentAnswer(e.target.value)}
            style={{ width: '100%', minHeight: '150px', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', resize: 'vertical', fontFamily: 'inherit', marginBottom: '1rem' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleSubmitAnswer} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Send size={18} /> Enviar Respostas
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--color-primary)' }}>Escola Bíblica & Estudos</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Material didático, provas e esboços para os grupos da igreja.</p>
        </div>
        {!isEditing && (
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={handleCreateNew}>
            <Edit size={20} /> Novo Estudo/Prova
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>Materiais Recentes</h3>
            <select style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)' }}>
              <option value="Todos">Filtrar por Grupo (Todos)</option>
              <option value="Geral">Geral</option>
              <option value="Teens">Teens / Jovens</option>
              <option value="Homens">Homens</option>
              <option value="Mulheres">Mulheres</option>
              <option value="Infantil">Infantil</option>
            </select>
          </div>
          
          {studies.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)' }}>Nenhum estudo salvo ainda.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {studies.map(study => (
                <div 
                  key={study.id} 
                  onClick={() => setViewingStudy(study)}
                  style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                    padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '0.5rem',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                  onMouseOut={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ backgroundColor: '#EEF2FF', padding: '0.75rem', borderRadius: '50%' }}>
                      <BookOpen size={24} color="var(--color-primary)" />
                    </div>
                    <div>
                      <h4 style={{ margin: 0 }}>{study.title}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{new Date(study.date).toLocaleDateString('pt-BR')}</span>
                        <span style={{ backgroundColor: '#F3F4F6', color: '#374151', padding: '0.1rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Users size={12} /> {study.targetGroup}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setCurrentStudy(study); setIsEditing(true); }}
                      style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(study.id); }}
                      style={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <input 
                type="text" 
                placeholder="Título do Estudo/Prova" 
                value={currentStudy.title}
                onChange={e => setCurrentStudy({...currentStudy, title: e.target.value})}
                style={{ fontSize: '1.5rem', fontWeight: 'bold', border: 'none', outline: 'none', width: '100%', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }} 
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Direcionado para:</span>
                <select 
                  value={currentStudy.targetGroup} 
                  onChange={e => setCurrentStudy({...currentStudy, targetGroup: e.target.value})}
                  style={{ padding: '0.25rem 0.5rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)', fontSize: '0.875rem' }}>
                  <option value="Geral">Geral (Toda a Igreja)</option>
                  <option value="Teens">Teens / Jovens</option>
                  <option value="Homens">Ministério de Homens</option>
                  <option value="Mulheres">Ministério de Mulheres</option>
                  <option value="Infantil">Infantil (Kids)</option>
                </select>
              </div>
            </div>
            <button onClick={handleImproveAI} className="btn-primary" style={{ backgroundColor: '#8B5CF6', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
              <Sparkles size={18} /> Melhorar com IA
            </button>
          </div>

          <textarea 
            placeholder="Escreva o esboço do estudo, perguntas da prova ou notas aqui..."
            value={currentStudy.content}
            onChange={e => setCurrentStudy({...currentStudy, content: e.target.value})}
            style={{ width: '100%', minHeight: '300px', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', resize: 'vertical', fontFamily: 'inherit', fontSize: '1rem', lineHeight: '1.5' }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button onClick={() => setIsEditing(false)} style={{ color: 'var(--color-text-secondary)' }}>Cancelar</button>
            <button onClick={handleSave} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={18} /> Salvar Material
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
