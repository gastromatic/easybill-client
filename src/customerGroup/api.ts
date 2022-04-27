import { Requestable } from '../base/Requestable';
import { ResultList } from '../base/ResultList';
import { CreateCustomerGroupParams, CustomerGroup, GetCustomersGroupListParams } from '../types';

export class CustomerGroupAPI extends Requestable {
  getCustomerGroupList(
    params: GetCustomersGroupListParams = { limit: 100, page: 1 },
  ): Promise<ResultList<CustomerGroup>> {
    return this.request<ResultList<CustomerGroup>>({
      method: 'GET',
      url: '/customer-groups',
      params,
    });
  }

  getCustomerGroup(customerGroupId: number): Promise<CustomerGroup> {
    return this.request<CustomerGroup>({
      method: 'GET',
      url: `/customer-groups/${customerGroupId}`,
    });
  }

  createCustomerGroup(data: CreateCustomerGroupParams): Promise<CustomerGroup> {
    return this.request<CustomerGroup>({
      method: 'POST',
      url: '/customer-groups',
      data,
    });
  }

  updateCustomerGroup(
    customerGroupId: number,
    data: CreateCustomerGroupParams,
  ): Promise<CustomerGroup> {
    return this.request<CustomerGroup>({
      method: 'PUT',
      url: `/customer-groups/${customerGroupId}`,
      data,
    });
  }

  deleteCustomerGroup(customerGroupId: number): Promise<void> {
    return this.request<void>({
      method: 'DELETE',
      url: `/customer-groups/${customerGroupId}`,
    });
  }
}
