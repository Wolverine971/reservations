<template>
  <div>
    <v-dialog ref="dialog" v-model="menu" persistent width="50%">
      <template #activator="{ on, attrs }">
        <v-text-field
          v-model="timeRange"
          label="Time Range"
          prepend-icon="mdi-clock-time-four-outline"
          readonly
          v-bind="attrs"
          v-on="on"
        />
      </template>
      <v-card>
        <v-row>
          <v-col>
            <v-card-title for="start">
              Start Time
            </v-card-title>
            <v-time-picker
              v-if="menu"
              id="start"
              v-model="start"
              label="Start Time"
              :max="end ? end.toString() : null"
              :allowed-minutes="allowedStep"
              full-width
            />
          </v-col>
          <v-col>
            <v-card-title for="end">
              End Time
            </v-card-title>
            <v-time-picker
              v-if="menu"
              id="end"
              v-model="end"
              label="End Time"
              :min="endMin"
              :allowed-minutes="allowedStep"
              full-width
            />
          </v-col>
        </v-row>
        <p v-if="error" class="error">
          {{ error }}
        </p>
        <v-card-actions>
          <v-spacer />
          <v-btn text outlined @click="menu = false">
            Cancel
          </v-btn>
          <v-btn text outlined :disabled="!start || !end" @click="save">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'TimeRange',
  data () {
    return {
      menu: false,
      start: null,
      end: null,
      error: null,
      reservationsInterval: 15,
      endMin: null
    }
  },
  computed: {
    timeRange () {
      return [this.start, this.end].join(' ~ ')
    }
  },
  watch: {
    start (val) {
      if (val) {
        const splitVal = val.split(':')
        const addFifteen = (parseInt(splitVal[1]) + 15).toString()
        this.endMin = [splitVal[0], addFifteen].join(':')
        this.end = this.endMin
      } else {
        return null
      }
    }
  },
  methods: {
    allowedStep (m) {
      return m % this.reservationsInterval === 0
    },
    save () {
      if (!this.start) {
        this.error = 'please pick a start time'
      } else if (!this.end) {
        this.error = 'please pick a end time'
      } else {
        this.error = null
        this.menu = false
        this.$refs.dialog.save(this.timeRange)
        this.$emit('timesSelected', this.timeRange)
      }
    }
  }
}
</script>

<style>
.error {
  color: red;
}
</style>
