import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";
import { MessageCircleIcon, MapPinIcon } from "lucide-react";
import { capitialize } from "../lib/untils";

const FriendsCard = ({ friend, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 animate-pulse">
        <div className="flex items-start gap-4">
          <div className="size-14 rounded-full bg-slate-700" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-slate-700 rounded w-3/4" />
            <div className="h-4 bg-slate-700 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!friend) return null;

  const {
    profilePic = "/default-avatar.png",
    fullName = "Anonymous User",
    location,
    nativeLanguage,
    learningLanguage,
    bio,
  } = friend;

  return (
    <div className="group bg-slate-800/30 border border-slate-700 rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm w-full">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <img
          src={profilePic}
          alt={fullName}
          className="size-14 rounded-full object-cover ring-2 ring-emerald-500/50 group-hover:ring-emerald-400 transition-all duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-avatar.png";
          }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-lg truncate">
            {fullName}
          </h3>

          {location && (
            <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
              <MapPinIcon className="size-3.5" />
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Languages */}
      <div className="space-y-3 mb-4">
        <div className="flex flex-wrap gap-1.5">
          {nativeLanguage && (
            <span className="badge badge-secondary flex items-center gap-1">
              {getLanguageFlag(nativeLanguage)}
              Native: {capitialize(nativeLanguage)}
            </span>
          )}

          {learningLanguage && (
            <span className="badge badge-outline flex items-center gap-1">
              {getLanguageFlag(learningLanguage)}
              Learning: {capitialize(learningLanguage)}
            </span>
          )}
        </div>

        {bio && (
          <div className="bg-slate-700/30 rounded-lg p-2 border border-slate-600/50">
            <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">
              {bio}
            </p>
          </div>
        )}
      </div>

      {/* Message Button */}
      <div className="flex gap-2">
        <Link
          to={`/chat/${friend._id}`}
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
        >
          <MessageCircleIcon className="size-4" />
          Message
        </Link>
      </div>
    </div>
  );
};

/* ---------------------------------------------------
   FIXED FLAG FUNCTION — works on Render, Web, Mobile
-----------------------------------------------------*/
export const getLanguageFlag = (language) => {
  if (!language) return null;

  const lang = language.toLowerCase().trim();
  const code = LANGUAGE_TO_FLAG[lang];

  if (!code) return null;

  return (
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt={language}
      width={18}
      height={18}
      className="inline-block mr-1 rounded-sm"
    />
  );
};

export default FriendsCard;
