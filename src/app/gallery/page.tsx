import { PageHeader } from "@/components/ui/SectionHeading";
import { MediaCard } from "@/components/cards/MediaCard";
import { listContributors, listMedia } from "@/lib/data/queries";

export default async function GalleryPage() {
  const [{ items: media, source }, { items: contributors }] = await Promise.all([
    listMedia(),
    listContributors(),
  ]);

  return (
    <div>
      <PageHeader
        eyebrow="Gallery"
        title="Photo and video records"
        lede={`The gallery brings together ${source === "supabase" ? "published community uploads and curated records" : "curated records and generated placeholders"} from across the atlas.`}
      />

      <div className="mx-auto max-w-shell px-4 py-10 sm:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {media.map((item) => (
            <MediaCard
              key={item.slug}
              item={item}
              author={contributors.find((person) => person.id === item.authorId)}
              showMeta
            />
          ))}
        </div>
      </div>
    </div>
  );
}
