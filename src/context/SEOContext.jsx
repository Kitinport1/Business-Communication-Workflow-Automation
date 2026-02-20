import React, { createContext, useState, useContext, useEffect } from 'react';

const SEOContext = createContext();

export const useSEO = () => {
  const context = useContext(SEOContext);
  if (!context) {
    throw new Error('useSEO must be used within SEOProvider');
  }
  return context;
};

export const SEOProvider = ({ children }) => {
  const [seoData, setSeoData] = useState({
    keywordRankings: [],
    backlinks: [],
    siteAudit: null,
    competitorData: [],
    dailyReports: []
  });
  
  const [trackingEmail, setTrackingEmail] = useState(
    localStorage.getItem('trackingEmail') || ''
  );
  
  const [competitors, setCompetitors] = useState(
    JSON.parse(localStorage.getItem('competitors') || '[]')
  );
  
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [competitorHistory, setCompetitorHistory] = useState(
    JSON.parse(localStorage.getItem('competitorHistory') || '{}')
  );

  // Carregar email de tracking
  useEffect(() => {
    const savedEmail = localStorage.getItem('trackingEmail');
    if (savedEmail) {
      setTrackingEmail(savedEmail);
    }
  }, []);

  // Função para atualizar email de tracking
  const updateTrackingEmail = (email) => {
    setTrackingEmail(email);
    localStorage.setItem('trackingEmail', email);
    
    if (email) {
      sendWelcomeReport(email);
    }
  };

  // Adicionar concorrente para monitoramento
  const addCompetitor = (url, name) => {
    const newCompetitor = {
      id: Date.now(),
      url,
      name: name || extractDomainName(url),
      addedAt: new Date().toISOString(),
      lastChecked: null,
      data: null,
      history: []
    };

    const updatedCompetitors = [...competitors, newCompetitor];
    setCompetitors(updatedCompetitors);
    localStorage.setItem('competitors', JSON.stringify(updatedCompetitors));

    // Buscar dados iniciais do concorrente
    fetchCompetitorData(newCompetitor.id, url);

    // Enviar alerta por email se configurado
    if (trackingEmail) {
      sendCompetitorAlert(trackingEmail, newCompetitor);
    }

    return newCompetitor;
  };

  // Remover concorrente
  const removeCompetitor = (id) => {
    const updatedCompetitors = competitors.filter(c => c.id !== id);
    setCompetitors(updatedCompetitors);
    localStorage.setItem('competitors', JSON.stringify(updatedCompetitors));
    
    // Remover do histórico
    const newHistory = { ...competitorHistory };
    delete newHistory[id];
    setCompetitorHistory(newHistory);
    localStorage.setItem('competitorHistory', JSON.stringify(newHistory));
  };

  // Buscar dados do concorrente
  const fetchCompetitorData = async (id, url) => {
    setLoading(true);
    
    // Simular chamada de API para análise do concorrente
    setTimeout(() => {
      const mockData = generateMockCompetitorData(url);
      
      setCompetitors(prev => prev.map(c => 
        c.id === id 
          ? { 
              ...c, 
              lastChecked: new Date().toISOString(),
              data: mockData,
              history: [...(c.history || []), { 
                date: new Date().toISOString(), 
                data: mockData 
              }].slice(-10)
            }
          : c
      ));

      // Salvar histórico
      const historyUpdate = {
        ...competitorHistory,
        [id]: [...(competitorHistory[id] || []), { 
          date: new Date().toISOString(), 
          data: mockData 
        }].slice(-10)
      };
      setCompetitorHistory(historyUpdate);
      localStorage.setItem('competitorHistory', JSON.stringify(historyUpdate));

      setLastUpdate(new Date().toISOString());
      setLoading(false);

      // Verificar mudanças significativas
      checkSignificantChanges(id, mockData);
    }, 2000);
  };

  // Verificar mudanças significativas nos concorrentes
  const checkSignificantChanges = (competitorId, newData) => {
    const history = competitorHistory[competitorId] || [];
    if (history.length > 1) {
      const previousData = history[history.length - 2].data;
      
      const changes = [];
      
      // Verificar mudança de posição
      if (previousData.rank && newData.rank && previousData.rank !== newData.rank) {
        changes.push({
          type: 'rank_change',
          from: previousData.rank,
          to: newData.rank,
          difference: newData.rank - previousData.rank
        });
      }

      // Verificar novas palavras-chave
      const newKeywords = newData.topKeywords.filter(
        kw => !previousData.topKeywords?.includes(kw)
      );
      if (newKeywords.length > 0) {
        changes.push({
          type: 'new_keywords',
          keywords: newKeywords
        });
      }

      // Verificar aumento de backlinks
      if (previousData.backlinks && newData.backlinks && 
          newData.backlinks > previousData.backlinks * 1.2) {
        changes.push({
          type: 'backlink_surge',
          from: previousData.backlinks,
          to: newData.backlinks,
          increase: ((newData.backlinks - previousData.backlinks) / previousData.backlinks * 100).toFixed(1)
        });
      }

      if (changes.length > 0 && trackingEmail) {
        sendChangeAlert(trackingEmail, competitorId, changes);
      }
    }
  };

  // Analisar URL fornecida
  const analyzeURL = (url) => {
    setLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const analysis = generateMockAnalysis(url);
        setLoading(false);
        resolve(analysis);
      }, 2000);
    });
  };

  // Comparar com concorrentes
  const compareWithCompetitors = (url) => {
    const results = competitors.map(c => ({
      competitor: c,
      comparison: generateMockComparison(url, c.url)
    }));
    return results;
  };

  // Gerar relatório completo
  const generateReport = (email, includeCompetitors = true) => {
    const report = {
      date: new Date().toISOString(),
      yourSite: generateMockAnalysis('seu-site.com'),
      competitors: includeCompetitors ? competitors.map(c => ({
        name: c.name,
        url: c.url,
        data: c.data || generateMockCompetitorData(c.url)
      })) : [],
      recommendations: generateRecommendations()
    };

    if (email) {
      sendEmailReport(email, report);
    }

    return report;
  };

  // Enviar alerta de concorrente por email
  const sendCompetitorAlert = (email, competitor) => {
    console.log(`📧 Alerta: Novo concorrente adicionado - ${competitor.name}`);
    console.log(`Email enviado para: ${email}`);
    // Aqui você integraria com serviço de email real
  };

  // Enviar alerta de mudança
  const sendChangeAlert = (email, competitorId, changes) => {
    const competitor = competitors.find(c => c.id === competitorId);
    console.log(`📧 Alerta de mudança para ${competitor?.name}:`, changes);
    console.log(`Email enviado para: ${email}`);
  };

  // Enviar relatório por email
  const sendEmailReport = (email, report) => {
    console.log(`📧 Relatório SEO enviado para: ${email}`);
    console.log('Relatório:', report);
  };

  // Enviar relatório de boas-vindas
  const sendWelcomeReport = (email) => {
    console.log(`📧 Email de boas-vindas enviado para: ${email}`);
  };

  // Extrair nome do domínio da URL
  const extractDomainName = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '').split('.')[0];
    } catch {
      return url;
    }
  };

  // Gerar dados mock para concorrente
  const generateMockCompetitorData = (url) => {
    const domain = extractDomainName(url);
    return {
      domain,
      url,
      rank: Math.floor(Math.random() * 20) + 1,
      authority: Math.floor(Math.random() * 50) + 30,
      backlinks: Math.floor(Math.random() * 5000) + 500,
      keywords: Math.floor(Math.random() * 1000) + 200,
      traffic: Math.floor(Math.random() * 50000) + 10000,
      topKeywords: [
        'workflow automation',
        'business process',
        'marketing automation',
        'sales pipeline',
        'customer onboarding'
      ].slice(0, Math.floor(Math.random() * 3) + 3),
      socialScore: Math.floor(Math.random() * 100),
      speedScore: Math.floor(Math.random() * 40) + 60,
      mobileScore: Math.floor(Math.random() * 30) + 70
    };
  };

  // Gerar análise mock para URL
  const generateMockAnalysis = (url) => {
    const domain = extractDomainName(url);
    return {
      url,
      domain,
      score: Math.floor(Math.random() * 30) + 70,
      issues: {
        critical: Math.floor(Math.random() * 5),
        warnings: Math.floor(Math.random() * 10),
        passed: Math.floor(Math.random() * 20) + 30
      },
      performance: {
        loadTime: (Math.random() * 3 + 1).toFixed(1),
        ttfb: (Math.random() * 500 + 200).toFixed(0),
        domSize: Math.floor(Math.random() * 1000) + 500
      },
      seo: {
        title: Math.random() > 0.2,
        description: Math.random() > 0.3,
        headings: Math.random() > 0.1,
        images: Math.random() > 0.4,
        links: Math.random() > 0.2
      },
      recommendations: [
        'Otimizar meta descriptions',
        'Adicionar texto alternativo às imagens',
        'Melhorar velocidade de carregamento',
        'Implementar schema markup',
        'Criar mais links internos'
      ].slice(0, Math.floor(Math.random() * 3) + 2)
    };
  };

  // Gerar comparação mock
  const generateMockComparison = (yourUrl, competitorUrl) => {
    return {
      yourScore: Math.floor(Math.random() * 30) + 70,
      competitorScore: Math.floor(Math.random() * 30) + 70,
      advantages: [
        'Melhor velocidade de carregamento',
        'Mais backlinks de autoridade',
        'Conteúdo mais relevante'
      ].slice(0, Math.floor(Math.random() * 2) + 1),
      disadvantages: [
        'Menos palavras-chave rankeadas',
        'Autoridade de domínio menor',
        'Pouca presença social'
      ].slice(0, Math.floor(Math.random() * 2) + 1),
      opportunities: [
        'Focar em palavras-chave de cauda longa',
        'Melhorar perfil de backlinks',
        'Otimizar para featured snippets'
      ]
    };
  };

  // Gerar recomendações
  const generateRecommendations = () => {
    return [
      {
        priority: 'high',
        action: 'Corrigir meta descriptions duplicadas',
        impact: '+15% CTR',
        effort: 'Baixo'
      },
      {
        priority: 'high',
        action: 'Adicionar schema markup de artigos',
        impact: '+20% visibilidade',
        effort: 'Médio'
      },
      {
        priority: 'medium',
        action: 'Otimizar imagens para carregamento',
        impact: '+10% velocidade',
        effort: 'Baixo'
      },
      {
        priority: 'medium',
        action: 'Criar conteúdo sobre ' + getRandomTopic(),
        impact: '+25 keywords',
        effort: 'Alto'
      }
    ];
  };

  const getRandomTopic = () => {
    const topics = ['SEO', 'marketing', 'vendas', 'tecnologia', 'startups', 'inovação'];
    return topics[Math.floor(Math.random() * topics.length)];
  };

  const value = {
    seoData,
    trackingEmail,
    competitors,
    competitorHistory,
    loading,
    lastUpdate,
    updateTrackingEmail,
    addCompetitor,
    removeCompetitor,
    fetchCompetitorData,
    analyzeURL,
    compareWithCompetitors,
    generateReport,
    fetchSEOData: () => setLoading(false) // Mock function
  };

  return (
    <SEOContext.Provider value={value}>
      {children}
    </SEOContext.Provider>
  );
};