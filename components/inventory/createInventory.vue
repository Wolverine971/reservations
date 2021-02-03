<template>
  <v-dialog v-model="dialog" width="500">
    <template #activator="{ on, attrs }">
      <v-btn color="blue lighten-2" dark v-bind="attrs" v-on="on">
        Create Inventory Date and Time
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Create Inventory Date and Time</v-card-title>
      <v-card-text>
        <v-row>
          <date-range @datesSelected="dates = $event" />
          <time-range @timesSelected="times = $event" />
        </v-row>
        <v-row>
          <v-text-field
            v-model="reservationsCount"
            type="number"
            label="Number of Reservations Available"
            append-outer-icon="mdi-plus"
            prepend-icon="mdi-minus"
            @click:append-outer="increment"
            @click:prepend="decrement"
          />
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn outlined @click="save">
          Save Inventory
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import uuid from 'uuid-random'
import { getFormattedDate, getFormattedTime } from '../../utils'
import DateRange from './dateRange'
import TimeRange from './timeRange'
export default {
  name: 'CreateInventory',
  components: { DateRange, TimeRange },
  data () {
    return {
      dialog: false,
      reservationsCount: 0,
      times: null,
      dates: null
    }
  },
  mounted () {
    const currentDate = getFormattedDate()
    this.dates = [currentDate, currentDate]
    const currentTime = getFormattedTime()
    this.times = `${currentTime} ~ ${currentTime}`
  },
  methods: {
    save () {
      const times = this.times.split(' ~ ')
      const start = this.processDate(times[0], new Date(this.dates[0]))
      const end = this.processDate(times[1], new Date(this.dates[1] ? this.dates[1] : this.dates[0]))
      // difference in milliseconds
      const diff = end - start
      // gets number of days from milliseconds
      const eventNumber = Math.floor(diff / 86400000)
      const events = []

      let day = start.getDate()
      day += 1
      // loop through eventNumber and create an event for each day
      for (let i = 0; i <= eventNumber; i++) {
        const startDate = new Date(start.setDate(day + i))
        const endDate = new Date(end.setDate(day + i))
        events.push({
          id: uuid(),
          name: `Reservations: ${this.reservationsCount}`,
          start: startDate,
          end: endDate,
          color: 'blue',
          reservationAvailable: this.reservationsCount,
          timed: true
        })
      }
      this.$emit('inventoryCreated', events)
      this.dialog = false
    },
    increment () {
      this.reservationsCount = parseInt(this.reservationsCount, 10) + 1
    },
    decrement () {
      if (this.reservationsCount > 0) {
        this.reservationsCount = parseInt(this.reservationsCount, 10) - 1
      }
    },
    processDate (times, date) {
      const startTimes = times.split(':')
      const newDate = new Date(date)
      newDate.setHours(startTimes[0])
      newDate.setMinutes(startTimes[1])
      return newDate
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
