<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: false,
  },
  submsg: {
    type: String,
    required: false,
  },
  link: {
    type: String,
    required: false,
  },
  style: {
    type: String,
    required: false,
  }
})
</script>

<template>
  <div class="item">
    <i>
      <a :href="link" target="_blank" rel="noopener">
        <img :alt="msg" class="logo" :src="img" width="35" height="35" />
      </a>
    </i>
    <a :href="link" target="_blank" rel="noopener">
      <div class="details">
          <h3>
            {{ msg }}
          </h3>
          <p class="submsg" :style="style">{{ submsg }}</p>
      </div>
    </a>
  </div>
</template>

<style scoped>

.submsg {
  opacity: 0.5;
}

.logo {
  display: block;
  margin: 0 auto 0rem;
}

.item {
  margin-top: 0rem;
  display: flex;
  position: relative;
}

.details {
  flex: 1;
  margin-left: 0rem;
}

i {
  display: flex;
  place-items: center;
  place-content: center;
  width: 50px;
  height: 50px;

  color: var(--color-text);
}

h3 {
  font-size: 1.2rem;
  font-weight: 500;
  padding-top: 0rem;
  margin-top: -0.2rem;
  margin-bottom: 0rem;
  color: var(--color-heading);
}

@media (min-width: 128px) {
  .item {
    margin-top: 0;
    padding: 0.1rem 0 0.5rem calc(var(--section-gap) / 2.5);
  }

  i {
    top: calc(50% - 25px);
    left: 0px;
    position: absolute;
    border: 1px solid var(--color-border);
    background: var(--color-background);
    border-radius: 8px;
    width: 50px;
    height: 50px;
  }

  .item:before {
    content: ' ';
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 26px;
    bottom: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:after {
    content: ' ';
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 26px;
    top: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:first-of-type:before {
    display: none;
  }

  .item:last-of-type:after {
    display: none;
  }
}
</style>
