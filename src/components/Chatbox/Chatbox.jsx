import React, { useState, useEffect } from "react";

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Expands after first message
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  // Load chat history from sessionStorage when component mounts
  useEffect(() => {
    const storedMessages = sessionStorage.getItem("chatMessages");
    if (storedMessages) {
      setChatHistory(JSON.parse(storedMessages));
      setIsExpanded(true); // Expand if history exists
    }
  }, []);

  const toggleChatBox = () => {
    setIsOpen(!isOpen);
    setIsButtonVisible(!isButtonVisible);
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Expand chat after the first message
    if (!isExpanded) {
      setIsExpanded(true);
    }

    const userMessage = { sender: "You", text: message };
    const updatedChatHistory = [...chatHistory, userMessage];

    setChatHistory(updatedChatHistory);
    sessionStorage.setItem("chatMessages", JSON.stringify(updatedChatHistory));

    try {
      const response = await fetch("http://127.0.0.1:8000/api/aichat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      if (data.reply) {
        const aiMessage = { sender: "AI", text: data.reply };
        const newChatHistory = [...updatedChatHistory, aiMessage];

        setChatHistory(newChatHistory);
        sessionStorage.setItem("chatMessages", JSON.stringify(newChatHistory));
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setMessage("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      {isButtonVisible && (
        <button
          onClick={toggleChatBox}
          className="flex items-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white py-2 px-4 rounded-full shadow-lg hover:bg-gradient-to-l transform transition-all duration-300 ease-in-out"
        >
          <span className="mr-2">Chat with us 👋</span>
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-500">
            <span>💬</span>
          </div>
        </button>
      )}

      {/* Chatbox */}
{isOpen && (
        <div
          className={'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-xl mt-4 z-50 transition-all duration-300'}
        >
          <div className="flex justify-between items-center">
            <div className="font-semibold">Hi there 👋</div>
            <button onClick={toggleChatBox} className="text-white text-xl">×</button>
          </div>
          <p className="text-sm mt-2">Welcome to our website. Ask us anything 🎉</p>
              <p className="text-xs mt-1">We typically reply within a few minutes.</p>

          {!isExpanded ? (
            // Initial small chatbox with only an input field
            <div className="flex items-center mt-4">
              <input
                type="text"
                value={message}
                onChange={handleChange}
                className="flex-1 p-2 rounded-md bg-white text-gray-700"
                placeholder="Enter your message..."
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 p-2 bg-white text-blue-500 rounded-full"
              >
                ➡️
              </button>
            </div>
          ) : (
            // Expanded chatbox with messages and input
            <>

              {/* Chat Messages */}
              <div className="mt-2 bg-white text-gray-800 p-2 rounded-md h-48 overflow-y-auto">
                {chatHistory.length > 0 ? (
                  chatHistory.map((msg, index) => (
                    <div key={index} className={`p-2 ${msg.sender === "You" ? "text-right" : "text-left"}`}>
                      <span
                        className={`inline-block px-3 py-1 rounded-md ${
                          msg.sender === "You" ? "bg-blue-200" : "bg-gray-200"
                        }`}
                      >
                        {msg.text}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No messages yet...</p>
                )}
              </div>

              {/* Chat Input */}
              <div className="flex items-center mt-4">
                <input
                  type="text"
                  value={message}
                  onChange={handleChange}
                  className="flex-1 p-2 rounded-md bg-white text-gray-700"
                  placeholder="Enter your message..."
                />
                <button
                  onClick={handleSendMessage}
                  className="ml-2 p-2 bg-white text-blue-500 rounded-full"
                >
                  ➡️
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );

  
};

export default ChatBox;
