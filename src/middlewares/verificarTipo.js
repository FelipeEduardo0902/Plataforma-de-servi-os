module.exports = (tiposPermitidos) => {
    return (req, res, next) => {
      const usuario = req.usuario;
  
      if (!usuario || !tiposPermitidos.includes(usuario.tipo)) {
        return res.status(403).json({ erro: 'Acesso negado. Permissão insuficiente.' });
      }
  
      next();
    };
  };
  