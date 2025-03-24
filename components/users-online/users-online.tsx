import { Users } from "lucide-react";

export function UsersOnline() {
  return (
    <div className="flex items-center space-x-2 bg-purple-800/30 rounded-full px-3 py-1 border border-purple-700/30">
      <Users className="h-4 w-4 text-pink-400" />
      <span className="text-xs font-medium text-purple-100">90</span>
    </div>
  );
}
