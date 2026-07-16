// LiveFeed — real-time event feed for command center
// Thinzar Kyaw — Frontend Domain

import { MessageSquare } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface FeedItem {
  id: string;
  text: string;
  time: string;
}

interface LiveFeedProps {
  items: FeedItem[];
}

export const LiveFeed = ({ items }: LiveFeedProps) => {
  if (items.length === 0) return null;

  return (
    <div className="mx-4">
      <SectionHeader className="mb-3">Live Feed</SectionHeader>
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm divide-y divide-gray-100">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 px-4 py-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100">
              <MessageSquare className="h-3 w-3 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-vr-navy leading-snug">{item.text}</p>
              <p className="mt-0.5 text-xs text-gray-400">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
