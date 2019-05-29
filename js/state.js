// this single js file replaces the state concept from the react framework.

// First define state variables in the states array. For each variable set an
// initial value and any DOM elements that should update when it changes.
var states = []

function createState (state) {
  if (state._var == null || state.value == null || state.listeners == null) return false

  states.push(state)
  updateListeners()
  return state
}

function deleteState (targetState) {
  let state = states.find(state => state._var === targetState._var)
  if (!state) state = states.find(state => state._var === targetState)
  if (!state) return false

  updateListeners()
  return states.splice(states.indexOf(state), 1)
}

function updateListeners (_var) {
  if (_var) {
    let state = states.find(state => state._var === _var)
    if (!state) return false

    state.listeners.forEach(listener => {
      let listeningElement = document.querySelector("#" + listener)
      listeningElement.textContent = state.value
    })
  } else {
    states.forEach(state => {
      state.listeners.forEach(listener => {
        let listeningElement = document.querySelector("#" + listener)
        listeningElement.textContent = state.value
      })
    })
  }
}

function setState (_var, value, listeners) {
  let state = states.find(state => state._var === _var)
  if (!state) {
    return(createState({
      _var: _var,
      value: value,
      listeners: listeners || []
    }))
  }

  state._var = _var
  state.value = value
  if (listeners) state.listeners = listeners
  updateListeners(_var)
  return state
}

function getState (_var) {
  let state = states.find(state => state._var === _var)
  if (!state) return false

  return state.value
}

updateListeners()

export { setState, getState, deleteState }
