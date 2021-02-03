<template>
  <div>
    <h1>Inventory</h1>
    <v-sheet tile class="d-flex">
      <v-btn icon class="ma-2 btn-bottom" @click="$refs.calendar.prev()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-col>
        <v-row>
          <create-inventory @inventoryCreated="addToCalendar" />
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
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x
      >
        <event-detail :selected-event="selectedEvent" @updateEvent="updateInventory" />
      </v-menu>
    </v-sheet>
  </div>
</template>

<script>
import CreateInventory from '../components/inventory/createInventory'
import EventDetail from '~/components/inventory/eventDetail.vue'
export default {
  name: 'Inventory',
  components: { CreateInventory, EventDetail },
  data () {
    return {
      type: 'month',
      types: ['month', 'week', 'day'],
      mode: 'stack',
      modes: ['stack', 'column'],
      weekday: [0, 1, 2, 3, 4, 5, 6],
      events: [],
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      focus: ''
    }
  },
  methods: {
    newDates (dates) {
      this.dates = dates
    },
    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => {
          this.selectedOpen = true
        }, 10)
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    setToday () {
      this.focus = ''
    },
    addToCalendar (events) {
      this.events = [...this.events, ...events]
      this.$store.commit('addInventory', events)
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
      this.selectedOpen = false
      this.$store.commit('replaceInventory', this.events)
    }
  }
}
</script>

<style>
.btn-bottom {
  align-self: flex-end;
}
</style>
