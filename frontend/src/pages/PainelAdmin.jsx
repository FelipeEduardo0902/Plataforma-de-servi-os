// pages/PainelAdmin.jsx

import { useEffect, useState } from "react";
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import {
  listarServicos,
  editarServico,
  excluirServico
} from "../api";
import { useNavigate } from "react-router-dom";

export default function PainelAdmin() {
  const [servicos, setServicos] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_URL;

  // Carregar categorias cadastradas
  const carregarCategorias = async () => {
    try {
      const response = await fetch(`${BASE_URL}/categorias`);
      const data = await response.json();
      setCategorias(data);
    } catch (err) {
      setCategorias([]);
    }
  };

  // Carregar todos os serviços
  const carregarServicos = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await listarServicos(token);
      setServicos(data);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
    }
  };

  useEffect(() => {
    carregarServicos();
    carregarCategorias();
  }, []);

  const abrirModalEditar = (servico) => {
    setServicoSelecionado({ ...servico });
    setMensagem("");
    setErro("");
  };

  const fecharModal = () => {
    setServicoSelecionado(null);
  };

  const handleEditar = async () => {
    try {
      const token = localStorage.getItem("token");
      await editarServico(servicoSelecionado.id, servicoSelecionado, token);
      setMensagem("Serviço atualizado com sucesso!");
      carregarServicos();
      fecharModal();
    } catch (err) {
      setErro(err.message);
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
      const token = localStorage.getItem("token");
      await excluirServico(id, token);
      carregarServicos();
    } catch (err) {
      alert("Erro: " + err.message);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom align="center">
          Painel do Administrador
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" mb={3}>
          Acesse as áreas de gerenciamento
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          sx={{ flexWrap: "wrap", mb: 4 }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/admin/usuarios")}
          >
            Gerenciar Usuários
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/admin/categorias")}
          >
            Gerenciar Categorias
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={() => navigate("/admin/servicos")}
          >
            Gerenciar Serviços
          </Button>
        </Stack>

        <Typography variant="h5" gutterBottom fontWeight={600}>
          Lista de Serviços
        </Typography>

        <Grid container spacing={3}>
          {servicos.map((servico) => (
            <Grid item xs={12} sm={6} md={4} key={servico.id}>
              <Card sx={{ width: "100%", maxWidth: 345, mx: "auto" }}>
                {servico.imagem && (
                  <CardMedia
                    component="img"
                    height="160"
                    image={`${BASE_URL}/uploads/${servico.imagem}`}
                    alt={servico.titulo}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    {servico.titulo}
                  </Typography>
                  <Typography variant="body2">{servico.descricao}</Typography>
                  <Typography variant="body2" mt={1}>
                    <strong>Categoria:</strong> {servico.categoria}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Cidade:</strong> {servico.cidade}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Contato:</strong> {servico.contato}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                    Prestador ID: {servico.prestador_id}
                  </Typography>

                  <Stack direction="row" spacing={1} mt={2}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => abrirModalEditar(servico)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleExcluir(servico.id)}
                    >
                      Excluir
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Modal de Edição */}
      <Dialog open={!!servicoSelecionado} onClose={fecharModal} fullWidth>
        <DialogTitle>Editar Serviço</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            fullWidth
            label="Título"
            value={servicoSelecionado?.titulo || ""}
            onChange={(e) => setServicoSelecionado({ ...servicoSelecionado, titulo: e.target.value })}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Descrição"
            value={servicoSelecionado?.descricao || ""}
            onChange={(e) => setServicoSelecionado({ ...servicoSelecionado, descricao: e.target.value })}
          />
          {/* Select para categoria */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Categoria</InputLabel>
            <Select
              value={servicoSelecionado?.categoria || ""}
              label="Categoria"
              onChange={(e) =>
                setServicoSelecionado({ ...servicoSelecionado, categoria: e.target.value })
              }
            >
              {categorias.map((cat, idx) => (
                <MenuItem key={idx} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            fullWidth
            label="Cidade"
            value={servicoSelecionado?.cidade || ""}
            onChange={(e) => setServicoSelecionado({ ...servicoSelecionado, cidade: e.target.value })}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Contato"
            value={servicoSelecionado?.contato || ""}
            onChange={(e) => setServicoSelecionado({ ...servicoSelecionado, contato: e.target.value })}
          />
          {erro && <Alert severity="error" sx={{ mt: 2 }}>{erro}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharModal}>Cancelar</Button>
          <Button onClick={handleEditar} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
