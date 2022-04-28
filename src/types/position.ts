import { definitions, paths } from '../generated/types';

export type Position = definitions['Position'];
export type GetPositionListParams = paths['/positions']['get']['parameters']['query'];
export type CreatePositionParams = paths['/positions']['post']['parameters']['body']['body'];
