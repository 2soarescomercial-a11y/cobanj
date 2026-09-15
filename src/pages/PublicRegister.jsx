import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Camera, Link as Instagram, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function PublicRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
    instagram: '',
    photo: null,
    branch: 'Matriz'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newMember = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      dob: formData.dob,
      instagram: formData.instagram,
      photo: formData.photo,
      branch: formData.branch,
      role: 'Membro',
      has_access: false,
      system_role: 'user',
      username: null,
      password: null
    };
    
    const { error } = await supabase.from('members').insert([newMember]);
    
    if (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Ocorreu um erro ao enviar seu cadastro. Tente novamente.');
      return;
    }
    
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' }}>
        <div className="card" style={{ maxWidth: '500px', width: '90%', textAlign: 'center', padding: '3rem 2rem' }}>
          <CheckCircle size={64} color="var(--color-primary)" style={{ margin: '0 auto 1.5rem' }} />
          <h2 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Cadastro Realizado!</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
            Seus dados foram enviados com sucesso. A liderança irá analisar e liberar seu acesso ao sistema em breve.
          </p>
          <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Voltar para o Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6', padding: '2rem 1rem' }}>
      <div className="card" style={{ maxWidth: '600px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--color-primary)', margin: 0 }}>COBANJ</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>Cadastro de Membro</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              <User size={16} /> Nome Completo
            </label>
            <input 
              type="text" required
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)' }} 
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                <Phone size={16} /> Telefone / WhatsApp
              </label>
              <input 
                type="text" required placeholder="(DD) 99999-9999"
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)' }} 
              />
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                <Calendar size={16} /> Data de Nascimento
              </label>
              <input 
                type="date" required
                value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)' }} 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              <Mail size={16} /> Email
            </label>
            <input 
              type="email" required
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)' }} 
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              <Instagram size={16} /> Instagram (Opcional)
            </label>
            <input 
              type="text" placeholder="@seu.usuario"
              value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)' }} 
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              <MapPin size={16} /> Endereço Completo
            </label>
            <input 
              type="text" required placeholder="Rua, Número, Bairro, Cidade"
              value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)' }} 
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              <Camera size={16} /> Foto de Perfil (Opcional)
            </label>
            <input 
              type="file" accept="image/*"
              onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  // Aqui no mundo real faria upload. Vamos simular guardando nome ou ObjectURL provisório.
                  setFormData({...formData, photo: URL.createObjectURL(file)});
                }
              }}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)', backgroundColor: '#fff' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Congregação / Filial</label>
            <select 
              value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)' }}>
              <option value="Matriz">Matriz</option>
              <option value="Filial Piabeta">Filial Piabetá</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ padding: '1rem', fontSize: '1rem', marginTop: '1rem' }}>
            Enviar Cadastro
          </button>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link to="/login" style={{ color: 'var(--color-primary)', fontSize: '0.875rem', textDecoration: 'none' }}>
              Já tem acesso? Faça login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
