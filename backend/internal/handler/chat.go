package handler

import (
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

type ChatRoom struct {
	clients map[*websocket.Conn]string
	history []map[string]any // 최근 50개 메시지 보관
	mu      sync.RWMutex
}

type ChatHub struct {
	rooms map[string]*ChatRoom
	mu    sync.RWMutex
}

func NewChatHub() *ChatHub {
	return &ChatHub{rooms: make(map[string]*ChatRoom)}
}

func (h *ChatHub) getRoom(id string) *ChatRoom {
	h.mu.Lock()
	defer h.mu.Unlock()
	if r, ok := h.rooms[id]; ok {
		return r
	}
	r := &ChatRoom{
		clients: make(map[*websocket.Conn]string),
		history: make([]map[string]any, 0, 50),
	}
	h.rooms[id] = r
	return r
}

func (room *ChatRoom) addHistory(msg map[string]any) {
	room.history = append(room.history, msg)
	if len(room.history) > 50 {
		room.history = room.history[len(room.history)-50:]
	}
}

func (room *ChatRoom) broadcast(msg map[string]any) {
	room.mu.Lock()
	room.addHistory(msg)
	room.mu.Unlock()

	room.mu.RLock()
	defer room.mu.RUnlock()
	for conn := range room.clients {
		if err := conn.WriteJSON(msg); err != nil {
			conn.Close()
			delete(room.clients, conn)
		}
	}
}

func (h *ChatHub) HandleChat(c *gin.Context) {
	roomID := c.Param("roomId")
	nickname := c.Query("nick")
	if nickname == "" {
		nickname = "익명"
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("ws upgrade error:", err)
		return
	}
	defer conn.Close()

	room := h.getRoom(roomID)

	// 접속 시 최근 메시지 전송
	room.mu.RLock()
	for _, msg := range room.history {
		conn.WriteJSON(msg)
	}
	room.mu.RUnlock()

	room.mu.Lock()
	room.clients[conn] = nickname
	room.mu.Unlock()

	defer func() {
		room.mu.Lock()
		delete(room.clients, conn)
		room.mu.Unlock()
	}()

	for {
		var msg map[string]any
		if err := conn.ReadJSON(&msg); err != nil {
			break
		}
		msg["nick"] = nickname
		msg["type"] = "chat"
		// 욕설 마스킹
		if message, ok := msg["message"].(string); ok {
			msg["message"] = MaskProfanity(message)
		}
		room.broadcast(msg)
	}
}
