const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

// Função para mover arquivos da subpasta para a pasta correta
function fixAnalyticsLocation() {
  const wrongPath = path.join(pagesDir, 'Analytics', 'Analytics.jsx');
  const correctPath = path.join(pagesDir, 'Analytics.jsx');
  
  if (fs.existsSync(wrongPath)) {
    console.log('📦 Movendo Analytics.jsx para o local correto...');
    fs.renameSync(wrongPath, correctPath);
    
    // Remove a pasta vazia
    const wrongDir = path.join(pagesDir, 'Analytics');
    if (fs.existsSync(wrongDir)) {
      fs.rmdirSync(wrongDir);
      console.log('🗑️  Pasta Analytics removida');
    }
    console.log('✅ Analytics.jsx movido com sucesso!');
  } else {
    console.log('✅ Analytics.jsx já está no local correto');
  }
}

// Criar arquivos se não existirem
function ensurePagesExist() {
  const pages = ['Analytics', 'Communications', 'Team', 'Schedule', 'Settings'];
  
  pages.forEach(page => {
    const filePath = path.join(pagesDir, `${page}.jsx`);
    if (!fs.existsSync(filePath)) {
      console.log(`📝 Criando ${page}.jsx...`);
      
      const content = `import React from 'react';
import { Container } from 'react-bootstrap';

const ${page} = () => {
  return (
    <Container fluid className="py-4">
      <h2>${page}</h2>
      <p className="text-muted">This page is under construction.</p>
    </Container>
  );
};

export default ${page};
`;
      fs.writeFileSync(filePath, content);
      console.log(`✅ ${page}.jsx criado!`);
    }
  });
}

// Executar
console.log('🔧 Corrigindo estrutura de arquivos...\n');
fixAnalyticsLocation();
ensurePagesExist();
console.log('\n✨ Estrutura corrigida! Reinicie o servidor.');