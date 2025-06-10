import * as React from 'react';

declare module '@/components/icons' {
  export const Icons: {
    [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  };
}
