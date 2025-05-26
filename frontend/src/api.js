const BASE_URL = import.meta.env.VITE_API_URL;

export async function cadastrarServico(formData, token) {
  const data = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    data.append(key, value);
  });
  if (formData.imagem) {
    data.append("imagem", formData.imagem);
  }

  const response = await fetch(`${BASE_URL}/servicos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: data
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.erro || "Erro ao cadastrar serviço.");
  return result;
}



export async function listarServicos(token) {
  const response = await fetch(`${BASE_URL}/servicos`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return await response.json();
}

export async function editarServico(id, dados, token) {
  const response = await fetch(`${BASE_URL}/servicos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(dados)
  });
  if (!response.ok) throw new Error("Erro ao atualizar serviço.");
  return await response.json();
}

export async function excluirServico(id, token) {
  const response = await fetch(`${BASE_URL}/servicos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error("Erro ao excluir serviço.");
}



export async function buscarServicosPublicos() {
  const response = await fetch(`${BASE_URL}/servicos`);
  if (!response.ok) throw new Error("Erro ao buscar serviços.");
  return await response.json();
}

export async function listarServicosComToken(token) {
  const response = await fetch(`${BASE_URL}/servicos`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error("Erro ao buscar serviços do prestador.");
  return await response.json();
}


export async function realizarLogin(email, senha) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.erro || "Erro ao fazer login");
  return data;
}

export async function cadastrarUsuario(dados) {
  const response = await fetch(`${BASE_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.erro || "Erro ao cadastrar usuário");
  return data;
}