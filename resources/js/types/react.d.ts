import 'react';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Add any additional HTML attributes you need here
    class?: string;
    style?: React.CSSProperties;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Add any custom elements here
      [elemName: string]: any;
    }
  }
}
