import { PageHeader } from "@/components/ui/SectionHeading";
import { StoryCard } from "@/components/cards/StoryCard";
import { stories } from "@/data/stories";
import { contributors } from "@/data/contributors";
import { regions } from "@/data/regions";

export default function StoriesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Stories"
        title="Essays and field notes from Ethiopia"
        lede="Long-form writing connects geography, ritual and daily labour , the kind of context that maps alone cannot provide."
      />

      <div className="mx-auto max-w-shell px-4 py-10 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {stories.map((story) => (
            <StoryCard
              key={story.slug}
              story={story}
              author={contributors.find((person) => person.id === story.authorId)}
              regionName={regions.find((region) => region.slug === story.regionSlug)?.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
