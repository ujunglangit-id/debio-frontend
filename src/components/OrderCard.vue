<template>
  <CardButton :disabled="disabled" @click="onClick">
    <div class="dg-order-card d-flex align-center fill-height py-2 pr-4" style="width: 100%">
      <div class="my-3 ml-5">
        <v-icon
          v-if="_icon"
          color="#BA8DBB"
          :size="48"
        >
          {{ _icon }}
        </v-icon>
        <v-avatar v-else>
          <img src="../assets/degenics-logo.png" />
        </v-avatar>
      </div>
      <div class="ml-5" style="width: 100%; overflow:hidden;">
        <div class="text-h7 text-truncate" >
          <b>{{ title }}</b>
        </div>
        <div class="text-body-2 grey--text text--darken-1">
          {{ specimenNumber | specimenNumber }}
        </div>
        <div class="text-body-1 grey--text text--darken-1 mt-2">
          <b>{{ labName }}</b>
        </div>
        <div class="d-flex align-center justify-space-between fill-height" style="margin-top: -4px;">
          <div class="text-body-2 grey--text text--darken-1">
            {{ timestamp | timestampToDateTime }}
          </div>
          <div v-if="status">
            <StatusChip :status="status" />
          </div>
        </div>
      </div>
    </div>
  </CardButton>
</template>

<script>
import CardButton from './CardButton'
import StatusChip from './StatusChip'

export default {
  name: 'OrderCard',
  components: {
    CardButton,
    StatusChip,
  },
  props: {
    icon: String,
    title: String,
    specimenNumber: String,
    labName: String,
    timestamp: String,
    status: String,
    disabled: Boolean,
  },
  computed: {
    _icon() {
      return this.icon && (this.icon.startsWith('mdi') || this.icon.startsWith('$'))
        ? this.icon
        : ''
    },
  },
  methods: {
    onClick() {
      this.$emit('click')
    }
  },
}
</script>

<style lang="scss">
.dg-order-card {
  min-height: 118.85px;
}
</style>
