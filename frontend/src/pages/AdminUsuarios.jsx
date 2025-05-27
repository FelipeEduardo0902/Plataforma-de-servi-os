import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [confirmarExclusao, setConfirmarExclusao] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const carregarUsuarios = async () => {
    try {
      const response = await fetch(`${BASE_URL}/usuarios/listar-todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUsuarios(data);
    } catch (err) {
      setErro("Erro ao carregar usuários");
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const handleSalvar = async () => {
    try {
      const response = await fetch(`${BASE_URL}/usuarios/${usuarioEditando.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(usuarioEditando),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Erro ao atualizar.");

      setMensagem("Usuário atualizado com sucesso.");
      setUsuarioEditando(null);
      carregarUsuarios();
    } catch (err) {
      setErro(err.message);
    }
  };

  const handleExcluir = async () => {
    try {
      const response = await fetch(`${BASE_URL}/usuarios/${confirmarExclusao}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Erro ao excluir.");

      setMensagem("Usuário excluído com sucesso.");
      setConfirmarExclusao(null);
      carregarUsuarios();
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <Container sx={{ py: 5 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" align="center" fontWeight={600} gutterBottom>
          Gerenciar Usuários
        </Typography>

        {mensagem && <Alert severity="success" sx={{ mb: 2 }}>{mensagem}</Alert>}
        {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.nome}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.tipo}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => setUsuarioEditando(u)}>Editar</Button>
                  <Button size="small" color="error" onClick={() => setConfirmarExclusao(u.id)}>Excluir</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Modal de edição */}
        <Dialog open={!!usuarioEditando} onClose={() => setUsuarioEditando(null)} fullWidth>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              label="Nome"
              value={usuarioEditando?.nome || ""}
              onChange={(e) => setUsuarioEditando({ ...usuarioEditando, nome: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              value={usuarioEditando?.email || ""}
              onChange={(e) => setUsuarioEditando({ ...usuarioEditando, email: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Senha (opcional)"
              type="password"
              onChange={(e) => setUsuarioEditando({ ...usuarioEditando, senha: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Tipo"
              value={usuarioEditando?.tipo || ""}
              onChange={(e) => setUsuarioEditando({ ...usuarioEditando, tipo: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUsuarioEditando(null)}>Cancelar</Button>
            <Button onClick={handleSalvar} variant="contained">Salvar</Button>
          </DialogActions>
        </Dialog>

        {/* Modal de exclusão */}
        <Dialog open={!!confirmarExclusao} onClose={() => setConfirmarExclusao(null)}>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogActions>
            <Button onClick={() => setConfirmarExclusao(null)}>Cancelar</Button>
            <Button onClick={handleExcluir} variant="contained" color="error">Excluir</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}
