import { Router } from 'express';
import { 
  listarTarefas, 
  criarTarefa, 
  buscarTarefa, 
  atualizarTarefa, 
  excluirTarefa 
} from '../controllers/tarefasController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tarefas
 *   description: Gerenciamento de tarefas
 * 
 * components:
 *   schemas:
 *     Tarefa:
 *       type: object
 *       required:
 *         - titulo
 *       properties:
 *         id:
 *           type: integer
 *           description: ID da tarefa
 *           example: 1
 *         titulo:
 *           type: string
 *           description: Título da tarefa
 *           example: "Fazer compras"
 *         descricao:
 *           type: string
 *           description: Descrição detalhada da tarefa
 *           example: "Comprar itens do mês no supermercado"
 *         status:
 *           type: string
 *           enum: [pendente, em_andamento, concluida]
 *           default: pendente
 *           description: Status atual da tarefa
 *           example: "pendente"
 *         criado_em:
 *           type: string
 *           format: date-time
 *           description: Data de criação da tarefa
 *           example: "2023-11-13T15:30:00.000Z"
 *         atualizado_em:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização da tarefa
 *           example: "2023-11-13T15:30:00.000Z"
 *     Erro:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensagem de erro
 *         message:
 *           type: string
 *           description: Descrição detalhada do erro
 */

/**
 * @swagger
 * /api/tarefas:
 *   get:
 *     summary: Lista todas as tarefas
 *     tags: [Tarefas]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pendente, em_andamento, concluida]
 *         description: Filtro por status
 *     responses:
 *       200:
 *         description: Lista de tarefas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tarefa'
 *       500:
 *         description: Erro ao buscar tarefas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.get('/', listarTarefas);

/**
 * @swagger
 * /api/tarefas:
 *   post:
 *     summary: Cria uma nova tarefa
 *     tags: [Tarefas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título da tarefa
 *                 example: "Fazer compras"
 *               descricao:
 *                 type: string
 *                 description: Descrição detalhada da tarefa
 *                 example: "Comprar itens do mês no supermercado"
 *               status:
 *                 type: string
 *                 enum: [pendente, em_andamento, concluida]
 *                 description: Status inicial da tarefa
 *                 example: "pendente"
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tarefa'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.post('/', criarTarefa);

/**
 * @swagger
 * /api/tarefas/{id}:
 *   get:
 *     summary: Busca uma tarefa pelo ID
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: ID da tarefa
 *     responses:
 *       200:
 *         description: Tarefa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tarefa'
 *       404:
 *         description: Tarefa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       500:
 *         description: Erro ao buscar tarefa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.get('/:id', buscarTarefa);

/**
 * @swagger
 * /api/tarefas/{id}:
 *   put:
 *     summary: Atualiza uma tarefa existente
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: ID da tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Novo título da tarefa
 *                 example: "Fazer compras atualizado"
 *               descricao:
 *                 type: string
 *                 description: Nova descrição da tarefa
 *                 example: "Comprar itens do mês no supermercado e na farmácia"
 *               status:
 *                 type: string
 *                 enum: [pendente, em_andamento, concluida]
 *                 description: Novo status da tarefa
 *                 example: "em_andamento"
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tarefa'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       404:
 *         description: Tarefa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.put('/:id', atualizarTarefa);

/**
 * @swagger
 * /api/tarefas/{id}:
 *   delete:
 *     summary: Remove uma tarefa
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: ID da tarefa
 *     responses:
 *       204:
 *         description: Tarefa removida com sucesso
 *       404:
 *         description: Tarefa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       500:
 *         description: Erro ao excluir tarefa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.delete('/:id', excluirTarefa);

export default router;
