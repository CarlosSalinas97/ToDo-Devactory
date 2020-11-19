<template>
  <div class="home">

    <section>
      <header>
        <h1>To Do</h1>
        <!-- Cargar ToDos -->
        <form @submit.prevent="setTareas(tarea)">
          <input type="text" placeholder="Que necesita recordar?" v-model="tarea" @keydown.enter="submit" @keyup.enter="clearInput()" autofocus="autofocus">
        </form>
      </header>
      
      <section>
        <!-- Mostrar ToDos -->
        <ul>
          <li v-for="(tarea, index) in mapeoFiltrado">
            <div v-if="tarea.activo">
              <input type="checkbox" @click="editTarea({id: tarea._id, input: false})">
              <label :id="index" v-show="modTarea != [index]" @dblclick = editarTarea(index)>{{tarea.texto}}</label>
              <input type="text" v-show="modTarea == [index]"  v-model="tarea.texto" @keydown.enter="editTarea({id: tarea._id, input: tarea.texto})" @keyup.enter="editarTarea(index)">
              <button @click="removeTarea({id: tarea._id})">X</button>
            </div>
            <div v-else>
              <input type="checkbox" @click="editTarea({id: tarea._id, input: true})" checked>
              <label :id="index" v-show="modTarea != [index]" @dblclick = editarTarea(index)>{{tarea.texto}}</label>
              <button @click="removeTarea({id: tarea._id})">X</button>
            </div>
          </li>

        </ul>
      </section>

      
      <footer>
        <!-- Botones de filtro (Todos, Activo, Completados) -->
        <ul>
          <li>
            <button @click="setFiltro(0)">Todos</button>
          </li>
          <li>
            <button @click="setFiltro(1)">Pendientes</button>
            </li>
          <li>
            <button @click="setFiltro(2)">Completados</button>
          </li>
        </ul>
        <button @click="borrarCompletos()">Limpiar completados</button>

      </footer>
    </section>

    <footer class="info">
      <p>Doble click para editar una tarea</p>
      <p>Hecho por <a href="https://www.linkedin.com/in/carlos-ariel-salinas/">Carlos Salinas</a></p>
      <p>Ejercicio de evaluación para Devactory</p>
    </footer>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import axios from 'axios'

export default {
  data(){
    return{
      tarea:'',
      modTarea: null,
      filtro:0,
    }
  },
  computed:{
    ...mapState(['tareas']),
    mapeoFiltrado: function(){
      if (this.filtro == 0){
        return this.tareas
      } else if (this.filtro == 1){
        return this.tareas.filter(i => i.activo === true)
      } else if (this.filtro == 2){
        return this.tareas.filter(i => i.activo === false)
      }
    },
  },
  created(){
    this.getTarea
  },
  methods:{
    ...mapActions(['setTareas','getTareas','removeTarea', 'editTarea']),
    clearInput(){
      this.tarea = ""
    },
    editarTarea(id){
      if (this.modTarea != id){
        this.modTarea = id
      }else{
        this.modTarea = null
      }
    },
    setFiltro(num){
      if (num == 0){
        this.filtro = 0
      }else if (num == 1){
        this.filtro = 1
      }else if (num == 2){
        this.filtro = 2
      }
    },
    borrarCompletos(){
      for (let i in this.mapeoFiltrado){
        if (this.mapeoFiltrado[i].activo === false){
          this.removeTarea(this.mapeoFiltrado[i]._id)
        }
      }
    },
  }
}
</script>
