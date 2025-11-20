import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
  SparklesIcon,
} from "lucide-react";

import { capitialize } from "../lib/untils";

import FriendsCard, { getLanguageFlag } from "../components/FriendsCard";
import NoFriendsFound from "../components/NoFriendsFound";
import FloatingSmile from "../components/FloatingSmile";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const [loadingStates, setLoadingStates] = useState({});

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { 
    data: recommendedData, 
    isLoading: loadingUsers, 
    error: recommendedUsersError,
    isError: hasRecommendedUsersError
  } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Ensure recommendedUsers is always an array and filter out any null/undefined users
  const safeRecommendedUsers = useMemo(() => {
    if (!recommendedData) return [];
    const users = Array.isArray(recommendedData) 
      ? recommendedData 
      : Array.isArray(recommendedData?.users) 
        ? recommendedData.users 
        : [];
    return users.filter(user => user?._id); // Only include users with valid _id
  }, [recommendedData]);

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation } = useMutation({
    mutationFn: async (userId) => {
      setLoadingStates((prev) => ({ ...prev, [userId]: true }));
      try {
        const result = await sendFriendRequest(userId);
        return result;
      } finally {
        setLoadingStates((prev) => ({ ...prev, [userId]: false }));
      }
    },
    onSuccess: (data, userId) => {
      setOutgoingRequestsIds((prev) => new Set(prev).add(userId));
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
    },
  });

  useEffect(() => {
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      const newOutgoingIds = new Set(
        outgoingFriendReqs.map((req) => req.recipient._id)
      );
      setOutgoingRequestsIds(newOutgoingIds);
    } else if (outgoingFriendReqs && outgoingFriendReqs.length === 0) {
      setOutgoingRequestsIds(new Set());
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900 p-6">
      <FloatingSmile />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Friends Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Your Friends</h2>
              <p className="text-slate-400 mt-1">
                Connect and practice languages together
              </p>
            </div>
            <Link
              to="/notifications"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors duration-200 font-medium"
            >
              <UsersIcon className="size-4" />
              Friend Requests
            </Link>
          </div>

          // In Home.jsx, update the friends section:
{loadingFriends ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(4)].map((_, i) => (
      <FriendsCard key={`loading-${i}`} isLoading />
    ))}
  </div>
) : Array.isArray(friends) && friends.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {friends
      .filter(friend => friend?._id) // Filter out invalid friends
      .map((friend) => (
        <FriendsCard key={friend._id} friend={friend} />
      ))}
  </div>
) : (
  <NoFriendsFound />
)}
        </section>

        {/* Recommended Users Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <SparklesIcon className="size-6 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Recommended Users
              </h2>
              <p className="text-slate-400 mt-1">
                Discover perfect language exchange partners based on your
                preferences and interests.
              </p>
            </div>
          </div>

          {hasRecommendedUsersError ? (
            <div className="text-center py-6 text-red-400">
              Failed to load recommended users. {recommendedUsersError?.message || 'Please try again later.'}
            </div>
          ) : loadingUsers ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full size-8 border-2 border-emerald-500 border-t-transparent"></div>
            </div>
          ) : safeRecommendedUsers.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-slate-700">
              <UsersIcon className="size-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">
                No recommended users found
              </h3>
              <p className="text-slate-500">
                Try again later or adjust your preferences
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {safeRecommendedUsers
                .filter(user => user != null) // Remove any null/undefined users
                .map((user) => {
                  if (!user?._id) return null; // Additional safety check
                  const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                  const isLoading = loadingStates[user._id] || false;

                  return (
                    <div
                      key={user._id || `user-${Math.random().toString(36).substr(2, 9)}`}
                      className="group bg-slate-800/30 border border-slate-700 rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={user?.profilePic || "/default-avatar.png"}
                          alt={user?.fullName || 'User'}
                          className="size-14 rounded-full object-cover ring-2 ring-emerald-500/50 group-hover:ring-emerald-400 transition-all duration-300"
                        />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-lg truncate">
                          {user?.fullName || 'Anonymous User'}
                        </h3>
                        {user?.location && (
                          <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
                            <MapPinIcon className="size-3.5" />
                            <span className="truncate">{user.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                      <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 flex-1 bg-emerald-500/10 px-3 py-2 rounded-lg">
                          {user?.nativeLanguage && getLanguageFlag(user.nativeLanguage)}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-emerald-400 font-medium">
                              Native
                            </p>
                            <p className="text-sm font-semibold text-white truncate">
                              {capitialize(user.nativeLanguage)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-1 bg-slate-700/50 px-3 py-2 rounded-lg">
                          {user?.learningLanguage && getLanguageFlag(user.learningLanguage)}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-slate-400 font-medium">
                              Learning
                            </p>
                            <p className="text-sm font-semibold text-white truncate">
                              {capitialize(user.learningLanguage)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {user.bio && (
                        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50">
                          <p className="text-slate-300 text-sm leading-relaxed">
                            {user.bio}
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => sendRequestMutation(user._id)}
                      disabled={hasRequestBeenSent || isLoading}
                      className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                        hasRequestBeenSent
                          ? "bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600"
                          : "bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95"
                      } ${isLoading ? "animate-pulse opacity-80" : ""}`}
                    >
                      {hasRequestBeenSent ? (
                        <>
                          <CheckCircleIcon className="size-4" />
                          Request Sent
                        </>
                      ) : (
                        <>
                          <UserPlusIcon className="size-4" />
                          {isLoading ? "Sending..." : "Send Friend Request"}
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;