import { Plus, Search } from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { getProducts } from "../services/products.service";
import { useNavigate } from "react-router-dom";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();

        setProducts(data.products ?? []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return products;
    }

    return products.filter((product) => {
      return [
        product.name,
        product.sku,
        product.category?.name,
        product.collection?.name,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term));
    });
  }, [products, search]);

  if (loading) {
    return (
      <div className="page">
        <div className="empty-card">Cargando productos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="error-card">{error}</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Productos</h1>

          <p>Administra los productos del catálogo Spiegelau.</p>
        </div>

        <button className="primary-button" type="button">
          <Plus size={18} />
          Agregar producto
        </button>
      </div>

      <section className="content-card">
        <div className="products-toolbar">
          <div className="search-box">
            <Search size={18} />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar productos"
            />
          </div>

          <span className="product-count">
            {filteredProducts.length} productos
          </span>
        </div>

        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Estado</th>
                <th>Inventario</th>
                <th>Categoría</th>
                <th>Colección</th>
                <th>Precio</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="clickable-row"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <td>
                    <div className="product-cell">
                      <div className="product-thumbnail">
                        {product.primaryImage ? (
                          <img src={product.primaryImage} alt={product.name} />
                        ) : (
                          <span>—</span>
                        )}
                      </div>

                      <div className="product-info">
                        <strong>{product.name}</strong>

                        <span>{product.sku}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`status-badge ${
                        product.status === "published" ? "published" : "draft"
                      }`}
                    >
                      {product.status === "published"
                        ? "Publicado"
                        : "Borrador"}
                    </span>
                  </td>

                  <td>{product.stock}</td>

                  <td>{product.category?.name ?? "Sin categoría"}</td>

                  <td>{product.collection?.name ?? "Sin colección"}</td>

                  <td>S/ {Number(product.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default ProductsPage;
