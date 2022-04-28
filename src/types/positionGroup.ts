import { definitions, paths } from '../generated/types';

export type PositionGroup = definitions['PositionGroup'];
export type GetPositionGroupListParams = paths['/position-groups']['get']['parameters']['query'];
export type CreatePositionGroupParams =
  paths['/position-groups']['post']['parameters']['body']['body'];
