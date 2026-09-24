# Usar imagem oficial e leve do Nginx baseada em Alpine Linux
FROM nginx:alpine

# Copiar os arquivos estáticos do projeto para o diretório padrão do Nginx
COPY . /usr/share/nginx/html

# Expor a porta 80 para acesso web
EXPOSE 80

# Iniciar o servidor Nginx em primeiro plano
CMD ["nginx", "-g", "daemon off;"]