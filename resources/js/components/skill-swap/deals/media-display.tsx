interface MediaDisplayProps {
    image: string | null
    video: string | null
  }
  
  export function MediaDisplay({ image, video }: MediaDisplayProps) {
    if (!image && !video) return null
  
    return (
      <>
        {image && (
          <div className="rounded-md overflow-hidden border mb-3">
            <img src={image || "/placeholder.svg"} alt="Skill swap visual" className="w-full h-auto object-cover" />
          </div>
        )}
  
        {video && (
          <div className="rounded-md overflow-hidden border mb-3">
            <div className="aspect-video bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">Video: {video}</span>
            </div>
          </div>
        )}
      </>
    )
  }
  