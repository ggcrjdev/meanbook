# MEAN Book
Exemplo de aplicação baseado no conceito de rede social usando a stack MEAN (MongoDB, Express, AngularJS e NodeJS).
A aplicação contempla uso de recursos do node.js tais como:
- Implementação de API Restful;
- Uso dos contextos de aplicação/sessão/requisição;
- Integração do frontend em AngularJS a API Restful por meio de um service.

## Instalação
### Prerequisitos da aplicação
- Instalação do server nodejs;
- Instalação do MongoDB na pasta [C:\dev-js\server\mongodb-3.0]; e
- Recomendado rodar no Sistema Operacional Windows 7.
### Instalação da app
Acessar a pasta raiz da aplicação no repositório e executar o seguinte comando:
- npm install nodemon -g && npm install

## Execução da app
- Executar o arquivo bin/mongodb-start.bat (inicializa o servidor MongoDB);
- Executar o arquivo bin/node-start.bat (inicializa o servidor NodeJS e deixa disponível a app para acesso); e
- Acessar a app no navegador pela URL http://localhost:3000
