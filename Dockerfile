FROM node:20

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia os arquivos restantes (exceto os ignorados por .dockerignore)
COPY . .

# Expõe a porta que o Render vai acessar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "src/index.js"]
