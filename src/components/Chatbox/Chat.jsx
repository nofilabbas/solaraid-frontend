import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./chat.css";

function Chat({ receiverId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [receiverName, setReceiverName] = useState("Chat");

  const customerId = sessionStorage.getItem("customer_id");
  const sellerId = sessionStorage.getItem("seller_id");

  const isCustomer = !!customerId;
  const senderId = isCustomer ? customerId : sellerId;
  const senderType = isCustomer ? "customer" : "seller";
  const receiverType = isCustomer ? "seller" : "customer";
  const senderUsername = isCustomer
    ? sessionStorage.getItem("customer_username")
    : sessionStorage.getItem("seller_username");
    const messagesEndRef = useRef(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);


  useEffect(() => {
    if (receiverId && senderId) {
      const seller_id = isCustomer ? receiverId : senderId;
      const customer_id = isCustomer ? senderId : receiverId;

      axios
        .get(`http://127.0.0.1:8000/api/get_chat/${seller_id}/${customer_id}/`)
        .then((res) => {
          setMessages(res.data.messages);
        });

      axios
        .get(`http://127.0.0.1:8000/api/${receiverType}/${receiverId}/`)
        .then((res) => {
          const { first_name, last_name } = res.data.user;
        setReceiverName(`${first_name} ${last_name}`);
        });
    }
  }, [receiverId, senderId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const payload = {
      sender_id: senderId,
      receiver_id: receiverId,
      sender_type: senderType,
      receiver_type: receiverType,
      content: newMessage,
    };

    axios
      .post("http://127.0.0.1:8000/api/send_message/", payload)
      .then(() => {
        setNewMessage("");
        const seller_id = isCustomer ? receiverId : senderId;
        const customer_id = isCustomer ? senderId : receiverId;

        axios
          .get(`http://127.0.0.1:8000/api/get_chat/${seller_id}/${customer_id}/`)
          .then((res) => setMessages(res.data.messages));
      });
  };

  return (
    <div className="chat-floating">
      <div className="chat-box">
        <div className="chat-header" onClick={() => setIsMinimized(!isMinimized)}>
          <span>{receiverName}</span>
          <button
            className="chat-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            ×
          </button>
        </div>

        {!isMinimized && (
          <>
            <div className="message-list">
              {messages.map((msg, index) => {
                const isSender = msg.sender === senderUsername;
                return (
                  <div
                    key={index}
                    className={`message-bubble ${isSender ? "sent" : "received"}`}
                  >
                    <div className="message-content">{msg.content}</div>
                    <div className="message-meta">
                      <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <div className="send-message">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Chat;
