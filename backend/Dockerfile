FROM node:18-alpine

# Container ke andar ek safe folder banayega
WORKDIR /app 

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000

# 🚨 THE FIX: Ignore npm start, run the file directly!
CMD ["node", "index.js"]