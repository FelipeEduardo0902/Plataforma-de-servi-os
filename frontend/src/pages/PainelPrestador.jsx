import { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { listarServicosComToken, editarServico, excluirServico } from "../api";

export default function PainelPrestador() {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal edição
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [formEdit, setFormEdit] = useState({
    titulo: "",
    descricao: "",
    categoria: "",
    cidade: "",
    contato: "",
    imagem: null,
  });
  const [previewImagem, setPreviewImagem] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // Modal exclusão
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [excluirLoading, setExcluirLoading] = useState(false);
  const [excluirError, setExcluirError] = useState("");

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchServicos();
  }, []);

  async function fetchServicos() {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const data = await listarServicosComToken(token);
      setServicos(data);
    } catch (err) {
      setError("Erro ao carregar serviços.");
    } finally {
      setLoading(false);
    }
  }

  // Abrir modal edição com dados do serviço selecionado
  const abrirModalEditar = (servico) => {
    setServicoSelecionado(servico);
    setFormEdit({
      titulo: servico.titulo,
      descricao: servico.descricao || "",
      categoria: servico.categoria,
      cidade: servico.cidade,
      contato: servico.contato,
      imagem: null, // imagem nova ainda não selecionada
    });
    setPreviewImagem(servico.imagem ? `${BASE_URL}/uploads/${servico.imagem}` : null);
    setEditError("");
    setModalEditarAberto(true);
  };

  // Atualiza formulário de edição
  const handleChangeEdit = (e) => {
    setFormEdit({ ...formEdit, [e.target.name]: e.target.value });
  };

  // Trocar imagem selecionada no input file
  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    setFormEdit({ ...formEdit, imagem: file });
    if (file) {
      setPreviewImagem(URL.createObjectURL(file));
    } else {
      setPreviewImagem(servicoSelecionado.imagem ? `${BASE_URL}/uploads/${servicoSelecionado.imagem}` : null);
    }
  };

  // Salvar edição (envia FormData para suportar imagem)
  const salvarEdicao = async () => {
    setEditLoading(true);
    setEditError("");
    try {
      const token = localStorage.getItem("token");

      const data = new FormData();
      data.append("titulo", formEdit.titulo);
      data.append("descricao", formEdit.descricao);
      data.append("categoria", formEdit.categoria);
      data.append("cidade", formEdit.cidade);
      data.append("contato", formEdit.contato);
      if (formEdit.imagem) {
        data.append("imagem", formEdit.imagem);
      }

      // Requisição manual pois editarServico não suporta FormData
      const response = await fetch(`${BASE_URL}/servicos/${servicoSelecionado.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // NÃO colocar Content-Type quando usa FormData!
        },
        body: data,
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.erro || "Erro ao atualizar serviço.");
      }

      const updatedServico = await response.json();

      // Atualiza localmente
      setServicos((old) =>
        old.map((s) =>
          s.id === servicoSelecionado.id ? { ...s, ...formEdit, imagem: updatedServico.imagem || s.imagem } : s
        )
      );
      setModalEditarAberto(false);
    } catch (err) {
      setEditError(err.message || "Erro ao salvar edição.");
    } finally {
      setEditLoading(false);
    }
  };

  // Abrir modal exclusão
  const abrirModalExcluir = (servico) => {
    setServicoSelecionado(servico);
    setExcluirError("");
    setModalExcluirAberto(true);
  };

  // Confirmar exclusão
  const confirmarExcluir = async () => {
    setExcluirLoading(true);
    setExcluirError("");
    try {
      const token = localStorage.getItem("token");
      await excluirServico(servicoSelecionado.id, token);
      setServicos((old) => old.filter((s) => s.id !== servicoSelecionado.id));
      setModalExcluirAberto(false);
    } catch (err) {
      setExcluirError(err.message || "Erro ao excluir serviço.");
    } finally {
      setExcluirLoading(false);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(to right, #f0f4f8, #e0f7fa)",
        margin: 0,
        padding: 2,
      }}
    >
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Paper elevation={4} sx={{ padding: 4, borderRadius: 3 }}>
          <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
            Painel do Prestador
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            gutterBottom
          >
            Gerencie seus serviços cadastrados ou adicione novos.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, mb: 4, fontWeight: 600 }}
            onClick={() => navigate("/prestador/cadastrar-servico")}
          >
            Cadastrar Novo Serviço
          </Button>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress />
            </Box>
          )}
          {error && <Alert severity="error">{error}</Alert>}

          <Grid container spacing={2} justifyContent="center">
            {servicos.map((servico) => (
              <Grid
                item
                xs={12}
                sm={6}
                key={servico.id}
                display="flex"
                justifyContent="center"
              >
                <Card
                  sx={{
                    width: "100%",
                    maxWidth: 345,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {servico.imagem && (
                    <CardMedia
                      component="img"
                      height="160"
                      image={`${BASE_URL}/uploads/${servico.imagem}`}
                      alt={servico.titulo}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {servico.titulo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {servico.descricao || "Sem descrição"}
                    </Typography>
                    <Typography variant="body2" mt={1}>
                      <strong>Categoria:</strong> {servico.categoria}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Cidade:</strong> {servico.cidade}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Contato:</strong> {servico.contato}
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 1,
                      p: 1,
                      borderTop: "1px solid #eee",
                    }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => abrirModalEditar(servico)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => abrirModalExcluir(servico)}
                    >
                      Excluir
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Modal de edição */}
          <Dialog
            open={modalEditarAberto}
            onClose={() => setModalEditarAberto(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Editar Serviço</DialogTitle>
            <DialogContent dividers>
              {editError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {editError}
                </Alert>
              )}
              <TextField
                margin="normal"
                label="Título"
                name="titulo"
                value={formEdit.titulo}
                onChange={handleChangeEdit}
                fullWidth
                required
              />
              <TextField
                margin="normal"
                label="Descrição"
                name="descricao"
                value={formEdit.descricao}
                onChange={handleChangeEdit}
                fullWidth
                multiline
                rows={3}
              />
              <TextField
                margin="normal"
                label="Categoria"
                name="categoria"
                value={formEdit.categoria}
                onChange={handleChangeEdit}
                fullWidth
                required
              />
              <TextField
                margin="normal"
                label="Cidade"
                name="cidade"
                value={formEdit.cidade}
                onChange={handleChangeEdit}
                fullWidth
                required
              />
              <TextField
                margin="normal"
                label="Contato"
                name="contato"
                value={formEdit.contato}
                onChange={handleChangeEdit}
                fullWidth
                required
                helperText="Formato: (XX) 9XXXX-XXXX"
              />
              <Box mt={2}>
                <Typography variant="body1" gutterBottom>
                  Imagem atual:
                </Typography>
                {previewImagem ? (
                  <img
                    src={previewImagem}
                    alt="Pré-visualização"
                    style={{ maxWidth: "100%", maxHeight: 160, borderRadius: 8 }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma imagem.
                  </Typography>
                )}
              </Box>
              <Button variant="outlined" component="label" sx={{ mt: 2 }} fullWidth>
                Trocar imagem
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImagemChange}
                />
              </Button>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setModalEditarAberto(false)}
                disabled={editLoading}
              >
                Cancelar
              </Button>
              <Button
                onClick={salvarEdicao}
                variant="contained"
                disabled={editLoading}
              >
                {editLoading ? "Salvando..." : "Salvar"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Modal de exclusão */}
          <Dialog
            open={modalExcluirAberto}
            onClose={() => setModalExcluirAberto(false)}
            maxWidth="xs"
            fullWidth
          >
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogContent dividers>
              {excluirError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {excluirError}
                </Alert>
              )}
              <Typography>
                Tem certeza que deseja excluir o serviço{" "}
                <strong>{servicoSelecionado?.titulo}</strong>?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setModalExcluirAberto(false)}
                disabled={excluirLoading}
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmarExcluir}
                variant="contained"
                color="error"
                disabled={excluirLoading}
              >
                {excluirLoading ? "Excluindo..." : "Excluir"}
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Grid>
    </Grid>
  );
}
