import { apiRequest } from "./api";


export function getProducts() {
  return apiRequest("/api/products");
}


export function getProduct(id) {
  return apiRequest(`/api/products/${id}`);
}


export function updateProduct(id, product) {
  return apiRequest(`/api/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(product),
  });
}




