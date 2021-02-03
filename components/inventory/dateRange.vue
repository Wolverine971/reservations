<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :return-value.sync="date"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        v-model="dateRangeText"
        label="Date Range"
        prepend-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        v-on="on"
      />
    </template>
    <v-card>
      <v-card-title>Pick a Date Range</v-card-title>
      <v-date-picker v-model="dates" range show-current />
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="primary"
          @click="menu = false"
        >
          Cancel
        </v-btn>
        <v-btn
          text
          color="primary"
          @click="save"
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import { getFormattedDate } from '~/utils'
export default {
  name: 'DateRange',
  data: () => ({
    dates: ['2019-09-10', '2019-09-20'],
    menu: false,
    date: null
  }),
  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    }
  },
  mounted () {
    const formattedDate = getFormattedDate()
    this.dates = [formattedDate, formattedDate]
  },
  methods: {
    save () {
      this.sortDates()
      this.$emit('datesSelected', this.dates)
      this.menu = false
    },
    sortDates () {
      if (this.dates[0] && this.dates[1] && this.dates[0] > this.dates[1]) {
        const newDates = []
        const temp = this.dates[0]
        newDates.push(this.dates[1])
        newDates.push(temp)
        this.dates = [...newDates]
      }
    }
  }
}
</script>

<style></style>
