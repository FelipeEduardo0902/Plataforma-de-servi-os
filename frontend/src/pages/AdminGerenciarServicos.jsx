// src/pages/AdminGerenciarServicos.jsx
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import {
  listarServicos,
  editarServico,
  excluirServico
} from "../api";

export default function AdminGerenciarServicos() {
  const [servicos, setServicos] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const BASE_URL = import.meta.env.VITE_API_URL;

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
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom align="center">
          Gerenciar Serviços
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom align="center">
          Lista completa de serviços cadastrados
        </Typography>

        <Grid container spacing={3} mt={2}>
          {servicos.map((servico) => (
            <Grid item xs={12} sm={6} md={4} key={servico.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                {servico.imagem && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={`${BASE_URL}/uploads/${servico.imagem}`}
                    alt={servico.titulo}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {servico.titulo}
                  </Typography>
                  <Typography variant="body2">{servico.descricao}</Typography>
                  <Typography variant="body2" mt={1}><strong>Categoria:</strong> {servico.categoria}</Typography>
                  <Typography variant="body2"><strong>Cidade:</strong> {servico.cidade}</Typography>
                  <Typography variant="body2"><strong>Contato:</strong> {servico.contato}</Typography>
                  <Typography variant="caption" color="text.secondary">Prestador ID: {servico.prestador_id}</Typography>

                  <Grid container spacing={1} mt={2}>
                    <Grid item xs={6}>
                      <Button fullWidth variant="outlined" onClick={() => abrirModalEditar(servico)}>
                        Editar
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button fullWidth variant="outlined" color="error" onClick={() => handleExcluir(servico.id)}>
                        Excluir
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Dialog open={!!servicoSelecionado} onClose={fecharModal} fullWidth>
        <DialogTitle>Editar Serviço</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Título"
            fullWidth
            value={servicoSelecionado?.titulo || ""}
            onChange={(e) => setServicoSelecionado({ ...servicoSelecionado, titulo: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Descrição"
            fullWidth
            value={servicoSelecionado?.descricao || ""}
            onChange={(e) => setServicoSelecionado({ ...servicoSelecionado, descricao: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Categoria"
            fullWidth
            value={servicoSelecionado?.categoria || ""}
            onChange={(e) => setServicoSelecionado({ ...servicoSelecionado, categoria: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Cidade"
            fullWidth
            value={servicoSelecionado?.cidade || ""}
            onChange={(e) => setServicoSelecionado({ ...servicoSelecionado, cidade: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Contato"
            fullWidth
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
