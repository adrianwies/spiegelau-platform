import { useEffect, useState } from "react";
import { Plus } from "lucide-react";


import { getCategories } from "../services/categories.service";


function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data.categories ?? []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }


    loadCategories();
  }, []);


  if (loading) {
    return (
      <div className="page">
        <div className="empty-card">
          Cargando categorías...
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
          <h1>Categorías</h1>
          <p>
            Organiza los productos por categoría.
          </p>
        </div>


        <button
          type="button"
          className="primary-button"
        >
          <Plus size={18} />
          Agregar categoría
        </button>
      </div>


      <section className="content-card">
        <div className="products-toolbar">
          <span className="product-count">
            {categories.length} categorías
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
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>


                  <td>
                    <strong>
                      {category.name}
                    </strong>
                  </td>


                  <td>{category.slug}</td>


                  <td>
                    <span
                      className={`status-badge ${
                        category.visible
                          ? "published"
                          : "draft"
                      }`}
                    >
                      {category.visible
                        ? "Visible"
                        : "Oculta"}
                    </span>
                  </td>


                  <td>{category.sort_order}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}


export default CategoriesPage;




