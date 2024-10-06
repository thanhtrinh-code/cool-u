import React, { useEffect, useRef, useState } from 'react';

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      message: 'Hello! How can I help you today?',
      role: 'assistant',
    },
    {
      message: 'What is the CO2 level in Seattle?',
      role: 'user',
    },
    {
      message:
        'In Seattle, the CO₂ level, like in most urban areas, is influenced by human activities and the surrounding environment. As of 2024, data from the Pacific Marine Environmental Laboratory shows that the CO₂ concentration at the Space Needle is continuously monitored. Recent levels have been approximately 415 parts per million (ppm), consistent with the global average in recent years.',
      role: 'assistant',
    },
  ]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const userMessage = {
        message: message,
        role: 'user',
      };
      const aiMessage = {
        message: '...',
        role: 'assistant',
      };
      setMessages([...messages, userMessage, aiMessage]);
      setMessage('');

      const response = await fetch('http://localhost:3000/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();

      setMessages([
        ...messages,
        userMessage,
        {
          role: 'assistant',
          message: data.response,
        },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed rounded-lg sm:top-[15rem] sm:right-[2rem] top-0 right-0 w-full h-full sm:w-[24rem] sm:h-[40rem] bg-white shadow-2xl z-[1000] flex flex-col">
      <div className="flex flex-col h-full overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex m-2 items-start ${
              msg.role !== 'assistant' ? 'justify-end' : 'justify-start'
            } gap-4`}
          >
            <div
              className={`rounded-lg px-4 py-2 ${
                msg.role === 'assistant'
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-green-500 text-white'
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center justify-between w-full h-16 border-t border-gray-300 p-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          className="ml-2 px-4 py-2 bg-amber-300 rounded-full hover:bg-amber-400 transition duration-200"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
