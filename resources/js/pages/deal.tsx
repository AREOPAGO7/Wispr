import { useState, useRef, useEffect, MouseEvent } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Calendar, CheckCircle, Send, ArrowLeft, MoreHorizontal, Handshake, AlertTriangle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Echo from 'laravel-echo';
import axios from 'axios';

interface DealProps {
  deal: {
    id: number;
    status: 'pending' | 'in_progress' | 'completed' | 'reported';
    initiator_accepted: boolean;
    acceptor_accepted: boolean;
    swap: {
      id: number;
      title: string;
      description: string;
      offering: string;
      seeking: string;
      tags: Array<{
        id: number;
        name: string;
        created_at: string;
        updated_at: string;
        pivot: {
          swap_id: number;
          tag_id: number;
        };
      }>;
      created_at: string;
    };
    initiator: {
      id: number;
      name: string;
      avatar: string | null;
    };
    acceptor: {
      id: number;
      name: string;
      avatar: string | null;
    };
    initiator_rating?: string;
    acceptor_rating?: string;
    initiator_rating_score?: number;
    acceptor_rating_score?: number;
    report_reason?: string;
  };
  isInitiator: boolean;
  isAcceptor: boolean;
}

interface Message {
  id: number;
  content: string;
  user_id: number;
  created_at: string;
  user: {
    id: number;
    name: string;
    avatar: string | null;
  };
}

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

export default function Deal({ deal, isInitiator, isAcceptor }: DealProps) {
  console.log('Deal props:', { deal, isInitiator, isAcceptor });
  
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesRef = useRef<Message[]>([]);  // Add this ref to track messages
  const [message, setMessage] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [rating, setRating] = useState('');
  const [ratingScore, setRatingScore] = useState('');
  const [chatWidth, setChatWidth] = useState(() => typeof window !== 'undefined' ? Math.floor(window.innerWidth / 2) : 400);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  
  // Update messagesRef when messages state changes
  useEffect(() => {
    console.log('Messages state updated:', messages);
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    // Load initial messages
    axios.get(route('deals.messages.index', deal.id))
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

  const handleSendMessage = () => {
    if (message.trim() === '') return;

    // Create a temporary message object with the correct user info
    const currentUserId = isInitiator ? deal.initiator.id : deal.acceptor.id;
    const currentUser = isInitiator ? deal.initiator : deal.acceptor;
    
    const tempMessage: Message = {
      id: Date.now(), // temporary ID
      content: message,
      user_id: currentUserId,
      created_at: new Date().toISOString(),
      user: currentUser
    };

    // Update UI immediately with the temporary message
    setMessages(prev => [...prev, tempMessage]);
    setMessage('');

    // Send to server
    axios.post(route('deals.messages.store', deal.id), {
      content: message
    }).then(response => {
      if (response.data?.message) {
        // Replace temporary message with the real one from server
        setMessages(prev => 
          prev.map(msg => 
            msg?.id === tempMessage.id ? response.data.message : msg
          ).filter(Boolean) // Remove any undefined messages
        );
      }
    }).catch(error => {
      console.error('Failed to send message:', error);
      // Remove the temporary message if sending failed
      setMessages(prev => prev.filter(msg => msg?.id !== tempMessage.id));
    });
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

  const handleReport = () => {
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
                  {deal.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
                {deal.swap.tags.map((tag) => (
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
                  messages.filter(Boolean).map((msg) => {
                    if (!msg) return null;
                    
                    const currentUserId = isInitiator ? deal.initiator.id : deal.acceptor.id;
                    const isCurrentUser = msg.user_id === currentUserId;
                    
                    return (
                <div 
                  key={msg.id} 
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                        <div className={`max-w-[80%] rounded-lg p-3 ${
                          isCurrentUser
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {formatDate(msg.created_at)}
                      </p>
                    </div>
                  </div>
                    );
                  })
            )}
            <div ref={messagesEndRef} />
          </div>
          
              <div className="mt-4 flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1"
              />
                <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
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