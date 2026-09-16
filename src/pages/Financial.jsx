import { useState, useEffect } from 'react';
import { DollarSign, ArrowUpCircle, ArrowDownCircle, Plus, Edit, Trash } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Financial() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, type: 'entrada', description: '', amount: '', date: '', category: 'Dízimo', branch: 'Matriz' });

  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('transactions').select('*').order('date', { ascending: false });
    if (data) {
      setTransactions(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const totalEntradas = transactions.filter(t => t.type === 'entrada').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalSaidas = transactions.filter(t => t.type === 'saida').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const saldoFinal = totalEntradas - totalSaidas;

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.id) {
      await supabase.from('transactions').update({
        type: formData.type,
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: formData.date,
        category: formData.category,
        branch: formData.branch
      }).eq('id', formData.id);
    } else {
      await supabase.from('transactions').insert([{
        type: formData.type,
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: formData.date,
        category: formData.category,
        branch: formData.branch
      }]);
    }
    fetchTransactions();
    setShowModal(false);
    setFormData({ id: null, type: 'entrada', description: '', amount: '', date: '', category: 'Dízimo', branch: 'Matriz' });
  };

  const handleEdit = (transaction) => {
    setFormData(transaction);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja remover este lançamento?')) {
      await supabase.from('transactions').delete().eq('id', id);
      fetchTransactions();
    }
  };

  const openNewTransactionModal = () => {
    setFormData({ id: null, type: 'entrada', description: '', amount: '', date: new Date().toISOString().split('T')[0], category: 'Dízimo', branch: 'Matriz' });
    setShowModal(true);
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--color-primary)' }}>Financeiro</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Controle de dízimos, ofertas e despesas.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={openNewTransactionModal}>
          <Plus size={20} /> Novo Lançamento
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#ECFDF5', borderRadius: '0.5rem' }}>
            <ArrowUpCircle size={32} color="#10B981" />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>Entradas</p>
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#10B981' }}>R$ {totalEntradas.toFixed(2)}</h2>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#FEF2F2', borderRadius: '0.5rem' }}>
            <ArrowDownCircle size={32} color="#EF4444" />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>Saídas</p>
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#EF4444' }}>R$ {totalSaidas.toFixed(2)}</h2>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#EFF6FF', borderRadius: '0.5rem' }}>
            <DollarSign size={32} color="#3B82F6" />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>Saldo Final</p>
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#3B82F6' }}>R$ {saldoFinal.toFixed(2)}</h2>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Extrato</h3>
        
        {loading ? (
          <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '2rem 0' }}>Carregando lançamentos...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem 0.5rem' }}>Data</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Descrição</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Categoria</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Filial</th>
                  <th style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>Valor</th>
                  <th style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan="6" style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Nenhuma movimentação encontrada.</td></tr>
                ) : (
                  transactions.map(t => (
                    <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '1rem 0.5rem' }}>{new Date(t.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>{t.description}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{t.category}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{t.branch}</td>
                      <td style={{ padding: '1rem 0.5rem', textAlign: 'right', color: t.type === 'entrada' ? '#10B981' : '#EF4444', fontWeight: 'bold' }}>
                        {t.type === 'entrada' ? '+' : '-'} R$ {Number(t.amount).toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                        <button onClick={() => handleEdit(t)} style={{ color: 'var(--color-primary)', marginRight: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}><Edit size={16} /></button>
                        <button onClick={() => handleDelete(t.id)} style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}><Trash size={16} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>{formData.id ? 'Editar Lançamento' : 'Novo Lançamento'}</h3>
            <form onSubmit={handleRegister}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="radio" name="type" value="entrada" checked={formData.type === 'entrada'} onChange={e => setFormData({...formData, type: e.target.value})} /> Entrada
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#DC2626' }}>
                  <input type="radio" name="type" value="saida" checked={formData.type === 'saida'} onChange={e => setFormData({...formData, type: e.target.value})} /> Saída
                </label>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Descrição</label>
                <input 
                  type="text" required placeholder="Ex: Oferta de Domingo, Conta de Água..."
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)', outline: 'none' }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Valor (R$)</label>
                  <input 
                    type="number" step="0.01" required placeholder="0,00"
                    value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)', outline: 'none' }} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Data</label>
                  <input 
                    type="date" required
                    value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)', outline: 'none' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Categoria</label>
                  <select 
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)', outline: 'none' }}>
                    <option value="Dízimo">Dízimo</option>
                    <option value="Oferta">Oferta Alçada</option>
                    <option value="Missões">Missões</option>
                    <option value="Construção">Construção</option>
                    <option value="Despesas Fixas">Despesas Fixas (Água, Luz)</option>
                    <option value="Pagamentos">Pagamentos / Salários</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Filial</label>
                  <select 
                    value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)', outline: 'none' }}>
                    <option value="Matriz">Matriz</option>
                    <option value="Filial Piabeta">Filial Piabetá</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1rem', color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" className="btn-primary">{formData.id ? 'Salvar Alterações' : 'Salvar Lançamento'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
