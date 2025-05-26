import { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { listarServicosComToken } from "../api";

export default function PainelPrestador() {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState([]);

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await listarServicosComToken(token);
        setServicos(data);
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
      }
    };

    fetchServicos();
  }, []);

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
          <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
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

          <Grid container spacing={2} justifyContent="center">
            {servicos.map((servico) => (
              <Grid item xs={12} sm={6} key={servico.id} display="flex" justifyContent="center">
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
                    <Typography variant="body2" color="text.secondary">
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
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
