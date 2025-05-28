import { useEffect, useRef, useState } from "react";
import axios from "axios";
import SellerSidebar from "./SellerSidebar";
import { checkSession } from '../../utils/sessionUtils';

function SellerChats() {
  const [chatCustomers, setChatCustomers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState(null); // New state for selected chat
  const senderUsername = sessionStorage.getItem("seller_username");
  const sellerId = sessionStorage.getItem("seller_id");
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    checkSession('seller');
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  useEffect(() => {
    if (sellerId) {
      axios
        .get(`http://127.0.0.1:8000/api/seller_chats/${sellerId}/`)
        .then((response) => {
          setChatCustomers(response.data.customers); // Expect list of { id, username, profile_img }
        })
        .catch((error) => {
          console.error("Error fetching seller chat list:", error);
        });
    }
  }, [sellerId]);

  useEffect(() => {
    if (selectedChat) {
      // Fetch messages for the selected chat
      const receiverId = selectedChat.id;
      axios
        .get(`http://127.0.0.1:8000/api/get_chat/${sellerId}/${receiverId}/`)
        .then((response) => {
          setMessages(response.data.messages);
        })
        .catch((error) => {
          console.error("Error fetching chat messages:", error);
        });
    }
  }, [selectedChat, sellerId]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const receiverId = selectedChat.id;
    const payload = {
      sender_id: sellerId,
      receiver_id: receiverId,
      sender_type: "seller",
      receiver_type: "customer",
      content: newMessage,
    };

    axios
      .post("http://127.0.0.1:8000/api/send_message/", payload)
      .then(() => {
        setNewMessage("");
        axios
          .get(`http://127.0.0.1:8000/api/get_chat/${sellerId}/${receiverId}/`)
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
    {/* Sidebar */}
    <div className="w-1/4 bg-white border-r border-gray-200 shadow-md">
      <SellerSidebar />
    </div>
  
    {/* Chat Section */}
    <div className="w-3/4 flex bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat List */}
      <div className="w-[300px] bg-gray-100 border-r border-gray-300 p-4 flex flex-col">
        <h2 className="text-2xl font-semibold text-primary mb-4 px-2">Your Conversations</h2>
        <div className="flex-1 overflow-y-auto">
          {chatCustomers.length === 0 ? (
            <p className="text-gray-500 px-2">No chats yet.</p>
          ) : (
            <ul className="space-y-2">
              {chatCustomers.map((customer) => (
                <li
                  key={customer.id}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-200 cursor-pointer transition"
                  onClick={() => setSelectedChat(customer)}
                >
                  <img
                    src={customer.profile_img || "/default_profile.png"}
                    alt={customer.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="truncate font-medium">{customer.username}</span>
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
            <h2 className="text-lg text-gray-500">Click on a chat to start</h2>
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
                        isSender ? 'bg-blue-100' : 'bg-gray-200'
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
            <p className="text-center text-gray-500">Select a conversation to view the chat.</p>
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
              placeholder="Type your message..."
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

export default SellerChats;
