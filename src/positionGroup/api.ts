import { Requestable } from '../base/Requestable';
import { ResultList } from '../base/ResultList';
import { CreatePositionGroupParams, GetPositionGroupListParams, PositionGroup } from '../types';

export class PositionGroupAPI extends Requestable {
  getPositionGroupList(
    params: GetPositionGroupListParams = { limit: 100, page: 1 },
  ): Promise<ResultList<PositionGroup>> {
    return this.request<ResultList<PositionGroup>>({
      method: 'GET',
      url: '/position-groups',
      params,
    });
  }

  getPositionGroup(positionGroupId: number): Promise<PositionGroup> {
    return this.request<PositionGroup>({
      method: 'GET',
      url: `/position-groups/${positionGroupId}`,
    });
  }

  createPositionGroup(data: CreatePositionGroupParams): Promise<PositionGroup> {
    return this.request<PositionGroup>({
      method: 'POST',
      url: '/position-groups',
      data,
    });
  }

  updatePositionGroup(
    positionGroupId: number,
    data: CreatePositionGroupParams,
  ): Promise<PositionGroup> {
    return this.request<PositionGroup>({
      method: 'PUT',
      url: `/position-groups/${positionGroupId}`,
      data,
    });
  }

  deletePositionGroup(positionGroupId: number): Promise<void> {
    return this.request<void>({
      method: 'DELETE',
      url: `/position-groups/${positionGroupId}`,
    });
  }
}
