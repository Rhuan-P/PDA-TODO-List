import Tarefa from '../models/Tarefa.js';

export const listarTarefas = async (req, res) => {
  try {
    const { status } = req.query;
    
    let tarefas;
    if (status) {
      tarefas = await Tarefa.findByStatus(status);
    } else {
      tarefas = await Tarefa.findAll();
    }
    
    res.json(tarefas);
  } catch (error) {
    console.error('Erro ao listar tarefas:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar tarefas',
      message: error.message 
    });
  }
};

export const criarTarefa = async (req, res) => {
  try {
    const { titulo, descricao } = req.body;
    
    if (!titulo) {
      return res.status(400).json({ 
        error: 'Dados inválidos',
        message: 'O título é obrigatório' 
      });
    }
    
    const tarefa = await Tarefa.create({ 
      titulo, 
      descricao: descricao || null,
      status: 'pendente'
    });
    
    res.status(201).json(tarefa);
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(400).json({ 
      error: 'Erro ao criar tarefa',
      message: error.message 
    });
  }
};

export const buscarTarefa = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        error: 'ID inválido',
        message: 'O ID deve ser um número' 
      });
    }
    
    const tarefa = await Tarefa.findById(parseInt(id));
    
    if (!tarefa) {
      return res.status(404).json({ 
        error: 'Tarefa não encontrada',
        message: `Nenhuma tarefa encontrada com o ID ${id}` 
      });
    }
    
    res.json(tarefa);
  } catch (error) {
    console.error(`Erro ao buscar tarefa ${req.params.id}:`, error);
    res.status(500).json({ 
      error: 'Erro ao buscar tarefa',
      message: error.message 
    });
  }
};

export const atualizarTarefa = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, status } = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        error: 'ID inválido',
        message: 'O ID deve ser um número' 
      });
    }
    
    // Verifica se a tarefa existe
    const tarefaExistente = await Tarefa.findById(parseInt(id));
    if (!tarefaExistente) {
      return res.status(404).json({ 
        error: 'Tarefa não encontrada',
        message: `Nenhuma tarefa encontrada com o ID ${id}` 
      });
    }
    
    // Atualiza apenas os campos fornecidos
    const dadosAtualizados = {};
    if (titulo !== undefined) dadosAtualizados.titulo = titulo;
    if (descricao !== undefined) dadosAtualizados.descricao = descricao;
    if (status !== undefined) {
      if (!['pendente', 'em_andamento', 'concluida'].includes(status)) {
        return res.status(400).json({
          error: 'Status inválido',
          message: 'O status deve ser: pendente, em_andamento ou concluida'
        });
      }
      dadosAtualizados.status = status;
    }
    
    if (Object.keys(dadosAtualizados).length === 0) {
      return res.status(400).json({
        error: 'Nenhum dado para atualizar',
        message: 'Forneça pelo menos um campo para atualização (titulo, descricao ou status)'
      });
    }
    
    const tarefaAtualizada = await Tarefa.update(parseInt(id), dadosAtualizados);
    res.json(tarefaAtualizada);
  } catch (error) {
    console.error(`Erro ao atualizar tarefa ${req.params.id}:`, error);
    res.status(500).json({ 
      error: 'Erro ao atualizar tarefa',
      message: error.message 
    });
  }
};

export const excluirTarefa = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        error: 'ID inválido',
        message: 'O ID deve ser um número' 
      });
    }
    
    // Verifica se a tarefa existe
    const tarefaExistente = await Tarefa.findById(parseInt(id));
    if (!tarefaExistente) {
      return res.status(404).json({ 
        error: 'Tarefa não encontrada',
        message: `Nenhuma tarefa encontrada com o ID ${id}` 
      });
    }
    
    await Tarefa.delete(parseInt(id));
    
    res.status(204).send();
  } catch (error) {
    console.error(`Erro ao excluir tarefa ${req.params.id}:`, error);
    res.status(500).json({ 
      error: 'Erro ao excluir tarefa',
      message: error.message 
    });
  }
};
