
# 💬 Website Chat Application
📌 *[Xem bản tiếng anh](README.md)*
## 📌 Giới thiệu
Website chat này không chỉ cung cấp tính năng nhắn tin mà còn được thiết kế để nâng cao khả năng triển khai với **Docker Swarm**, **RabbitMQ** và **Nginx Load Balancing**, đảm bảo hiệu suất và khả năng mở rộng cao.

## 🎯 Mục Đích
- Cung cấp một nền tảng chat đơn giản nhưng hiệu quả.
- Đóng gói các ứng frontend và backend thành các image
- Tăng cường khả năng mở rộng hệ thống bằng **Docker Swarm**.
- Đảm bảo hiệu suất và tính ổn định thông qua **RabbitMQ** và **Nginx Load Balancer**.

## 🛠️ Công Nghệ Sử Dụng
### 💻 Frontend
- **ReactJS** + **Vite**: Hiệu suất cao, tối ưu hóa tốc độ tải trang.
- **Socket.IO Client**: Giao tiếp thời gian thực.
- **Styled-Components**: Quản lý CSS linh hoạt và dễ bảo trì.

### 🖥 Backend
- **Node.js**: Xây dựng API và xử lý logic server.
- **Mongoose**: ORM cho MongoDB, giúp quản lý dữ liệu dễ dàng.
- **AMQP (amqplib)**: Giao tiếp giữa các service thông qua RabbitMQ.

### 🗄️ Database & Infrastructure
- **MongoDB**: Lưu trữ dữ liệu tin nhắn và người dùng.
- **RabbitMQ**: Hệ thống hàng đợi tin nhắn giúp xử lý công việc không đồng bộ.
- **Nginx**: Cân bằng tải giúp phân phối yêu cầu giữa các node backend.
- **Docker Swarm**: Quản lý container và đảm bảo tính mở rộng.

## ✨ Tính Năng

### 🔹 Phía Người Dùng
✔ Đăng nhập / Đăng ký tài khoản.
<br>
✔ Nhắn tin theo thời gian thực với **Socket.IO**.
<br>
✔ Giao diện thân thiện, tốc độ tải nhanh.

## 🚀 Cách Chạy Ứng Dụng
### 1️⃣ Cài Đặt Các Công Cụ Cần Thiết
- **Node.js** (cho backend và frontend)
- **Docker & Docker Compose** (để triển khai hệ thống)

# Hướng Dẫn Triển khai và demo hệ thống chat real time với docker , docker swarm 
Lưu ý : Những lệnh có option là không bắt buộc phải làm (chỉ để mở rộng thêm nếu cần thiết).
Dung lượng image khá lớn nên cần mạng wifi /4g tương đối mạnh để pull chúng về 
## 1. Kiểm Tra Các Docker Đang Chạy
Để kiểm tra các dịch vụ đang chạy trong Docker Swarm, sử dụng lệnh sau:
```bash
docker service ls
```

## 2. Tạo Docker Swarm
Nếu bạn chưa tạo Docker Swarm, hãy sử dụng lệnh sau:
```bash
docker swarm init
```
Nếu đã tạo trước đó và muốn rời khỏi Docker Swarm, sử dụng lệnh:
```bash
docker swarm leave --force # Nếu là manager
```

## 3. Thêm Worker (Tùy Chọn) : Mặc định khi tạo đã có worker sẵn có 
Bạn có thể thêm worker vào Swarm nếu cần:
```bash
docker swarm join --token <TOKEN> <MANAGER-IP>:2377
```
Ví dụ:
```bash
docker swarm join --token SWMTKN-1-... 192.168.65.3:2377
```

## 4. Thêm Manager vào Swarm (Option : tùy chọn) : Mặc định khi khởi tạo là node manager
Để thêm manager vào Swarm, sử dụng lệnh:
```bash
docker swarm join-token manager
```

## 5. Tạo Docker Registry Cục Bộ
Tạo một registry cục bộ để thay thế Docker Hub trên port 5000:
```bash
docker run -d -p 5000:5000 --name local-registry registry:2
```
### Cấu Hình Docker Desktop
Với Docker Desktop, đi tới **Settings > Docker Engine** và thêm `localhost:5000` vào mục "insecure-registries":
```json
{
  "insecure-registries" : ["localhost:5000"]
}
```

## 6. Xóa Docker Stack Trước Đó nếu Có (Option: tùy chọn): khi khởi tạo nhiều lần cần xóa bản cũ để tránh gây lỗi
Xóa mạng nếu chúng đã tồn tại trước đó
Trước khi triển khai dịch vụ mới, hãy xóa stack cũ để tránh gây lỗi:
```bash
docker stack rm midtermnodejs
```

