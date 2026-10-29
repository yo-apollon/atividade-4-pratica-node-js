const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'clinica_secreta';

function verificaJWT(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ auth: false, mensagem: 'Nenhum token fornecido.' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ auth: false, mensagem: 'Falha ao autenticar o token.' });
    }
    req.pacienteId = decoded.id;
    next();
  });
}

module.exports = { verificaJWT, SECRET };
