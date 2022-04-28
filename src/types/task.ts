import { definitions, paths } from '../generated/types';

export type Task = definitions['Task'];
export type GetTaskListParams = paths['/tasks']['get']['parameters']['query'];
export type CreateTaskParams = paths['/tasks']['post']['parameters']['body']['body'];
