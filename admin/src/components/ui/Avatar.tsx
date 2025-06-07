interface AvatarProps {
  name: string;
  image?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ name, image, size = 'md' }: AvatarProps) {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  return (
    <div
      className={`${sizeClasses[size]} relative rounded-full overflow-hidden flex items-center justify-center bg-gray-700 text-gray-200`}
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-medium">{initials}</span>
      )}
    </div>
  );
}
