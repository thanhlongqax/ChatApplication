# Thành viên nhóm gồm:
1. **52100773 - Nguyễn Văn Biên**
2. **52100540 - Lý Đại Cương**
3. **52100836 - Đặng Ngọc Sang**

# Ứng dụng Websocket xây dựng ứng dụng chat trực tuyến

Dự án này là một ứng dụng trò chuyện sử dụng công nghệ socket để thực hiện chat 1-1 giữa những người dùng. Backend được xây dựng bằng Nodejs và Express, sử dụng Socket.IO để gửi và nhận các event trò chuyện. Frontend giao diện người dùng được xây dựng bằng ReactJS và sử dụng thư viện socket.io-client để kết nối tới server.

## Setup

1. **Backend:**
     - ### Di chuyển vào thư mục `backend`:
            cd backend
     - ### Cài đặt dependencies:
            npm install
     - ### Khởi động ứng dụng:
            npm start

2. **Frontend:**
     - ### Di chuyển vào thư mục `frontend`: 
            cd frontend
     - ### Cài đặt dependencies: 
            npm install
     - ### Khởi động ứng dụng:
            npm start

## Cấu trúc thư mục

### `backend/`

- `controllers/`: Thư mục này chứa các thành phần(component) React có thể tái sử dụng, như icon, button, form hoặc các thành phần giao diện người dùng khác.
- `models/`: Thư mục này chứa các trang ứng dụng, mỗi trang có thể chứa các thành phần và logic liên quan đến một chức năng cụ thể.
- `routes/`: Contains files that define and manage the application's routes. These files can contain routing handlers and call handlers from controllers.

### `frontend/`

- `src/`: Chứa code giao diện người dùng.
  - `components`: Thư mục này chứa các thành phần(component) React có thể tái sử dụng, như icon, button, form hoặc các thành phần giao diện người dùng khác.
  - `pages`: Thư mục này chứa các trang ứng dụng, mỗi trang có thể chứa các thành phần và logic liên quan đến một chức năng cụ thể.
  - `services`: Chứa các dịch vụ liên quan đến tương tác với server hoặc xử lý logic nghiệp vụ. Các dịch vụ này có thể cung cấp khả năng liên lạc với API, xử lý trạng thái toàn cầu và các tác vụ khác.
  - `utils`: Chứa các tiện ích và hàm tiện ích có thể sử dụng ở nhiều nơi trong code của dự án. Điều này có thể bao gồm các chức năng tiện ích chung, xử lý định dạng dữ liệu hoặc các chức năng hỗ trợ khác.


## Cách chạy project

1. Khởi động phần backend bằng cách chạy lệnh `npm start` trong thư mục `backend`.
2. Khởi động phần frontend bằng cách chạy lệnh `npm start` trong thư mục `frontend`.
3. Mở trình duyệt và truy cập `http://localhost:3000` để sử dụng ứng dụng.

## Công nghệ sử dụng

- Backend: Node.js, Express, Socket.IO
- Frontend: ReactJS, socket.io-client
- NoSql: MongoDB

