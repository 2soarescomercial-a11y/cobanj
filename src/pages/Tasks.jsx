import { useState, useEffect } from 'react';
import { Plus, CheckCircle, Circle, Trash, Edit, User, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, title: '', assignee: '', branch: 'Matriz' });
  const [filterBranch, setFilterBranch] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setTasks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.id) {
      await supabase.from('tasks').update({
        title: formData.title,
        assignee: formData.assignee,
        branch: formData.branch
      }).eq('id', formData.id);
    } else {
      await supabase.from('tasks').insert([{
        title: formData.title,
        assignee: formData.assignee,
        branch: formData.branch,
        completed: false
      }]);
    }
    fetchTasks();
    setShowModal(false);
    setFormData({ id: null, title: '', assignee: '', branch: 'Matriz' });
  };

  const toggleTask = async (id, currentStatus) => {
    // Optimistic update
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));
    await supabase.from('tasks').update({ completed: !currentStatus }).eq('id', id);
    fetchTasks();
  };

  const handleEdit = (task) => {
    setFormData({ id: task.id, title: task.title, assignee: task.assignee, branch: task.branch });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Deseja excluir esta tarefa?')) {
      await supabase.from('tasks').delete().eq('id', id);
      fetchTasks();
    }
  };

  const openNewTaskModal = () => {
    setFormData({ id: null, title: '', assignee: '', branch: 'Matriz' });
    setShowModal(true);
  };

  const filteredTasks = filterBranch ? tasks.filter(t => t.branch === filterBranch) : tasks;
  const pendingTasks = tasks.filter(t => !t.completed).length;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--color-primary)' }}>Gestão de Tarefas</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Escale as equipes e defina os responsáveis pelos trabalhos.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={openNewTaskModal}>
          <Plus size={20} /> Nova Tarefa
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#EEF2FF', borderRadius: '0.5rem' }}>
            <Circle size={32} color="var(--color-primary)" />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>Tarefas Pendentes</p>
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-primary)' }}>{pendingTasks}</h2>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#ECFDF5', borderRadius: '0.5rem' }}>
            <CheckCircle size={32} color="#10B981" />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>Tarefas Concluídas</p>
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#10B981' }}>{tasks.length - pendingTasks}</h2>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0 }}>Lista de Afazeres</h3>
          <select 
            value={filterBranch}
            onChange={e => setFilterBranch(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)' }}>
            <option value="">Todas as Filiais</option>
            <option value="Matriz">Matriz</option>
            <option value="Filial Piabeta">Filial Piabetá</option>
          </select>
        </div>
        
        {loading ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>Carregando tarefas...</p>
        ) : filteredTasks.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>Nenhuma tarefa encontrada.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredTasks.map(task => (
              <div key={task.id} style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '0.5rem',
                backgroundColor: task.completed ? '#F9FAFB' : 'white',
                opacity: task.completed ? 0.7 : 1
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button onClick={() => toggleTask(task.id, task.completed)} style={{ padding: '0.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {task.completed ? (
                      <CheckCircle size={24} color="#10B981" />
                    ) : (
                      <Circle size={24} color="var(--color-text-secondary)" />
                    )}
                  </button>
                  <div>
                    <h4 style={{ margin: 0, textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'var(--color-text-secondary)' : 'var(--color-text-primary)' }}>
                      {task.title}
                    </h4>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <User size={14} /> Responsável: {task.assignee || 'Não definido'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={14} /> {task.branch}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEdit(task)} style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(task.id)} style={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
          <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>{formData.id ? 'Editar Tarefa' : 'Nova Tarefa'}</h3>
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>O que precisa ser feito?</label>
                <input 
                  type="text" required placeholder="Ex: Limpar salão, Ensaiar louvor..."
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)' }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Quem será o Responsável?</label>
                  <select 
                    required
                    value={formData.assignee} onChange={e => setFormData({...formData, assignee: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)' }} 
                  >
                    <option value="">Selecione um responsável...</option>
                    <optgroup label="Departamentos">
                      <option value="Equipe de Som">Equipe de Som</option>
                      <option value="Diaconato">Diaconato</option>
                      <option value="Louvor">Ministério de Louvor</option>
                      <option value="Mídia">Mídia e Comunicação</option>
                    </optgroup>
                    <optgroup label="Membros Cadastrados">
                      <option value="João Silva (Diácono)">João Silva (Diácono)</option>
                      <option value="Maria Souza (Professora)">Maria Souza (Professora)</option>
                      <option value="Pr. Carlos (Pastor)">Pr. Carlos (Pastor)</option>
                    </optgroup>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Filial</label>
                  <select 
                    value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)' }}>
                    <option value="Matriz">Matriz</option>
                    <option value="Filial Piabeta">Filial Piabetá</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1rem', color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" className="btn-primary">{formData.id ? 'Salvar Alterações' : 'Salvar Tarefa'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

