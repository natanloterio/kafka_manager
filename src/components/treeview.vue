<template id="item-template">
  <li>
    <div :class="{bold: isFolder}" @click="toggle">
        {{model.name}}
        <span v-if="isFolder">[{{ open ? '-' : '+' }}]</span>
    </div>
    <ul v-show="open" v-if="isFolder">
      <item
        class="item"
        v-for="(model, index) in model.children"
        :key="index"
        :model="model">
      </item>
    </ul>
  </li>

</template>

<style>
.item {
  cursor: pointer;
  margin-left: 5px;
}
.bold {
  font-weight: bold;
}
ul {
  padding-left: 1em;
  line-height: 1.5em;
  list-style-type: dot;
}
</style>
<script>

export default {
    name: 'item',
    template: '#item-template',
    props: {
        model: Object
    },
    data: function () {
        return {
            open: false
        }
    },
    computed: {
        isFolder: function () {
            return this.model.children &&
        this.model.children.length
        }
    },
    methods: {
        toggle: function () {
            if(this.isFolder) {
                this.open = !this.open
            }
        }
    }
}
</script>
