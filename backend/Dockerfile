# Sử dụng Node.js
FROM node:16

# Đặt thư mục làm việc trong container
WORKDIR /usr/src/app

# Copy package.json và package-lock.json để cài đặt dependencies
COPY package*.json ./

# Cài đặt dependencies
RUN npm install
RUN npm i bcrypt
# Copy mã nguồn vào container
COPY . .

# Expose port 3000
EXPOSE 3000

# Chạy ứng dụng Node.js
CMD ["node", "server.js"]
