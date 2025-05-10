document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('gallery-container');
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img-src');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalDate = document.getElementById('modal-date');
    const closeButton = document.querySelector('.close-button');

    // Verifica se todos os elementos do DOM foram encontrados
    if (!galleryContainer || !modal || !modalImg || !modalTitle || !modalDescription || !modalDate || !closeButton) {
        console.error('Um ou mais elementos do DOM não foram encontrados. Verifique os IDs no HTML.');
        return; // Interrompe a execução se algo estiver faltando
    }

    // Carrega as imagens do JSON
    fetch('images.json')
        .then(response => {
            if (!response.ok) {
                // Tenta fornecer mais detalhes sobre o erro HTTP
                return response.text().then(text => {
                    throw new Error(`Erro ao carregar images.json: ${response.status} ${response.statusText}. Detalhes: ${text}`);
                });
            }
            return response.json();
        })
        .then(imagesData => { // Mudei o nome da variável para evitar conflito com a pasta 'images'
            if (!Array.isArray(imagesData) || imagesData.length === 0) {
                galleryContainer.innerHTML = '<p style="color:white; text-align:center;">Nenhuma imagem encontrada no arquivo JSON ou o arquivo está vazio.</p>';
                console.warn('O arquivo images.json está vazio ou não é um array.');
                return;
            }

            imagesData.forEach(imageData => { // Mudei o nome da variável
                const galleryItem = document.createElement('div');
                galleryItem.classList.add('gallery-item');

                const imgElement = document.createElement('img');
                imgElement.src = imageData.src;
                imgElement.alt = imageData.title || "Imagem da galeria"; // Adiciona um alt padrão
                
                // Opcional: Adicionar um tratamento de erro para imagens não carregadas
                imgElement.onerror = () => {
                    console.warn(`Erro ao carregar imagem: ${imageData.src}. Verifique o caminho.`);
                    // Você pode definir um src de placeholder aqui se quiser
                    // imgElement.src = 'path/to/placeholder.jpg'; 
                    galleryItem.style.display = 'none'; // Esconde o item se a imagem não carregar
                };

                const itemInfo = document.createElement('div');
                itemInfo.classList.add('item-info');

                const titleElement = document.createElement('h3');
                titleElement.textContent = imageData.title || "Sem Título";

                const descriptionElement = document.createElement('p');
                descriptionElement.textContent = imageData.description || "Sem descrição.";

                itemInfo.appendChild(titleElement);
                itemInfo.appendChild(descriptionElement);

                galleryItem.appendChild(imgElement);
                galleryItem.appendChild(itemInfo);

                // Evento de clique para abrir o modal
                galleryItem.addEventListener('click', () => {
                    modalImg.src = imageData.src;
                    modalImg.alt = imageData.title || "Imagem ampliada";
                    modalTitle.textContent = imageData.title || "Sem Título";
                    modalDescription.textContent = imageData.description || "Sem descrição.";
                    // Formata a data de forma mais segura
                    try {
                        modalDate.textContent = `Criado em: ${new Date(imageData.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}`;
                    } catch (e) {
                        modalDate.textContent = `Data: ${imageData.date || 'N/A'}`;
                        console.warn("Erro ao formatar data:", imageData.date, e);
                    }
                    modal.style.display = 'flex'; // Mudei para flex para usar o modal-content-wrapper
                });

                galleryContainer.appendChild(galleryItem);
            });
        })
        .catch(error => {
            console.error('Falha ao carregar ou processar images.json:', error);
            galleryContainer.innerHTML = `<p style="color:red; text-align:center;">Erro crítico ao carregar galeria: ${error.message}. Verifique o console para mais detalhes.</p>`;
        });

    // Fecha o modal ao clicar no botão de fechar
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Fecha o modal ao clicar fora da área de conteúdo do modal (no fundo escuro)
    modal.addEventListener('click', (event) => {
        // Verifica se o clique foi diretamente no elemento modal (fundo) e não em seus filhos
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Fecha o modal com a tecla Esc
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'flex') { // Checa se o modal está visível
            modal.style.display = 'none';
        }
    });
});
