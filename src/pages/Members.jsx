import { useState } from 'react';
import { UserPlus, Edit, Trash, Users, Phone, Mail, MapPin, Calendar, X } from 'lucide-react';

export default function Members() {
  const [members, setMembers] = useState([
    { 
      id: 1, name: 'João Silva', role: 'Diácono', branch: 'Matriz',
      phone: '(21) 99999-9999', email: 'joao@email.com', address: 'Rua A, 123', dob: '1980-05-15'
    },
    { 
      id: 2, name: 'Maria Souza', role: 'Professora', branch: 'Filial Piabetá',
      phone: '(21) 98888-8888', email: 'maria@email.com', address: 'Av Principal, 45', dob: '1992-10-22'
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [viewingMember, setViewingMember] = useState(null);
  const [formData, setFormData] = useState({ 
    id: null, name: '', role: 'Membro', branch: 'Matriz', 
    phone: '', email: '', address: '', dob: '',
    hasAccess: false, username: '', password: ''
  });

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.id) {
      setMembers(members.map(m => m.id === formData.id ? formData : m));
    } else {
      setMembers([...members, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
    setFormData({ id: null, name: '', role: 'Membro', branch: 'Matriz', phone: '', email: '', address: '', dob: '', hasAccess: false, username: '', password: '' });
  };

  const handleEdit = (member, e) => {
    if (e) e.stopPropagation();
    setFormData(member);
    setViewingMember(null);
    setShowModal(true);
  };

  const handleDelete = (id, e) => {
    if (e) e.stopPropagation();
    if (confirm('Tem certeza que deseja remover este membro?')) {
      setMembers(members.filter(m => m.id !== id));
      setViewingMember(null);
    }
  };

  const openNewMemberModal = () => {
    setFormData({ id: null, name: '', role: 'Membro', branch: 'Matriz', phone: '', email: '', address: '', dob: '', hasAccess: false, username: '', password: '' });
    setShowModal(true);
  };

  const handleCardClick = (member) => {
    setViewingMember(member);
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--color-primary)' }}>Membros</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Gerencie o cadastro de membros e obreiros.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={openNewMemberModal}>
          <UserPlus size={20} /> Novo Membro
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>Lista de Membros</h3>
          <select style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)' }}>
            <option value="">Todas as Filiais</option>
            <option value="Matriz">Matriz</option>
            <option value="Filial Piabeta">Filial Piabetá</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {members.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)' }}>Nenhum membro cadastrado.</p>
          ) : (
            members.map(member => (
              <div 
                key={member.id} 
                onClick={() => handleCardClick(member)}
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
                    <Users size={24} color="var(--color-primary)" />
                  </div>
                  <div>
                    <h4 style={{ margin: 0 }}>{member.name}</h4>
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{member.role} • {member.branch}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={(e) => handleEdit(member, e)} style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem' }}>
                    <Edit size={18} />
                  </button>
                  <button onClick={(e) => handleDelete(member.id, e)} style={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem' }}>
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de Visualização (Detalhes) */}
      {viewingMember && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card" style={{ width: '450px', maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ backgroundColor: '#EEF2FF', padding: '1rem', borderRadius: '50%' }}>
                  <Users size={32} color="var(--color-primary)" />
                </div>
                <div>
                  <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>{viewingMember.name}</h2>
                  <span style={{ fontSize: '0.875rem', fontWeight: 'bold', backgroundColor: '#F3F4F6', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>
                    {viewingMember.role}
                  </span>
                </div>
              </div>
              <button onClick={() => setViewingMember(null)} style={{ color: 'var(--color-text-secondary)' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-primary)' }}>
                <MapPin size={18} color="var(--color-text-secondary)" /> 
                <span><strong>Filial:</strong> {viewingMember.branch}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-primary)' }}>
                <Phone size={18} color="var(--color-text-secondary)" /> 
                <span><strong>Telefone:</strong> {viewingMember.phone || 'Não informado'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-primary)' }}>
                <Mail size={18} color="var(--color-text-secondary)" /> 
                <span><strong>Email:</strong> {viewingMember.email || 'Não informado'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-primary)' }}>
                <Calendar size={18} color="var(--color-text-secondary)" /> 
                <span><strong>Data de Nasc:</strong> {viewingMember.dob ? new Date(viewingMember.dob).toLocaleDateString('pt-BR') : 'Não informado'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-primary)' }}>
                <MapPin size={18} color="var(--color-text-secondary)" /> 
                <span><strong>Endereço:</strong> {viewingMember.address || 'Não informado'}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <button onClick={() => handleDelete(viewingMember.id)} style={{ padding: '0.5rem 1rem', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trash size={18} /> Excluir
              </button>
              <button onClick={() => handleEdit(viewingMember)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit size={18} /> Editar Cadastro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cadastro/Edição */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
          <div className="card" style={{ width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>{formData.id ? 'Editar Membro' : 'Cadastrar Membro'}</h3>
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Nome Completo</label>
                <input 
                  type="text" required
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)' }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Telefone</label>
                  <input 
                    type="text" placeholder="(DD) 99999-9999"
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)' }} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Data de Nasc.</label>
                  <input 
                    type="date"
                    value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)' }} 
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Email</label>
                <input 
                  type="email"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)' }} 
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Endereço</label>
                <input 
                  type="text"
                  value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)' }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Cargo</label>
                  <select 
                    value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)' }}>
                    <option value="Membro">Membro</option>
                    <option value="Obreiro">Obreiro</option>
                    <option value="Diácono">Diácono</option>
                    <option value="Presbítero">Presbítero</option>
                    <option value="Evangelista">Evangelista</option>
                    <option value="Pastor">Pastor</option>
                    <option value="Professora">Professora(or)</option>
                    <option value="Tesoureiro">Tesoureiro</option>
                    <option value="Mídia">Mídia / Comunicação</option>
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

              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.hasAccess} 
                    onChange={e => setFormData({...formData, hasAccess: e.target.checked})}
                  />
                  Este membro terá acesso ao sistema (Login)
                </label>
                
                {formData.hasAccess && (
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Usuário</label>
                      <input 
                        type="text" required={formData.hasAccess} placeholder="ex: joao.silva"
                        value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)' }} 
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Senha</label>
                      <input 
                        type="password" required={formData.hasAccess} placeholder="******"
                        value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)' }} 
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1rem', color: 'var(--color-text-secondary)' }}>Cancelar</button>
                <button type="submit" className="btn-primary">{formData.id ? 'Salvar Alterações' : 'Salvar Membro'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
