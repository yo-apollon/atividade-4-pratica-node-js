const express = require('express');
const jwt = require('jsonwebtoken');
const { Paciente } = require('./models');
const { verificaJWT, SECRET } = require('./middlewares/verificaJWT');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensagem: 'Bem-vindo à API da Clínica Médica!' });
});

app.post('/pacientes', async (req, res) => {
  try {
    const { nome, idade, sexo, usuario, senha } = req.body;
    const paciente = await Paciente.create({ nome, idade, sexo, usuario, senha });
    res.status(201).json(paciente);
  } catch (error) {
    res.status(400).json({ mensagem: 'Erro ao cadastrar paciente.', erro: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { usuario, senha } = req.body;
    const paciente = await Paciente.findOne({ where: { usuario } });

    if (!paciente || paciente.senha !== senha) {
      return res.status(401).json({ auth: false, mensagem: 'Usuário ou senha inválidos.' });
    }

    const token = jwt.sign({ id: paciente.id }, SECRET, { expiresIn: '1h' });
    res.json({ auth: true, token });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao realizar login.', erro: error.message });
  }
});

app.get('/pacientes', verificaJWT, async (req, res) => {
  try {
    const pacientes = await Paciente.findAll();
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao listar pacientes.', erro: error.message });
  }
});

app.get('/pacientes/:id', verificaJWT, async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) {
      return res.status(404).json({ mensagem: 'Paciente não encontrado.' });
    }
    res.json(paciente);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar paciente.', erro: error.message });
  }
});

app.put('/pacientes/:id', verificaJWT, async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) {
      return res.status(404).json({ mensagem: 'Paciente não encontrado.' });
    }
    const { nome, idade, sexo, usuario, senha } = req.body;
    await paciente.update({ nome, idade, sexo, usuario, senha });
    res.json(paciente);
  } catch (error) {
    res.status(400).json({ mensagem: 'Erro ao atualizar paciente.', erro: error.message });
  }
});

app.delete('/pacientes/:id', verificaJWT, async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) {
      return res.status(404).json({ mensagem: 'Paciente não encontrado.' });
    }
    await paciente.destroy();
    res.json({ mensagem: 'Paciente removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao remover paciente.', erro: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
