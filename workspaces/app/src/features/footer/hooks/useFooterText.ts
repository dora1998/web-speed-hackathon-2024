import useSWR from 'swr';

import { footerApiClient } from '../apiClient/footerApiClient';

export function useFooterText(...[options]: Parameters<typeof footerApiClient.fetch>) {
  return useSWR(footerApiClient.fetch$$key(options), footerApiClient.fetch, { suspense: true });
}
