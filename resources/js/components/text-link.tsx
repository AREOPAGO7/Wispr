
import { HTMLAttributes } from 'react';
import { Link } from '@inertiajs/react';

interface TextLinkProps extends HTMLAttributes<HTMLAnchorElement> {
    href: string;
}

export function TextLink({ href, children, className = '', ...props }: TextLinkProps) {
    return (
        <Link
            href={href}
            className={`text-primary hover:text-primary/80 transition-colors ${className}`}
            {...props as any}
        >
            {children}
        </Link>
    );
} 