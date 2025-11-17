import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otherUserStatus, setOtherUserStatus] = useState("offline");
  const [isMobile, setIsMobile] = useState(false);
  const { authUser } = useAuthUser();
  const cleanupRef = useRef(null);

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  // Check mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    let isMounted = true;
    let client;
    let presenceListener;

    const initChat = async () => {
      if (!tokenData?.token || !authUser || !targetUserId) {
        return;
      }

      try {
        if (chatClient) {
          await chatClient.disconnectUser();
        }

        client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        if (!isMounted) return;

        const channelId = [authUser._id, targetUserId].sort().join("-");

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        const otherUserResponse = await client.queryUsers(
          { id: targetUserId },
          { id: 1, online: 1, name: 1 }
        );

        const otherUser = otherUserResponse.users[0];
        if (!otherUser) throw new Error("User not found");

        if (isMounted) {
          setOtherUserStatus(otherUser.online ? "online" : "offline");
        }

        const handlePresenceChange = (event) => {
          if (event.user.id === targetUserId && isMounted) {
            setOtherUserStatus(event.user.online ? "online" : "offline");
          }
        };

        client.on("user.presence.changed", handlePresenceChange);
        presenceListener = handlePresenceChange;

        await currChannel.watch();

        if (!isMounted) return;

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        if (isMounted) {
          toast.error("Could not connect to chat.");
          setLoading(false);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initChat();

    return () => {
      isMounted = false;
      const cleanup = async () => {
        if (chatClient) {
          try {
            if (presenceListener) {
              chatClient.off("user.presence.changed", presenceListener);
            }
            await chatClient.disconnectUser();
          } catch (err) {
            console.error("Cleanup error:", err);
          }
        }
      };
      cleanupRef.current = cleanup;
    };
  }, [tokenData, authUser, targetUserId]);

  useEffect(() => {
    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []);

  const handleVideoCall = useCallback(() => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });
      toast.success("Video call link sent!");
    }
  }, [channel]);

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh] w-full flex items-center justify-center bg-gradient-to-br from-black via-stone-900 to-black p-2 sm:p-4">
      {/* Main Chat Container */}
      <div className="w-full h-full max-w-7xl flex rounded-2xl overflow-hidden border border-emerald-600/30 bg-black/20 backdrop-blur-lg">
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-900/80 to-black/60 border-b border-emerald-700/30 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <img
                  src={channel.state.members[targetUserId]?.user?.image}
                  alt="User avatar"
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-emerald-500/50 object-cover"
                />
                <div>
                  <h2 className="text-white font-bold text-sm sm:text-base md:text-lg">
                    {channel.state.members[targetUserId]?.user?.name || "User"}
                  </h2>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                      otherUserStatus === "online" 
                        ? "bg-green-500 animate-pulse" 
                        : "bg-red-500"
                    }`} />
                    <span className="text-emerald-200 text-xs sm:text-sm capitalize">
                      {otherUserStatus}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="scale-75 sm:scale-90 md:scale-100">
                <CallButton handleVideoCall={handleVideoCall} />
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col min-h-0">
            <Chat client={chatClient}>
              <Channel channel={channel}>
                <div className="flex-1 flex h-full">
                  {/* Main Chat Window */}
                  <div className="flex-1 flex flex-col">
                    <Window>
                      <MessageList />
                      <MessageInput />
                    </Window>
                  </div>
                  
                  {/* Thread Sidebar - Automatically shows when thread is active */}
                  <div className={`${
                    isMobile ? 'hidden' : 'w-80 lg:w-96 xl:w-[500px]'
                  } border-l border-emerald-700/30`}>
                    <Thread />
                  </div>
                </div>
              </Channel>
            </Chat>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;