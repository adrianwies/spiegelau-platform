export function normalizeSlug(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}


export function createProductSlug(product, products = []) {
  const existingSlug = normalizeSlug(product?.slug);


  const baseSlug =
    existingSlug ||
    normalizeSlug(product?.name) ||
    "producto";


  const hasCollision = products.some((candidate) => {
    if (String(candidate?.id) === String(product?.id)) {
      return false;
    }


    const candidateSlug =
      normalizeSlug(candidate?.slug) ||
      normalizeSlug(candidate?.name);


    return candidateSlug === baseSlug;
  });


  if (!hasCollision) {
    return baseSlug;
  }


  const suffix =
    normalizeSlug(product?.sku) ||
    normalizeSlug(product?.id);


  return suffix
    ? `${baseSlug}-${suffix}`
    : baseSlug;
}



