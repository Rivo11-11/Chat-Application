# ChatApplication

A real-time chat application that allows users to communicate with each other. The application features user authentication, real-time messaging, and online status indicators.

## Description

ChatApplication is built using the MERN (MongoDB, Express.js, React, Node.js) stack. It utilizes Socket.io for real-time communication, allowing users to send and receive messages instantly. Users can see which contacts are online, ensuring a smooth and interactive chat experience.

## Features

- User Authentication (Login/Signup)
- Real-time Messaging with Socket.io
- Online Status Indicators
- User Profile Management
- Responsive Design

## Installation

### Backend

1. Navigate to the `backend` directory:
    ```sh
    cd backend
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the `backend` directory and add the following environment variables:
    ```env
    MONGO_URL=<your-mongodb-connection-string>
    JWT_SECRET=<your-jwt-secret>
    ```

4. Start the backend server:
    ```sh
    npm start
    ```

### Frontend

1. Navigate to the `frontend` directory:
    ```sh
    cd frontend
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the `frontend` directory and add the following environment variables:
    ```env
    REACT_APP_API_URL=http://localhost:5000
    ```

4. Start the frontend development server:
    ```sh
    npm start
    ```

## Usage

1. Register a new account or log in with existing credentials.
2. View your contacts and their online status.
3. Click on a contact to start chatting in real-time.

## Project Structure

### Backend

- `server.js`: Entry point for the backend server.
- `controllers/`: Contains the controllers for handling requests.
- `models/`: Contains the Mongoose models for MongoDB.
- `routes/`: Contains the route definitions.
- `utils/`: Contains utility functions.

### Frontend

- `src/App.js`: Main React component.
- `src/components/`: Contains React components.
- `src/pages/`: Contains the main pages of the application.
- `src/utils/`: Contains utility functions and constants.

## WebSockets

The application uses Socket.io for real-time communication. Here is how the online status is managed:

### Backend

- When a user connects, their ID is stored in the `onlineUsers` map.
- When a user disconnects, their ID is removed from the `onlineUsers` map.
- The server emits the list of online users to all connected clients whenever a user connects or disconnects.

### Frontend

- The frontend listens for updates to the online users list and updates the UI accordingly.
- The online status of contacts is indicated with a green checkmark.

## Example Code

### Backend (server.js)

```javascript
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});

global.onlineUsers = new Map();

io.on('connection', (socket) => {
  global.chatSocket = socket;
  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id);
    const onlineUserList = Array.from(onlineUsers.keys());
    io.emit('online-users', onlineUserList);
  });

  socket.on('logout', (userId) => {
    onlineUsers.delete(userId);
    const onlineUserList = Array.from(onlineUsers.keys());
    io.emit('online-users', onlineUserList);
  });

  socket.on('send-msg', (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-receive', data.msg);
    }
  });
});
