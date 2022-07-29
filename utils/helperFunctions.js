import { v4 as uuid } from "uuid";

export const generateId = () => {
  const unique_id = uuid();
  const small_id = unique_id.slice(0, 8);
  return small_id;
};
