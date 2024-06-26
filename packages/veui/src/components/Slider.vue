<template>
<div :class="sliderClasses" :ui="realUi" role="application" tabindex="-1">
  <!-- 条 -->
  <div ref="track" :class="$c('slider-track')" @click="handleTrackClick">
    <slot name="track">
      <div :class="$c('slider-track-default')">
        <div :class="$c('slider-track-default-wrapper')">
          <div
            :class="[
              $c('slider-track-default-bg'),
              $c('slider-track-default-progress')
            ]"
          />
          <div
            :class="[
              $c('slider-track-default-sp'),
              $c('slider-track-default-progress')
            ]"
            :style="secondaryProgressStyle"
          />
          <div
            :class="[
              $c('slider-track-default-fg'),
              $c('slider-track-default-progress')
            ]"
            :style="progressStyle"
          />
          <div v-if="stepMarks" :class="$c('slider-track-default-marks')">
            <div
              v-for="mk in stepMarks"
              :key="mk"
              :class="{
                [$c('slider-track-default-mark')]: true,
                [$c(
                  `slider-track-default-mark-${
                    progressRange[0] <= mk && mk <= progressRange[1]
                      ? 'in-progress'
                      : 'out-progress'
                  }`
                )]: true
              }"
              :style="{
                left: `${mk * 100}%`
              }"
              @click="handleMarkClick($event, mk)"
            />
          </div>
        </div>
      </div>
    </slot>
  </div>

  <!-- 块 -->
  <button
    v-for="(_, index) in new Array(thumbCount)"
    :key="`thumb${index}`"
    ref="thumb"
    v-outside.hover="() => handleThumbMouseLeave(index)"
    v-drag="thumbDragOptions[index]"
    v-nudge="{
      step: keyboardChangeStep,
      update: (...args) => handleThumbNudgeUpdage(index, ...args)
    }"
    type="button"
    :class="$c('slider-thumb')"
    :disabled="realDisabled"
    :style="{
      left: `${ratios[index] * 100}%`
    }"
    role="slider"
    v-bind="thumbAttrs[index]"
    @mouseenter="handleThumbMouseEnter(index)"
    @mousedown="handleThumbFocus(index)"
    @focus="handleThumbFocus(index)"
    @blur="handleThumbBlur"
  >
    <slot
      name="thumb"
      :index="index"
      :focus="currentThumbFocusIndex === index"
      :hover="currentThumbHoverIndex === index"
      :dragging="currentThumbDraggingIndex === index"
    >
      <div :class="$c('slider-thumb-default')"/>
    </slot>
  </button>

  <!-- 提示 -->
  <slot
    name="tip"
    :target="tooltipTarget"
    :open="activeTooltipIndex >= 0"
    :active-index="activeTooltipIndex"
  >
    <veui-tooltip
      ref="tip"
      :target="tooltipTarget"
      :open="activeTooltipIndex >= 0"
      :overlay-class="$c('slider-tooltip')"
      trigger="custom"
      :interactive="false"
      :ui="uiParts.tooltip"
    >
      <slot name="tip-label">{{ tooltipLabel }}</slot>
    </veui-tooltip>
  </slot>
</div>
</template>

<script>
import { fill, clamp, isEqual, identity } from 'lodash'
import drag from '../directives/drag'
import nudge from '../directives/nudge'
import outside from '../directives/outside'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import input from '../mixins/input'
import useControllable from '../mixins/controllable'
import Tooltip from './Tooltip'
import '../common/global'

