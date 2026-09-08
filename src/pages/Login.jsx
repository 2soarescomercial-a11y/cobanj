export default function Login() {
  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="card" style={{ width: '400px', textAlign: 'center' }}>
        <h1>Login</h1>
        <p>Acesse o sistema da igreja.</p>
        <button className="btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Entrar</button>
      </div>
    </div>
  );
}
