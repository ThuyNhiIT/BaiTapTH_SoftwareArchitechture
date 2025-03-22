# Sử dụng Node.js 18 trên Alpine Linux làm base image
FROM node:18-alpine AS builder

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json trước để tối ưu cache
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng React
RUN npm run build

# Sử dụng Nginx để chạy ứng dụng React
FROM nginx:alpine

# Copy file build vào thư mục phục vụ của Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Mở cổng 80
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
