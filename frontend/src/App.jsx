import { Routes, Route } from "react-router-dom";
import MenuSuperior from "./components/MenuSuperior";
import TelaLogin from "./pages/TelaLogin";
import CadastrarServico from "./pages/CadastrarServico";
import PainelPrestador from "./pages/PainelPrestador";
import PainelCliente from "./pages/PainelCliente";
import PainelAdmin from "./pages/PainelAdmin";
import AdminCategorias from "./pages/AdminCategorias";
import AdminUsuarios from "./pages/AdminUsuarios";
import AdminGerenciarServicos from "./pages/AdminGerenciarServicos";

function App() {
  return (
    <>
      <MenuSuperior />
      <Routes>
        <Route path="/" element={<TelaLogin />} />
        <Route path="/admin/dashboard" element={<PainelAdmin />} />
        <Route path="/prestador/dashboard" element={<PainelPrestador />} />
        <Route path="/cliente/dashboard" element={<PainelCliente />} />
        <Route path="/prestador/cadastrar-servico" element={<CadastrarServico />} />
        <Route path="/admin/categorias" element={<AdminCategorias />} />
        <Route path="/admin/usuarios" element={<AdminUsuarios />} />
        <Route path="/admin/servicos" element={<AdminGerenciarServicos />} />
      </Routes>
    </>
  );
}

export default App;
