import { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { cadastrarServico } from "../api";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function CadastrarServico() {
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    categoria: "",
    cidade: "",
    contato: "",
    imagem: null,
  });
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [preview, setPreview] = useState(null); // preview da imagem
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const response = await fetch(`${BASE_URL}/categorias`);
        const data = await response.json();
        setCategorias(data);
      } catch {
        setCategorias([]);
      }
    }
    fetchCategorias();
  }, []);

  // Formata o telefone para exibição
  const formatarTelefone = (valor) => {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);
    if (numeros.length <= 2) return `(${numeros}`;
    if (numeros.length <= 7)
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contato") {
      setFormData({ ...formData, contato: formatarTelefone(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, imagem: file });

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
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

    const telefoneLimpo = formData.contato.replace(/\D/g, "");
    if (!/^\d{11}$/.test(telefoneLimpo)) {
      setErro("Telefone inválido. Informe 11 dígitos (ex: (51) 99123-4567).");
      return;
    }

    try {
      await cadastrarServico(formData, token);
      setMensagem("Serviço cadastrado com sucesso!");
      setFormData({
        titulo: "",
        descricao: "",
        categoria: "",
        cidade: "",
        contato: "",
        imagem: null,
      });
      setPreview(null);
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
                label="Categoria"
              >
                {categorias.length === 0 ? (
                  <MenuItem value="">
                    Nenhuma categoria cadastrada
                  </MenuItem>
                ) : (
                  categorias.map((cat) => (
                    <MenuItem key={cat.id || cat.nome} value={cat.nome}>
                      {cat.nome}
                    </MenuItem>
                  ))
                )}
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
              label="Contato"
              name="contato"
              value={formData.contato}
              onChange={handleChange}
              margin="normal"
              required
              helperText="Formato: (51) 99999-9999"
            />

            <Button variant="outlined" component="label" sx={{ mt: 2 }} fullWidth>
              Escolher imagem (opcional)
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept="image/*"
              />
            </Button>

            {preview && (
              <img
                src={preview}
                alt="Pré-visualização"
                style={{
                  marginTop: 20,
                  maxWidth: "100%",
                  maxHeight: 240,
                  borderRadius: 8,
                  boxShadow: "0 0 8px #bbb",
                }}
              />
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, fontWeight: 600 }}
            >
              Cadastrar Serviço
            </Button>
          </form>

          {mensagem && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {mensagem}
            </Alert>
          )}
          {erro && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {erro}
            </Alert>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
