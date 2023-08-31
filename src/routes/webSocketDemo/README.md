---
title: WebSocket Demo
---

# WebSocket Demo

This is a minimal example of establishing a WebSocket connection to the server the page is retrieved from. Using Socket.IO it inititates the connection in `polling` mode and then upgrades it to `websocket` or even `webtransport` when there will be support for it in the future.

Upon connection the WebSocket Server greets the client with a warm and welcoming `Hello, World 👋` message in the terminal and states the connection status as `Connected`.

[dev server link](/webSocketDemo)
