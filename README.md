# Aplicação ImagensApp
Esta é uma aplicação simples que utiliza a API do Giphy para buscar e favoritar imagens.

# Como Executar
Para executar a aplicação, siga os passos abaixo:

1. Certifique-se de ter o Docker instalado. Você pode obtê-lo em [docker.com](https://www.docker.com/products/docker-desktop/).

2. Abra um terminal e execute os seguintes comandos:
```javascript
docker pull jvrios/imagensapp-node:Vfinal
docker run -p 8080:80 -p 3000:3000 jvrios/imagensapp-node:Vfinal
```
3. Após executar os comandos acima, abra seu navegador e acesse o seguinte endereço:
```javascript
http://localhost:8080
```
# Como Usar
Após abrir a aplicação no navegador, você poderá buscar imagens utilizando a barra de pesquisa. Clique no botão de coração para favoritar uma imagem.

Divirta-se explorando imagens com o ImagensApp!

# Contribuições
Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request com melhorias.

# Licença
Este projeto está licenciado sob a Licença MIT.
