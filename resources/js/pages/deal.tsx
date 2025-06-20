import React, { useState, useRef, useEffect, MouseEvent, ReactNode, Key, ReactElement, JSXElementConstructor, ReactPortal } from 'react';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, PageProps } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CheckCircle, Send, ArrowLeft, MoreHorizontal, Handshake, AlertTriangle, Paperclip, X, Download, FileText, Image as ImageIcon, Code, Copy, Trash2 } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
}

interface Message {
    id: number;
    content: string | null;
    created_at: string;
    user: User;
    user_id?: number;
    attachment_path: string;
    attachment_name?: string | null;
    mime_type?: string | null;
    is_image?: boolean;
    is_code_block?: boolean;
    size?: number;
}

const codeBlockStyles: React.CSSProperties = {
    backgroundColor: '#2d2d2d',
    color: '#f8f8f2',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    overflowX: 'auto',
    margin: '0.5rem 0',
    lineHeight: 1.5,
};

// Mock chat data
const mockMessages = [
  {
    id: 1,
    content: "Hi! I'm interested in your skill swap offer.",
    sender_id: 1,
    created_at: "2024-03-10T10:00:00Z"
  },
  {
    id: 2,
    content: "Great! I'd love to learn more about what you can offer.",
    sender_id: 2,
    created_at: "2024-03-10T10:05:00Z"
  },
  {
    id: 3,
    content: "I can help you with web development. What would you like to learn?",
    sender_id: 1,
    created_at: "2024-03-10T10:10:00Z"
  }
];

