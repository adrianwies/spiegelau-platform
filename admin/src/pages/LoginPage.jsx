import {
  useState,
} from "react";


import {
  Navigate,
  useNavigate,
} from "react-router-dom";


import {
  useAuth,
} from "../auth/AuthContext";


function LoginPage() {
  const navigate =
    useNavigate();


  const {
    user,
    login,
  } = useAuth();


  const [username, setUsername] =
    useState("");


  const [password, setPassword] =
    useState("");


  const [error, setError] =
    useState("");


  const [submitting, setSubmitting] =
    useState(false);


  if (user) {
    return (
      <Navigate
        to="/products"
        replace
      />
    );
  }


  async function handleSubmit(
    event,
  ) {
    event.preventDefault();


    setError("");
    setSubmitting(true);


    try {
      await login(
        username,
        password,
      );


      navigate(
        "/products",
        {
          replace: true,
        },
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }


  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <div className="brand-mark">
            S
          </div>


          <div>
            <strong>
              SPIEGELAU
            </strong>


            <span>
              Administración
            </span>
          </div>
        </div>


        <h1>
          Iniciar sesión
        </h1>


        <p className="login-description">
          Ingresa tus credenciales
          para acceder al panel.
        </p>


        <form
          onSubmit={
            handleSubmit
          }
          className="login-form"
        >
          <label>
            Usuario


            <input
              type="text"
              value={username}
              onChange={(
                event,
              ) =>
                setUsername(
                  event.target
                    .value,
                )
              }
              autoComplete="username"
              autoFocus
              required
            />
          </label>


          <label>
            Contraseña


            <input
              type="password"
              value={password}
              onChange={(
                event,
              ) =>
                setPassword(
                  event.target
                    .value,
                )
              }
              autoComplete="current-password"
              required
            />
          </label>


          {error && (
            <div className="login-error">
              {error}
            </div>
          )}


          <button
            type="submit"
            className="primary-button login-submit"
            disabled={
              submitting
            }
          >
            {submitting
              ? "Ingresando..."
              : "Ingresar"}
          </button>
        </form>
      </section>
    </main>
  );
}


export default LoginPage;