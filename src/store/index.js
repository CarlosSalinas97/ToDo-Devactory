import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    tareas:[],
  },
  mutations: {
    setTareas(state, tarea){
      state.tareas = tarea
    },
    getTareas(state, tarea){
      state.tareas = tarea
    },
  },
  actions: {
    //Funcion correspondiente a traer todos las tareas almacenadas en la API. Se lanza al cargar la página.
    getTareas({commit}){
      axios.get('https://todo-api-devactory.herokuapp.com/api/todo')
      .then(function(res){
        commit('getTareas', res.data)
      })
      .catch(function(err){
        console.log(err)
      })
    },

    //Funcion correspondiente a crear tareas. Se lanza al presionar Enter en el input principal.
    setTareas({commit, dispatch}, tarea){
      axios.post('https://todo-api-devactory.herokuapp.com/api/add', {texto: tarea})
      .then(function(res){
        commit('setTareas', res.data)
        dispatch('getTareas')
      })
      .catch(function(err){
        console.log('Error Post',err)
      })
    },

    //Funcion correspondiente a borrar tareas. Se lanza al presionar el boton X a la derecha de las tareas o al presionar el botón correspondiente a eliminar todas las completadas.
    removeTarea({dispatch}, _id){
      axios.delete(`https://todo-api-devactory.herokuapp.com/api/borrar/${_id}`)
      .then(function(res){
        dispatch('getTareas')
      })
      .catch(function(err){
        console.log(err)
      })
    },

    /*Funcion correspondiente a editar tareas ya creadas, dependiendo de los parametros puede editar si esta activo o no, o el campo texto de la tarea. 
    Se lanza mediante la selección de los checkbox o al terminar de editar una tarea presionando enter.*/
    editTarea({dispatch}, tarea){
      if (typeof tarea.input === "boolean"){
        //Edita el estado de activo o no
        axios.put(`https://todo-api-devactory.herokuapp.com/api/editar/${tarea.id}`, {activo: tarea.input})
        .then(function(res){
          dispatch('getTareas')
        })
        .catch(function(err){
          console.log(err)
      })
      } else {
        //Edita el campo texto de la nota
        axios.put(`https://todo-api-devactory.herokuapp.com/api/editar/${tarea.id}`, {texto: tarea.input})
        .then(function(res){
          dispatch('getTareas')
        })
        .catch(function(err){
          console.log(err)
        })
      }
    }
  },
})
