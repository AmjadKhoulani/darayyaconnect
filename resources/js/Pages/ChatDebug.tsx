import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function ChatDebug({ auth }: { auth: any }) {
    const [channels, setChannels] = useState<any[]>([]);
    const [activeChannel, setActiveChannel] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetchChannels();
    }, []);

    const fetchChannels = async () => {
        try {
            const res = await axios.get('/api/chat-channels');
            setChannels(res.data.channels || []);
            setError('');
        } catch (err: any) {
            setError('Failed to fetch channels: ' + (err.response?.data?.message || err.message));
        }
    };

    const fetchMessages = async (slug: string) => {
        try {
            const res = await axios.get(`/api/chat/${slug}`);
            setMessages(res.data);
            setError('');
        } catch (err: any) {
            setError('Failed to fetch messages: ' + (err.response?.data?.message || err.message));
        }
    };

    const createChannel = async () => {
        try {
            setStatus('Creating channel...');
            await axios.post('/api/chat-channels', {
                name: 'Debug Channel ' + Date.now(),
                description: 'Created via Web Debug',
                icon: 'Bug'
            });
            setStatus('Channel created!');
            fetchChannels();
        } catch (err: any) {
            setError('Failed to create channel: ' + (err.response?.data?.message || err.message));
            setStatus('');
        }
    };

    const sendMessage = async () => {
        if (!activeChannel) return;
        try {
            setStatus('Sending message...');
            await axios.post(`/api/chat/${activeChannel.slug}`, {
                body: newMessage,
                type: 'text'
            });
            setNewMessage('');
            setStatus('Message sent!');
            fetchMessages(activeChannel.slug);
        } catch (err: any) {
            setError('Failed to send message: ' + (err.response?.data?.message || err.message));
            setStatus('');
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Chat Debugger</h2>}
        >
            <Head title="Chat Debug" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}
                        {status && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">{status}</div>}

                        <div className="mb-6">
                            <h3 className="text-lg font-bold mb-2">1. Channel Management</h3>
                            <button
                                onClick={createChannel}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Test Create Channel (Admin Only)
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="border rounded p-4">
                                <h3 className="font-bold mb-4">Channels</h3>
                                {channels.map(channel => (
                                    <div
                                        key={channel.id}
                                        onClick={() => { setActiveChannel(channel); fetchMessages(channel.slug); }}
                                        className={`p-2 cursor-pointer hover:bg-gray-100 ${activeChannel?.id === channel.id ? 'bg-blue-50 font-bold' : ''}`}
                                    >
                                        #{channel.name}
                                        <span className="text-xs text-gray-400 block">{channel.slug}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="col-span-2 border rounded p-4 flex flex-col h-[500px]">
                                <h3 className="font-bold mb-4">Messages ({activeChannel?.name || 'Select Channel'})</h3>

                                <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 p-4 rounded">
                                    {messages.map((msg, i) => (
                                        <div key={i} className="mb-2">
                                            <span className="font-bold text-sm">{msg.user?.name}:</span>
                                            <span className="ml-2">{msg.body}</span>
                                            <div className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleString()}</div>
                                        </div>
                                    ))}
                                    {messages.length === 0 && <p className="text-gray-400 text-center mt-10">No messages found</p>}
                                </div>

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        className="flex-1 border rounded px-3 py-2"
                                        placeholder="Type a message..."
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={!activeChannel || !newMessage}
                                        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
