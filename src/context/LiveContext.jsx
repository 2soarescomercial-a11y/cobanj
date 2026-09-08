import { createContext, useContext, useState } from 'react';

const LiveContext = createContext({});

export function LiveProvider({ children }) {
  const [liveData, setLiveData] = useState({
    type: 'aviso',
    title: 'Aguardando Início',
    content: 'O culto já vai começar. Prepare seu coração.',
    updatedAt: new Date().toISOString()
  });

  const publishToLive = (type, title, content) => {
    setLiveData({
      type,
      title,
      content,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <LiveContext.Provider value={{ liveData, publishToLive }}>
      {children}
    </LiveContext.Provider>
  );
}

export const useLive = () => useContext(LiveContext);
