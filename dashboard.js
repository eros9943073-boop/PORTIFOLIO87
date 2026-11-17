// 1. Ativa os ícones da biblioteca Lucide na tela
lucide.createIcons();

// 2. Configuração da conexão com o Supabase
// Substitua pelos mesmos dados que você já usou no seu login.html
const SUPABASE_URL = 'https://yatsmsvttvldmupcatjd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_wfdIRdpeCGp0bRpjSFr8mw_f1EwGQZz';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 3. Pegando os elementos do HTML que vamos manipular
const formProjeto = document.getElementById('form-projeto');
const btnSalvar = document.getElementById('btn-salvar');
const mensagemStatus = document.getElementById('mensagem-status');

// 4. Escutando o envio do formulário
formProjeto.addEventListener('submit', async (evento) => {
  // Impede que a página recarregue sozinha ao clicar no botão
  evento.preventDefault();

  // Trava o botão enquanto envia para evitar cliques duplicados
  btnSalvar.disabled = true;
  btnSalvar.innerHTML = '<span>Salvando...</span>';
  mensagemStatus.className = 'status-oculto';

  // Captura o que foi digitado nos campos
  const titulo = document.getElementById('titulo').value.trim();
  const descricao = document.getElementById('descricao').value.trim();
  const link = document.getElementById('link').value.trim();

  // Envia os dados para a tabela 'projetos' no Supabase
  // Se 'link' estiver vazio, enviamos 'null' para ficar limpo no banco
  const { error } = await supabaseClient
    .from('projetos')
    .insert([
      {
        titulo: titulo,
        descricao: descricao,
        link: link || null
      }
    ]);

  // Verifica se o banco retornou algum erro
  if (error) {
    console.error('Erro ao salvar projeto:', error);
    mensagemStatus.textContent = 'Erro ao salvar o projeto. Verifique a conexão.';
    mensagemStatus.className = 'status-erro';
  } else {
    mensagemStatus.textContent = 'Projeto adicionado ao portfólio com sucesso!';
    mensagemStatus.className = 'status-sucesso';
    
    // Limpa os campos do formulário para você poder cadastrar outro
    formProjeto.reset();
  }

  // Restaura o botão ao estado normal
  btnSalvar.disabled = false;
  btnSalvar.innerHTML = '<i data-lucide="save"></i><span>Salvar no Portfólio</span>';
  lucide.createIcons(); // Recarrega o ícone dentro do botão
});