import React, { useEffect, useRef, useState } from 'react'

export default function ChatBot() {
    const [messages, setMessages] = useState([
        {
            message: 'Hello! How can I help you today?',
            role: 'assistant'
        },
        {
            message: 'Hi, I am good',
            role: 'user'
        },
        {
            message: 'Hello! How can I help you today?',
            role: 'assistant'
        },
        {
            message: 'Hi, I am good',
            role: 'user'
        },

    ]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const sendMessage = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            setMessages([
                ...messages,       
                {
                    message: message,  
                    role: 'user'
                }
            ]);
            setMessage('');
            const response = await fetch('http://localhost:3000/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
            });
            const data = await response.json();
            setMessages([...messages, { message: data.response.content, role: 'assistant' }]);

        } catch (error) {
            console.error(error);
        }finally{
            setIsLoading(false);
        }
    }
  return (
    <div className='fixed rounded-lg sm:top-[12rem] sm:right-[4.5rem] top-0 right-0 w-full h-full sm:w-[24rem] sm:h-[30rem] bg-white shadow-2xl z-[1000] flex flex-col'>
        <div className='flex flex-col h-full overflow-y-auto pt-2'>
            {messages.map((msg, index) => (
                <div key={index} className={`flex items-start ${msg.role !== 'assistant' ? "justify-end" : "justify-start"} gap-4 ${msg.role === 'assistant'? 'text-gray-500' : 'text-white'}`}>
                    <div className='rounded-full bg-gray-200 px-4 py-2'>
                        {msg.message}
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
        <div className='flex items-center justify-center w-full h-16 border border-black'>
            <input 
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder='Type a message...'
                className='w-full px-4 py-2 rounded-full border-none focus:outline-none'
            />
            <button className='pr-10 bg-amber-300' onClick={sendMessage}>
                Send
            </button>
        </div>
    </div>
  )
}
