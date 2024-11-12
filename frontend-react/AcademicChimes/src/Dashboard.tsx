import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import WebSocketService from './WebSocketService'

interface Group {
  id: number
  name: string
}

interface User {
  id: string
  name: string
}

interface GroupUpdate {
  type: 'CREATE' | 'UPDATE'
  group: Group
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [groups, setGroups] = useState<Group[]>([])
  const [contacts, setContacts] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchGroups()
    fetchContacts()

    const setupWebSocket = async () => {
      try {
        await WebSocketService.connect()
        console.log('WebSocket connected successfully')
        await WebSocketService.subscribe<GroupUpdate>('/topic/group-updates', (message) => {
          console.log('Received group update:', message)
          if (message.type === 'CREATE') {
            setGroups((prevGroups) => [...prevGroups, message.payload.group])
          } else if (message.type === 'UPDATE') {
            setGroups((prevGroups) =>
              prevGroups.map((group) => (group.id === message.payload.group.id ? message.payload.group : group))
            )
          }
        })
      } catch (error) {
        console.error('Failed to set up WebSocket:', error)
      }
    }

    setupWebSocket()

    return () => {
      WebSocketService.disconnect()
    }
  }, [])

  const fetchGroups = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/chat/groups?userId=${localStorage.getItem('userId')}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch groups')
      }
      const data = await response.json()
      setGroups(data)
    } catch (error) {
      console.error('Error fetching groups:', error)
    }
  }

  const fetchContacts = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/chat/users/search?query=${searchQuery}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch contacts')
      }
      const data = await response.json()
      setContacts(data)
    } catch (error) {
      console.error('Error fetching contacts:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userRole')
    navigate('/login')
  }

  const handleCreateGroup = async () => {
    const groupName = prompt('Enter group name:')
    if (groupName) {
      try {
        const response = await fetch('http://localhost:8080/api/chat/groups', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ 
            name: groupName, 
            creatorId: localStorage.getItem('userId') 
          }),
        })
        if (!response.ok) {
          throw new Error('Failed to create group')
        }
        const newGroup = await response.json()
        setGroups((prevGroups) => [...prevGroups, newGroup])
      } catch (error) {
        console.error('Error creating group:', error)
        alert('Failed to create group. Please try again.')
      }
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    fetchContacts()
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </header>
      <div className="flex-1 flex">
        <aside className="w-64 bg-white shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Groups</h2>
          <ul className="space-y-2">
            {groups.map((group) => (
              <li key={group.id}>
                <button
                  onClick={() => navigate(`/chat/group/${group.id}`)}
                  className="w-full text-left p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  {group.name}
                </button>
              </li>
            ))}
          </ul>
          {localStorage.getItem('userRole') === 'staff' && (
            <button
              onClick={handleCreateGroup}
              className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Create Group
            </button>
          )}
        </aside>
        <main className="flex-1 p-4">
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="flex">
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="flex-1 p-2 border rounded-l"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
          <ul className="space-y-2">
            {contacts.map((contact) => (
              <li key={contact.id}>
                <button
                  onClick={() => navigate(`/chat/direct/${contact.id}`)}
                  className="w-full text-left p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  {contact.name}
                </button>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  )
}