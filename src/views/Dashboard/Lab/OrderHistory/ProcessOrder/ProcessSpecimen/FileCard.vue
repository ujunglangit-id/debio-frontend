<template>
  <v-card class="dg-card px-3 py-2 mb-2">
    <div class="d-flex align-center">
      <div>{{ filename }}</div>
      <v-spacer />
      <div class="d-flex">
        <a :href="ipfsUrl" target="_blank" style="text-decoration: none;">
          <v-btn icon text>
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </a>
        <v-btn v-if="!hideDelete" @click="onDeleteClick" icon text>
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    filename: String,
    ipfsUrl: String,
    hideDelete: Boolean
  },
  methods: {
    onDeleteClick() {
      this.$emit('delete', this.file)
    },
  }
}
</script>

<style>

</style>