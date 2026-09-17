import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Vote, Users, Activity } from 'lucide-react';
import './App.css';

// Mock de dados para simular a API
const generateMockData = () => [
  { name: 'Joãozinho', votos: Math.floor(Math.random() * 5000) + 10000, color: '#ff4757' },
  { name: 'Mariazinha', votos: Math.floor(Math.random() * 5000) + 8000, color: '#2ed573' }
];

function App() {
  const [resultados, setResultados] = useState(generateMockData());
  const [votado, setVotado] = useState(false);
  const [view, setView] = useState('votar'); // 'votar' ou 'dashboard'

  // Simula o Polling (Dashboard atualizando sozinho)
  useEffect(() => {
    if (view === 'dashboard') {
      const interval = setInterval(() => {
        setResultados(prev => prev.map(p => ({ ...p, votos: p.votos + Math.floor(Math.random() * 100) })));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [view]);

  const handleVoto = (candidato) => {
    // Aqui iria o fetch('API_URL/vote', { method: 'POST' })
    console.log(`Votou em: ${candidato.name}`);
    setVotado(true);
    setTimeout(() => setVotado(false), 3000);
  };

  const totalVotos = resultados.reduce((acc, curr) => acc + curr.votos, 0);

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">
          <Activity size={24} color="#ff4757" />
          <span>Paredão Scale Vote</span>
        </div>
        <div className="nav-links">
          <button className={view === 'votar' ? 'active' : ''} onClick={() => setView('votar')}>
            <Vote size={18} /> Votar
          </button>
          <button className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}>
            <Users size={18} /> Dashboard (Ao Vivo)
          </button>
        </div>
      </nav>

      <main className="main-content">
        {view === 'votar' ? (
          <div className="vote-section">
            <header className="header-title">
              <h1>Quem deve sair?</h1>
              <p>O sistema foi feito para aguentar 1 milhão de votos por minuto.</p>
            </header>

            <div className="cards-container">
              {resultados.map((cand) => (
                <div className="participant-card" key={cand.name} onClick={() => handleVoto(cand)}>
                  <div className="avatar" style={{ backgroundColor: cand.color }}>
                    {cand.name.charAt(0)}
                  </div>
                  <h2>{cand.name}</h2>
                  <button className="btn-votar" style={{ backgroundColor: cand.color }}>
                    VOTAR AGORA
                  </button>
                </div>
              ))}
            </div>

            {votado && (
              <div className="success-toast">
                ✅ Voto computado com sucesso na AWS!
              </div>
            )}
          </div>
        ) : ( 
          <div className="dashboard-section">
             <header className="header-title">
              <h1>Resultados Oficiais</h1>
              <p>Atualizando em tempo real com DynamoDB</p>
              <div className="total-badge">
                Total de Votos: {totalVotos.toLocaleString('pt-BR')}
              </div>
            </header>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={resultados} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={16} fontWeight="bold" />
                  <Tooltip cursor={{fill: 'transparent'}} formatter={(value) => value.toLocaleString('pt-BR') + ' votos'} />
                  <Bar dataKey="votos" radius={[0, 8, 8, 0]} barSize={40}>
                    {resultados.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
