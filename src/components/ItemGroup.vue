<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  }
})
</script>


<template>
  <div class="itemcollector">
    <div class="itemgroup">
      <h2 class="rainbow-text">{{ title }}</h2>
      <slot></slot>
    </div>
  </div>
</template>


<style scoped>

.itemgroup {
  /* top: calc(50% - 25px); */
  /* left: 0px; */
  position: relative;
  /* border: 3px inset var(--color-border); */
  /* background: var(--color-background); */
  /* border-radius: 4px; */
  padding: 2px;
  margin: 5px;
  /* width: 50px;
  height: 50px; */
}

h2 {
  font-size: 1.65rem;
  font-weight: 500;
  color: var(--color-heading);
  text-align: left;
}

</style>