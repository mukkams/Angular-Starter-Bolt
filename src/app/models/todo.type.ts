export type Todo = {
  id: number;
  name: string;
  description: string;
  barcode: string;
  rate: number;
  addedOn: Date;
  modifiedOn: Date;
};

export type CreateTodoInput = Omit<Todo, 'id' | 'addedOn' | 'modifiedOn'>;