# Revisão do projeto LM Bags & Brindes

Revisão iniciada em 08/09/2026. Projeto: `D:\Programaçao\lmbags-brindes`.

## Resultado e alcance

Foram revisados frontend, rotas da API, autenticação, uploads, scripts de importação, configuração de publicação e dependências. A página pública foi inspecionada no navegador. As alterações são locais; não houve publicação nem testes de invasão em produção. A revisão não garante ausência de todas as vulnerabilidades.

## Achados de segurança

| Prioridade | Achado | Correção / situação |
| --- | --- | --- |
| Crítica | Credencial de PostgreSQL literal em `backend/src/importar-railway.js` e segredo do Cloudinary em arquivos de upload/administração. | Valores removidos do código e substituídos por variáveis de ambiente. **Revogar e trocar as credenciais no Railway/PostgreSQL e Cloudinary.** A remoção local não invalida valores antigos nem apaga o histórico Git. Não foram usados para acessar os serviços. |
| Alta | JWT tinha segredo padrão previsível. Se a variável estivesse ausente em produção, permitiria falsificar tokens. | API passa a exigir `JWT_SECRET` com pelo menos 32 bytes; verificação limita algoritmo, emissor e destinatário. Validade reduzida para duas horas. Trocar a chave invalida sessões anteriores. Não foi verificado qual valor está configurado em produção. |
| Alta | Login sem limite de tentativas; uploads inteiros em memória sem limite. | Limites por IP, arquivo de até 5 MB, um arquivo por requisição, lista de MIME permitidos e checagem da assinatura JPEG/PNG/WebP. Assinatura não substitui decodificação completa/antivírus. |
| Média | Paginação sem teto, erros internos enviados aos visitantes e entradas públicas sem validação. | Máximo de 100 itens por página, limites de filtros, validação de login/leads/visitas e respostas de erro genéricas. Consultas SQL examinadas usam parâmetros; não foi identificado SQL injection direto nessas consultas. |
| Média | CORS aberto e ausência de cabeçalhos de proteção na aplicação. | Origens configuráveis, Helmet na API e cabeçalhos no Vercel. CORS não substitui autenticação. |
| Média | Verificação de certificado do banco desativada. | Verificação habilitada. A cadeia de certificados da hospedagem precisa ser validada antes da publicação. `DATABASE_CA` pode fornecer a autoridade certificadora. |
| Média | Sessão administrativa persistia no localStorage. | Novas sessões passam a usar sessionStorage. Isso reduz persistência, mas **não protege contra XSS**. Recomenda-se migrar para sessão com cookie HttpOnly, política SameSite e proteção CSRF, após definir o domínio da API. |
| Dependências | Auditoria apontou pacotes vulneráveis no frontend e backend. | Lockfiles atualizados; auditorias após atualização retornaram zero vulnerabilidades conhecidas naquele momento. Isso não prova que todas as condições de exploração se aplicavam ao site. |

## Pendências antes de publicar

1. Revogar os segredos expostos e configurar `DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` e `CLOUDINARY_API_SECRET` no ambiente de destino. Não colocar segredos em variáveis `VITE_*`.
2. Usar Node.js 22 ou 24. O backend anteriormente indicava Node 20. Instalar as dependências pelos lockfiles com `npm ci` em cada pasta.
3. Conferir `TRUST_PROXY_HOPS` de acordo com o proxy real. O padrão zero é conservador, mas pode agrupar visitantes atrás do proxy. Não confiar indiscriminadamente em `X-Forwarded-For`.
4. Testar login real, edição, upload, conexão TLS ao banco e download em ambiente de homologação. Os testes locais usam banco simulado e não alteram dados reais.
5. O limitador em memória não é compartilhado entre instâncias e reinicia junto com o processo. Para múltiplas instâncias, adotar armazenamento compartilhado e proteção de borda.
6. Revisar exposição passada dos segredos, acessos dos serviços, privilégios de banco, backups e restauração. Histórico Git não foi reescrito.
7. O widget externo Elfsight continua presente e executa JavaScript no site. Isolar sua execução do painel e definir uma CSP testada é uma próxima melhoria. O componente antigo `GoogleReviews.jsx`, sem uso, contém depoimentos fixos: não ativá-lo como se fossem avaliações verificadas.
8. Completar validação de todos os campos administrativos, revogação de sessões por usuário e regras de retenção de leads/visitas. IPs de visitas e emails são armazenados; finalidade, retenção e aviso de privacidade precisam ser definidos pelo negócio. Não foi feita certificação jurídica/LGPD.

## Hero, estrutura e funcionamento

- Carrossel com ecobags, garrafas, mochilas e canetas; controles de avanço/retorno, seleção direta e pausa. Pausa ao receber foco e respeita preferência de movimento reduzido.
- Fotos reais extraídas de `1parte.pdf`, páginas físicas 109 (sacola de lona), 5 (garrafas), 73 (mochilas/bolsas) e 129 (canetas). Os dois PDFs foram indexados para localizar produtos; não foi feita revisão visual de todas as 611 páginas.
- Imagens WebP somam aproximadamente 85 KB; primeira imagem tem prioridade de carregamento. Nenhum produto foi cadastrado automaticamente no banco.
- Hero independente do carregamento da API, prazo de espera de 12 segundos e rejeição de resposta HTML inesperada nas chamadas da API.
- Busca codifica os termos; catálogo e cabeçalho adaptados a telas pequenas; campos recebem nomes acessíveis e navegação tem link para pular ao conteúdo.
- Edição administrativa busca o produto pelo ID em vez de carregar 2.000 produtos. Endpoint autenticado específico adicionado.
- Download passa a oferecer link explícito depois da resposta da API, evitando mensagem falsa de download iniciado quando um popup é bloqueado. O destino do catálogo já configurado foi preservado.

