import { useState } from 'react';
import { Search, Book as BookIcon, ChevronLeft, Book } from 'lucide-react';
import { useLive } from '../context/LiveContext';

const BIBLE_BOOKS = [
  { id: 'Genesis', name: 'Gênesis', chapters: 50 },
  { id: 'Exodus', name: 'Êxodo', chapters: 40 },
  { id: 'Leviticus', name: 'Levítico', chapters: 27 },
  { id: 'Numbers', name: 'Números', chapters: 36 },
  { id: 'Deuteronomy', name: 'Deuteronômio', chapters: 34 },
  { id: 'Joshua', name: 'Josué', chapters: 24 },
  { id: 'Judges', name: 'Juízes', chapters: 21 },
  { id: 'Ruth', name: 'Rute', chapters: 4 },
  { id: '1 Samuel', name: '1 Samuel', chapters: 31 },
  { id: '2 Samuel', name: '2 Samuel', chapters: 24 },
  { id: '1 Kings', name: '1 Reis', chapters: 22 },
  { id: '2 Kings', name: '2 Reis', chapters: 25 },
  { id: '1 Chronicles', name: '1 Crônicas', chapters: 29 },
  { id: '2 Chronicles', name: '2 Crônicas', chapters: 36 },
  { id: 'Ezra', name: 'Esdras', chapters: 10 },
  { id: 'Nehemiah', name: 'Neemias', chapters: 13 },
  { id: 'Esther', name: 'Ester', chapters: 10 },
  { id: 'Job', name: 'Jó', chapters: 42 },
  { id: 'Psalms', name: 'Salmos', chapters: 150 },
  { id: 'Proverbs', name: 'Provérbios', chapters: 31 },
  { id: 'Ecclesiastes', name: 'Eclesiastes', chapters: 12 },
  { id: 'Song of Solomon', name: 'Cânticos', chapters: 8 },
  { id: 'Isaiah', name: 'Isaías', chapters: 66 },
  { id: 'Jeremiah', name: 'Jeremias', chapters: 52 },
  { id: 'Lamentations', name: 'Lamentações', chapters: 5 },
  { id: 'Ezekiel', name: 'Ezequiel', chapters: 48 },
  { id: 'Daniel', name: 'Daniel', chapters: 12 },
  { id: 'Hosea', name: 'Oséias', chapters: 14 },
  { id: 'Joel', name: 'Joel', chapters: 3 },
  { id: 'Amos', name: 'Amós', chapters: 9 },
  { id: 'Obadiah', name: 'Obadias', chapters: 1 },
  { id: 'Jonah', name: 'Jonas', chapters: 4 },
  { id: 'Micah', name: 'Miquéias', chapters: 7 },
  { id: 'Nahum', name: 'Naum', chapters: 3 },
  { id: 'Habakkuk', name: 'Habacuque', chapters: 3 },
  { id: 'Zephaniah', name: 'Sofonias', chapters: 3 },
  { id: 'Haggai', name: 'Ageu', chapters: 2 },
  { id: 'Zechariah', name: 'Zacarias', chapters: 14 },
  { id: 'Malachi', name: 'Malaquias', chapters: 4 },
  { id: 'Matthew', name: 'Mateus', chapters: 28 },
  { id: 'Mark', name: 'Marcos', chapters: 16 },
  { id: 'Luke', name: 'Lucas', chapters: 24 },
  { id: 'John', name: 'João', chapters: 21 },
  { id: 'Acts', name: 'Atos', chapters: 28 },
  { id: 'Romans', name: 'Romanos', chapters: 16 },
  { id: '1 Corinthians', name: '1 Coríntios', chapters: 16 },
  { id: '2 Corinthians', name: '2 Coríntios', chapters: 13 },
  { id: 'Galatians', name: 'Gálatas', chapters: 6 },
  { id: 'Ephesians', name: 'Efésios', chapters: 6 },
  { id: 'Philippians', name: 'Filipenses', chapters: 4 },
  { id: 'Colossians', name: 'Colossenses', chapters: 4 },
  { id: '1 Thessalonians', name: '1 Tessalonicenses', chapters: 5 },
  { id: '2 Thessalonians', name: '2 Tessalonicenses', chapters: 3 },
  { id: '1 Timothy', name: '1 Timóteo', chapters: 6 },
  { id: '2 Timothy', name: '2 Timóteo', chapters: 4 },
  { id: 'Titus', name: 'Tito', chapters: 3 },
  { id: 'Philemon', name: 'Filemom', chapters: 1 },
  { id: 'Hebrews', name: 'Hebreus', chapters: 13 },
  { id: 'James', name: 'Tiago', chapters: 5 },
  { id: '1 Peter', name: '1 Pedro', chapters: 5 },
  { id: '2 Peter', name: '2 Pedro', chapters: 3 },
  { id: '1 John', name: '1 João', chapters: 5 },
  { id: '2 John', name: '2 João', chapters: 1 },
  { id: '3 John', name: '3 João', chapters: 1 },
  { id: 'Jude', name: 'Judas', chapters: 1 },
  { id: 'Revelation', name: 'Apocalipse', chapters: 22 }
];

