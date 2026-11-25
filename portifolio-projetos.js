
// ==========================================
// CONEXÃO COM O SUPABASE
// ==========================================

const SUPABASE_URL = 'https://yatsmsvttvldmupcatjd.supabase.co';

const SUPABASE_KEY = 'sb_publishable_wfdIRdpeCGp0bRpjSFr8mw_f1EwGQZz';

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ==========================================
// CARREGAR OS PROJETOS
// ==========================================

async function carregarProjetos() {

    const listaProjetos = document.getElementById('lista-projetos');

    if (!listaProjetos) return;

    listaProjetos.innerHTML = '<p class="projetos-status">Carregando projetos...</p>';

    try {

        // Buscar os projetos na tabela projetos
        const { data, error } = await supabaseClient
            .from('projetos')
            .select('id, titulo, descricao, link, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        // Verificar se existem projetos cadastrados
        if (!data || data.length === 0) {

            listaProjetos.innerHTML = `
                <p class="projetos-status">
                    Ainda não existem projetos publicados.
                    Em breve teremos novidades!
                </p>
            `;

            return;
        }

        // Limpar a área antes de mostrar os projetos
        listaProjetos.innerHTML = '';

        // Criar um card para cada projeto
        data.forEach((projeto) => {

            const card = document.createElement('article');

            card.className = 'projeto-card';

            const tag = document.createElement('span');
            tag.className = 'projeto-tag';
            tag.textContent = 'PROJETO';

            const titulo = document.createElement('h3');
            titulo.textContent = projeto.titulo;

            const descricao = document.createElement('p');
            descricao.textContent = projeto.descricao;

            card.appendChild(tag);
            card.appendChild(titulo);
            card.appendChild(descricao);

            // Criar botão somente quando existir um link válido
            if (projeto.link) {

                try {

                    const url = new URL(projeto.link);

                    if (url.protocol === 'https:' || url.protocol === 'http:') {

                        const link = document.createElement('a');

                        link.href = url.href;
                        link.target = '_blank';
                        link.rel = 'noopener noreferrer';
                        link.className = 'projeto-link';
                        link.textContent = 'Ver projeto →';

                        card.appendChild(link);

                    }

                } catch (erro) {
                    console.warn('Link inválido no projeto:', projeto.titulo);
                }

            } else {

                const semLink = document.createElement('span');

                semLink.className = 'projeto-sem-link';
                semLink.textContent = 'Link não informado';

                card.appendChild(semLink);

            }

            listaProjetos.appendChild(card);

        });

    } catch (erro) {

        console.error('Erro ao carregar projetos:', erro);

        listaProjetos.innerHTML = `
            <p class="projetos-status">
                Não foi possível carregar os projetos.
                Verifique sua conexão com o Supabase.
            </p>
        `;

    }

}


// ==========================================
// INICIAR QUANDO A PÁGINA CARREGAR
// ==========================================

document.addEventListener('DOMContentLoaded', carregarProjetos);
