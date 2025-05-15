# 🧩 WebSocket Room Chat Server

A minimal WebSocket-based chat server that supports room-based messaging and automatic user management.

---

## 🚀 Features

- Join chat rooms via `roomId`
- Broadcast messages to all clients in the same room (except the sender)
- Prevent duplicate joins
- Auto-remove disconnected users from rooms

---

## 🛠️ Tech Stack

- Node.js
- TypeScript
- [ws](https://github.com/websockets/ws) — WebSocket library

---

## 📦 Installation

```bash
git clone https://github.com/your-username/websocket-room-chat.git
cd websocket-room-chat
npm install
