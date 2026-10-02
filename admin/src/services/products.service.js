import { apiRequest } from "./api";


export function getProducts() {
  return apiRequest("/api/products");
}


export function getProduct(id) {
  return apiRequest(`/api/products/${id}`);
}




