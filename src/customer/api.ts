import { Requestable } from '../base/Requestable';
import { ResultList } from '../base/ResultList';
import { CreateCustomerParams, Customer, GetCustomersListParams } from '../types';

export class CustomerAPI extends Requestable {
  getCustomersList(
    params: GetCustomersListParams = { limit: 100, page: 1 },
  ): Promise<ResultList<Customer>> {
    return this.request<ResultList<Customer>>({
      method: 'GET',
      url: '/customers',
      params,
    });
  }

  getCustomer(customerId: number): Promise<Customer> {
    return this.request<Customer>({
      method: 'GET',
      url: `/customers/${customerId}`,
    });
  }

  createCustomer(data: CreateCustomerParams): Promise<Customer> {
    return this.request<Customer>({
      method: 'POST',
      url: '/customers',
      data,
    });
  }

  updateCustomer(customerId: number, data: CreateCustomerParams): Promise<Customer> {
    return this.request<Customer>({
      method: 'PUT',
      url: `/customers/${customerId}`,
      data,
    });
  }

  deleteCustomer(customerId: number): Promise<void> {
    return this.request<void>({
      method: 'DELETE',
      url: `/customers/${customerId}`,
    });
  }
}
