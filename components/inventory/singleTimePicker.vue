<template>
  <v-dialog
    ref="dialog"
    v-model="timePicker"
    :return-value.sync="pickedTime"
    :disabled="readonly"
    persistent
    width="290px"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        v-model="pickedTime"
        :label="label"
        prepend-icon="mdi-clock-time-four-outline"
        readonly
        v-bind="attrs"
        v-on="on"
      />
    </template>
    <v-time-picker
      v-if="timePicker"
      v-model="pickedTime"
      :readonly="readonly"
      full-width
      :allowed-minutes="allowedStep"
    >
      <v-spacer />
      <v-btn text color="primary" @click="timePicker = false">
        Cancel
      </v-btn>
      <v-btn text color="primary" @click="save">
        OK
      </v-btn>
    </v-time-picker>
  </v-dialog>
</template>

<script>
export default {
  name: 'SingleTimePicker',
  props: {
    label: {
      type: String,
      default: '',
      required: true
    },
    time: {
      type: String,
      default: '',
      required: true
    },
    readonly: {
      type: Boolean,
      default: true,
      required: true
    }
  },
  data () {
    return {
      timePicker: false,
      pickedTime: null
    }
  },
  watch: {
    time (val) {
      this.pickedTime = val
    }
  },
  mounted () {
    this.pickedTime = this.time
  },
  methods: {
    save () {
      this.$refs.dialog.save(this.pickedTime)
      this.$emit('timePicked', this.pickedTime)
      this.timePicker = false
    },
    allowedStep (m) {
      return m % 15 === 0
    }
  }
}
</script>

<style></style>
