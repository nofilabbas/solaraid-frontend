import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { checkSession } from '../../utils/sessionUtils';

function CustomerChats() {
  const [chatSellers, setChatSellers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);

  const customerId = sessionStorage.getItem("customer_id");
  const senderUsername = sessionStorage.getItem("customer_username");
  const messagesEndRef = useRef(null);

useEffect(() => {
  checkSession();
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

  useEffect(() => {
    if (customerId) {
      axios
        .get(`http://127.0.0.1:8000/api/customer_chats/${customerId}/`)
        .then((response) => {
          setChatSellers(response.data.sellers);
        })
        .catch((error) => {
          console.error("Error fetching customer chat list:", error);
        });
    }
  }, [customerId]);

  useEffect(() => {
    if (selectedChat) {
      const receiverId = selectedChat.id;
      axios
        .get(`http://127.0.0.1:8000/api/get_chat/${receiverId}/${customerId}/`)
        .then((response) => {
          setMessages(response.data.messages);
        })
        .catch((error) => {
          console.error("Error fetching chat messages:", error);
        });
    }
  }, [selectedChat, customerId]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const receiverId = selectedChat.id;
    const payload = {
      sender_id: customerId,
      receiver_id: receiverId,
      sender_type: "customer",
      receiver_type: "seller",
      content: newMessage,
    };

    axios
      .post("http://127.0.0.1:8000/api/send_message/", payload)
      .then(() => {
        setNewMessage("");
        axios
          .get(`http://127.0.0.1:8000/api/get_chat/${receiverId}/${customerId}/`)
          .then((res) => {
            setMessages(res.data.messages);
          });
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  return (
    <div className="container mx-auto h-[90vh] flex">
    {/* Sidebar (1/4 width) */}
    <div className="w-1/4 bg-white border-r border-gray-200 shadow-md">
      <Sidebar />
    </div>
  
    {/* Chat Area (3/4 width) */}
    <div className="w-3/4 flex bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat List */}
      <div className="w-[320px] bg-gray-100 border-r border-gray-300 p-4 flex flex-col">
        <h2 className="text-2xl font-semibold text-primary mb-4 px-2">Chats</h2>
        <div className="flex-1 overflow-y-auto">
          {chatSellers.length === 0 ? (
            <p className="text-gray-500 px-2">No chats yet.</p>
          ) : (
            <ul className="space-y-2">
              {chatSellers.map((seller) => (
                <li
                  key={seller.id}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-200 cursor-pointer transition"
                  onClick={() => setSelectedChat(seller)}
                >
                  <img
                    src={seller.profile_img || "/default_profile.png"}
                    alt={seller.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="truncate font-medium">{seller.username}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
  
      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-300 px-4 py-3 flex items-center shadow-sm">
          {selectedChat ? (
            <>
              <img
                src={selectedChat.profile_img || "/default_profile.png"}
                alt={selectedChat.username}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <h2 className="text-lg font-semibold">{selectedChat.username}</h2>
            </>
          ) : (
            <h2 className="text-lg text-gray-500">Select a conversation</h2>
          )}
        </div>
  
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {selectedChat ? (
            messages.length > 0 ? (
              messages.map((msg, index) => {
                const isSender = msg.sender === senderUsername;
                return (
                  <div key={index} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`px-4 py-2 rounded-lg shadow max-w-[65%] ${
                        isSender ? 'bg-green-200' : 'bg-white border'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs text-right text-gray-500 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500">No messages yet.</p>
            )
          ) : (
            <p className="text-center text-gray-500">Click a chat to start messaging</p>
          )}
          <div ref={messagesEndRef} />
        </div>
  
        {/* Input */}
        {selectedChat && (
          <div className="bg-white px-4 py-3 border-t border-gray-300 flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-primary text-white px-4 py-2 rounded-full hover:opacity-90 transition"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
  

  );
}

export default CustomerChats;
