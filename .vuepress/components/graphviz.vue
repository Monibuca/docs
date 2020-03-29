<template>
  <div v-html="graph"></div>
</template>

<script>
export default {
    data(){
        return {
            graph:""
        }
    },
    props:{
        value:String
    },
    mounted(){
        this.graph = Viz(this.value,"svg")
    }
}
</script>

<style>
@keyframes linena {
    from {
        stroke-dashoffset: 50;
    }
    to {
        stroke-dashoffset: 0;
    }
}
.edge>path {
    animation: linena 2s linear infinite;
    stroke-dasharray: 10, 10, 5;
}
</style>