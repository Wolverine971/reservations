import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export interface AppState {
    inventory: any[],
    reservations: any[]
}
// STATE
export const state: AppState = {
  inventory: [],
  reservations: []
}

export const getters = {
  getInventory (state: AppState) {
    return state.inventory
  },
  getReservations (state: AppState) {
    return state.reservations
  },
  getCurrentReservations (state: AppState) {
    if (state.reservations) {
      return state.reservations.map((i) => {
        return {
          start: i.start,
          end: i.end
        }
      })
    } else {
      return []
    }
  },
  getAvailableDates (state: AppState) {
    if (state.inventory) {
      return state.inventory.map((i) => {
        return {
          start: i.start,
          end: i.end,
          inventory: i.reservationAvailable
        }
      })
    } else {
      return []
    }
  },
  getInventoryAvailabilityObj (state: AppState) {
    const inventory: any = {}
    if (state.inventory) {
      state.inventory.forEach((i) => {
        const month = i.start.getMonth()
        const date = i.start.getDate()
        const time = `${i.start.getHours()}:${i.start.getMinutes()}`
        const reservations = i.reservationAvailable
        inventory[month][date][time] = reservations
      })
      return inventory
    } else {
      return {}
    }
  },
  getCurrentReservationsObj (state: AppState) {
    const reservations: any = {}
    if (state.reservations) {
      state.reservations.forEach((i) => {
        const month = i.start.getMonth()
        const date = i.start.getDate()
        const time = `${i.start.getHours()}:${i.start.getMinutes()}`
        reservations[month][date][time] += 1
      })
      return reservations
    } else {
      return {}
    }
  }
}

// MUTATIONS
export const mutations = {
  addInventory (state: AppState, events: any[]) {
    state.inventory = [...state.inventory, ...events]
  },
  addReservation (state: AppState, events: any[]) {
    state.reservations = [...state.reservations, ...events]
  },
  replaceInventory (state: AppState, events: any[]) {
    state.inventory = [...events]
  },
  replaceReservations (state: AppState, events: any[]) {
    state.reservations = [...events]
  }
}

// ACTIONS
export const actions: any = {
}

const createStore = () =>
  new Vuex.Store({
    state,
    mutations,
    getters,
    actions
  })

export default createStore
