import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ArticleCard = ({
  imgSrc,
  title,
  description,
}: {
  imgSrc: string;
  title: string;
  description: string;
}) => {
  return (
    <Link
      href="/blog/integrating-stockfish-nnue"
      className="group block"
    >
      <article className="grid grid-cols-1 items-center gap-6 rounded-2xl border border-(--hairline) bg-background p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:grid-cols-2 md:p-5">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden rounded-xl">
          <Image
            src={imgSrc}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="flex h-full flex-col justify-center">
          <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl">
            {title}
          </h2>

          <p className="mt-3 text-sm text-pretty text-(--ink-mute) leading-relaxed text-muted-foreground md:text-base">
            {description}
          </p>

          <div className="mt-5 flex justify-end">
            <div className="flex items-center gap-2 font-medium">
              <span>Read Article</span>

              <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ArticleCard;