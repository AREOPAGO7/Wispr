interface PostMediaProps {
  image: string | null
  video: string | null
}

export function PostMedia({ image, video }: PostMediaProps) {
  if (!image && !video) return null

  const getImageUrl = (path: string | null) => {
    if (!path) return null
    return path.startsWith('http') ? path : `/storage/${path}`
  }

  return (
    <>
      {image && (
        <div className="rounded-md overflow-hidden border mb-3  max-w-3xl mx-auto">
          <img 
            src={getImageUrl(image) || "/placeholder.svg"} 
            alt="Skill swap visual" 
            className="w-full h-auto object-cover" 
          />
        </div>
      )}

      {video && (
        <div className="rounded-md overflow-hidden border mb-3 max-w-3xl mx-auto">
          <video
            controls
            className="w-full aspect-video bg-black"
            src={video.startsWith('http') ? video : `/storage/${video}`}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </>
  )
}