## SEO

- Corrigidos texto do hero e divergências de quantidade de produtos; retirada alegação de 5.000 sem comprovação.
- Canonical por rota, títulos/descrições básicos, título e descrição de produto após carregamento, noindex administrativo e de pesquisas internas.
- `robots.txt` e sitemap das três páginas principais; referências a ícones/manifest inexistentes retiradas; imagem de compartilhamento aponta a arquivo existente.
- **Pendente:** SSR/pré-renderização para metadados presentes no HTML inicial de cada produto, sitemap dinâmico de produtos, respostas HTTP 404 reais e verificação no Search Console. A hospedagem ainda usa fallback SPA; metadados em JavaScript não resolvem todas as limitações de indexação ou compartilhamento.
- As categorias e contagens do banco não foram normalizadas. O site observado tinha variações como `caneta` e `Canetas`. Contato, telefone e afirmação de atendimento exclusivo a revendedores precisam de confirmação comercial antes de alterar a mensagem.

## Validação

- Build de produção gerado com sucesso.
- ESLint do frontend sem erros na revisão final anterior à integração.
- Seis testes de segurança passaram: autenticação, paginação, JSON/leads inválidos, cabeçalhos/CORS, assinatura de upload e limitação de login.
- Auditorias de dependências atualizadas: zero vulnerabilidades conhecidas reportadas.
- Inspeção visual da prévia e teste com API indisponível. Credenciais e operações reais de administração não foram utilizadas.

## Referências

- [Express: segurança em produção](https://expressjs.com/en/advanced/best-practice-security.html)
- [Google: SEO para aplicações JavaScript](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google: URLs canônicas](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

## Atualização de 10/09/2026 — campanha, rodapé e privacidade

Esta seção atualiza os pontos anteriores sobre o hero, o widget e as páginas institucionais.

- Hero com cinco banners: Outubro Rosa, ecobags, garrafas, mochilas e canetas. Rotação a cada seis segundos, indicadores sem nomes visíveis, pausa acessível e respeito a movimento reduzido.
- Página /outubro-rosa e quatro coleções com fotos clicáveis direcionadas às buscas do catálogo. Fotos reais dos PDFs; sacola e garrafa rosa extraídas com transparência preservada.
- Cabeçalho reorganizado e destaques distribuídos por quatro buscas, com deduplicação por código. Falhas parciais da API não apagam os demais resultados.
- Rodapé com termos, privacidade, cookies, trocas/devoluções, entrega/pagamento e atendimento/reclamações. Conteúdo inicial preparado considerando Brasil; não constitui certificação jurídica.
- Dados pendentes em frontend/src/lib/business.js: razão social, CNPJ/NIF, endereço completo e confirmação de email/jurisdição. Livro de Reclamações só aparece quando houver URL real configurada. Páginas legais ficam noindex enquanto os dados essenciais estiverem incompletos.
- Preferências permitem aceitar, rejeitar e escolher opcionais; podem ser reabertas no rodapé. Estatísticas e avaliações externas começam desligadas. Escolhas persistem por até 180 dias, com sincronização entre abas.
- O script Elfsight global foi removido. Avaliações agora carregam apenas após consentimento, dentro de iframe isolado sem allow-same-origin; retirar consentimento desmonta o iframe. Compatibilidade do widget nesse isolamento ainda precisa ser conferida em navegador. A recomendação anterior de isolamento foi implementada; CSP continua pendente de validação.
- Placeholder de imagem agora é local. Nenhuma das imagens do banco foi migrada, excluída ou recadastrada. Arquivo .env preservado.

Validação desta atualização: build de produção passou; quatro testes automatizados passaram, cobrindo rotas, títulos, links, banners e persistência/revogação/expiração do consentimento. Os testes não substituem avaliação visual ou integração real. Não havia navegador disponível nesta sessão para inspecionar a última versão. Nenhum deploy foi executado. Permanecem as pendências de credenciais, homologação e infraestrutura descritas acima.

Referências para revisão do conteúdo jurídico:
- Comércio eletrônico no Brasil: https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/decreto/d7962.htm
- Código de Defesa do Consumidor: https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm
- Guia de cookies da ANPD: https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_orientativo_cookies_e_protecao_de_dados_pessoais
- Livro de Reclamações em Portugal: https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/2005-34431675

### Refinamento visual inspirado na XBZ — 10/09/2026

Referência consultada: https://www.xbzbrindes.com.br/ (organização de categorias e vitrine). O navegador desta sessão não estava disponível; a referência visual de campanha fornecida pelo usuário complementou a leitura da página.

Novo cenário fotográfico original gerado para Outubro Rosa, integrado como WebP de aproximadamente 75 KB. Produtos continuam sendo fotos reais do catálogo. Os demais banners agora preservam o enquadramento inteiro das cenas e usam fundos coordenados; sacola exibida em recorte transparente. Layout panorâmico no desktop e composição vertical no celular. Texto e botões permanecem HTML acessível.

Campanha removida apenas do menu principal. Adicionada faixa de atalhos para produtos e download do catálogo; imagens da vitrine ampliadas e chamada de detalhes mais clara. Build de produção e cinco testes de rotas/consentimento passaram. Inspeção visual no navegador e publicação continuam pendentes.