export default {
  name: 'veui-slider',
  components: {
    'veui-tooltip': Tooltip
  },
  directives: {
    drag,
    nudge,
    outside
  },
  mixins: [
    prefix,
    ui,
    input,
    useControllable({
      // 方案1: propValue(formatted), localValue(formatted), realValue(parsed)
      //   同步步骤: update realValue -> map(format) -> sync local & prop

      // 方案2: propValue(formatted), localValue(parsed), realValue(parsed)
      //   同步步骤: update realValue -> sync local -> map(format) -> sync prop

      // 本来打算采用方案 1，感觉更统一更简单，实际 propValue 和 localValue 可能不一样，因为:
      // propValue 是用户给的 formatted，而 localValue 是 format 函数产出的，如 '0.1' 和 '0.10'（会导致不必要事件触发）
      // 所以采用方案 2
      prop: 'value',
      get (val) {
        val = val == null ? [] : [].concat(val)
        return !this.isControlled('value')
          ? val
          : val
            .map((val) => this.getAdjustedValue(this.parse(val)))
            .sort((a, b) => (a > b ? 1 : -1))
      },
      set (value) {
        // value 其实也是来自 realValue 的
        if (!isEqual(value, this.realValue)) {
          this.localValue = value
          let formatted = value.map(this.format)
          this.$emit('input', formatted.length > 1 ? formatted : formatted[0])
        }
      }
    })
  ],
  props: {
    /* eslint-disable vue/require-prop-types */
    value: {},
    /* eslint-enable vue/require-prop-types */
    secondaryProgress: {
      type: [Number, Array],
      default: 0
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 1
    },
    step: {
      type: Number,
      default: 0,
      validator: (val) => val >= 0
    },
    mark: Boolean,
    parse: {
      type: Function,
      default: identity
    },
    format: {
      type: Function,
      default: identity
    }
  },
  data () {
    return {
      currentThumbFocusIndex: -1,
      currentThumbDraggingIndex: -1,
      currentThumbHoverIndex: -1,
      latestIndex: -1,
      thumbCount: 0
    }
  },
  computed: {
    sliderClasses () {
      return {
        [this.$c('slider')]: true,
        [this.$c('disabled')]: this.realDisabled,
        [this.$c('readonly')]: this.realReadonly
      }
    },
    progressRange () {
      if (this.realValue.length === 0) {
        return [0, 0]
      }
      if (this.realValue.length === 1) {
        return [0, this.ratios[0]]
      }
      return [this.ratios[0], this.ratios[1]]
    },
    ratios () {
      let { min, max } = this
      return this.realValue.map((val) => (val - min) / (max - min))
    },
    activeTooltipIndex () {
      if (this.currentThumbFocusIndex >= 0) {
        return this.currentThumbFocusIndex
      }
      if (this.currentThumbHoverIndex >= 0) {
        return this.currentThumbHoverIndex
      }
      return -1
    },
    tooltipTarget () {
      return this.getThumbRefByIndex(this.activeTooltipIndex)
    },
    tooltipLabel () {
      return this.getValueByIndex(this.latestIndex)
    },
    stepMarks () {
      let { min, min: val, max, step, mark } = this
      if (!step || min >= max || !mark) {
        return
      }
      let marks = []
      while (val <= max) {
        let pos = (val - min) / (max - min)
        if (pos >= 0 && pos <= 1) {
          marks.push(pos)
        }
        val += step
      }
      return marks
    },
    keyboardChangeStep () {
      // 如果没有指定 step ，就算一个
      return this.step || (this.max - this.min) / 10
    },
    noInteractive () {
      return this.realDisabled || this.realReadonly
    },
    localValueBoundary () {
      return this.getLocalValueBoundary(this.currentThumbFocusIndex)
    },
    progressStyle () {
      return this.getProgressStyle(this.ratios)
    },
    localSecondaryProgress () {
      let { min, max } = this
      return []
        .concat(this.secondaryProgress)
        .map((progress) => (progress - min) / (max - min))
    },
    secondaryProgressStyle () {
      return this.getProgressStyle(this.localSecondaryProgress)
    },
    thumbAttrs () {
      return this.realValue.map((value, index) => {
        let { min, max } = this.getLocalValueBoundary(index)
        return {
          'aria-valuemin': this.reduceDecimal(min),
          'aria-valuemax': this.reduceDecimal(max),
          'aria-valuenow': this.reduceDecimal(value),
          'aria-valuetext': this.format(this.reduceDecimal(value))
        }
      })
    },
    thumbDragOptions () {
      return fill(new Array(this.thumbCount), true).map((_, index) => ({
        axis: 'x',
        dragstart: (...args) => this.handleThumbDragStart(index, ...args),
        drag: (...args) => this.handleThumbDrag(index, ...args),
        dragend: (...args) => this.handleThumbDragEnd(index, ...args)
      }))
    }
  },
  watch: {
    realValue: {
      handler (newVal, oldVal = []) {
        if (newVal.length !== oldVal.length) {
          // 解耦 localValue 和 localValue.length，防止依赖 localValue 长度的 drag options 在拖动时改变
          this.thumbCount = newVal.length
        }

        if (this.$refs.tip) {
          // 要用 nextTick，否则有 step 的 thumb 的 tip 定位到了前一个位置
          this.$nextTick(() => {
            this.$refs.tip.relocate()
          })
        }
      },
      immediate: true
    },
    activeTooltipIndex: {
      handler (val) {
        if (val !== -1) {
          this.latestIndex = val
        }
      },
      immediate: true
    }
  },
  methods: {
    handleMarkClick (e, ratio) {
      if (this.noInteractive || this.realValue.length > 1) {
        return
      }
      e.stopPropagation()
      this.updateValueByRatio(ratio)
      this.$refs.thumb[0].focus()
    },
    handleTrackClick ({ offsetX }) {
      if (this.noInteractive || this.realValue.length > 1) {
        return
      }
      let trackWidth = this.$refs.track.offsetWidth
      this.updateValueByRatio(offsetX / trackWidth)
      this.$refs.thumb[0].focus()
    },
    handleThumbMouseEnter (index) {
      this.currentThumbHoverIndex = index
    },
    handleThumbMouseLeave (index) {
      this.currentThumbHoverIndex = -1
    },
    handleThumbDragStart (index) {
      if (this.noInteractive) {
        return
      }
      this.currentThumbDraggingIndex = index
      this.previousRatio = this.ratios[index]
      this.trackWidth = this.$refs.track.offsetWidth
    },
    handleThumbDrag (index, { distanceX }) {
      if (this.noInteractive) {
        return
      }
      let ratio = this.previousRatio + distanceX / this.trackWidth
      this.updateValueByRatio(ratio, index)
    },
    handleThumbDragEnd () {
      this.currentThumbDraggingIndex = -1
      this.currentThumbFocusIndex = -1
    },
    handleThumbNudgeUpdage (index, delta) {
      if (this.noInteractive) {
        return
      }
      let { min, max } = this.localValueBoundary
      let val = this.getAdjustedValue(this.realValue[index] + delta, min, max)
      this.updateValue(index, val)
    },
    updateValue (index, val) {
      let values = [...this.realValue]
      values[index] = val
      this.commit('value', values)
    },
    handleThumbFocus (index) {
      this.currentThumbFocusIndex = index
    },
    handleThumbBlur () {
      this.currentThumbFocusIndex = -1
    },
    updateValueByRatio (ratio, index = 0) {
      let { min, max } = this.localValueBoundary
      let val = this.getAdjustedValue(
        this.min + (this.max - this.min) * ratio,
        min,
        max
      )
      this.updateValue(index, val)
    },
    getAdjustedValue (val, min = this.min, max = this.max) {
      val = clamp(val, min, max)
      if (this.step > 0) {
        let maxSteps = Math.floor((max - min) / this.step)
        val =
          Math.min(Math.round((val - min) / this.step), maxSteps) * this.step +
          min
      }
      return val
    },
    getValueByIndex (index) {
      let val = Array.isArray(this.value) ? this.value[index] : this.value
      return this.reduceDecimal(val)
    },
    reduceDecimal (val) {
      // 如果是数字就处理一下精度，否则会出现很多零
      return typeof val === 'number' ? Math.round(val * 100) / 100 : val
    },
    getThumbRefByIndex (index) {
      return this.$refs.thumb && this.$refs.thumb[index]
    },
    getLocalValueBoundary (thumbIndex) {
      let { min, max, ratios } = this
      let len = this.realValue.length
      if (len === 1) {
        return { min, max }
      }
      let prevIndex = thumbIndex - 1
      let nextIndex = thumbIndex + 1
      let minLocalValue =
        prevIndex < 0 ? min : ratios[prevIndex] * (max - min) + min
      let maxLocalValue =
        nextIndex > len - 1 ? max : ratios[nextIndex] * (max - min) + min
      return {
        min: minLocalValue,
        max: maxLocalValue
      }
    },
    getProgressStyle (ratios) {
      let left = 0
      let width
      if (ratios.length === 1) {
        width = `${ratios[0] * 100}%`
      } else {
        left = `${ratios[0] * 100}%`
        width = `${(ratios[ratios.length - 1] - ratios[0]) * 100}%`
      }
      return {
        left,
        width
      }
    },
    focus () {
      this.$el.focus()
    }
  }
}
</script>
