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




import { getCategories } from "../services/categories.service";
import { getCollections } from "../services/collections.service";


import {
  getProduct,
  updateProduct,
} from "../services/products.service";






function ProductDetailPage() {
  const { id } = useParams();


  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [categories, setCategories] = useState([]);
const [collections, setCollections] = useState([]);


const [form, setForm] = useState(null);


const [saving, setSaving] = useState(false);
const [saveMessage, setSaveMessage] = useState("");






useEffect(() => {
  async function loadData() {
    try {
      const [
        productData,
        categoriesData,
        collectionsData,
      ] = await Promise.all([
        getProduct(id),
        getCategories(),
        getCollections(),
      ]);


      const product =
        productData.product;


      setProduct(product);


      setCategories(
        categoriesData.categories ?? [],
      );


      setCollections(
        collectionsData.collections ?? [],
      );


      setForm({
        name: product.name ?? "",
        sku: product.sku ?? "",


        categoryId:
          product.category?.id ?? "",


        collectionId:
          product.collection?.id ?? "",


        presentation:
          product.presentation ?? "",


        shortDescription:
          product.shortDescription ?? "",


        description:
          product.description ?? "",


        price:
          product.price ?? 0,


        offerPrice:
          product.offerPrice ?? "",


        stock:
          product.stock ?? 0,


        featured:
          product.featured,


        new:
          product.new,


        offer:
          product.offer,


        visible:
          product.visible,


        status:
          product.status,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }


  loadData();
}, [id]);

function handleChange(event) {
  const {
    name,
    value,
    type,
    checked,
  } = event.target;


  setForm((current) => ({
    ...current,


    [name]:
      type === "checkbox"
        ? checked
        : value,
  }));
}

async function handleSave(event) {
  event.preventDefault();


  setSaving(true);
  setSaveMessage("");


  try {
    await updateProduct(id, {
      ...form,


      categoryId:
        Number(form.categoryId),


      collectionId:
        form.collectionId
          ? Number(form.collectionId)
          : null,


      price:
        Number(form.price),


      offerPrice:
        form.offerPrice === ""
          ? null
          : Number(form.offerPrice),


      stock:
        Number(form.stock),
    });


    setSaveMessage(
      "Producto guardado correctamente",
    );
  } catch (err) {
    setSaveMessage(err.message);
  } finally {
    setSaving(false);
  }
}













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
        <button
  type="button"
  className="secondary-button"
  disabled
>
  <ExternalLink size={17} />
  Ver producto
</button>

{saveMessage && (
  <div className="save-message">
    {saveMessage}
  </div>
)}








      </div>


      <div className="product-detail-grid">
        <div className="product-detail-main">
         <section className="detail-card">
  <h2>Información del producto</h2>


  <div className="form-field">
    <label htmlFor="name">
      Nombre
    </label>


    <input
      id="name"
      name="name"
      type="text"
      value={form.name}
      onChange={handleChange}
    />
  </div>


  <div className="form-field">
    <label htmlFor="sku">
      SKU
    </label>


    <input
      id="sku"
      name="sku"
      type="text"
      value={form.sku}
      onChange={handleChange}
    />
  </div>


  <div className="form-field">
    <label htmlFor="shortDescription">
      Descripción corta
    </label>


    <textarea
      id="shortDescription"
      name="shortDescription"
      rows="3"
      value={form.shortDescription}
      onChange={handleChange}
    />
  </div>


  <div className="form-field">
    <label htmlFor="description">
      Descripción
    </label>


    <textarea
      id="description"
      name="description"
      rows="8"
      value={form.description}
      onChange={handleChange}
    />
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




