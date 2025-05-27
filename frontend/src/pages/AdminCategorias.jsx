import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Alert
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const token = localStorage.getItem("token");

  async function carregarCategorias() {
    try {
      setErro(""); setMensagem("");
      const response = await fetch(`${BASE_URL}/categorias`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setCategorias(data);
    } catch {
      setErro("Erro ao carregar categorias.");
    }
  }

  useEffect(() => { carregarCategorias(); }, []);

  async function adicionarCategoria() {
    if (!novaCategoria.trim()) return setErro("Digite o nome!");
    try {
      setErro(""); setMensagem("");
      const response = await fetch(`${BASE_URL}/categorias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nome: novaCategoria.trim() })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.erro);
      setMensagem("Categoria criada!");
      setNovaCategoria("");
      carregarCategorias();
    } catch (err) {
      setErro(err.message || "Erro ao adicionar categoria");
    }
  }

  async function removerCategoria(nome) {
    if (!window.confirm(`Excluir "${nome}"?`)) return;
    try {
      setErro(""); setMensagem("");
      const response = await fetch(`${BASE_URL}/categorias/${encodeURIComponent(nome)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.erro);
      setMensagem("Categoria excluída!");
      carregarCategorias();
    } catch (err) {
      setErro(err.message || "Erro ao excluir categoria");
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom align="center">
          Categorias
        </Typography>
        <TextField
          label="Nova Categoria"
          value={novaCategoria}
          onChange={e => setNovaCategoria(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={adicionarCategoria}
          fullWidth
        >
          Adicionar
        </Button>
        {mensagem && <Alert severity="success" sx={{ mt: 2 }}>{mensagem}</Alert>}
        {erro && <Alert severity="error" sx={{ mt: 2 }}>{erro}</Alert>}
        <List sx={{ mt: 2 }}>
          {categorias.length === 0 ? (
            <ListItem>
              <ListItemText primary="Nenhuma categoria." />
            </ListItem>
          ) : (
            categorias.map((cat) => (
              <ListItem
                key={cat.id || cat.nome}
                secondaryAction={
                  <IconButton edge="end" color="error" onClick={() => removerCategoria(cat.nome)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={cat.nome} />
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Container>
  );
}
