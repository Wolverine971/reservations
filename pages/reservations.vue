<template>
  <div>
    <h1>Reservations</h1>
    <v-sheet tile class="d-flex">
      <v-btn icon class="ma-2 btn-bottom" @click="$refs.calendar.prev()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-col>
        <v-row>
          <create-reservation @reservationCreated="addToCalendar" />
          <v-spacer />
          <v-select
            v-model="type"
            :items="types"
            dense
            outlined
            hide-details
            class="ma-2"
            label="type"
          />
        </v-row>
      </v-col>
      <v-btn icon class="ma-2 btn-bottom" @click="$refs.calendar.next()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
    <v-sheet height="600">
      <v-calendar
        ref="calendar"
        v-model="focus"
        :weekdays="weekday"
        :type="type"
        :events="events"
        :event-overlap-mode="mode"
        :event-overlap-threshold="30"
        @click:event="showEvent"
        @click:more="viewDay"
        @click:date="viewDay"
      />
      <v-menu
        v-model="selectedReservationOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x
      >
        <reservation-detail :selected-event="selectedReservation" @updateEvent="updateReservation" />
      </v-menu>
      <v-menu
        v-model="selectedInventoryOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x
      >
        <event-detail :selected-event="selectedInventory" @updateEvent="updateInventory" />
      </v-menu>
    </v-sheet>
  </div>
</template>

<script>
import createReservation from '~/components/createReservation.vue'
import reservationDetail from '~/components/reservationDetails'
export default {
  name: 'Reservations',
  components: { createReservation, reservationDetail },
  data () {
    return {
      type: 'month',
      types: ['month', 'week', 'day'],
      mode: 'column',
      weekday: [0, 1, 2, 3, 4, 5, 6],
      value: '',
      events: [],
      selectedEvent: {},
      selectedReservation: {},
      selectedReservationOpen: false,
      selectedInventory: {},
      selectedInventoryOpen: false,
      selectedElement: null,
      focus: ''
    }
  },
  computed: {
    inventory () {
      return this.$store.getters.getInventory
    }
  },
  mounted () {
    this.events = this.inventory
  },
  methods: {
    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        if (event.email) {
          this.selectedReservation = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => {
            this.selectedReservationOpen = true
          }, 10)
        } else {
          this.selectedInventory = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => {
            this.selectedInventoryOpen = true
          }, 10)
        }
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    addToCalendar (events) {
      this.events = [...this.events, ...events]
      this.$store.commit('addReservation', events)
    },
    updateReservation (event) {
      let index = 0
      let target = {}
      this.events.forEach((e, i) => {
        if (e.id === event.id) {
          index = i
          target = e
        }
      })
      const replacement = Object.assign({}, target, event)
      //   this.selectedEvent = Object.assign({}, this.selectedEvent, event)
      this.events.splice(index, 1, replacement)
      this.selectedReservationOpen = false
      this.$store.commit('replaceReservations', this.events)
    },
    updateInventory (event) {
      let index = 0
      let target = {}
      this.events.forEach((e, i) => {
        if (e.id === event.id) {
          index = i
          target = e
        }
      })
      const replacement = Object.assign({}, target, event)
      //   this.selectedEvent = Object.assign({}, this.selectedEvent, event)
      this.events.splice(index, 1, replacement)
      this.selectedInventoryOpen = false
      this.$store.commit('replaceInventory', this.events)
    }
  }
}
</script>

<style></style>
