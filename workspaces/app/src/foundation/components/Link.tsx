import { forwardRef } from 'react';

type Props = {
  children: React.ReactNode;
  to?: string;
} & JSX.IntrinsicElements['a'];

export const Link = forwardRef<HTMLAnchorElement, Props>(({ children, to, ...rest }, ref) => {
  return (
    <a ref={ref} href={to} {...rest}>
      {children}
    </a>
  );
});
