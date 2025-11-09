import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import DetailHeader from "../Components/DetailHeader";
import ChatForum from "../Components/ChatForum";
import React, { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { ticketAPI, userAPI, forumAPI } from "../../../src/services/api";

function DetailedTickets() {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isPrivate, setIsPrivate] = useState(false);

    useEffect(() => {
        fetchTicket();
    }, [id]);

    useEffect(() => {
        fetchMessages();
    }, [id, isPrivate]);

    const fetchTicket = async () => {
        try {
            setLoading(true);
            const response = await ticketAPI.getById(id);
            
            if (response.success && response.data) {
                const ticketData = response.data;
                const location = ticketData.location;
                const locationStr = location 
                    ? (typeof location === 'string' 
                        ? location 
                        : `${location.suburb || ''} ${location.street_name || ''}`.trim() || 'N/A')
                    : 'N/A';
                
                setTicket({
                    id: ticketData.id || ticketData.ticket_id,
                    title: ticketData.title || ticketData.subject || 'Untitled Ticket',
                    status: ticketData.status || 'Pending',
                    location: locationStr,
                    description: ticketData.description || '',
                    createdAt: ticketData.createdAt || ticketData.date_created || ticketData.created_at 
                        ? new Date(ticketData.createdAt || ticketData.date_created || ticketData.created_at).toISOString().split('T')[0] 
                        : new Date().toISOString().split('T')[0],
                    assignedTo: ticketData.assignedTo || ticketData.assigned_to || 'Unassigned',
                    issue_type: ticketData.issue_type,
                    resolved_at: ticketData.completedAt || ticketData.date_completed || ticketData.resolved_at
                });
            } else {
                setError('Ticket not found');
            }
        } catch (err) {
            setError(err.message || 'Failed to load ticket');
        } finally {
            setLoading(false);
        }
    };

    const [chatMessages, setChatMessages] = useState([]);
    const [privateMessages, setPrivateMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);

    const [newMessage, setNewMessage] = useState('');

    const fetchMessages = async () => {
        try {
            setMessagesLoading(true);
            const user = userAPI.getCurrentUser();
            const currentUserId = user ? user.id || user.user_id : null;

            const citizenResponse = await forumAPI.getMessages(50, 0, 1, id, false);
            const privateResponse = await forumAPI.getMessages(50, 0, 1, id, true);

            if (citizenResponse.success) {
                const formattedCitizenMessages = citizenResponse.data.messages.map(msg => ({
                    id: msg.message_id,
                    user: msg.user_id === currentUserId ? 'You' : (msg.user_name || 'Unknown User'),
                    message: msg.message_description,
                    timestamp: new Date(msg.message_sent_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }));
                setChatMessages(formattedCitizenMessages);
            }

            if (privateResponse.success) {
                const formattedPrivateMessages = privateResponse.data.messages.map(msg => ({
                    id: msg.message_id,
                    user: msg.user_id === currentUserId ? 'You' : (msg.user_name || 'Unknown User'),
                    message: msg.message_description,
                    timestamp: new Date(msg.message_sent_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }));
                setPrivateMessages(formattedPrivateMessages);
            }
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        } finally {
            setMessagesLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() !== '') {
            try {
                setNewMessage('');

                // Send to backend
                const currentUser = userAPI.getCurrentUser();
                const userId = currentUser ? currentUser.id || currentUser.user_id : null;
                await forumAPI.addMessage('Chat', newMessage, userId, id, isPrivate);

                // Refresh messages to show the new message
                fetchMessages();
            } catch (err) {
                console.error('Failed to send message:', err);
                alert('Failed to send message. Please try again.');
                // Restore the message on error
                setNewMessage(newMessage);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen">
                <Sidebar />
                <main className="flex-1 flex flex-col min-h-screen overflow-hidden p-6">
                    <DetailHeader backTo={"/tickets"} />
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-500">Loading ticket...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !ticket) {
        return (
            <div className="flex h-screen">
                <Sidebar />
                <main className="flex-1 flex flex-col min-h-screen overflow-hidden p-6">
                    <DetailHeader backTo={"/tickets"} />
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-red-500">{error || 'Ticket not found'}</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 flex flex-col min-h-screen overflow-hidden p-6 bg-gray-50">
                <DetailHeader backTo={"/tickets"} />
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-bold">Ticket #{ticket.id}</h1>
                            <div className="flex items-center space-x-2">
                                <p><span className="font-semibold">Status:</span> {ticket.status}</p>
                                <p><span className="font-semibold">Assigned To:</span> {ticket.assignedTo}</p>
                            </div>
                        </div>

                        <p><span className="font-semibold">Title:</span> {ticket.title}</p>
                        <p><span className="font-semibold">Category:</span> {ticket.issue_type || 'N/A'}</p>
                        <p><span className="font-semibold">Location:</span> {ticket.location}</p>
                        <p><span className="font-semibold">Created At:</span> {ticket.createdAt}</p>
                        {ticket.resolved_at && (
                            <p><span className="font-semibold">Resolved At:</span> {new Date(ticket.resolved_at).toISOString().split('T')[0]}</p>
                        )}
                        <p><span className="font-semibold">Description:</span> {ticket.description}</p>

                    </div>
                    <div className="mt-auto bg-white p-6 rounded-lg shadow flex flex-col h-[57vh]">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">
                                {isPrivate ? "Private Chat" : "Citizen Chat"}
                            </h2>

                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium text-gray-700">
                                    {isPrivate ? "Citizen Chat" : "Private Chat"}
                                </span>
                                <Switch
                                    checked={isPrivate}
                                    onChange={setIsPrivate}
                                    className={`${isPrivate ? 'bg-blue-600' : 'bg-gray-200'}
                                            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                                >
                                    <span
                                        className={`${isPrivate ? 'translate-x-6' : 'translate-x-1'}
                                            inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                    />
                                </Switch>
                            </div>
                        </div>

                        <div className="flex-1 min-h-0 overflow-y-auto">
                            <ChatForum
                                messages={isPrivate ? privateMessages : chatMessages}
                                newMessage={newMessage}
                                setNewMessage={setNewMessage}
                                handleSendMessage={handleSendMessage}
                                isPrivate={isPrivate}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default DetailedTickets;