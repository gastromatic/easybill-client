import { Requestable } from '../base/Requestable';
import { ResultList } from '../base/ResultList';
import { CreatePositionParams, GetPositionListParams, Position } from '../types';

export class PositionAPI extends Requestable {
  getPositionList(
    params: GetPositionListParams = { limit: 100, page: 1 },
  ): Promise<ResultList<Position>> {
    return this.request<ResultList<Position>>({
      method: 'GET',
      url: '/positions',
      params,
    });
  }

  getPosition(positionId: number): Promise<Position> {
    return this.request<Position>({
      method: 'GET',
      url: `/positions/${positionId}`,
    });
  }

  createPosition(data: CreatePositionParams): Promise<Position> {
    return this.request<Position>({
      method: 'POST',
      url: '/positions',
      data,
    });
  }

  updatePosition(positionId: number, data: CreatePositionParams): Promise<Position> {
    return this.request<Position>({
      method: 'PUT',
      url: `/positions/${positionId}`,
      data,
    });
  }

  deletePosition(positionId: number): Promise<void> {
    return this.request<void>({
      method: 'DELETE',
      url: `/positions/${positionId}`,
    });
  }
}
