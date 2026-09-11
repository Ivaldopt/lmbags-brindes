# Galerias de cores do Cloudinary

O site já exibe imagens adicionais cadastradas em produto_imagens. O script scripts/sync-gallery.js cria essas associações a partir das fotos existentes, sem reenviar ou excluir arquivos do Cloudinary.

Pré-requisitos: DATABASE_URL e as três variáveis CLOUDINARY configuradas no ambiente do backend. Em produção, manter também a configuração TLS do banco. O prefixo padrão é lmbags/; CLOUDINARY_GALLERY_PREFIX permite selecionar outro prefixo real.

Na pasta backend, gerar primeiro o relatório:

    node scripts/sync-gallery.js

O arquivo galerias-relatorio.json lista os grupos candidatos, ambiguidades e produtos sem padrão reconhecido. Não publicar esse relatório na pasta public. Conferir amostras visualmente e especialmente modelos parecidos antes de aplicar:

    node scripts/sync-gallery.js --apply

O comando de aplicação consulta novamente os dados e grava apenas grupos com um único produto e imagem principal presente. Só remove sufixos conhecidos de cor e o par ID/timestamp; capacidades e modelos permanecem no nome. Nomes iguais não comprovam, sozinhos, que duas fotos pertencem ao mesmo produto. Grupos ambíguos não são associados. O script não altera a imagem principal nem remove imagens adicionais e pode ser repetido sem adicionar novamente a mesma URL. Falhas na gravação desfazem a transação inteira.

A listagem é paginada (500 imagens por chamada) e ocorre apenas na execução do script, nunca durante a visita de um cliente ao site. A API Admin do Cloudinary possui limites: https://cloudinary.com/documentation/admin_api

As associações reais ainda não foram executadas: credenciais do Cloudinary pendentes de configuração pelo proprietário. Testes usam nomes fictícios; não significam revisão das 18 mil imagens.
