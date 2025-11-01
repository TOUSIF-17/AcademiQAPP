'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SocketDemo() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to the socket server using the path configured in server.js
    const socketInstance = io({
      path: '/api/socketio',
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Socket Connected:', socketInstance.id);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket Disconnected');
    });

    // Listener for incoming messages
    socketInstance.on('message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    // Cleanup function to disconnect socket when component unmounts
    return () => {
      socketInstance.disconnect();
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const sendMessage = () => {
    if (socket && inputMessage.trim()) {
      const newMessage = {
        text: inputMessage.trim(),
        senderId: socket.id || 'user',
        timestamp: new Date().toISOString()
      };
      
      // Optimistically add the message to the display
      setMessages(prev => [...prev, newMessage]);
      
      // Emit the message to the server
      socket.emit('message', newMessage);
      
      // Clear the input field
      setInputMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            WebSocket Demo 💬
            <span className={`text-sm px-2 py-1 rounded ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScrollArea className="h-80 w-full border rounded-md p-4 bg-gray-50">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No messages yet. Start typing to send a message!
                </p>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className="flex justify-start">
                    <div className="max-w-[80%]">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        {msg.senderId === socket?.id ? 'You' : msg.senderId}
                      </p>
                      <div className={`p-3 rounded-lg ${msg.senderId === socket?.id ? 'bg-blue-500 text-white self-end' : 'bg-white border text-gray-900 self-start'}`}>
                        <p>{msg.text}</p>
                        <span className="text-xs text-opacity-70 mt-1 block text-right">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              disabled={!isConnected}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={!isConnected || !inputMessage.trim()}
            >
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}