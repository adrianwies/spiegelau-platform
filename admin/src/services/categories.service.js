import { apiRequest } from "./api";


export function getCategories() {
  return apiRequest("/api/categories");
}




