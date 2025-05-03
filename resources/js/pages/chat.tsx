import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { ChatList } from '../components/skill-swap/chat/chat-list';
import { MessageList } from '../components/skill-swap/chat/message-list';
import { MessageInput } from '../components/skill-swap/chat/message-input';
import { mockChats } from '../data/mock-chat';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: '/home',
    },
    {
        title: 'Chat',
        href: '/chat',
    },
];

export default function Chat() {
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
    const currentUserId = 1; // Mock current user ID

    const selectedChat = selectedChatId
        ? mockChats.find((chat) => chat.id === selectedChatId)
        : null;

    const handleSendMessage = (content: string) => {
        // Mock sending message
        console.log('Sending message:', content);
    };

    const handleFileUpload = (file: File) => {
        // Mock file upload
        console.log('Uploading file:', file.name);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chat" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-center">
                    <div className="w-full  mx-auto p-4">
                        <div className="grid grid-cols-3 gap-4">
                            {/* Chat List */}
                            <div className="col-span-1 border rounded-lg p-4">
                                <h2 className="text-lg font-semibold mb-4">Messages</h2>
                                <ChatList
                                    chats={mockChats}
                                    selectedChatId={selectedChatId}
                                    onSelectChat={setSelectedChatId}
                                />
                            </div>

                            {/* Chat Area */}
                            <div className="col-span-2 border rounded-lg flex flex-col">
                                {selectedChat ? (
                                    <>
                                        <div className="border-b p-4">
                                            <h2 className="text-lg font-semibold">{selectedChat.userName}</h2>
                                        </div>
                                        <MessageList
                                            messages={selectedChat.messages}
                                            currentUserId={currentUserId}
                                        />
                                        <MessageInput
                                            onSend={handleSendMessage}
                                            onFileUpload={handleFileUpload}
                                        />
                                    </>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                                        Select a chat to start messaging
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 