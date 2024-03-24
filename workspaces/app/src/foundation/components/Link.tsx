import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
  to?: string;
} & JSX.IntrinsicElements['a'];

export const Link = forwardRef<HTMLAnchorElement, Props>(({ children, to, ...rest }, ref) => {
  if (to == null) {
    return (
      <a ref={ref} {...rest}>
        {children}
      </a>
    );
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <RouterLink ref={ref as any} to={to} {...rest}>
      {children}
    </RouterLink>
  );
});
