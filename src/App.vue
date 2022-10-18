<template>
  <div class="container">
    <div class="padding" v-for="item, key of data">
      <div class="item">
        <h5>Item {{ key }}</h5>
      <img :src="item.img" alt="jea" />
      <p>
        {{item.text}}
      </p>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import daLibrary from "./library";

const data = ref<any[]>([]);

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

const mansonry = daLibrary(".container", {minWidth: 10});
mansonry.start();

setTimeout(() => {
  
}, 1000);
    

const printRandomText = () => {
  const text = "Quisque mattis laoreet erat. Proin tincidunt molestie vulputate. Donec auctor vitae magna nec cursus. Nam vel consectetur ipsum, eu lacinia metus. Nam a magna tempor, rhoncus felis id, maximus turpis. Nullam aliquet condimentum nunc sed ullamcorper. Donec volutpat quam eros, luctus facilisis orci cursus ut. Sed hendrerit gravida augue, ac sodales libero pharetra vel. Donec nec ipsum urna. Nam metus libero, mollis in metus at, tempus dictum erat. Donec tempus nulla mattis nunc ultrices ornare."
  const array = text.split(". ");
  const randomz =  array.slice(0, generateRandom(1, 10));
  return randomz.join(". ");
}


onMounted(() => {
  
  data.value.push(
    { img: 'https://picsum.photos/300/300', text: printRandomText() },
    { img: 'https://picsum.photos/300/300', text: printRandomText() },
    { img: 'https://picsum.photos/300/300', text: printRandomText() },
    { img: 'https://picsum.photos/300/300', text: printRandomText() },
    { img: 'https://picsum.photos/300/300', text: printRandomText() },
    { img: 'https://picsum.photos/300/300', text: printRandomText() },
    { img: 'https://picsum.photos/300/300', text: printRandomText() },
    { img: 'https://picsum.photos/300/300', text: printRandomText() },
    { img: 'https://picsum.photos/300/300', text: printRandomText() },
    { img: 'https://picsum.photos/300/300', text: printRandomText() },
  )

//   setTimeout(() => {
//     data.value.push(
//     { img: 'https://picsum.photos/300/300', text: printRandomText() },
//     { img: 'https://picsum.photos/300/300', text: printRandomText() },
//     { img: 'https://picsum.photos/300/300', text: printRandomText() },
//     { img: 'https://picsum.photos/300/300', text: printRandomText() },
//     { img: 'https://picsum.photos/300/300', text: printRandomText() },
//     { img: 'https://picsum.photos/300/300', text: printRandomText() },
//     { img: 'https://picsum.photos/300/300', text: printRandomText() },
//     { img: 'https://picsum.photos/300/300', text: printRandomText() },
//     { img: 'https://picsum.photos/300/300', text: printRandomText() },
//     { img: 'https://picsum.photos/300/300', text: printRandomText() })

//     setTimeout(() => {
//       const values = JSON.parse(JSON.stringify(data.value));
//       values.pop();
//       values.pop();
//       values.pop();
//       values.pop();
//       values.pop();
//       values.pop();
//       values.pop();
//       values.pop();
//       data.value = values;
//     }, 2000);
// }, 2000);


});
</script>

<style lang="scss" scoped>
.padding {
  // padding: 10px;
}
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
  // display: grid; 
  // grid-template-columns: repeat(3, 1fr);
  --masonry-gap: 10px;
  // grid-template-columns: repeat(1, 1fr);
  // @media (min-width: 300px) {
  //   grid-template-columns: repeat(2, 1fr);
  // }
  // @media (min-width: 500px) {
  //   grid-template-columns: repeat(3, 1fr);
  // }
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
  // overflow: hidden;
  // outline: 1px solid black;
}
</style>
