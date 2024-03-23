import type { DomainSpecificApiClientInterface } from '../../../lib/api/DomainSpecificApiClientInterface';
import { apiClient } from '../../../lib/api/apiClient';

export type GetFooterTextResponse = { text: string };

type FooterApiClient = DomainSpecificApiClientInterface<{
  fetch: [{ type: string }, GetFooterTextResponse];
}>;

export const footerApiClient: FooterApiClient = {
  fetch: async ({ type }) => {
    const response = await apiClient.get<GetFooterTextResponse>(`/assets/text/${type}.json`);
    return response.data;
  },
  fetch$$key: (options) => ({
    requestUrl: `/assets/text/${options.type}.json`,
    ...options,
  }),
};