## 7. Xóa Mạng Nếu Tồn Tại (Option: tùy chọn): khi khởi tạo nhiều lần cần xóa bản cũ để tránh gây lỗi
Xóa mạng nếu chúng đã tồn tại trước đó:
```bash
docker network rm midtermnodejs_frontend-network midtermnodejs_backend-network
```

### 8. Cách Build Image
Có hai cách để xử lý image, nếu đã build trước đó hoặc chưa:

### 8.1. Chưa Build Image Trước Đó
Build các image:
```bash
# Build backend
docker build -t localhost:5000/backend-image ./backend

# Build frontend
docker build -t localhost:5000/frontend-image ./frontend

# Build nginx
docker build -t localhost:5000/nginx-image ./nginx
```
### 8.2. Nếu Đã Build Image Trước Đó (Option : Không bắt buộc phải làm) : Nếu bạn đã có các image trong máy , tránh gây lãng phí bộ nhớ 
Tag image với địa chỉ của registry cục bộ:
```bash
docker tag frontend-image localhost:5000/frontend-image:latest
docker tag backend-image localhost:5000/backend-image:latest
docker tag nginx-image localhost:5000/nginx-image:latest
```

### 9. Pull MongoDB và RabbitMQ : Nếu bạn đã có trước đó không cần pull về nữa
Pull MongoDB và RabbitMQ từ Docker Hub:
```bash
docker pull mongo
docker pull rabbitmq
```

## 10. Push Image Lên Registry Cục Bộ
Để đẩy các image đã build lên registry cục bộ:
```bash
docker push localhost:5000/frontend-image:latest
docker push localhost:5000/backend-image:latest
docker push localhost:5000/nginx-image:latest
```
## 11. Triển Khai Dịch Vụ Trong Docker Swarm
Triển khai dịch vụ trong Docker Swarm bằng lệnh:
```bash
docker stack deploy -c docker-compose.yml midtermnodejs
```
## 12. Mở Rộng Replica
Mở rộng số lượng replica cho dịch vụ nginx lên 3:
```bash
docker service scale midtermnodejs_nginx=3
```

## 13. Kiểm Tra Trạng Thái Dịch Vụ
Kiểm tra trạng thái dịch vụ:
```bash
docker service ps midtermnodejs_nginx
```

# 14. Test triển khai hệ thống và thử nghiệm 
Mở browser để test trên 2 port là
```bash
http://localhost:3003/login  # Giao diện reactjs để test sản phẩm
http://localhost/test # Đây là nginx để phân phối tới 2 backend có thể kiểm tra user nào đang onl 
```
Tiến hành đăng ký tài khoản như sau : 
```bash
http://localhost:3003/register  # Giao diện reactjs để đăng ký tài khoản
```
tài khoản 1 :

Username : user1

password : password123
___________
tải khoản 2

Username : user2

password : password123
_______
Tiến hành nhắn tin qua lại và load lại sau khi nhắn tin xong để trải nghiệm hệ thống

## 15. Kiểm Tra Sức Khỏe Của Registry
Sử dụng healthcheck để kiểm tra sức khỏe:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

## 16. Dừng Dịch Vụ Trong Docker Swarm (Option) : Sau khi đã trải nghiệm xong và demo xong xóa đi giảm thiểu lãng phí bộ nhớ
Sau khi thử nghiệm xong, dừng dịch vụ:
```bash
docker stack rm midtermnodejs
```

## 16. Xóa Các Phần Đã Build Trong Dự Án
Để xóa các phần đã build trong dự án, bạn có thể sử dụng các lệnh sau:

### 16.1. Xóa Docker Registry
Để xóa registry cục bộ đã tạo:
```bash
docker stop local-registry
docker rm local-registry
```

### 16.2. Xóa Các Image Đã Build
Xóa các image đã build mà không ảnh hưởng đến các image khác trong hệ thống:
```bash
docker rmi localhost:5000/frontend-image:latest
docker rmi localhost:5000/backend-image:latest
docker rmi localhost:5000/nginx-image:latest
```

### 16.3. Xóa Các Container Không Còn Sử Dụng (Option )
Xóa các container không còn sử dụng:
```bash
docker container prune
```

### 16.4. Xóa Các Volume Không Còn Sử Dụng (Option)
Xóa các volume không còn sử dụng:
```bash
docker volume prune
```
## 📷 Giao Diện Ứng Dụng
📌 *Đang cập nhật hình ảnh...*

## 🎥 Xem Video Hướng Dẫn Chi Tiết
📌 *[Link video hướng dẫn (nếu có)]*

## 👤 Tác Giả
**Thành Long**

📧 **Liên Hệ**: thanhlongndp@gmail.com

## 📜 Giấy Phép
Dự án được phát hành theo giấy phép **MIT**.

---
🚀 *Made with ❤️ by Long*

---
