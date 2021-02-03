<template>
  <v-card color="grey lighten-4" min-width="350px" flat>
    <v-toolbar :color="selectedEvent.color" dark>
      <v-btn icon @click="edit = !edit">
        <v-icon>{{ edit ? 'mdi-pencil' : 'mdi-pencil-off' }}</v-icon>
      </v-btn>
      <v-toolbar-title> {{ selectedEvent.name }}</v-toolbar-title>
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <single-time-picker :readonly="!edit" :label="'Start'" :time="getTime(selectedEvent.start)" @timePicked="setStartTime" />
      <single-time-picker :readonly="!edit" :label="'End'" :time="getTime(selectedEvent.end)" @timePicked="setEndTime" />
      <v-text-field
        v-model="reservations"
        type="number"
        :readonly="!edit"
        label="Reservations Available"
        :value="selectedEvent.reservationAvailable"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn text color="secondary" @click="selectedOpen = false">
        Cancel
      </v-btn>
      <v-btn text color="secondary" @click="save">
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import SingleTimePicker from './singleTimePicker'
export default {
  name: 'EventDetail',
  components: { SingleTimePicker },
  props: {
    selectedEvent: {
      type: Object,
      default: null,
      required: true
    }
  },
  data () {
    return {
      selectedOpen: false,
      edit: false,
      start: null,
      end: null,
      reservations: null
    }
  },
  watch: {
    selectedEvent (val) {
      this.parseEvent(val)
    }
  },
  mounted () {
    this.parseEvent(this.selectedEvent)
  },
  methods: {
    getTime (date) {
      return `${date.getHours()}:${
        date.getMinutes() ? date.getMinutes() : '00'
      }`
    },
    save () {
      const updatedEvent = {
        id: this.selectedEvent.id,
        name: `Reservations: ${this.reservations}`,
        start: this.start,
        end: this.end,
        reservationAvailable: this.reservations
      }
      this.$emit('updateEvent', updatedEvent)
      this.selectedOpen = false
    },
    setStartTime (time) {
      const splitTime = time.split(':')
      this.start = new Date(this.selectedEvent.start)
      this.start.setHours(splitTime[0])
      this.start.setMinutes(splitTime[1])
    },
    setEndTime (time) {
      const splitTime = time.split(':')
      this.end = new Date(this.selectedEvent.end)
      this.end.setHours(splitTime[0])
      this.end.setMinutes(splitTime[1])
    },
    parseEvent (event) {
      this.start = event.start
      this.end = event.end
      this.reservations = event.reservationAvailable
    }
  }
}
</script>

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
