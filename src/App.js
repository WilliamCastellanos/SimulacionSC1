import { useState } from "react";
import { Simulator } from "./components/Simulator";

function App() {
  const [view, setView] = useState("form");
  const [juegos, setJuegos] = useState(20000);

  const simulate = (event) => {
    if (event) event.preventDefault();
    setView("Simulator");
  }

  return (
    <div className="container mt-4 border rounded p-4" >
      <div className="text-center"> {/* Centro el contenido */}
        <h2>Simulación de Arquería</h2>
        <div className="mt-4">
          <h3>Habilidades</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Ítem</th>
                <th>Puntuación</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Resistencia</td>
                <td>Entero: 35 ± 10</td>
              </tr>
              <tr>
                <td>Experiencia</td>
                <td>Entero: 10</td>
              </tr>
              <tr>
                <td>Suerte</td>
                <td>Flotante: 1 a 3</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <h3>Tabla de Datos</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Dianas</th>
                <th>Mujeres</th>
                <th>Hombres</th>
                <th>Puntaje</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Central</td>
                <td>30%</td>
                <td>20%</td>
                <td>10</td>
              </tr>
              <tr>
                <td>Intermedia</td>
                <td>38%</td>
                <td>33%</td>
                <td>9</td>
              </tr>
              <tr>
                <td>Exterior</td>
                <td>27%</td>
                <td>40%</td>
                <td>8</td>
              </tr>
              <tr>
                <td>Error</td>
                <td>5%</td>
                <td>7%</td>
                <td>0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-12">
          {view === "form" && <Form juegos={juegos} cambiarJuegos={setJuegos} simular={simulate} />}
          {view === "Simulator" && <Simulator juegos={juegos} />}
        </div>
      </div>

    </div>

  );
}

function Form({ juegos, cambiarJuegos, simular }) {

  return (
    <form className="p-3">
      <div className="mb-3">
        <label className="form-label">Número de Juegos</label>
        <input type="number" min={1} value={juegos} onChange={e => cambiarJuegos(e.target.value)} className="form-control" readOnly />
      </div>
      <div className="row justify-content-center">
        <button type="button" disabled={juegos <= 0} className="btn btn-success col-md-6" onClick={e => simular(e)}>Simular</button>
      </div>
    </form>
  );
}

export default App;
