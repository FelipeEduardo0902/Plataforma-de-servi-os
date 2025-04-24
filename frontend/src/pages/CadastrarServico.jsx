import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Alert,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  FormControl
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CadastrarServico() {
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    categoria: "",
    cidade: "",
    contato: ""
  });
  const [imagem, setImagem] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImagem(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setErro("");

    const token = localStorage.getItem("token");
    if (!token) {
      setErro("Você precisa estar logado para cadastrar um serviço.");
      return;
    }

    // Validação do telefone (11 dígitos numéricos)
    const telefoneLimpo = formData.contato.replace(/\D/g, "");
    if (!/^\d{11}$/.test(telefoneLimpo)) {
      setErro("Telefone inválido. Informe 11 dígitos (ex: 51991234567).");
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (imagem) data.append("imagem", imagem);

      const response = await fetch("http://localhost:3000/servicos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: data
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.erro || "Erro ao cadastrar serviço.");

      setMensagem("Serviço cadastrado com sucesso!");
      setFormData({ titulo: "", descricao: "", categoria: "", cidade: "", contato: "" });
      setImagem(null);

      setTimeout(() => {
        navigate("/prestador/dashboard");
      }, 1500);
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh", background: "#f7f9fc" }}
    >
      <Grid item xs={12} sm={8} md={6} lg={5}>
        <Paper elevation={4} sx={{ padding: 4, borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom align="center" fontWeight={600}>
            Cadastrar Novo Serviço
          </Typography>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <TextField
              fullWidth
              label="Título"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Descrição"
              name="descricao"
              multiline
              rows={3}
              value={formData.descricao}
              onChange={handleChange}
              margin="normal"
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Categoria</InputLabel>
              <Select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
              >
                <MenuItem value="Pintura">Pintura</MenuItem>
                <MenuItem value="Elétrica">Elétrica</MenuItem>
                <MenuItem value="Hidráulica">Hidráulica</MenuItem>
                <MenuItem value="Jardinagem">Jardinagem</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Cidade"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Contato (somente números)"
              name="contato"
              value={formData.contato}
              onChange={handleChange}
              margin="normal"
              required
              helperText="Ex: 51991234567"
            />

            <Button variant="outlined" component="label" sx={{ mt: 2 }} fullWidth>
              Escolher imagem (opcional)
              <input type="file" hidden onChange={handleFileChange} />
            </Button>

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, fontWeight: 600 }}>
              Cadastrar Serviço
            </Button>
          </form>

          {mensagem && <Alert severity="success" sx={{ mt: 2 }}>{mensagem}</Alert>}
          {erro && <Alert severity="error" sx={{ mt: 2 }}>{erro}</Alert>}
        </Paper>
      </Grid>
    </Grid>
  );
}
