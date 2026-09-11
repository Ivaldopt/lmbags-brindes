export function validateUpload(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return 'Escolha uma imagem JPEG, PNG ou WebP.'
  if (file.size > 5 * 1024 * 1024) return 'A imagem ultrapassa 5 MB. Reduza o tamanho antes de enviar.'
  return ''
}
export function uploadError(error) {
  if (error.response?.status === 401) return 'Sua sessão expirou. Entre novamente no painel antes de enviar a imagem.'
  if (error.response?.status === 413) return 'A imagem ultrapassa o limite de 5 MB.'
  if (error.code === 'ECONNABORTED') return 'O envio demorou mais que o esperado. Confira sua conexão e tente novamente.'
  const message = error.response?.data?.erro
  return typeof message === 'string' ? message : 'Não foi possível enviar a imagem. Verifique sua conexão e tente novamente.'
}
