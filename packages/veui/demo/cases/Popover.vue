<template>
<article>
  <h1>
    <code>&lt;veui-popover&gt;</code>
  </h1>
  <section>
    <veui-checkbox
      v-model="aimCenter"
      style="margin-left: 20px"
    >对准中心</veui-checkbox>
  </section>
  <section>
    <div class="demo-wrap">
      <div style="margin-bottom: 10px">hover事件</div>
      <div class="box">
        <div class="top">
          <veui-button
            ref="topLeftHover"
            ui="aux"
            @mouseenter.native="
              show({
                position: 'top-start',
                target: $refs['topLeftHover']
              })
            "
          >上左</veui-button>
          <veui-button
            ref="topCenterHover"
            ui="aux"
            @mouseenter.native="
              show({
                position: 'top',
                target: 'topCenterHover'
              })
            "
          >上边</veui-button>
          <veui-button
            ref="topRightHover"
            ui="aux"
            @mouseenter.native="
              show({
                position: 'top-end',
                target: 'topRightHover'
              })
            "
          >上右</veui-button>
        </div>
        <div class="left">
          <veui-button
            ref="leftTopHover"
            ui="aux"
            @mouseenter.native="
              show({
                position: 'left-start',
                target: 'leftTopHover'
              })
            "
          >左上</veui-button>
          <veui-button
            ref="leftCenterHover"
            ui="aux"
            @mouseenter.native="
              show({
                position: 'left',
                target: 'leftCenterHover'
              })
            "
          >左边</veui-button>
          <veui-button
            ref="leftBottomHover"
            ui="aux"
            @mouseenter.native="
              show({
                position: 'left-end',
                target: 'leftBottomHover'
              })
            "
          >左下</veui-button>
        </div>
        <div class="right">
          <veui-button
            ref="rightTopHover"
            ui="aux"
            @mouseenter.native="
              show({
                position: 'right-start',
                target: 'rightTopHover'
              })
            "
          >右上</veui-button>
          <veui-button
            ref="rightCenterHover"
            ui="aux"
            @mouseenter.native="
              show({
                position: 'right',
                target: 'rightCenterHover'
              })
            "
          >右边</veui-button>
          <veui-button
            ref="rightBottomHover"
            ui="aux"
            @mouseenter.native="
              show({
                position: 'right-end',
                target: 'rightBottomHover'
              })
            "
          >右下</veui-button>
        </div>
        <div class="bottom">
          <veui-button
            ref="BottomLeftHover"
            ui="aux"
            @mouseenter.native="
              show({
                position: 'bottom-start',
                target: 'BottomLeftHover'
              })
            "
          >下左</veui-button>
          <veui-button
            ref="BottomCenterHover"
            ui="aux"
            @mouseenter.native="
              show({
                position: 'bottom',
                target: 'BottomCenterHover'
              })
            "
          >下边</veui-button>
          <veui-button
            ref="BottomRightHover"
            ui="aux"
            @mouseenter.native="
              show({
                position: 'bottom-end',
                target: 'BottomRightHover'
              })
            "
          >下右</veui-button>
        </div>
      </div>
    </div>
    <veui-popover
      ui="s"
      :position="position"
      :target="target"
      :open.sync="open"
      :overlay-options="overlayOptions"
      :overlay-style="{
        '--dls-dropdown-max-display-items': 8
      }"
      :aim-center="aimCenter"
      trigger="hover"
    >当前是hover事件</veui-popover>
  </section>
  <section>
    <div class="demo-wrap">
      <div style="margin-bottom: 10px">click事件</div>
      <div class="box">
        <div class="top">
          <veui-button
            ref="topLeftClick"
            ui="aux"
            @click.native="
              clickShow({
                clickPosition: 'top-start',
                clickTarget: 'topLeftClick'
              })
            "
          >上左</veui-button>
          <veui-button
            ref="topCenterClick"
            ui="aux"
            @click.native="
              clickShow({
                clickPosition: 'top',
                clickTarget: 'topCenterClick'
              })
            "
          >上边</veui-button>
          <veui-button
            ref="topRightClick"
            ui="aux"
            @click.native="
              clickShow({
                clickPosition: 'top-end',
                clickTarget: 'topRightClick'
              })
            "
          >上右</veui-button>
        </div>
        <div class="left">
          <veui-button
            ref="leftTopClick"
            ui="aux"
            @click.native="
              clickShow({
                clickPosition: 'left-start',
                clickTarget: 'leftTopClick'
              })
            "
          >左上</veui-button>
          <veui-button
            ref="leftCenterClick"
            ui="aux"
            @click.native="
              clickShow({
                clickPosition: 'left',
                clickTarget: 'leftCenterClick'
              })
            "
          >左边</veui-button>
          <veui-button
            ref="leftBottomClick"
            ui="aux"
            @click.native="
              clickShow({
                clickPosition: 'left-end',
                clickTarget: 'leftBottomClick'
              })
            "
          >左下</veui-button>
        </div>
        <div class="right">
          <veui-button
            ref="rightTopClick"
            ui="aux"
            @click.native="
              clickShow({
                clickPosition: 'right-start',
                clickTarget: 'rightTopClick'
              })
            "
          >右上</veui-button>
          <veui-button
            ref="rightCenterClick"
            ui="aux"
            @click.native="
              clickShow({
                clickPosition: 'right',
                clickTarget: 'rightCenterClick'
              })
            "
          >右边</veui-button>
          <veui-button
            ref="rightBottomClick"
            ui="aux"
            @click.native="
              clickShow({
                clickPosition: 'right-end',
                clickTarget: 'rightBottomClick'
              })
            "
          >右下</veui-button>
        </div>
        <div class="bottom">
          <veui-button
            ref="BottomLeftClick"
            ui="aux"
            @click.native="
              clickShow({
                clickPosition: 'bottom-start',
                clickTarget: 'BottomLeftClick'
              })
            "
          >下左</veui-button>
          <veui-button
            ref="BottomCenterClick"
            ui="aux"
            @click.native="
              clickShow({
                clickPosition: 'bottom',
                clickTarget: 'BottomCenterClick'
              })
            "
          >下边</veui-button>
          <veui-button
            ref="BottomRightClick"
            ui="aux"
            @click.native="
              clickShow({
                clickPosition: 'bottom-end',
                clickTarget: 'BottomRightClick'
              })
            "
          >下右</veui-button>
        </div>
      </div>
    </div>
    <veui-popover
      ui="m"
      title="标题"
      :position="clickPosition"
      :target="clickTarget"
      :open.sync="clickOpen"
      :aim-center="aimCenter"
      :footless="false"
      trigger="click"
    >当前是click事件</veui-popover>
  </section>
