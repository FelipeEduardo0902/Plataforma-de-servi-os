import { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";

export default function PainelCliente() {
  const [servicos, setServicos] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const response = await fetch("http://localhost:3000/servicos");
        const data = await response.json();
        setServicos(data);
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
      }
    };

    fetchServicos();
  }, []);

  const handleAbrirModal = (servico) => {
    setServicoSelecionado(servico);
    setOpen(true);
  };

  const handleFecharModal = () => {
    setOpen(false);
    setServicoSelecionado(null);
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
        padding: 2
      }}
    >
      <Grid item xs={12} sm={10} md={8}>
        <Paper
          elevation={4}
          sx={{
            padding: 5,
            borderRadius: 3,
            textAlign: "center"
          }}
        >
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Painel do Cliente
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Veja os serviços disponíveis
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {servicos.map((servico) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={5}
                key={servico.id}
                display="flex"
                justifyContent="center"
              >
                <Card
                  sx={{ width: "100%", maxWidth: 345, cursor: "pointer" }}
                  onClick={() => handleAbrirModal(servico)}
                >
                  {servico.imagem && (
                    <CardMedia
                      component="img"
                      height="160"
                      image={`http://localhost:3000/uploads/${servico.imagem}`}
                      alt={servico.titulo}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" fontWeight={600}>
                      {servico.titulo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {servico.descricao?.slice(0, 50) || "Sem descrição"}...
                    </Typography>
                    <Typography variant="body2" mt={1}>
                      <strong>Categoria:</strong> {servico.categoria}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>

      {/* Modal */}
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleFecharModal();
          }
        }}
        fullWidth
      >
        <DialogTitle>{servicoSelecionado?.titulo}</DialogTitle>
        <DialogContent>
          {servicoSelecionado?.imagem && (
            <img
              src={`http://localhost:3000/uploads/${servicoSelecionado.imagem}`}
              alt={servicoSelecionado.titulo}
              style={{ width: "100%", borderRadius: "8px", marginBottom: "1rem" }}
            />
          )}
          <Typography variant="body1" gutterBottom>
            <strong>Descrição:</strong> {servicoSelecionado?.descricao || "Sem descrição"}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Categoria:</strong> {servicoSelecionado?.categoria}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Cidade:</strong> {servicoSelecionado?.cidade}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Contato:</strong> {servicoSelecionado?.contato}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFecharModal} variant="contained" color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
