<template>
<article>
  <h1>
    <code>&lt;veui-radio&gt;</code>
  </h1>
  <section>
    <h3>
      <code>v-model</code>
    </h3>
    <p>
      <veui-button
        ui="s"
        @click="size = size === 'm' ? 's' : 'm'"
      >Toggle</veui-button>
    </p>
    <p>
      <veui-radio v-model="size" value="m" name="size">正常状态</veui-radio>
      <veui-radio
        v-model="size"
        value="s"
        checked
        ui="s"
        name="size"
      >正常状态（小）</veui-radio>
    </p>
    <p>Size: {{ size }}</p>
  </section>
  <section>
    <h3>
      <code>:checked.sync</code>
    </h3>
    <p>
      <veui-button ui="s" @click="checked = !checked">Toggle</veui-button>
    </p>
    <p>
      <veui-radio :checked.sync="checked">绑定状态：{{ checked }}</veui-radio>
    </p>
  </section>
  <section>
    <h3>
      With same
      <code>name</code>
    </h3>
    <h4>Outside a &lt;form&gt;</h4>
    <veui-radio value="m" name="g1" :checked.sync="c1">{{ c1 }}</veui-radio>
    <veui-radio value="s" name="g1" :checked.sync="c2">{{ c2 }}</veui-radio>
    <h4>Inside a &lt;form&gt;</h4>
    <form>
      <veui-radio value="m" name="g1" :checked.sync="c1">{{ c1 }}</veui-radio>
      <veui-radio value="s" name="g1" :checked.sync="c2">{{ c2 }}</veui-radio>
    </form>
  </section>
  <section>
    <veui-radio ui="s" checked>选中状态</veui-radio>
  </section>
  <section>
    <veui-radio checked disabled>选中禁用状态</veui-radio>
  </section>
  <section>
    <veui-radio ui="s" checked disabled>选中禁用状态</veui-radio>
  </section>
  <section>
    <veui-radio disabled>未选禁用状态</veui-radio>
  </section>
  <section>
    <veui-radio ui="s" disabled>未选禁用状态</veui-radio>
  </section>
  <section style="width: 200px">
    <h4>换行样式</h4>
    <section>
      <veui-radio>这是一句很长很长很长很长很长很长很长很长很长的文案</veui-radio>
    </section>
    <section>
      <veui-radio
        ui="s"
      >这是一句很长很长很长很长很长很长很长很长很长的文案</veui-radio>
    </section>
  </section>
  <section>
    <h4>无文字</h4>
    <section>
      <veui-radio/>
    </section>
  </section>
  <section>
    <h3>单选组</h3>
    <p>
      <veui-radio v-model="group" name="group" value="A">A</veui-radio>
      <veui-radio v-model="group" name="group" value="B">B</veui-radio>
      <veui-radio v-model="group" name="group" value="C">C</veui-radio>
      <veui-button @click="group = 'B'">select B</veui-button>
    </p>
    <p>{{ group }}</p>
    <h3>受控单选组（固定选中C）</h3>
    <p>
      <veui-form>
        <veui-radio model="C" name="group2" value="A">A</veui-radio>
        <veui-radio model="C" name="group2" value="B">B</veui-radio>
        <veui-radio model="C" name="group2" value="C">C</veui-radio>
      </veui-form>
    </p>
  </section>
  <section>
    <veui-radio ui="s" checked>always checked</veui-radio>
    <veui-radio ui="s" :checked="false">always unchecked</veui-radio>
  </section>
</article>
</template>

<script>
import { Radio, Button, Form } from 'veui'

export default {
  name: 'radio-demo',
  components: {
    'veui-radio': Radio,
    'veui-button': Button,
    'veui-form': Form
  },
  data () {
    return {
      size: null,
      checked: false,
      group: null,
      c1: false,
      c2: false
    }
  }
}
</script>

<style lang="less" scoped>
.veui-radio {
  margin-right: 10px;
}

section {
  margin-bottom: 60px;
}
</style>
