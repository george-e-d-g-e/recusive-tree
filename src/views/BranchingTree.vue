<template>
  <div class="branching-tree">
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue';
import createBranchingTree from "@/services/branching-tree";

export default defineComponent({
  name: 'BranchingTree',
  setup() {
    const branchingTree = createBranchingTree()

    onUnmounted(() =>{
      branchingTree.sketch.remove()
      branchingTree.gui.remove()
    })

    return {}
  }
});
</script>

<style lang="scss">
  .p5Canvas {
    position: absolute;
    top: 0px;
    z-index: -1;
  }

  h1 {
    position: absolute;
    left: 1em;
    bottom: 0px;
    font-size: 0.8em;
    display: none;
  }

  /* dat.gui */
  .dg {
    /* hide the gui */
    display: none;
    &.a {
      float: left;
    }
    .dg .cr.number {
      border-left: 3px solid #bebebe;
    }

    .c .slider-fg {
      background: #bebebe;
    }
    .c .slider:hover .slider-fg {
      background: #e6e6e6;
    }
    .cr.number input[type="text"] {
      color: #bebebe;
    }
  }
</style>