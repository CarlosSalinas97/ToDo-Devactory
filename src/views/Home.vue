<template>
  <div class="home">
    <section>
      <header>
        <div class="container d-flex flex-column">
          <div class="d-flex flex-column align-items-center justify-content-center">
            <div class="row"><h1 class="display-1">To Do List</h1></div>
            <div class="row">
              <!-- Form-Input correspiente a la carga de tareas. El formulario se envia al presionar la tecla Enter -->
              <form @submit.prevent="setTareas(tarea)">
                <div class="col-12 input-group input-group-lg">
                  <input type="text" class="form-control" aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Que necesita recordar?" v-model="tarea" @keydown.enter="submit" @keyup.enter="clearInput()" autofocus="autofocus" style="width:300px;">
                </div>
              </form>
            </div>
          </div>
        </div>
      </header>
      
      <section>
        <div class="container d-flex flex-column">
          <div class="d-flex flex-column align-items-center justify-content-center">
            <!-- Mostrar tareas -->
            <ul class="list-group list-group-flush border border-dark rounded mt-2" style="width: 60%;">
              <li class="list-group-item" v-for="(tarea, index) in mapeoFiltrado">

                <!-- Muestra aquellas tareas que NO estan terminadas -->
                <div class="row" v-if="tarea.activo">
                  <div class="col-lg-1 col-12"><input type="checkbox" @click="editTarea({id: tarea._id, input: false})"></div>
                  <div class="col-lg-10 col-12">
                    <label :id="index" v-show="modTarea != [index]" @dblclick = editarTarea(index) style="word-break: break-all;">{{tarea.texto}}</label>
                    <input type="text" class="form-control" v-show="modTarea == [index]"  v-model="tarea.texto" @keydown.enter="editTarea({id: tarea._id, input: tarea.texto})" @keyup.enter="editarTarea(index)">
                  </div>
                  <div class="col-lg-1 col-12"><button type="button" class="btn btn-outline-danger" @click="removeTareaIncompleta(tarea._id)" style="border-radius: 25px;border: none;">X</button></div>
                </div>

                <!-- Muestra aquellas tareas que estan terminadas -->
                <div class="row" v-else>
                  <div class="col-lg-1 col-12"><input type="checkbox" @click="editTarea({id: tarea._id, input: true})" checked></div>
                  <div class="col-lg-10 col-12"><label :id="index" v-show="modTarea != [index]" style="word-break: break-all;"><del>{{tarea.texto}}</del></label></div>
                  <div class="col-lg-1 col-12"><button type="button" class="btn btn-outline-danger" @click="removeTarea(tarea._id)" style="border-radius: 25px;border: none;">X</button></div>
                </div>
              </li>
            </ul>
          </div>    
        </div>
      </section>

      <!-- Botones de filtro (Todos, Activo, Completados) y boton "Limpiar completados"-->
      <footer>
        <div class="container d-flex mt-2 justify-content-center">
          <div class="d-flex">
              <div class="row">
                <div class="col-lg-6 col-12 d-flex justify-content-lg-start justify-content-center">
                  <div class="btn-group" role="group">
                    <button type="button" class="btn btn-secondary" @click="setFiltro(0)">Todos</button>
                    <button type="button" class="btn btn-secondary" @click="setFiltro(1)">Pendientes</button>
                    <button type="button" class="btn btn-secondary" @click="setFiltro(2)">Completados</button>
                  </div>
                </div>
                <div class="col-lg-6 col-12 d-flex justify-content-lg-end justify-content-center mt-lg-0 mt-2">
                  <button type="button" class="btn btn-danger" @click="borrarCompletos()">Limpiar completados</button>
                </div>
            </div>
          </div>
        </div>
      </footer>
    </section>

    <!-- Pie de página -->
    <footer class="container info mt-5" style="color: #bfbfbf;font-size: 12px;text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);text-align: center;text-decoration: none;">
        <p>Hecho por <a href="https://www.linkedin.com/in/carlos-ariel-salinas/" target="_blank" style="color: inherit;">Carlos Salinas</a></p>
        <p>Ejercicio de evaluación para Devactory</p>
        <p>
          <a href="https://github.com/CarlosSalinas97/ToDo-API-Devactory" target="_blank" style="text-decoration: none; color: inherit;">Repositorio API</a>
           | 
          <a href="https://github.com/CarlosSalinas97/ToDo-Devactory" target="_blank" style="text-decoration: none; color: inherit;">Repositorio</a>
        </p>
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
    //Mapea de los estados definidos en el Store de Vuex
    ...mapState(['tareas']),

    //Mapeo filtrado de acuerdo al estado(activo: true/false) de las tareas.
    mapeoFiltrado: function(){
      if (this.filtro == 0){
        //Mapea todas las tareas
        return this.tareas
      } else if (this.filtro == 1){
        //Mapea las tareas activas (activo: true)
        return this.tareas.filter(i => i.activo === true)
      } else if (this.filtro == 2){
        //Mapea las tareas finalizadas (activo: false)
        return this.tareas.filter(i => i.activo === false)
      }
    },
  },
  created(){
    //Carga la página con todas las tareas en la BBDD
    this.getTarea
  },
  methods:{
    //Mapeo de las acciones definidas en el Store de Vuex
    ...mapActions(['setTareas','getTareas','removeTarea', 'editTarea']),

    //Limpia el input al presionar enter.
    clearInput(){
      this.tarea = ""
    },

    //Funcion encargada de transformar el label con el texto de la tarea, a un Input en el caso que se quiera modificar dicha tarea.
    editarTarea(id){
      if (this.modTarea != id){
        //Asigna el id correspondiente a la tarea
        this.modTarea = id
      }else{
        //Limpia la variable
        this.modTarea = null
      }
    },

    //Funcion encargada de administrar los botones de filtro (Todos, Pendientes, Completados).
    setFiltro(num){
      if (num == 0){
        //Filtro para mostrar Todos
        this.filtro = 0
      }else if (num == 1){
        //Filtro para mostrar Pendientes
        this.filtro = 1
      }else if (num == 2){
        //Filtro para mostrar Completados
        this.filtro = 2
      }
    },

    //Funcion encargada de borrar todas las tareas marcadas como completas. Su lanzador es el botón "Limpiar completados"
    borrarCompletos(){
      for (let i in this.mapeoFiltrado){
        if (this.mapeoFiltrado[i].activo === false){
          this.removeTarea(this.mapeoFiltrado[i]._id)
        }
      }
    },

    //Funcion encargada de notificar al usuario cuando el mismo quiere eliminar una tarea no completada, solicitandole confirmación para realizar o no el borrado.
    removeTareaIncompleta(id){
      this.$swal({
        title: '¿Estás seguro?',
        text: "Todavía no terminaste esta tarea",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, borrar',
        cancelButtonText: 'Cancelar'
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.removeTarea(id)
          this.$swal(
            'Borrado!',
            'La tarea ha sido eliminada.',
            'success',
          )
        }
      });
    }
  }
}
</script>