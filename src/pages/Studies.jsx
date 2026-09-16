import { useState, useEffect } from 'react';
import { Sparkles, Edit, BookOpen, Save, Trash, Users, ChevronLeft, Send, Radio, MessageSquare, Plus, CheckCircle, HelpCircle } from 'lucide-react';
import { useLive } from '../context/LiveContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Studies() {
  const { publishToLive } = useLive();
  const { user } = useAuth();
  
  const [studies, setStudies] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [viewingStudy, setViewingStudy] = useState(null);
  const [currentStudy, setCurrentStudy] = useState({ id: null, title: '', content: '', target_group: 'Geral', questions: [] });
  
  // Student answers
  const [studentAnswerText, setStudentAnswerText] = useState(''); // Backward compatibility
  const [studentAnswersData, setStudentAnswersData] = useState({}); // Stores answers by question id { qId: answer }
  const [hasAnswered, setHasAnswered] = useState(false);
  
  // Admin answers view
  const [allAnswers, setAllAnswers] = useState([]);
  const [showAnswersMode, setShowAnswersMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const isAdminOrEditor = user?.system_role === 'admin' || user?.system_role === 'editor' || user?.system_role === 'master';

  const fetchStudies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('studies')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setStudies(data.map(s => ({...s, questions: s.questions || []})));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudies();
  }, []);

  const handleCreateNew = () => {
    setCurrentStudy({ id: null, title: '', content: '', target_group: 'Geral', questions: [] });
    setViewingStudy(null);
    setIsEditing(true);
    setShowAnswersMode(false);
  };

  const handleSave = async () => {
    if (!currentStudy.title || (!currentStudy.content && currentStudy.questions.length === 0)) {
      alert("Título é obrigatório, e deve haver conteúdo ou pelo menos uma questão.");
      return;
    }
    
    // Ensure questions have IDs
    const questionsToSave = currentStudy.questions.map(q => ({
      ...q,
      id: q.id || `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }));

    const studyData = {
      title: currentStudy.title,
      content: currentStudy.content,
      target_group: currentStudy.target_group,
      questions: questionsToSave
    };

    let result;
    if (currentStudy.id) {
      result = await supabase.from('studies').update(studyData).eq('id', currentStudy.id);
    } else {
      result = await supabase.from('studies').insert([studyData]);
    }
    
    if (result.error) {
      console.error(result.error);
      alert('Erro ao salvar o estudo. Detalhes no console.');
    } else {
      alert('Estudo salvo com sucesso!');
      fetchStudies();
      setIsEditing(false);
    }
  };

  const handleDelete = async (id) => {
    if(confirm('Tem certeza que deseja apagar este material? Todas as respostas de alunos também serão apagadas.')) {
      await supabase.from('studies').delete().eq('id', id);
      fetchStudies();
    }
  };

  const handleImproveAI = () => {
    alert("Simulação Gemini: O texto está sendo melhorado pela IA...");
    setCurrentStudy({
      ...currentStudy,
      content: currentStudy.content + '\n\n[Dica gerada pela IA: Considere adicionar exemplos práticos...]'
    });
  };

  // ====== QUESTION BUILDER ======
  const addQuestion = (type) => {
    const newQuestion = {
      id: `q_${Date.now()}`,
      type, // 'multiple_choice' ou 'discursive'
      text: '',
      options: type === 'multiple_choice' ? ['', ''] : [], // Default 2 options
      correctOptionIndex: 0
    };
    setCurrentStudy({ ...currentStudy, questions: [...currentStudy.questions, newQuestion] });
  };

  const updateQuestionText = (index, text) => {
    const newQuestions = [...currentStudy.questions];
    newQuestions[index].text = text;
    setCurrentStudy({ ...currentStudy, questions: newQuestions });
  };

  const addOption = (qIndex) => {
    const newQuestions = [...currentStudy.questions];
    newQuestions[qIndex].options.push('');
    setCurrentStudy({ ...currentStudy, questions: newQuestions });
  };

  const updateOptionText = (qIndex, optIndex, text) => {
    const newQuestions = [...currentStudy.questions];
    newQuestions[qIndex].options[optIndex] = text;
    setCurrentStudy({ ...currentStudy, questions: newQuestions });
  };

  const removeOption = (qIndex, optIndex) => {
    const newQuestions = [...currentStudy.questions];
    newQuestions[qIndex].options.splice(optIndex, 1);
    if(newQuestions[qIndex].correctOptionIndex >= newQuestions[qIndex].options.length) {
      newQuestions[qIndex].correctOptionIndex = 0;
    }
    setCurrentStudy({ ...currentStudy, questions: newQuestions });
  };

  const setCorrectOption = (qIndex, optIndex) => {
    const newQuestions = [...currentStudy.questions];
    newQuestions[qIndex].correctOptionIndex = optIndex;
    setCurrentStudy({ ...currentStudy, questions: newQuestions });
  };

  const removeQuestion = (index) => {
    const newQuestions = [...currentStudy.questions];
    newQuestions.splice(index, 1);
    setCurrentStudy({ ...currentStudy, questions: newQuestions });
  };

  // ====== STUDENT ANSWERS ======
  const handleOptionChange = (qId, optionText) => {
    setStudentAnswersData({ ...studentAnswersData, [qId]: optionText });
  };

  const handleDiscursiveChange = (qId, text) => {
    setStudentAnswersData({ ...studentAnswersData, [qId]: text });
  };

  const loadStudentAnswer = async (studyId) => {
    if (!user?.id) return;
    
    const { data } = await supabase
      .from('study_answers')
      .select('answer_text, answers_data')
      .eq('study_id', studyId)
      .eq('member_id', user.id)
      .single();
      
    if (data) {
      setStudentAnswerText(data.answer_text || '');
      setStudentAnswersData(data.answers_data || {});
      setHasAnswered(true);
    } else {
      setStudentAnswerText('');
      setStudentAnswersData({});
      setHasAnswered(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if(!user?.id) {
      alert('Você precisa estar logado como membro válido para enviar respostas.');
      return;
    }

    if (hasAnswered) {
      await supabase.from('study_answers')
        .update({ answer_text: studentAnswerText, answers_data: studentAnswersData })
        .eq('study_id', viewingStudy.id)
        .eq('member_id', user.id);
    } else {
      await supabase.from('study_answers').insert([{
        study_id: viewingStudy.id,
        member_id: user.id,
        answer_text: studentAnswerText,
        answers_data: studentAnswersData
      }]);
    }

    alert('Suas respostas foram salvas com sucesso!');
    setHasAnswered(true);
  };

  // ====== ADMIN VIEW ======
  const loadAllAnswersForAdmin = async (studyId) => {
    const { data } = await supabase
      .from('study_answers')
      .select(`
        id, answer_text, answers_data, created_at,
        members ( name )
      `)
      .eq('study_id', studyId)
      .order('created_at', { ascending: false });
      
    if (data) {
      setAllAnswers(data);
    }
  };

  const handleViewStudy = (study) => {
    setViewingStudy(study);
    setShowAnswersMode(false);
    loadStudentAnswer(study.id);
  };


  // RENDER ADMIN REVIEW MODE
  if (viewingStudy && showAnswersMode) {
    return (
      <div className="container" style={{ paddingBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <button onClick={() => setShowAnswersMode(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)' }}>
            <ChevronLeft size={24} /> Voltar ao Estudo
          </button>
          <h2 style={{ color: 'var(--color-primary)', margin: 0 }}>Respostas dos Alunos</h2>
        </div>
        
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>{viewingStudy.title}</h3>
          
          {allAnswers.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)' }}>Nenhum aluno respondeu a este estudo ainda.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {allAnswers.map(ans => (
                <div key={ans.id} style={{ border: '1px solid var(--color-border)', borderRadius: '0.5rem', padding: '1rem', backgroundColor: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>{ans.members?.name || 'Membro Desconhecido'}</strong>
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      {new Date(ans.created_at).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  
                  {/* Structured Questions */}
                  {(viewingStudy.questions && viewingStudy.questions.length > 0) ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {viewingStudy.questions.map((q, idx) => {
                        const studentAns = ans.answers_data?.[q.id];
                        const isMC = q.type === 'multiple_choice';
                        const isCorrect = isMC ? studentAns === q.options[q.correctOptionIndex] : null;

                        return (
                          <div key={q.id} style={{ backgroundColor: '#F9FAFB', padding: '1rem', borderRadius: '0.375rem', border: '1px solid #E5E7EB' }}>
                            <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>{idx + 1}. {q.text}</p>
                            
                            {isMC ? (
                              <div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                                  Resposta do aluno: <strong>{studentAns || 'Não respondida'}</strong>
                                </p>
                                {studentAns && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: isCorrect ? '#059669' : '#DC2626', fontSize: '0.875rem', fontWeight: 500 }}>
                                    {isCorrect ? '✅ Correto' : `❌ Incorreto (Correta: ${q.options[q.correctOptionIndex]})`}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div>
                                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Resposta:</span>
                                <p style={{ margin: 0, marginTop: '0.25rem', whiteSpace: 'pre-wrap', color: '#1F2937' }}>{studentAns || <i style={{color: '#9CA3AF'}}>Em branco</i>}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : null}

                  {/* Backward compatibility / Text Only fallback */}
                  {ans.answer_text && (!viewingStudy.questions || viewingStudy.questions.length === 0) && (
                    <div style={{ whiteSpace: 'pre-wrap', backgroundColor: '#F9FAFB', padding: '1rem', borderRadius: '0.375rem', color: '#1F2937' }}>
                      {ans.answer_text}
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // RENDER STUDENT/VIEW MODE
  if (viewingStudy) {
    const hasQuestions = viewingStudy.questions && viewingStudy.questions.length > 0;

    return (
      <div className="container" style={{ paddingBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <button onClick={() => setViewingStudy(null)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)' }}>
            <ChevronLeft size={24} /> Voltar para a lista
          </button>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {isAdminOrEditor && (
              <>
                <button onClick={() => { 
                  loadAllAnswersForAdmin(viewingStudy.id);
                  setShowAnswersMode(true);
                }} style={{ color: 'var(--color-primary)', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--color-primary)', padding: '0.5rem 1rem', borderRadius: '0.375rem' }}>
                  <MessageSquare size={18} /> Ver Respostas
                </button>
                <button onClick={() => { setCurrentStudy({...viewingStudy, questions: viewingStudy.questions || []}); setViewingStudy(null); setIsEditing(true); }} style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', background: 'none' }}>
                  <Edit size={20} /> Editar
                </button>
              </>
            )}
          </div>
        </div>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{viewingStudy.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Publicado em: {new Date(viewingStudy.created_at || Date.now()).toLocaleDateString('pt-BR')}</span>
            <span style={{ backgroundColor: '#F3F4F6', color: '#374151', padding: '0.1rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Users size={12} /> {viewingStudy.target_group}
            </span>
          </div>

          <div style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap' }}>
            {viewingStudy.content}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Prova / Exercícios de Fixação</h3>
          
          {hasAnswered && (
            <div style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
              Você já enviou suas respostas. Você pode editar e enviar novamente se desejar.
            </div>
          )}
          
          {!user?.id && (
            <div style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
              Você precisa estar logado (com uma conta de membro) para enviar as respostas. O acesso <i>Master</i> não pode submeter respostas.
            </div>
          )}

          {hasQuestions ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>
              {viewingStudy.questions.map((q, idx) => (
                <div key={q.id || idx} style={{ border: '1px solid #E5E7EB', padding: '1.5rem', borderRadius: '0.5rem', backgroundColor: '#FAFAFA' }}>
                  <h4 style={{ margin: 0, marginBottom: '1rem', fontSize: '1.05rem', color: '#1F2937' }}>{idx + 1}. {q.text}</h4>
                  
                  {q.type === 'multiple_choice' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {q.options.map((opt, oIdx) => (
                        <label key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid transparent' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='#F3F4F6'} onMouseOut={e=>e.currentTarget.style.backgroundColor='transparent'}>
                          <input 
                            type="radio" 
                            name={`q_${q.id}`} 
                            value={opt} 
                            checked={studentAnswersData[q.id] === opt}
                            onChange={() => handleOptionChange(q.id, opt)}
                            disabled={!user?.id}
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <textarea 
                      placeholder="Sua resposta..."
                      value={studentAnswersData[q.id] || ''}
                      onChange={e => handleDiscursiveChange(q.id, e.target.value)}
                      disabled={!user?.id}
                      style={{ width: '100%', minHeight: '100px', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)', resize: 'vertical', fontFamily: 'inherit' }}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <textarea 
              placeholder="Digite suas respostas aqui..."
              value={studentAnswerText}
              onChange={e => setStudentAnswerText(e.target.value)}
              disabled={!user?.id}
              style={{ width: '100%', minHeight: '150px', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', resize: 'vertical', fontFamily: 'inherit', marginBottom: '1rem', opacity: !user?.id ? 0.6 : 1 }}
            />
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleSubmitAnswer} disabled={!user?.id} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: !user?.id ? 0.5 : 1 }}>
              <Send size={18} /> {hasAnswered ? 'Atualizar Respostas' : 'Enviar Respostas'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // RENDER EDIT / CREATE MODE
  if (isEditing) {
    return (
      <div className="container" style={{ paddingBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <button onClick={() => setIsEditing(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', background: 'none', border: 'none' }}>
            <ChevronLeft size={24} /> Voltar
          </button>
          <h2 style={{ color: 'var(--color-primary)', margin: 0 }}>{currentStudy.id ? 'Editar Estudo/Prova' : 'Novo Estudo/Prova'}</h2>
        </div>

        <div className="card" style={{ marginBottom: '2rem' }}>
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
                  value={currentStudy.target_group} 
                  onChange={e => setCurrentStudy({...currentStudy, target_group: e.target.value})}
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
              <Sparkles size={18} /> Melhorar Texto
            </button>
          </div>

          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Texto base do Estudo (Opcional se for apenas prova)</label>
          <textarea 
            placeholder="Escreva o esboço do estudo, texto base..."
            value={currentStudy.content}
            onChange={e => setCurrentStudy({...currentStudy, content: e.target.value})}
            style={{ width: '100%', minHeight: '200px', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', resize: 'vertical', fontFamily: 'inherit', fontSize: '1rem', lineHeight: '1.5' }}
          />
        </div>

        {/* QUESTION BUILDER */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={20} /> Construtor de Questões
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            Adicione perguntas estruturadas. Os alunos poderão responder e você verá o relatório formatado.
          </p>

          {currentStudy.questions.map((q, qIndex) => (
            <div key={qIndex} style={{ border: '1px solid var(--color-border)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem', backgroundColor: '#F9FAFB' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Questão {qIndex + 1} 
                  <span style={{ fontSize: '0.75rem', backgroundColor: '#E5E7EB', padding: '0.1rem 0.4rem', borderRadius: '1rem' }}>
                    {q.type === 'multiple_choice' ? 'Múltipla Escolha' : 'Discursiva'}
                  </span>
                </strong>
                <button onClick={() => removeQuestion(qIndex)} style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Trash size={18} />
                </button>
              </div>

              <input 
                type="text" 
                placeholder="Digite o enunciado da questão..." 
                value={q.text}
                onChange={e => updateQuestionText(qIndex, e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)', marginBottom: '1rem' }}
              />

              {q.type === 'multiple_choice' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '1rem' }}>
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input 
                        type="radio" 
                        name={`correct_opt_${qIndex}`} 
                        checked={q.correctOptionIndex === optIndex}
                        onChange={() => setCorrectOption(qIndex, optIndex)}
                        title="Marcar como alternativa correta"
                        style={{ cursor: 'pointer' }}
                      />
                      <input 
                        type="text"
                        placeholder={`Alternativa ${String.fromCharCode(65 + optIndex)}`}
                        value={opt}
                        onChange={e => updateOptionText(qIndex, optIndex, e.target.value)}
                        style={{ flex: 1, padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--color-border)' }}
                      />
                      {q.options.length > 2 && (
                        <button onClick={() => removeOption(qIndex, optIndex)} style={{ color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer' }}>
                          <Trash size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => addOption(qIndex)} style={{ color: 'var(--color-primary)', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                    <Plus size={16} /> Adicionar Alternativa
                  </button>
                </div>
              )}
            </div>
          ))}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={() => addQuestion('multiple_choice')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: '1px dashed var(--color-primary)', color: 'var(--color-primary)', borderRadius: '0.375rem', background: 'transparent' }}>
              <Plus size={18} /> Adicionar Múltipla Escolha
            </button>
            <button onClick={() => addQuestion('discursive')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: '1px dashed var(--color-primary)', color: 'var(--color-primary)', borderRadius: '0.375rem', background: 'transparent' }}>
              <Plus size={18} /> Adicionar Discursiva
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
          <button onClick={handleSave} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem' }}>
            <Save size={20} /> Salvar Estudo/Prova
          </button>
        </div>
      </div>
    );
  }

  // RENDER LIST
  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--color-primary)' }}>Escola Bíblica & Estudos</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Portal do Aluno: Material didático, provas e esboços.</p>
        </div>
        {isAdminOrEditor && (
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={handleCreateNew}>
            <Edit size={20} /> Novo Estudo/Prova
          </button>
        )}
      </div>

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
        
        {loading ? (
            <p style={{ color: 'var(--color-text-secondary)' }}>Carregando estudos...</p>
        ) : studies.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>Nenhum estudo salvo ainda.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {studies.map(study => (
              <div 
                key={study.id} 
                onClick={() => handleViewStudy(study)}
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
                      <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{new Date(study.created_at || Date.now()).toLocaleDateString('pt-BR')}</span>
                      <span style={{ backgroundColor: '#F3F4F6', color: '#374151', padding: '0.1rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Users size={12} /> {study.target_group}
                      </span>
                      {study.questions?.length > 0 && (
                        <span style={{ backgroundColor: '#DBEAFE', color: '#1E3A8A', padding: '0.1rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <CheckCircle size={12} /> {study.questions.length} Questões
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {isAdminOrEditor && (
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setCurrentStudy(study); setIsEditing(true); }}
                      style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', border: 'none', background: 'none' }}>
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(study.id); }}
                      style={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: '0.25rem', border: 'none', background: 'none' }}>
                      <Trash size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
