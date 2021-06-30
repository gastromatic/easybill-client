import { definitions, paths } from '../generated/types';

export type Customer = definitions['Customer'];
export type GetCustomersListParams = paths['/customers']['get']['parameters']['query'];
export type CreateCustomerParams = paths['/customers']['post']['parameters']['body']['body'];
