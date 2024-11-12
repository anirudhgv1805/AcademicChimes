import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import WebSocketService from './WebSocketService'

interface Message {
  id: number
  content: string
  sender: {
    id: string
    name: string
  }
  timestamp: string
  fileUrl?: string
  fileType?: string
}

interface MessageUpdate {
  type: 'NEW_MESSAGE'
  message: Message
}

export default function Chat() {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchMessages()
    const setupWebSocket = async () => {
      try {
        await WebSocketService.connect()
        await WebSocketService.subscribe<MessageUpdate>('/topic/messages', (message) => {
          setMessages((messages) => [...messages, message.payload])
        })
      } catch (error) {
        console.error('Failed to set up WebSocket:', error)
      }
    }
    setupWebSocket()

    return () => {
      WebSocketService.disconnect()
    }
  }, [type, id])

  const fetchMessages = async () => {
    try {
      const userId = localStorage.getItem('userId')
      let url = `http://localhost:8080/api/chat/messages/${type}/${id}`
      if (type === 'direct') {
        url += `?senderId=${userId}&recipientId=${id}`
      }
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
      setMessages([])
    }
  }

  const handleSendMessage = async () => {
    if (newMessage.trim() || file) {
      const formData = new FormData()
      formData.append('content', newMessage)
      formData.append('senderId', localStorage.getItem('userId') || '')
      formData.append('recipientId', type === 'direct' ? id || '' : '')
      formData.append('groupId', type === 'group' ? id || '' : '')
      if (file) {
        formData.append('file', file)
      }

      try {
        const response = await fetch('http://localhost:8080/api/chat/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData,
        })
        if (!response.ok) {
          throw new Error('Failed to send message')
        }
        setNewMessage('')
        setFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        fetchMessages()
      } catch (error) {
        console.error('Error sending message:', error)
      }
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0])
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chat</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Back to Dashboard
        </button>
      </header>
      <div className="flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto mb-4 bg-white rounded shadow-md p-4">
          {Array.isArray(messages) && messages.map((message) => (
            <div key={message.id} className="mb-2">
              <strong>{message.sender.name}: </strong>
              {message.content}
              {message.fileUrl && (
                <div>
                  {message.fileType?.startsWith('image/') ? (
                    <img src={message.fileUrl} alt="Attached file" className="max-w-xs mt-2" />
                  ) : (
                    <a href={message.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      Attached file
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-col">
          <div className="flex mb-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 p-2 border rounded-l"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition-colors"
            >
              Send
            </button>
          </div>
          <div className="flex items-center">
            <input
              type="file"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="flex-1"
            />
            {file && <span className="ml-2">{file.name}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}