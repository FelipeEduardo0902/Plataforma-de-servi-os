import { Routes, Route } from "react-router-dom";
import TelaLogin from "./pages/TelaLogin";
import CadastrarServico from "./pages/CadastrarServico";
import PainelPrestador from "./pages/PainelPrestador";
import PainelCliente from "./pages/PainelCliente";
import PainelAdmin from "./pages/PainelAdmin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TelaLogin />} />
      <Route path="/admin/dashboard" element={<PainelAdmin />} />
      <Route path="/prestador/dashboard" element={<PainelPrestador />} />
      <Route path="/cliente/dashboard" element={<PainelCliente />} />
      <Route path="/prestador/cadastrar-servico" element={<CadastrarServico />} />

    </Routes>
  );
}

export default App;
