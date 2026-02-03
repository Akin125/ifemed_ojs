import { Suspense } from "react";
import { getAnnouncements, getLocalizedValue } from "@/lib/ojs";
import type { Announcement, OJSResponse } from "@/types/ojs";
import { SkeletonList } from "@/components/SkeletonLoader";

async function AnnouncementsList() {
  try {
    const data = await getAnnouncements(50, 0) as OJSResponse<Announcement>;
    
    if (!data.items || data.items.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600">No announcements found.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {data.items.map((announcement: Announcement) => (
          <article key={announcement.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-2">
              {getLocalizedValue(announcement.title)}
            </h2>
            
            {announcement.datePosted && (
              <p className="text-sm text-gray-500 mb-3">
                {new Date(announcement.datePosted).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
            
            {announcement.descriptionShort && (
              <p className="text-gray-700 mb-3">
                {getLocalizedValue(announcement.descriptionShort)}
              </p>
            )}
            
            {announcement.description && (
              <div className="prose max-w-none text-gray-700">
                {getLocalizedValue(announcement.description)}
              </div>
            )}
          </article>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading news. Please check your API configuration.</p>
      </div>
    );
  }
}

export default function NewsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">News & Announcements</h1>
      <Suspense fallback={<SkeletonList count={5} />}>
        <AnnouncementsList />
      </Suspense>
    </div>
  );
}
