import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function MenuSuperior() {
  const navigate = useNavigate();

  // Pega o tipo do usuário do localStorage
  const tipoUsuario = localStorage.getItem("tipoUsuario");

  // Função para logout: limpa localStorage e redireciona para login
  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <AppBar position="static" sx={{ background: "linear-gradient(90deg, #1976d2, #00bcd4)" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, letterSpacing: 2, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Plataforma de Serviços
        </Typography>

        <Box>
          {tipoUsuario === "admin" && (
            <>
              <Button color="inherit" onClick={() => navigate("/admin/dashboard")}>
                Dashboard
              </Button>
              <Button color="inherit" onClick={() => navigate("/admin/usuarios")}>
                Usuários
              </Button>
              <Button color="inherit" onClick={() => navigate("/admin/servicos")}>
                Serviços
              </Button>
              <Button color="inherit" onClick={() => navigate("/admin/categorias")}>
                Categorias
              </Button>
            </>
          )}

          {tipoUsuario === "prestador" && (
            <>
              <Button color="inherit" onClick={() => navigate("/prestador/dashboard")}>
                Meus Serviços
              </Button>
              <Button color="inherit" onClick={() => navigate("/prestador/cadastrar-servico")}>
                Novo Serviço
              </Button>
            </>
          )}

          {tipoUsuario === "cliente" && (
            <>
              <Button color="inherit" onClick={() => navigate("/cliente/dashboard")}>
                Explorar Serviços
              </Button>
            </>
          )}

          {/* Mostrar botão sair sempre que usuário estiver logado */}
          {tipoUsuario && (
            <Button color="inherit" onClick={handleLogout}>
              Sair
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
