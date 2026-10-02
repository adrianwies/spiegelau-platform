import { apiRequest } from "./api";


export function getCollections() {
  return apiRequest("/api/collections");
}




