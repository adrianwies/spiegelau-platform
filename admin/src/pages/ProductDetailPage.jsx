import {
  ArrowLeft,
  ExternalLink,
} from "lucide-react";


import {
  useEffect,
  useState,
} from "react";


import {
  Link,
  useParams,
} from "react-router-dom";


import {
  getProduct,
} from "../services/products.service";


function ProductDetailPage() {
  const { id } = useParams();


  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProduct(id);


        setProduct(data.product);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }


    loadProduct();
  }, [id]);


  if (loading) {
    return (
      <div className="page">
        <div className="empty-card">
          Cargando producto...
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="page">
        <div className="error-card">
          {error}
        </div>
      </div>
    );
  }


  if (!product) {
    return null;
  }


  return (
    <div className="page product-detail-page">
      <div className="detail-topbar">
        <Link
          to="/products"
          className="back-button"
        >
          <ArrowLeft size={18} />
        </Link>


        <div className="detail-heading">
          <h1>{product.name}</h1>


          <div className="detail-heading-meta">
            <span>
              SKU: {product.sku}
            </span>


            <span
              className={`status-badge ${
                product.status === "published"
                  ? "published"
                  : "draft"
              }`}
            >
              {product.status === "published"
                ? "Publicado"
                : "Borrador"}
            </span>
          </div>
        </div>


        <button
          type="button"
          className="secondary-button"
          disabled
        >
          <ExternalLink size={17} />
          Ver producto
        </button>
      </div>


      <div className="product-detail-grid">
        <div className="product-detail-main">
          <section className="detail-card">
            <h2>Información del producto</h2>


            <div className="detail-field">
              <span>Nombre</span>
              <strong>{product.name}</strong>
            </div>


            <div className="detail-field">
              <span>Descripción corta</span>


              <p>
                {product.shortDescription ||
                  "Sin descripción corta"}
              </p>
            </div>


            <div className="detail-field">
              <span>Descripción</span>


              <p className="detail-description">
                {product.description ||
                  "Sin descripción"}
              </p>
            </div>
          </section>


          <section className="detail-card">
            <h2>Galería</h2>


            {product.images.length === 0 ? (
              <p className="muted-text">
                Este producto no tiene imágenes.
              </p>
            ) : (
              <div className="product-gallery">
                {product.images.map((image) => (
                  <div
                    key={image.id}
                    className="gallery-item"
                  >
                    <img
                      src={image.imageUrl}
                      alt={
                        image.altText ||
                        product.name
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </section>


          <section className="detail-card">
            <h2>Precio e inventario</h2>


            <div className="detail-two-columns">
              <div className="detail-field">
                <span>Precio</span>


                <strong>
                  S/ {product.price.toFixed(2)}
                </strong>
              </div>


              <div className="detail-field">
                <span>Precio oferta</span>


                <strong>
                  {product.offerPrice !== null
                    ? `S/ ${product.offerPrice.toFixed(2)}`
                    : "Sin oferta"}
                </strong>
              </div>


              <div className="detail-field">
                <span>Stock</span>


                <strong>
                  {product.stock}
                </strong>
              </div>
            </div>
          </section>


          <section className="detail-card">
            <h2>Especificaciones</h2>


            {Array.isArray(
              product.specifications,
            ) &&
            product.specifications.length >
              0 ? (
              <pre className="json-preview">
                {JSON.stringify(
                  product.specifications,
                  null,
                  2,
                )}
              </pre>
            ) : (
              <p className="muted-text">
                Sin especificaciones.
              </p>
            )}
          </section>
        </div>


        <aside className="product-detail-sidebar">
          <section className="detail-card">
            <h2>Organización</h2>


            <div className="detail-field">
              <span>Categoría</span>


              <strong>
                {product.category?.name ||
                  "Sin categoría"}
              </strong>
            </div>


            <div className="detail-field">
              <span>Colección</span>


              <strong>
                {product.collection?.name ||
                  "Sin colección"}
              </strong>
            </div>


            <div className="detail-field">
              <span>Presentación</span>


              <strong>
                {product.presentation || "—"}
              </strong>
            </div>


            <div className="detail-field">
              <span>Canal</span>


              <strong>
                {product.channel || "—"}
              </strong>
            </div>
          </section>


          <section className="detail-card">
            <h2>Estado</h2>


            <div className="detail-field">
              <span>Visible</span>


              <strong>
                {product.visible
                  ? "Sí"
                  : "No"}
              </strong>
            </div>


            <div className="detail-field">
              <span>Destacado</span>


              <strong>
                {product.featured
                  ? "Sí"
                  : "No"}
              </strong>
            </div>


            <div className="detail-field">
              <span>Nuevo</span>


              <strong>
                {product.new
                  ? "Sí"
                  : "No"}
              </strong>
            </div>
          </section>


          <section className="detail-card">
            <h2>SEO</h2>


            <div className="detail-field">
              <span>Slug</span>


              <code>
                {product.slug}
              </code>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}


export default ProductDetailPage;




