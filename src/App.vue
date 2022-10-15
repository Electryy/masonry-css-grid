<template>
  <div class="container">
    <div class="item" v-for="n in 10">
      <h5>Item {{ n }}</h5>
      <img :src="`https://picsum.photos/300/${randomNumber(50)}0`" alt="jea" />
      <p>
        {{ generateString() }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import daLibrary from "./library";

const randomNumber = (max) => {
  return Math.floor(Math.random() * max);
};

const characters =
  "ABCD EFGHIJKL MNOPQRSTUV WXYZabcdefg hijklmn opqrst uvwx yz0 1234 56789";

const generateString = () => {
  const length = Math.floor(Math.random() * 100);
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

console.log(generateString(5));

onMounted(() => {
  const mansonry = daLibrary(".container");
  mansonry.start();
});
</script>

<style lang="scss" scoped>
.item {
  background-color: aquamarine;
  // margin: 10px;
  text-overflow: clip;
  transition: all 300ms ease;
}
* {
  margin: 0;
  padding: 0;
}

.container {
  overflow: hidden;
  width: 90vw;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  @media (min-width: 300px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 500px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (min-width: 700px) {
    grid-template-columns: repeat(4, 1fr);
  }
  img {
    width: 100%;
    display: block;
  }
}
</style>

<style lang="scss">
.wrap {
  padding: 10px;
  overflow: hidden;
}
</style>
