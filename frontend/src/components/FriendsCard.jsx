import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";
import { MessageCircleIcon, MapPinIcon } from "lucide-react";
import { capitialize } from "../lib/untils";

const FriendsCard = ({ friend }) => {
  return (
    <div className="group bg-slate-800/30 border border-slate-700 rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm w-full">
      
      {/* User Header */}
      <div className="flex items-start gap-4 mb-4">
        <img
          src={friend.profilePic || "/default-avatar.png"}
          alt={friend.fullName}
          className="size-14 rounded-full object-cover ring-2 ring-emerald-500/50 group-hover:ring-emerald-400 transition-all duration-300"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-lg truncate">{friend.fullName}</h3>
          {friend.location && (
            <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
              <MapPinIcon className="size-3.5" />
              <span className="truncate">{friend.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Compact Languages Section */}
      <div className="space-y-3 mb-4">
        {/* Languages - More Compact */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 flex-1 bg-emerald-500/10 px-2 py-1.5 rounded-lg min-w-0">
            {getLanguageFlag(friend.nativeLanguage)}
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-emerald-400 font-medium truncate">Native</p>
              <p className="text-xs font-semibold text-white truncate">{capitialize(friend.nativeLanguage)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-1 bg-slate-700/50 px-2 py-1.5 rounded-lg min-w-0">
            {getLanguageFlag(friend.learningLanguage)}
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-slate-400 font-medium truncate">Learning</p>
              <p className="text-xs font-semibold text-white truncate">{capitialize(friend.learningLanguage)}</p>
            </div>
          </div>
        </div>

        {/* Bio - Compact */}
        {friend.bio && (
          <div className="bg-slate-700/30 rounded-lg p-2 border border-slate-600/50">
            <p className="text-slate-300 text-xs leading-relaxed line-clamp-2">{friend.bio}</p>
          </div>
        )}
      </div>

      {/* Message Button */}
      <Link 
        to={`/chat/${friend._id}`} 
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all duration-200 active:scale-95 text-sm"
      >
        <MessageCircleIcon className="size-3.5" />
        Message
      </Link>
    </div>
  );
};

export default FriendsCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/16x12/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-0.5 inline-block object-cover rounded-sm flex-shrink-0"
      />
    );
  }
  return null;
}