"use client"

// components/ChatInterface.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Message, QuickBooksAuth } from '../types';
import { generateAIResponse } from '../services/ai';
import { v4 as uuidv4 } from 'uuid'; // You'll need to install this package

interface ChatInterfaceProps {
  quickBooksAuth?: QuickBooksAuth;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ quickBooksAuth }) => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      // Add user message to chat
      const newMessages = [
        ...messages,
        { role: 'user', content: input }
      ];
      setMessages(newMessages);
      setInput('');

      // Call our API route instead of OpenAI directly
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const aiMessage = await response.json();
      setMessages([...newMessages, aiMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      alert('Failed to get response from AI');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-100 ml-auto max-w-md' 
                : 'bg-gray-100 mr-auto max-w-md'
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;