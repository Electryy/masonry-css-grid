<template>
  <div class="container">
    <div class="item" v-for="n in 10">
      <h5>Item {{ n }}</h5>
      <img :src="`https://picsum.photos/300/300`" alt="jea" />
      <p>
        {{printRandomText()}}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import daLibrary from "./library";

const  generateRandom = (min = 0, max = 100) => {
    // find diff
    let difference = max - min;

    // generate random number 
    let rand = Math.random();

    // multiply with difference 
    rand = Math.floor( rand * difference);

    // add with min value 
    rand = rand + min;

    return rand;
}

const printRandomText = () => {
  const text = "Quisque mattis laoreet erat. Proin tincidunt molestie vulputate. Donec auctor vitae magna nec cursus. Nam vel consectetur ipsum, eu lacinia metus. Nam a magna tempor, rhoncus felis id, maximus turpis. Nullam aliquet condimentum nunc sed ullamcorper. Donec volutpat quam eros, luctus facilisis orci cursus ut. Sed hendrerit gravida augue, ac sodales libero pharetra vel. Donec nec ipsum urna. Nam metus libero, mollis in metus at, tempus dictum erat. Donec tempus nulla mattis nunc ultrices ornare."
  const array = text.split(". ");
  const randomz =  array.slice(0, generateRandom(1, 10));
  return randomz.join(". ");
}


onMounted(() => {
  const container = document.querySelector(".container") as HTMLElement;
  if(container) {
    const mansonry = daLibrary(container);
    mansonry.start();
  }

  
});
</script>

<style lang="scss" scoped>
.item {
  background-color: aquamarine;
  // height: 100%;
  overflow: hidden;
  // margin: 10px;
}
* {
  margin: 0;
  padding: 0;
}

.container {
  overflow: hidden;
  width: 90vw;
  display: grid; grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  // grid-template-columns: repeat(1, 1fr);
  // @media (min-width: 300px) {
  //   grid-template-columns: repeat(2, 1fr);
  // }
  @media (min-width: 500px) {
    grid-template-columns: repeat(3, 1fr);
  }
  // @media (min-width: 700px) {
  //   grid-template-columns: repeat(4, 1fr);
  // }
  img {
    width: 100%;
    display: block;
  }
}
</style>

<style lang="scss">
.wrap {
  overflow: hidden;
  outline: 1px solid black;

}
</style>
