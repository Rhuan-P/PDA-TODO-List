import { supabase } from '../config/supabase.js';

class Tarefa {
  static async findAll() {
    const { data, error } = await supabase
      .from('tarefas')
      .select('*')
      .order('criado_em', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('tarefas')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async create(tarefaData) {
    const { data, error } = await supabase
      .from('tarefas')
      .insert([tarefaData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async update(id, tarefaData) {
    const { data, error } = await supabase
      .from('tarefas')
      .update(tarefaData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('tarefas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  static async findByStatus(status) {
    const { data, error } = await supabase
      .from('tarefas')
      .select('*')
      .eq('status', status)
      .order('criado_em', { ascending: false });
    
    if (error) throw error;
    return data;
  }
}

export default Tarefa;
