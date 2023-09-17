import { useState } from "react";
import { Form } from "./components/Form";
import { Sim } from "./components/Sim";

function App() {
  const [view, setView] = useState("form");
  const [juegos, setJuegos] = useState(20);

  const simular = (event) => {
    if (event) event.preventDefault();
    setView("sim");
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
      <div className="row justify-content-center"> {/* Centra los elementos hijos horizontalmente */}
        <div className="col-md-6">
          {view === "form" && <Form juegos={juegos} cambiarJuegos={setJuegos} simular={simular} />}
          {view === "sim" && <Sim juegos={juegos} />}
        </div>
      </div>

    </div>

  );
}

export default App;
