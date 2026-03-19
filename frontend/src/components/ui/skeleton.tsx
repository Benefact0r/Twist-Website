import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

interface ImageSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: 'square' | '3/4' | '4/3' | '16/9';
}

function ImageSkeleton({ className, aspectRatio = 'square', ...props }: ImageSkeletonProps) {
  const aspectClass = {
    'square': 'aspect-square',
    '3/4': 'aspect-[3/4]',
    '4/3': 'aspect-[4/3]',
    '16/9': 'aspect-video',
  }[aspectRatio];

  return (
    <div 
      className={cn(
        "skeleton rounded-xl overflow-hidden", 
        aspectClass,
        className
      )} 
      {...props} 
    />
  );
}

export { Skeleton, ImageSkeleton };
