import { LoaderIcon } from "lucide-react";

function ChatLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-900 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <LoaderIcon className="animate-spin size-12 text-emerald-400" />
        </div>
        <p className="text-emerald-200 text-lg font-medium">Connecting to chat...</p>
        <p className="text-emerald-400 text-sm mt-2">Please wait while we establish your connection</p>
      </div>
    </div>
  );
}

export default ChatLoader;