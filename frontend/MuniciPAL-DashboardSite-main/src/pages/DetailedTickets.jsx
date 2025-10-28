import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import DetailHeader from "../Components/DetailHeader";
import ChatForum from "../Components/ChatForum";
import React, { useState } from "react";
import { Switch } from "@headlessui/react";

function DetailedTickets() {
    const { id } = useParams();

    // Mock ticket data
    const ticket = {
        id,
        title: "Fix login bug",
        status: "Pending",
        location: "Edenvale",
        description: "Users are unable to log in with correct credentials.",
        createdAt: "2024-10-01",
        assignedTo: "Jayden",
    };

    const [isPrivate, setIsPrivate] = useState(false);

    //mock messages
    const [chatMessages, setChatMessages] = useState([
        { id: 1, user: 'Citizen', message: 'Hello, I need help with my order.', timestamp: '10:05 AM' },
        { id: 2, user: 'You', message: 'Sure, can you provide your order ID?', timestamp: '10:00 AM' },

    ]);

    const [privateMessages, setPrivateMessages] = useState([
        { id: 1, user: 'Employee', message: 'This is a private note regarding the ticket.', timestamp: '10:10 AM' },
    ]);

    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            const newChatMessage = {
                id: Date.now(),
                user: 'You',
                message: newMessage,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            if (isPrivate) {
                setPrivateMessages([...privateMessages, newChatMessage]);
            } else {
                setChatMessages([...chatMessages, newChatMessage]);
            }
            setNewMessage('');
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 flex flex-col min-h-screen overflow-hidden p-6">
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
                        <p><span className="font-semibold">Location:</span> {ticket.location}</p>
                        <p><span className="font-semibold">Created At:</span> {ticket.createdAt}</p>
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