<template>
  <v-dialog v-model="dialog" width="500" :disabled="error">
    <template #activator="{ on, attrs }">
      <div v-bind="attrs" class="btn-col" v-on="on">
        <v-btn color="blue lighten-2" :disabled="error">
          Create Reservation
        </v-btn>
        <p v-if="error" class="res-error">
          {{ error }}
        </p>
      </div>
    </template>
    <v-card>
      <v-card-title>Create Reservation</v-card-title>
      <v-card-text>
        <v-text-field v-model="name" label="Name" />
        <v-text-field
          v-model="email"
          label="Email"
          :rules="emailRules"
          required
        />
        <v-row>
          <v-text-field
            v-model="partySize"
            type="number"
            dense
            outlined
            hide-details
            class="ma-2"
            label="Party Size"
          />
        </v-row>
        <v-row>
          <v-select
            v-model="selectedMonth"
            :items="monthOptions"
            dense
            outlined
            hide-details
            class="ma-2"
            label="Select Month"
          />
          <v-select
            v-model="selectedDay"
            :items="dayOptions"
            dense
            outlined
            hide-details
            class="ma-2"
            label="Select Day"
          />
        </v-row>
        <v-row>
          <v-select
            v-model="selectedTime"
            :items="timeOptions"
            dense
            outlined
            hide-details
            label="Available Times"
            class="ma-2"
          />
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn outlined :disabled="!timeSlot" @click="save">
          Save Reservation
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import uuid from 'uuid-random'
export default {
  name: 'CreateReservation',
  data () {
    return {
      monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ],
      events: [],
      name: '',
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      dialog: false,
      partySize: 0,
      selectedMonth: null,
      selectedDay: null,
      selectedTime: null,
      timeSlot: null,
      monthIndex: 0,
      error: null
    }
  },
  computed: {
    currentReservations () {
      return this.$store.getters.getCurrentReservations
    },
    availableDates () {
      return this.$store.getters.getAvailableDates
    },
    monthOptions () {
      if (this.availableDates) {
        return this.availableDates.map((month) => {
          return this.monthNames[month.start.getMonth()]
        })
      } else {
        return []
      }
    },
    dayOptions () {
      if (this.selectedMonth) {
        const availableDates = this.availableDates.map((date) => {
          if (this.monthNames[date.start.getMonth()] === this.selectedMonth) {
            const day = date.start.getDate()
            return day
          }
          return []
        })
        return availableDates
      } else {
        return []
      }
    },
    timeOptions () {
      if (this.selectedDay) {
        const availableTimes = this.availableDates
          .map((date) => {
            if (
              this.monthNames[date.start.getMonth()] === this.selectedMonth &&
              date.start.getDate() === this.selectedDay
            ) {
              // brute force check
              if (this.checkAvailable(date)) {
                const start = `${date.start.getHours()}:${
                  date.start.getMinutes() ? date.start.getMinutes() : '00'
                }`
                const end = `${date.end.getHours()}:${
                  date.end.getMinutes() ? date.end.getMinutes() : '00'
                }`
                return `${start} ~ ${end}`
              } else {
                return []
              }
            }
            return []
          })
          .filter(t => t.length)
        return availableTimes
      } else {
        return []
      }
    }
  },
  watch: {
    selectedTime (val) {
      const timeSlot = this.availableDates.filter(
        date =>
          this.monthNames[date.start.getMonth()] === this.selectedMonth &&
          date.start.getDate() === this.selectedDay &&
          val.split(':')[0] === date.start.getHours().toString()
      )
      this.timeSlot = timeSlot.length ? timeSlot[0] : null
    },
    selectedMonth (val) {
      this.monthIndex = this.monthNames.indexOf(val)
    },
    dialog (val) {
      if (val) {
        this.checkInventory(this.availableDates)
      }
    }
  },
  mounted () {
    this.checkInventory(this.availableDates)
  },
  methods: {
    save () {
      const newReservation = {
        id: uuid(),
        name: `${this.name}: party of ${this.partySize}`,
        email: this.email,
        partySize: this.partySize,
        start: this.timeSlot.start,
        end: this.timeSlot.end,
        color: 'red',
        timed: true
      }
      this.$emit('reservationCreated', [newReservation])
      this.dialog = false
      this.clearData()
    },
    checkAvailable (selectedInventory) {
      const reservationDates = {}
      this.currentReservations.forEach((r) => {
        if (!reservationDates[r.start]) {
          reservationDates[r.start] = 1
        } else {
          reservationDates[r.start] += 1
        }
      })
      if (
        !reservationDates[selectedInventory.start] ||
        reservationDates[selectedInventory.start] < selectedInventory.inventory
      ) {
        return true
      } else {
        return false
      }
    },
    checkInventory (inventory) {
      if (inventory.length === 0) {
        this.error = 'No Inventory Available'
      } else {
        this.error = null
      }
    },
    clearData () {
      this.name = ''
      this.email = ''
      this.partySize = 0
      this.selectedMonth = null
      this.selectedDay = null
      this.selectedTime = null
      this.timeSlot = null
    }
  }
}
</script>

<style>
.res-error {
  color: red;
}
.btn-col{
  display: flex;
  flex-direction: column;
}
</style>