export default function Deal() {
  const { props } = usePage<PageProps>();
  const { deal, auth } = props;
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
  const isInitiator = deal.initiator.id === auth.user.id;
  const isAcceptor = deal.acceptor?.id === auth.user.id;
  
  console.log('Deal props:', { deal, isInitiator, isAcceptor });
  
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesRef = useRef<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [isCodeBlockActive, setIsCodeBlockActive] = useState(false);
  const [isCodeBlock, setIsCodeBlock] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reportReason, setReportReason] = useState('');
  const [rating, setRating] = useState('');
  const [ratingScore, setRatingScore] = useState('');
  const [chatWidth, setChatWidth] = useState(400);
  const [loading, setLoading] = useState(true);
  const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  // Set initial chat width based on window size
  useEffect(() => {
    const handleResize = () => {
      setChatWidth(Math.floor(window.innerWidth / 2));
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Update messagesRef when messages state changes
  useEffect(() => {
    console.log('Messages state updated:', messages);
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    // Load initial messages
    axios.get(route('deals.messages.index', { deal: deal.id }))
      .then(response => {
        if (Array.isArray(response.data)) {
          setMessages(response.data.reverse());
        } else {
          console.error('Invalid messages data received:', response.data);
          setMessages([]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load messages:', error);
        setMessages([]);
        setLoading(false);
      });
  
    // Simple Echo subscription
    const channel = window.Echo.channel('chat')
      .listen('.App\\Events\\NewDealMessage', (data: { message: Message }) => {
        console.log('Message received:', data);
        // Only update messages if the current user is NOT the sender and message is valid
        const currentUserId = isInitiator ? deal.initiator.id : deal.acceptor.id;
        if (data?.message && data.message.user_id !== currentUserId) {
          setMessages(prev => [...prev, data.message]);
        }
      });

    return () => {
      channel.stopListening('.App\\Events\\NewDealMessage');
  };
  }, [deal.id, isInitiator]);

  const toggleCodeBlock = () => {
    if (!message.trim()) {
      // If message is empty, add code block markers with cursor in the middle
      setMessage('```\n\n```');
    } else if (message.startsWith('```') && message.endsWith('```')) {
      // If already a code block, remove the markers
      const content = message.slice(3, -3).trim();
      setMessage(content);
    } else {
      // Wrap selection or entire message in code block
      const selectionStart = (document.activeElement as HTMLInputElement).selectionStart || 0;
      const selectionEnd = (document.activeElement as HTMLInputElement).selectionEnd || 0;
      const beforeSelection = message.substring(0, selectionStart);
      const selectedText = message.substring(selectionStart, selectionEnd);
      const afterSelection = message.substring(selectionEnd);
      
      if (selectionStart !== selectionEnd) {
        // Wrap selected text in code block
        setMessage(`${beforeSelection}\`\`\`\n${selectedText}\n\`\`\`${afterSelection}`);
      } else {
        // Wrap entire message in code block
        setMessage(`\`\`\`\n${message}\n\`\`\``);
      }
    }
  };

  const handleSendMessage = async () => {
    if ((!message.trim() && !previewUrl) || isUploading) return;
    
    const messageContent = message.trim();
    const isCodeBlock = messageContent.startsWith('```') && messageContent.endsWith('```');
    
    try {
      setIsUploading(true);
      
      if (previewUrl && fileInputRef.current?.files?.[0]) {
        // Handle file upload with FormData
        const formData = new FormData();
        formData.append('attachment', fileInputRef.current.files[0]);
        if (messageContent) {
          formData.append('content', messageContent);
        }
        // Convert boolean to 1 or 0 for form data
        formData.append('is_code_block', isCodeBlock ? '1' : '0');
        
        const response = await fetch(route('deals.messages.store', { deal: deal.id }), {
          method: 'POST',
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': csrfToken,
            'Accept': 'application/json',
          },
          credentials: 'same-origin',
          body: formData,
        });

        const result = await response.json();
        
        if (!response.ok || result.status === 'error') {
          throw new Error(result.message || 'Failed to send message with attachment');
        }
        
        setMessages(prev => [...prev, result.message]);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setMessage('');
        setIsCodeBlock(false);
      } else if (messageContent) {
        // Handle text message with JSON
        const response = await fetch(route('deals.messages.store', { deal: deal.id }), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify({ 
            content: messageContent,
            is_code_block: isCodeBlock 
          }),
        });

        const result = await response.json();
        
        if (!response.ok || result.status === 'error') {
          throw new Error(result.message || 'Failed to send message');
        }
        
        setMessages(prev => [...prev, result.message]);
        setMessage('');
        setIsCodeBlock(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // For all file types, set a preview state (even for non-images)
    if (file.type.startsWith('image/')) {
      // For images, show image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // For non-image files, set a generic file preview
      setPreviewUrl('file');
      // Auto-upload the file if there's no message content
      if (!message.trim()) {
        handleSendMessage();
      }
    }
  };

  const removePreview = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return <FileText className="h-5 w-5" />;
    
    if (mimeType.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5" />;
    }
    
    if (mimeType.includes('pdf')) {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    
    if (mimeType.includes('word') || mimeType.includes('document')) {
      return <FileText className="h-5 w-5 text-blue-500" />;
    }
    
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
      return <FileText className="h-5 w-5 text-green-500" />;
    }
    
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number = 0) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleGoBack = () => {
    router.visit('/deals');
  };

  const handleAccept = () => {
    router.post(route('deals.accept', deal.id));
  };

  const handleReject = () => {
    if (confirm('Are you sure you want to reject this deal?')) {
      router.post(route('deals.reject', deal.id));
    }
  };

  const handleComplete = () => {
    if (confirm('Are you sure you want to mark this deal as completed?')) {
      router.post(route('deals.complete', deal.id));
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(route('deals.messages.destroy', { 
        deal: deal.id, 
        message: messageId 
      }), {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        },
        credentials: 'same-origin',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete message');
      }

      // Update local state to remove the message
      setMessages(prev => prev.filter(msg => msg?.id !== messageId));
      toast.success('Message deleted');
    } catch (error: any) {
      console.error('Error deleting message:', error);
      toast.error(error?.message || 'Failed to delete message');
    }
  };

  const handleReport = async () => {
    if (reportReason.trim() === '') return;
    router.post(route('deals.report', deal.id), { reason: reportReason });
  };

  const handleRate = () => {
    if (rating.trim() === '' || !ratingScore) return;
    router.post(route('deals.rate', deal.id), { 
      rating: rating,
      score: parseInt(ratingScore)
    });
  };

  const handleMouseDown = (e: MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = chatWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = startX.current - e.clientX;
      const maxWidth = Math.min(window.innerWidth - 200, 1000); // Maximum chat width of 800px
      const minWidth = 500; // Minimum chat width
      const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth.current + delta));
      setChatWidth(newWidth);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    
    document.addEventListener('mousemove', handleMouseMove as any);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove as any);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Add new useEffect for handling scrolling on messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800";
      case "reported":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'My Deals',
      href: '/deals',
    },
    {
      title: deal.swap.title,
      href: `/deals/${deal.id}`,
    },
  ];

  const partner = isInitiator ? deal.acceptor : deal.initiator;
  const hasRated = isInitiator ? deal.initiator_rating : deal.acceptor_rating;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Deal: ${deal.swap.title}`} />
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* Details Panel */}
        <div className="flex-1 overflow-y-auto min-w-[200px]">
          <Card className="h-full rounded-none border-l border-white/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
              <Button variant="ghost" size="icon" onClick={handleGoBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
                <h1 className="text-xl font-semibold truncate">{deal.swap.title}</h1>
              <Badge variant="outline" className={getStatusColor(deal.status)}>
                  {deal.status.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Badge>
            </div>

                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                  <AvatarImage src={partner.avatar || "/placeholder.svg"} alt={partner.name} />
                  <AvatarFallback>{partner.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                  <h2 className="font-semibold">{partner.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {isInitiator ? 'You initiated this deal' : 'You received this deal'}
                  </p>
                  </div>
                </div>
                
              <p className="text-sm mb-4">{deal.swap.description}</p>
                
                <div className="flex gap-2 mb-4">
                  <Badge variant="outline" className="bg-white/10 text-white/80">
                  Offering: {deal.swap.offering}
                  </Badge>
                  <Badge variant="outline" className="">
                  Seeking: {deal.swap.seeking}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                {deal.swap.tags.map((tag: { id: Key | null | undefined; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (
                  <Badge key={tag.id} variant="secondary" className="text-xs">
                    {tag.name}
                    </Badge>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Started: {formatDate(deal.swap.created_at)}</span>
                </div>
                  </div>
                  
              <Separator className="my-4" />
              
              <div className="space-y-3">
                {deal.status === "in_progress" && (
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium">Completion Status</h4>
                      <div className="flex items-center gap-2 text-sm">
                        <div className={`w-2 h-2 rounded-full ${deal.initiator_accepted ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <span>Initiator: {deal.initiator_accepted ? 'Accepted' : 'Pending'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className={`w-2 h-2 rounded-full ${deal.acceptor_accepted ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <span>Acceptor: {deal.acceptor_accepted ? 'Accepted' : 'Pending'}</span>
                      </div>
                    </div>

                    {((isInitiator && !deal.initiator_accepted) || (isAcceptor && !deal.acceptor_accepted)) && (
                      <Button 
                        className="w-full gap-2" 
                        onClick={handleComplete}
                      >
                      <CheckCircle className="h-4 w-4" />
                      Mark as Completed
                    </Button>
                  )}
                  
                    {!deal.initiator_accepted || !deal.acceptor_accepted ? (
                      <p className="text-sm text-muted-foreground text-center">
                        Waiting for the other party to accept completion
                      </p>
                    ) : null}
                  </div>
                )}
                
                {deal.status === "pending" && isAcceptor && (
                    <>
                    <Button className="w-full gap-2" onClick={handleAccept}>
                        <Handshake className="h-4 w-4" />
                        Accept Deal
                      </Button>
                    <Button variant="outline" className="w-full gap-2" onClick={handleReject}>
                        Decline Deal
                      </Button>
                    </>
                  )}
                  
                {deal.status === "pending" && isInitiator && (
                  <p className="text-sm text-muted-foreground text-center">
                    Waiting for {partner.name} to accept or decline the deal
                  </p>
                )}
                
                {deal.status === "completed" && !hasRated && (
                  <Dialog>
                    <DialogTrigger asChild>
                    <Button className="w-full gap-2">
                      Leave Feedback
                    </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Rate your experience</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Rating (1-5)</Label>
                          <Select value={ratingScore} onValueChange={setRatingScore}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a rating" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5].map((score) => (
                                <SelectItem key={score} value={score.toString()}>
                                  {score} {score === 1 ? 'star' : 'stars'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Your feedback</Label>
                          <Textarea
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            placeholder="Share your experience..."
                          />
                        </div>
                        <Button className="w-full" onClick={handleRate}>
                          Submit Rating
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                
                {deal.status === "completed" && hasRated && (
                  <p className="text-sm text-muted-foreground text-center">
                    You have already rated this deal
                  </p>
                )}
                
                {(deal.status === "in_progress" || deal.status === "completed") && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Report Issue
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Report an Issue</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Reason for reporting</Label>
                          <Textarea
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            placeholder="Please describe the issue..."
                          />
                        </div>
                        <Button className="w-full" onClick={handleReport}>
                          Submit Report
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                      )}
                
                <Button variant="outline" className="w-full" onClick={() => router.visit(route('swaps.show', deal.swap.id))}>
                  View Original Swap
                </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        {/* Chat Panel */}
        <div className="relative flex-shrink-0" style={{ width: chatWidth }}>
          <Card className="h-full rounded-none border-l border-white/5">
            {/* Profile Bar */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={partner.avatar || "/placeholder.svg"} alt={partner.name} />
                  <AvatarFallback>{partner.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{partner.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {isInitiator ? 'Deal Initiator' : 'Deal Acceptor'}
                  </p>
        </div>
        </div>
            </div>

            <CardContent className="p-4 h-[calc(100%-5rem)] flex flex-col">
              <div className="flex-1 space-y-4 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                    No messages yet. Start the conversation!
          </div>
                ) : (
                  [...messages] // Create a copy of the messages array
                    .filter((msg): msg is Message => Boolean(msg))
                    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) // Sort by date ascending
                    .map((msg) => {
                      console.log('Rendering message:', { 
                        id: msg.id, 
                        is_code_block: msg.is_code_block,
                        content: msg.content?.substring(0, 50) + '...' 
                      });
                      
                      // Check if the message was sent by the current user
                      const isCurrentUser = msg.user_id === auth.user.id;
                      const isCodeBlock = msg.is_code_block || (msg.content?.startsWith('```') && msg.content.endsWith('```'));
                      
                      return (
                        <div 
                          key={msg.id} 
                          className={`relative group flex ${isCurrentUser ? 'justify-end' : 'justify-start'} px-2`}
                        >
                          {isCurrentUser && (
                            <div key={`delete-${msg.id}`} className="absolute -left-8 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacts">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteMessage(msg.id);
                                }}
                                className="p-1.5 text-muted-foreground hover:text-destructive rounded-full hover:bg-muted transition-colors z-10"
                                title="Delete message"
                                style={{
                                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                  width: '24px',
                                  height: '24px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        <div 
                          className={`relative max-w-[80%] rounded-lg p-3 ${
                            isCurrentUser
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                          }`}
                        >
                          {msg.content && (
                            <div className="text-sm mb-2">
                              {isCodeBlock ? (
                                <div className="rounded-md overflow-hidden my-2">
                                  <div className="relative rounded-md overflow-hidden">
                                    <pre className="m-0 p-0">
                                      <SyntaxHighlighter 
                                        language="javascript"
                                        style={vscDarkPlus}
                                        customStyle={{
                                          margin: 0,
                                          padding: '1rem',
                                          fontSize: '0.875rem',
                                          lineHeight: '1.5',
                                          backgroundColor: '#1e1e1e',
                                          borderRadius: '0.375rem',
                                          whiteSpace: 'pre-wrap',
                                          wordBreak: 'break-word',
                                        }}
                                        codeTagProps={{
                                          style: {
                                            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                                            backgroundColor: 'transparent',
                                            display: 'block',
                                            overflowX: 'auto',
                                          },
                                        }}
                                        wrapLines={true}
                                        wrapLongLines={true}
                                        showLineNumbers={false}
                                      >
                                        {msg.content ? 
                                          msg.content
                                            .replace(/^```(?:[\s\S]*?\n)?|```$/g, '') // Remove code block markers
                                            .replace(/\t/g, '  ') // Convert tabs to 2 spaces
                                            .trim() // Remove extra whitespace
                                          : ''
                                        }
                                      </SyntaxHighlighter>
                                    </pre>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const code = msg.content
                                          ? msg.content
                                              .replace(/^```(?:[\s\S]*?\n)?|```$/g, '')
                                              .trim()
                                          : '';
                                        navigator.clipboard.writeText(code);
                                        toast.success('Code copied to clipboard');
                                      }}
                                      className="absolute top-2 right-2 p-1.5 rounded bg-gray-800/80 hover:bg-gray-700/80 transition-colors border border-gray-600/50 shadow-sm"
                                      title="Copy code"
                                    >
                                      <Copy className="h-3.5 w-3.5 text-gray-300" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                              )}
                            </div>
                          )}
                          
                          {msg.attachment_path && (
                            <div className={`mt-2 rounded-md overflow-hidden border ${
                              isCurrentUser ? 'border-white/20' : 'border-border'
                            }`}>
                              <a 
                                href={msg.attachment_path && msg.attachment_path.startsWith('http')
                                  ? msg.attachment_path
                                  : msg.attachment_path && `/storage/${msg.attachment_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 hover:bg-black/10 transition-colors"
                                download
                              >
                                <div className="flex-shrink-0">
                                  {getFileIcon(msg.mime_type || '')}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm truncate">
                                    {msg.attachment_name || 'Download file'}
                                  </p>
                                  {msg.mime_type && (
                                    <p className="text-xs opacity-70">
                                      {msg.mime_type.split('/')[1]?.toUpperCase() || 'FILE'}
                                      {msg.size && ` • ${formatFileSize(msg.size)}`}
                                    </p>
                                  )}
                                </div>
                                <Download className="h-4 w-4 flex-shrink-0" />
                              </a>
                              
                              {msg.is_image && (
                                <div className="relative">
                                  <img 
                                    src={msg.attachment_path.startsWith('http') ? msg.attachment_path : `/storage/${msg.attachment_path}`}
                                    alt={msg.attachment_name || 'Image attachment'}
                                    className="max-w-full max-h-64 object-contain mx-auto"
                                  />
                                </div>
                              )}
                              
                              {msg.mime_type?.startsWith('video/') && (
                                <div className="relative mt-2">
                                  <video
                                    controls
                                    className="max-w-full max-h-64 mx-auto rounded-md"
                                  >
                                    <source 
                                      src={msg.attachment_path.startsWith('http') ? msg.attachment_path : `/storage/swaps/videos/${msg.attachment_path.split('/').pop()}`}
                                      type={msg.mime_type}
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <p className={`text-xs mt-1 ${isCurrentUser ? 'opacity-80' : 'opacity-60'}`}>
                            {formatDate(msg.created_at)}
                          </p>
                        </div>
                  </div>
                    );
                  })
            )}
            <div ref={messagesEndRef} />
          </div>
          
              <div className="mt-4">
                {previewUrl && fileInputRef.current?.files?.[0] && (
                  <div className="relative mb-2 p-3 bg-muted/30 rounded-md border border-border">
                    <div className="flex items-start gap-3">
                      {/* Preview thumbnail */}
                      {previewUrl.startsWith('data:image/') ? (
                        <div className="flex-shrink-0">
                          <img 
                            src={previewUrl}
                            alt="Preview"
                            className="h-16 w-16 rounded-md object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-md bg-muted">
                          {getFileIcon(fileInputRef.current.files[0].type)}
                        </div>
                      )}
                      
                      {/* File info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {fileInputRef.current.files[0].name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {fileInputRef.current.files[0].type?.split('/')[1]?.toUpperCase() || 'FILE'}
                          {fileInputRef.current.files[0].size && (
                            <span> • {formatFileSize(fileInputRef.current.files[0].size)}</span>
                          )}
                        </p>
                        <div className="mt-2">
                          <Button 
                            type="button"
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={removePreview}
                          >
                            <X className="mr-1 h-3 w-3" /> Remove
                          </Button>
                        </div>
                      </div>
                      
                      {/* Close button */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={removePreview}
                        aria-label="Remove file"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <div className="relative flex-1 flex items-end gap-2">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type your message..."
                      className={`min-h-[80px] pr-24 resize-y ${isCodeBlockActive ? 'font-mono text-sm' : ''}`}
                      disabled={isUploading}
                    />
                    <div className="absolute right-2 bottom-2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleCodeBlock();
                          setIsCodeBlockActive(!isCodeBlockActive);
                        }}
                        className={`p-1.5 rounded-md ${
                          isCodeBlockActive 
                            ? 'bg-primary text-primary-foreground' 
                            : 'text-muted-foreground hover:bg-muted'
                        }`}
                        title="Code block"
                      >
                        <Code className="h-4 w-4" />
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        id="file-upload"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                      />
                      <label 
                        htmlFor="file-upload" 
                        className={`cursor-pointer p-1.5 rounded-md transition-colors ${
                          isUploading 
                            ? 'text-muted-foreground' 
                            : 'text-foreground hover:bg-muted'
                        }`}
                        title={isUploading ? 'Uploading...' : 'Attach file'}
                      >
                        {isUploading ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        ) : (
                          <Paperclip className="h-4 w-4" />
                        )}
                      </label>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleSendMessage()}
                    disabled={(!message.trim() && !previewUrl) || isUploading}
                    className="h-10 w-10 p-0 flex-shrink-0"
                    size="icon"
                  >
                    {isUploading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resizer */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50"
            onMouseDown={handleMouseDown}
          />
        </div>
      </div>
    </AppLayout>
  );
}