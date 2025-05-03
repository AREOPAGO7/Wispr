interface PostMediaProps {
    image: string | null
    video: string | null
  }
  
  export function PostMedia({ image, video }: PostMediaProps) {
    if (!image && !video) return (
      <div className="rounded-md overflow-hidden border mb-3">
        <div className="w-full h-[300px] bg-muted flex items-center justify-center">
          <span className="text-muted-foreground">No media</span>
        </div>
      </div>
    )
  
    return (
      <>
        {image && (
          <div className="rounded-md overflow-hidden border-1 mb-3">
            <img src={image} alt="" className="w-full h-[300px] object-cover" />
          </div>
        )}
  
        {video && (
          <div className="rounded-md overflow-hidden border mb-3">
            <div className="w-full h-[300px] bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">Video: {video}</span>
            </div>
          </div>
        )}
      </>
    )
  }
  