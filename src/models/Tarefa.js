import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Tarefa = sequelize.define('Tarefa', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pendente', 'em_andamento', 'concluida'),
    defaultValue: 'pendente',
  },
}, {
  tableName: 'tarefas',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em',
});

export default Tarefa;