export default function Bible() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [result, setResult] = useState(null);
  
  const { publishToLive } = useLive();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    setLoading(true);
    setError('');
    setResult(null);
    setSelectedBook(null); // Limpa seleção atual ao pesquisar
    try {
      const response = await fetch(`https://bible-api.com/${encodeURIComponent(searchQuery)}?translation=almeida`);
      if (!response.ok) throw new Error('Referência não encontrada. Use o formato "João 3:16"');
      setResult(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setResult(null);
    setError('');
    setSearchQuery('');
  };

  const handleSelectChapter = async (chapterNumber) => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const query = `${selectedBook.id} ${chapterNumber}`;
      const response = await fetch(`https://bible-api.com/${encodeURIComponent(query)}?translation=almeida`);
      if (!response.ok) {
        throw new Error('Não foi possível carregar o capítulo.');
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToBooks = () => {
    setSelectedBook(null);
    setResult(null);
    setSearchQuery('');
  };

  const handleBackToChapters = () => {
    if (selectedBook) {
      setResult(null);
    } else {
      // Se foi via pesquisa, volta pro começo
      setResult(null);
      setSearchQuery('');
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--color-primary)' }}>Bíblia Sagrada</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Navegue pelos livros ou pesquise versículos.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Pesquisa rápida (Ex: João 3:16, Salmos 23)" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.375rem', border: '1px solid var(--color-border)', outline: 'none' }}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading || !searchQuery}>
            {loading && searchQuery ? 'Buscando...' : 'Pesquisar'}
          </button>
        </form>
      </div>

      {error && (
        <div style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {!selectedBook ? (
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>Selecione o Livro</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
            {BIBLE_BOOKS.map(book => (
              <button 
                key={book.id}
                onClick={() => handleSelectBook(book)}
                style={{
                  padding: '1rem 0.5rem',
                  backgroundColor: 'var(--color-background)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                  textAlign: 'center',
                  fontWeight: 500,
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
              >
                {book.name}
              </button>
            ))}
          </div>
        </div>
      ) : !result ? (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <button onClick={handleBackToBooks} style={{ display: 'flex', alignItems: 'center', color: 'var(--color-text-secondary)' }}>
              <ChevronLeft size={24} /> Voltar para livros
            </button>
            <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>{selectedBook.name}</h3>
          </div>
          
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>Selecione o Capítulo:</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '0.5rem' }}>
            {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(chapter => (
              <button
                key={chapter}
                onClick={() => handleSelectChapter(chapter)}
                disabled={loading}
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--color-background)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.375rem',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: 'var(--color-text-primary)'
                }}
                onMouseOver={e => { if(!loading) e.currentTarget.style.backgroundColor = 'var(--color-primary)'; e.currentTarget.style.color = 'white'; }}
                onMouseOut={e => { if(!loading) e.currentTarget.style.backgroundColor = 'var(--color-background)'; e.currentTarget.style.color = 'var(--color-text-primary)'; }}
              >
                {chapter}
              </button>
            ))}
          </div>
          {loading && <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Carregando capítulo...</p>}
        </div>
      ) : (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <button onClick={handleBackToChapters} style={{ display: 'flex', alignItems: 'center', color: 'var(--color-text-secondary)' }}>
              <ChevronLeft size={24} /> Voltar aos capítulos
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
              <Book size={24} />
              <h2 style={{ margin: 0 }}>{result.reference}</h2>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 1rem' }}>
            {result.verses.map(verse => (
              <div key={verse.verse} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '0.5rem', borderRadius: '0.375rem', transition: 'background-color 0.2s' }} className="verse-row">
                <p style={{ fontSize: '1.125rem', lineHeight: '1.7', color: 'var(--color-text-primary)', margin: 0, flex: 1 }}>
                  <strong style={{ color: 'var(--color-primary)', marginRight: '0.75rem', fontSize: '0.875rem' }}>{verse.verse}</strong>
                  {verse.text}
                </p>
                <button 
                  title="Transmitir versículo no Culto Ao Vivo"
                  onClick={() => {
                    if(publishToLive) {
                      publishToLive('leitura', `${result.reference.split(':')[0]} ${verse.verse}`, verse.text);
                      alert('Versículo enviado para o Culto Ao Vivo!');
                    }
                  }} 
                  style={{ color: '#EF4444', padding: '0.5rem', borderRadius: '0.375rem', backgroundColor: '#FEF2F2' }}>
                  Projetar
                </button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'var(--color-text-secondary)', textAlign: 'right' }}>
            Tradução: {result.translation_name}
          </div>
        </div>
      )}
    </div>
  );
}
