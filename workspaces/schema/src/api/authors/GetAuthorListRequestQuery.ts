import { z } from 'zod';

export const GetAuthorListRequestQuerySchema = z.object({
  id: z.string().optional(),
  limit: z.coerce.number().optional(),
  name: z.string().optional(),
  offset: z.coerce.number().optional(),
});

export type GetAuthorListRequestQuery = z.infer<typeof GetAuthorListRequestQuerySchema>;
