import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall }) {
  return (
    <button 
      onClick={handleVideoCall} 
      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 border border-emerald-500/50 backdrop-blur-sm"
    >
      <VideoIcon className="size-5" />
      <span>Video Call</span>
    </button>
  );
}

export default CallButton;