</article>
</template>

<script>
import bus from '../bus'
import { Button, Checkbox, Popover } from 'veui'

export default {
  name: 'popover-demo',
  components: {
    'veui-button': Button,
    'veui-checkbox': Checkbox,
    'veui-popover': Popover
  },
  data () {
    return {
      position: '',
      clickPosition: '',
      target: 'topLeftHover',
      clickTarget: 'topLeftClick',
      open: false,
      clickOpen: false,
      overlayOptions: {},
      aimCenter: false
    }
  },
  mounted () {
    this.$children.forEach((child) => {
      child.$on('click', () => {
        bus.$emit('log', child.$el.getAttribute('ui'))
      })
    })
  },
  methods: {
    show (obj) {
      this.position = obj.position
      this.target = obj.target
      this.open = true
    },
    clickShow (obj) {
      this.clickPosition = obj.clickPosition
      this.clickTarget = obj.clickTarget
      this.clickOpen = true
    }
  }
}
</script>

<style scoped>
section {
  user-select: none;
  margin: 30px 0;
}

.demo-wrap {
  width: 500px;
  height: 300px;
  padding: 30px;
  border: 1px solid #ccc;
}

.box {
  position: relative;
}

.top,
.bottom {
  width: 100%;
  clear: both;
  text-align: center;
}

.left {
  width: 100px;
  float: left;
}

.right {
  width: 100px;
  float: right;
}

.top .veui-button,
.bottom .veui-button {
  margin-right: 10px;
}

.left .veui-button,
.right .veui-button {
  margin-bottom: 10px;
}
</style>
