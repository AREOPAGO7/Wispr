import { LucideIcon } from 'lucide-react';
import { HTMLAttributes } from 'react';

interface IconProps extends HTMLAttributes<HTMLDivElement> {
    icon: LucideIcon;
    size?: number;
}

export function Icon({ icon: Icon, size = 20, className = '', ...props }: IconProps) {
    return <Icon className={className} size={size} {...props} />;
} 