# 💬 Website Chat Application 
📌 *[Xem bản tiếng Việt](README_vi.md)*

## 📌 Introduction
This chat website not only provides messaging functionality but is also designed to enhance deployment capabilities with **Docker Swarm**, **RabbitMQ**, and **Nginx Load Balancing**, ensuring high performance and scalability.

## 🎯 Objectives
- Provide a simple yet efficient chat platform.
- Package frontend and backend applications into images.
- Improve system scalability using **Docker Swarm**.
- Ensure performance and stability through **RabbitMQ** and **Nginx Load Balancer**.

## 🛠️ Technologies Used
### 💻 Frontend
- **ReactJS** + **Vite**: High performance, optimized page load speed.
- **Socket.IO Client**: Real-time communication.
- **Styled-Components**: Flexible and maintainable CSS management.

### 🖥 Backend
- **Node.js**: Builds APIs and handles server logic.
- **Mongoose**: ORM for MongoDB, making data management easier.
- **AMQP (amqplib)**: Service communication via RabbitMQ.

### 🗄️ Database & Infrastructure
- **MongoDB**: Stores user and message data.
- **RabbitMQ**: Message queue system for asynchronous processing.
- **Nginx**: Load balancer to distribute requests across backend nodes.
- **Docker Swarm**: Manages containers and ensures scalability.

## ✨ Features

### 🔹 User Side
✔ Login / Register accounts.
<br>
✔ Real-time messaging using **Socket.IO**.
<br>
✔ User-friendly interface with fast loading speed.

## 🚀 How to Run the Application
### 1️⃣ Install Required Tools
- **Node.js** (for backend and frontend)
- **Docker & Docker Compose** (for deployment)

# Deployment Guide and Real-Time Chat System Demo with Docker and Docker Swarm
**Note:** Commands with options are optional (only for advanced configurations).
The image size is quite large, so a stable WiFi/4G connection is recommended.

## 1. Check Running Docker Services
To check the running services in Docker Swarm, use:
```bash
docker service ls
```

## 2. Initialize Docker Swarm
If you haven't initialized Docker Swarm, use:
```bash
docker swarm init
```
If you want to leave Docker Swarm, use:
```bash
docker swarm leave --force # If it is a manager node
```

## 3. Add Worker Nodes (Optional)
By default, a worker node is available when initializing Swarm. You can add more workers if needed:
```bash
docker swarm join --token <TOKEN> <MANAGER-IP>:2377
```
Example:
```bash
docker swarm join --token SWMTKN-1-... 192.168.65.3:2377
```

## 4. Add Manager Nodes (Optional)
To add a manager node to Swarm:
```bash
docker swarm join-token manager
```

## 5. Create a Local Docker Registry
Set up a local registry to replace Docker Hub on port 5000:
```bash
docker run -d -p 5000:5000 --name local-registry registry:2
```
### Docker Desktop Configuration
In **Settings > Docker Engine**, add `localhost:5000` to "insecure-registries":
```json
{
  "insecure-registries" : ["localhost:5000"]
}
```

## 6. Remove Previous Docker Stack (Optional)
Before deploying a new stack, remove the old one to avoid conflicts:
```bash
docker stack rm midtermnodejs
```

## 7. Remove Networks If Existing (Optional)
```bash
docker network rm midtermnodejs_frontend-network midtermnodejs_backend-network
```

### 8. Build Docker Images
You can either build images from scratch or use existing ones.

### 8.1. If Images Are Not Built Yet
Build the images:
```bash
# Build backend
docker build -t localhost:5000/backend-image ./backend

# Build frontend
docker build -t localhost:5000/frontend-image ./frontend

# Build nginx
docker build -t localhost:5000/nginx-image ./nginx
```

### 8.2. If Images Are Already Built (Optional)
Tag the images with the local registry address:
```bash
docker tag frontend-image localhost:5000/frontend-image:latest
docker tag backend-image localhost:5000/backend-image:latest
docker tag nginx-image localhost:5000/nginx-image:latest
```

### 9. Pull MongoDB and RabbitMQ (Skip if Already Available)
```bash
docker pull mongo
docker pull rabbitmq
```

## 10. Push Images to Local Registry
```bash
docker push localhost:5000/frontend-image:latest
docker push localhost:5000/backend-image:latest
docker push localhost:5000/nginx-image:latest
```

## 11. Deploy Services in Docker Swarm
```bash
docker stack deploy -c docker-compose.yml midtermnodejs
```

## 12. Scale Replicas
Increase the number of replicas for Nginx:
```bash
docker service scale midtermnodejs_nginx=3
```

## 13. Check Service Status
```bash
docker service ps midtermnodejs_nginx
```

## 14. Test Deployment & System Functionality
Open the browser to test:
```bash
http://localhost:3003/login  # ReactJS frontend login
http://localhost/test # Nginx backend distribution
```
Register an account:
```bash
http://localhost:3003/register
```
Test accounts:
- **User 1**
  - Username: user1
  - Password: password123
- **User 2**
  - Username: user2
  - Password: password123

Send messages and refresh the page to experience the system.

## 15. Health Check for Registry
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

## 16. Stop Docker Swarm Services (Optional)
To free up resources:
```bash
docker stack rm midtermnodejs
```

## 17. Remove Built Project Components
### 17.1. Remove Local Docker Registry
```bash
docker stop local-registry
docker rm local-registry
```

### 17.2. Remove Built Images
```bash
docker rmi localhost:5000/frontend-image:latest
docker rmi localhost:5000/backend-image:latest
docker rmi localhost:5000/nginx-image:latest
```

### 17.3. Remove Unused Containers (Optional)
```bash
docker container prune
```

### 17.4. Remove Unused Volumes (Optional)
```bash
docker volume prune
```

## 📷 Application Interface
📌 *Screenshots coming soon...*

## 🎥 Watch Detailed Video Guide
📌 *[Video link (if available)]*

## 👤 Author
**Thanh Long**

📧 **Contact**: thanhlongndp@gmail.com

## 📜 License
This project is released under the **MIT** license.

---
🚀 *Made with ❤️ by Long*

