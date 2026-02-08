#!/bin/bash

# ========================================
# MetôCast Web - Script de Deploy/Build
# ========================================

set -e  # Parar em caso de erro

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🎙️  MetôCast Web - Script de Deploy${NC}"
echo ""

# Verificar se .env existe
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env não encontrado!${NC}"
    echo "Copiando .env.example para .env..."
    cp .env.example .env
    echo -e "${GREEN}✅ Arquivo .env criado!${NC}"
    echo -e "${YELLOW}⚠️  IMPORTANTE: Configure o arquivo .env antes de continuar!${NC}"
    echo ""
    read -p "Pressione ENTER para editar o .env agora ou CTRL+C para sair..."
    ${EDITOR:-nano} .env
fi

echo ""
echo -e "${GREEN}📦 Instalando dependências...${NC}"
npm install

echo ""
echo -e "${GREEN}🏗️  Gerando build de produção...${NC}"
npm run build

echo ""
echo -e "${GREEN}✅ Build concluído com sucesso!${NC}"
echo ""
echo "Arquivos gerados em: ${PWD}/dist"
echo ""
echo -e "${YELLOW}📋 Próximos passos:${NC}"
echo "1. Configure o Nginx para servir a pasta 'dist'"
echo "2. Reinicie o Nginx: sudo systemctl restart nginx"
echo "3. Certifique-se de que o backend está rodando"
echo "4. Acesse o site no navegador"
echo ""
echo "📖 Veja SETUP_ON_PREMISE.md para instruções completas"
