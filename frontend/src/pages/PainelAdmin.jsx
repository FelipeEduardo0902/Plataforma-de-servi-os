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
} from "@mui/material";
import {
  listarServicos,
  editarServico,
  excluirServico
} from "../api";

export default function PainelAdmin() {
  const [servicos, setServicos] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

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

  const BASE_URL = import.meta.env.VITE_API_URL;

  return (
    <Container sx={{ py: 5 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Painel do Administrador
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Gerencie todos os serviços cadastrados
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {servicos.map((servico) => (
            <Grid item xs={12} sm={6} md={5} key={servico.id} display="flex" justifyContent="center">
              <Card sx={{ width: "100%", maxWidth: 345 }}>
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
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Prestador ID: {servico.prestador_id}
                  </Typography>

                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 2, mr: 1 }}
                    onClick={() => abrirModalEditar(servico)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ mt: 2 }}
                    onClick={() => handleExcluir(servico.id)}
                  >
                    Excluir
                  </Button>
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
          <TextField
            margin="normal"
            fullWidth
            label="Categoria"
            value={servicoSelecionado?.categoria || ""}
            onChange={(e) => setServicoSelecionado({ ...servicoSelecionado, categoria: e.target.value })}
          />
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
