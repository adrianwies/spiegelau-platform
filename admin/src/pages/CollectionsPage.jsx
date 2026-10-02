import { useEffect, useState } from "react";
import { Plus } from "lucide-react";


import { getCollections } from "../services/collections.service";


function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    async function loadCollections() {
      try {
        const data = await getCollections();
        setCollections(data.collections ?? []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }


    loadCollections();
  }, []);


  if (loading) {
    return (
      <div className="page">
        <div className="empty-card">
          Cargando colecciones...
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


  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Colecciones</h1>
          <p>
            Administra las colecciones de Spiegelau.
          </p>
        </div>


        <button
          type="button"
          className="primary-button"
        >
          <Plus size={18} />
          Agregar colección
        </button>
      </div>


      <section className="content-card">
        <div className="products-toolbar">
          <span className="product-count">
            {collections.length} colecciones
          </span>
        </div>


        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Slug</th>
                <th>Estado</th>
                <th>Orden</th>
              </tr>
            </thead>


            <tbody>
              {collections.map((collection) => (
                <tr key={collection.id}>
                  <td>{collection.id}</td>


                  <td>
                    <strong>
                      {collection.name}
                    </strong>
                  </td>


                  <td>{collection.slug}</td>


                  <td>
                    <span
                      className={`status-badge ${
                        collection.visible
                          ? "published"
                          : "draft"
                      }`}
                    >
                      {collection.visible
                        ? "Visible"
                        : "Oculta"}
                    </span>
                  </td>


                  <td>{collection.sort_order}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}


export default CollectionsPage;




