<template>
<article>
  <h1>Plugins</h1>
  <h2>
    <code>this.$confirm()</code>
  </h2>
  <section>
    <button v-if="!removed" @click="handleButtonClick">删除我</button>
    <button @click="handleButton2Click">👈🏻恢复它</button>
    <button @click="handlePromptInput">prompt输入</button>
  </section>
</article>
</template>

<script>
export default {
  name: 'plugins-demo',
  components: {},
  data () {
    return {
      removed: false
    }
  },
  methods: {
    async handleButtonClick () {
      let ok = await this.$confirm('是否确定删除？', '删除确认', {
        okLabel: '删除'
      })
      if (!ok) {
        return
      }
      this.removed = true
    },
    async handleButton2Click () {
      await this.$confirm('是否确定恢复它？', '恢复确认', {
        ok: () => {
          let wait = new Promise((resolve) => setTimeout(resolve, 1000))
          return wait.then(() => {
            if (Math.random() > 0.7) {
              this.$toast.error('恢复失败')
              return false
            }
            this.removed = false
          })
        },
        okLabel: '恢复它',
        cancelLabel: '不恢复它'
      })
    },
    async handlePromptInput () {
      let input = await this.$prompt('请输入！', 'PROMPT', {
        okLabel: '输入',
        cancelLabel: '不输入',
        value: '初始值'
      })
      this.$alert(`prompt输入内容为:${input}`, 'title', {
        okLabel: '收到'
      })
    }
  }
}
</script>
