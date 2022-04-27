import { definitions, paths } from '../generated/types';

export type CustomerGroup = definitions['CustomerGroup'];
export type GetCustomersGroupListParams = paths['/customer-groups']['get']['parameters']['query'];
export type CreateCustomerGroupParams =
  paths['/customer-groups']['post']['parameters']['body']['body'];
