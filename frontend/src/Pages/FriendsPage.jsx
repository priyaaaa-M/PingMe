import { useQuery } from "@tanstack/react-query";
import { getFriends } from "../lib/api";
import { UsersIcon, MessageSquareIcon } from "lucide-react";
import { Link } from "react-router-dom";

const FriendsPage = () => {
  const { data: friendsData = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
  });

  // Filter out null or invalid entries
  const friends = Array.isArray(friendsData)
    ? friendsData.filter((friend) => friend && friend._id)
    : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-transparent min-h-screen">
      <div className="container mx-auto max-w-4xl space-y-8">
        {/* Page Header */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6 text-emerald-500">
          Your Friends
        </h1>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg text-emerald-500"></span>
          </div>
        ) : friends.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">
              You don't have any friends yet. Start adding some!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {friends.map((friend) => (
              <div
                key={friend._id}
                className="bg-white/5 backdrop-blur-sm border-2 border-emerald-600/30 rounded-xl shadow-lg hover:shadow-xl hover:border-emerald-600/50 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full ring-4 ring-emerald-600/50 overflow-hidden bg-slate-700">
                          {friend.profilePic ? (
                            <img
                              src={friend.profilePic}
                              alt={friend.fullName || "User"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextElementSibling?.classList.remove("hidden");
                              }}
                            />
                          ) : null}
                          <div className={`w-full h-full bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center text-2xl font-bold ${friend.profilePic ? "hidden" : ""}`}>
                            {friend.fullName
                              ? friend.fullName[0].toUpperCase()
                              : "U"}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white">
                          {friend.fullName || "Unknown User"}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Native: {friend.nativeLanguage || "N/A"}
                          </span>
                          <span className="bg-transparent border-2 border-emerald-500 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold">
                            Learning: {friend.learningLanguage || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/chat/${friend._id}`}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                    >
                      <MessageSquareIcon className="h-4 w-4" />
                      Message
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
