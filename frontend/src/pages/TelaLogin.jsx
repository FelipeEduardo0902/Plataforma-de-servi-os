import { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { realizarLogin, cadastrarUsuario } from "../api";

export default function TelaLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const [open, setOpen] = useState(false);
  const [cadastro, setCadastro] = useState({
    nome: "",
    email: "",
    senha: "",
    tipo: "cliente"
  });
  const [mensagemCadastro, setMensagemCadastro] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setErro("");
    try {
      const data = await realizarLogin(email, senha);
      localStorage.setItem("token", data.token);
      localStorage.setItem("tipoUsuario", data.tipo);

      if (data.tipo === "admin") navigate("/admin/dashboard");
      else if (data.tipo === "prestador") navigate("/prestador/dashboard");
      else navigate("/cliente/dashboard");
    } catch (err) {
      setErro(err.message);
    }
  };

  const handleCadastro = async () => {
    setMensagemCadastro("");
    try {
      await cadastrarUsuario(cadastro);
      setMensagemCadastro("Usuário cadastrado com sucesso!");
      setTimeout(() => {
        setOpen(false);
        setCadastro({ nome: "", email: "", senha: "", tipo: "cliente" });
      }, 1500);
    } catch (err) {
      setMensagemCadastro(err.message);
    }
  };

  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          minHeight: "100vh",
          width: "100vw",
          background: "linear-gradient(to right, #e0f7fa, #fce4ec)",
          padding: 2,
        }}
      >
        <Grid item xs={12} sm={8} md={4}>
          <Paper elevation={4} sx={{ padding: 4, borderRadius: 3 }}>
            <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
              Plataforma de Serviços
            </Typography>
            <Typography variant="subtitle1" align="center" gutterBottom color="text.secondary">
              Acesse com sua conta
            </Typography>

            <TextField
              label="E-mail"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Senha"
              type="password"
              fullWidth
              margin="normal"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            {erro && <Alert severity="error" sx={{ mt: 2 }}>{erro}</Alert>}

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, fontWeight: 600 }}
              onClick={handleLogin}
            >
              Entrar
            </Button>

            <Button
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => setOpen(true)}
            >
              Criar Conta
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Modal de cadastro */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Criar Conta</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            fullWidth
            margin="dense"
            value={cadastro.nome}
            onChange={(e) => setCadastro({ ...cadastro, nome: e.target.value })}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="dense"
            value={cadastro.email}
            onChange={(e) => setCadastro({ ...cadastro, email: e.target.value })}
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="dense"
            value={cadastro.senha}
            onChange={(e) => setCadastro({ ...cadastro, senha: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Tipo</InputLabel>
            <Select
              value={cadastro.tipo}
              label="Tipo"
              onChange={(e) => setCadastro({ ...cadastro, tipo: e.target.value })}
            >
              <MenuItem value="cliente">Cliente</MenuItem>
              <MenuItem value="prestador">Prestador</MenuItem>
            </Select>
          </FormControl>
          {mensagemCadastro && (
            <Alert severity={mensagemCadastro.includes("sucesso") ? "success" : "error"} sx={{ mt: 2 }}>
              {mensagemCadastro}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleCadastro} variant="contained">Cadastrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
