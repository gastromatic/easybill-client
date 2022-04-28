import { Requestable } from '../base/Requestable';
import { ResultList } from '../base/ResultList';
import { CreateTaskParams, GetTaskListParams, Task } from '../types';

export class TaskAPI extends Requestable {
  getTaskList(params: GetTaskListParams = { limit: 100, page: 1 }): Promise<ResultList<Task>> {
    return this.request<ResultList<Task>>({
      method: 'GET',
      url: '/tasks',
      params,
    });
  }

  getTask(taskId: number): Promise<Task> {
    return this.request<Task>({
      method: 'GET',
      url: `/tasks/${taskId}`,
    });
  }

  createTask(data: CreateTaskParams): Promise<Task> {
    return this.request<Task>({
      method: 'POST',
      url: '/tasks',
      data,
    });
  }

  updateTask(taskId: number, data: CreateTaskParams): Promise<Task> {
    return this.request<Task>({
      method: 'PUT',
      url: `/tasks/${taskId}`,
      data,
    });
  }

  deleteTask(taskId: number): Promise<void> {
    return this.request<void>({
      method: 'DELETE',
      url: `/tasks/${taskId}`,
    });
  }
}
