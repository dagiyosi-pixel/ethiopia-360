import { PageHeader } from "@/components/ui/SectionHeading";
import { MediaCard } from "@/components/cards/MediaCard";
import { media } from "@/data/media";
import { contributors } from "@/data/contributors";

export default function GalleryPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Gallery"
        title="Photo and video records"
        lede="The gallery brings together uploaded media and generated placeholders for the visual archive."
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
