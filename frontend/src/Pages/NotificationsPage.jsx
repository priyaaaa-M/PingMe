import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from "lucide-react";
import NoNotificationsFound from "../components/NoFriendsFound";
import { useState, useEffect } from "react";

const FlowerRain = ({ show, onComplete }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  const flowers = ['🌸', '🌺', '🌼', '🌻', '🌷', '🏵️'];
  const raindrops = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    flower: flowers[Math.floor(Math.random() * flowers.length)],
    left: Math.random() * 100,
    delay: Math.random() * 0.3,
    duration: 0.8 + Math.random() * 0.4
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {raindrops.map((drop) => (
        <div
          key={drop.id}
          className="absolute text-2xl animate-fall"
          style={{
            left: `${drop.left}%`,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
            top: '-50px'
          }}
        >
          {drop.flower}
        </div>
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>
    </div>
  );
};

const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const [showFlowerRain, setShowFlowerRain] = useState(false);
  const [processingRequests, setProcessingRequests] = useState(new Set());

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation } = useMutation({
    mutationFn: acceptFriendRequest,
    onMutate: (requestId) => {
      // Add request to processing set when mutation starts
      setProcessingRequests(prev => new Set(prev).add(requestId));
    },
    onSuccess: (data, requestId) => {
      setShowFlowerRain(true);
      // Remove request from processing set when done
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
    onError: (error, requestId) => {
      console.error('Error accepting friend request:', error);
      // Remove request from processing set on error
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-transparent min-h-screen">
      <FlowerRain show={showFlowerRain} onComplete={() => setShowFlowerRain(false)} />
      
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6 text-orange-600">Notifications</h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg text-orange-600"></span>
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2 text-orange-600">
                  <UserCheckIcon className="h-5 w-5 text-orange-600" />
                  Friend Requests
                  <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm ml-2">
                    {incomingRequests.length}
                  </span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((request) => {
                    // console.log('Request object:', request);
                    // console.log('Sender data:', request.sender);
                    // console.log('Profile picture URL:', request.sender?.profilePic);
                    
                    return (
                      <div
                        key={request._id}
                        className="bg-white/5 backdrop-blur-sm border-2 border-orange-600/30 rounded-xl shadow-lg hover:shadow-xl hover:border-orange-600/50 transition-all duration-300 hover:scale-[1.02]"
                      >
                        <div className="p-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="w-16 h-16 rounded-full ring-4 ring-orange-600/50 overflow-hidden bg-slate-700">
                                  <img 
                                    src={request.sender?.profilePic} 
                                    alt={request.sender?.fullName || 'User'} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextElementSibling?.classList.remove('hidden');
                                    }}
                                  />
                                  <div className="w-full h-full bg-gradient-to-br from-orange-600 to-red-600 text-white flex items-center justify-center text-2xl font-bold hidden">
                                    {request.sender?.fullName ? request.sender.fullName[0].toUpperCase() : 'U'}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h3 className="font-bold text-lg text-white">{request.sender?.fullName || 'Unknown User'}</h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                    Native: {request.sender?.nativeLanguage || 'N/A'}
                                  </span>
                                  <span className="bg-transparent border-2 border-orange-500 text-orange-400 px-3 py-1 rounded-full text-xs font-semibold">
                                    Learning: {request.sender?.learningLanguage || 'N/A'}
                                  </span>
                                </div>
                              </div>
                            </div>

                           <button
  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  onClick={(e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!processingRequests.has(request._id)) {
      console.log('Accepting friend request with ID:', request._id);
      acceptRequestMutation(request._id);
    }
  }}
  disabled={processingRequests.has(request._id)}
>
  {processingRequests.has(request._id) ? 'Accepting...' : 'Accept'}
</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ACCEPTED REQS NOTIFICATIONS */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2 text-green-400">
                  <BellIcon className="h-5 w-5 text-green-400" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((notification) => (
                    <div key={notification._id} className="bg-white/5 backdrop-blur-sm border-2 border-green-500/30 rounded-xl shadow-lg hover:border-green-500/50 transition-all">
                      <div className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full ring-4 ring-green-500/50 overflow-hidden mt-1">
                            <img
                              src={notification.recipient.profilePic}
                              alt={notification.recipient.fullName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-white">{notification.recipient.fullName}</h3>
                            <p className="text-sm my-1 text-gray-300">
                              {notification.recipient.fullName} accepted your friend request
                            </p>
                            <p className="text-xs flex items-center text-gray-400">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              Recently
                            </p>
                          </div>
                          <div className="bg-green-600 text-white px-3 py-1.5 rounded-full flex items-center gap-1 text-sm font-semibold">
                            <MessageSquareIcon className="h-3 w-3" />
                            New Friend
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default NotificationsPage;