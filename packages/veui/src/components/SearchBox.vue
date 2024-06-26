<template>
<div
  ref="self"
  :class="{
    [$c('search-box')]: true,
    [$c('search-box-suggestion-expanded')]: finalExpanded,
    [$c('disabled')]: realDisabled,
    [$c('readonly')]: realReadonly
  }"
  :ui="realUi"
  @click="handleClickBox"
>
  <veui-input-group>
    <veui-input
      ref="input"
      v-model="realValue"
      v-outside:input,box="closeSuggestions"
      :name="realName"
      :readonly="realReadonly"
      :disabled="realDisabled"
      v-bind="attrs"
      autocomplete="off"
      role="search"
      :aria-haspopup="inputPopup"
      :aria-owns="inputPopup ? dropdownId : null"
      v-on="listeners"
      @input="handleInput"
      @focus="handleInputFocus"
      @keydown="handleInputKeydown"
    >
      <veui-button
        v-if="!isStrong"
        slot="after"
        type="button"
        :class="$c('search-box-action')"
        :ui="uiParts.search"
        :disabled="realDisabled || realReadonly"
        :aria-haspopup="submitPopup"
        :aria-label="t('search')"
        @click.stop="search"
      >
        <veui-icon :name="icons.search"/>
      </veui-button>
    </veui-input>
    <veui-button
      v-if="isStrong"
      :ui="uiParts.button"
      :class="$c('search-box-action')"
      :disabled="realDisabled || realReadonly"
      :aria-haspopup="submitPopup"
      :aria-label="t('search')"
      @click.stop="search"
    >
      <veui-icon :name="icons.search"/>
    </veui-button>
  </veui-input-group>
  <veui-overlay
    v-show="finalExpanded"
    ref="overlay"
    target="input"
    match-width
    :open="finalExpanded"
    :overlay-class="overlayClass"
    :overlay-style="overlayStyle"
    :local="realOverlayOptions.local"
    :options="realOverlayOptions"
    :priority="overlayPriority"
  >
    <div
      :id="dropdownId"
      ref="box"
      :class="$c('search-box-suggestion-overlay')"
      role="listbox"
      :ui="realUi"
      :aria-expanded="finalExpanded"
    >
      <slot name="suggestions-before"/>
      <slot
        name="suggestions"
        :suggestions="realSuggestions"
        :select="selectSuggestion"
      >
        <veui-option-group
          ref="options"
          :ui="realUi"
          :options="keyword ? filteredSuggestions : realSuggestions"
          :class="$c('search-box-option-group')"
        >
          <template
            v-if="$scopedSlots['group-label']"
            slot="label"
            slot-scope="group"
          >
            <slot name="group-label" v-bind="group"/>
          </template>
          <template
            v-if="$scopedSlots['suggestion']"
            slot="option"
            slot-scope="option"
          >
            <slot name="suggestion" v-bind="option"/>
          </template>
          <template slot="option-label" slot-scope="option">
            <slot name="option-label" v-bind="option">
              <template v-if="!!keyword">
                <template v-for="({ parts }, idx) in option.matches">
                  <template v-for="({ text, matched }, index) in parts">
                    <mark
                      v-if="matched"
                      :key="`m${idx}-${index}`"
                      :class="$c('option-matched')"
                    >{{ text }}</mark>
                    <span v-else :key="`s${idx}-${index}`">{{ text }}</span>
                  </template>
                  <span
                    v-if="idx < option.matches.length - 1"
                    :key="idx"
                    :class="$c('option-separator')"
                  >&gt;</span>
                </template>
              </template>
            </slot>
          </template>
        </veui-option-group>
      </slot>
      <slot name="suggestions-after"/>
    </div>
  </veui-overlay>
</div>
</template>

<script>
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import input from '../mixins/input'
import dropdown from '../mixins/dropdown'
import useSearchable from '../mixins/searchable'
import i18n from '../mixins/i18n'
import Input from './Input'
import Icon from './Icon'
import Overlay from './Overlay'
import Button from './Button'
import InputGroup from './InputGroup'
import OptionGroup from './OptionGroup'
import focusable from '../mixins/focusable'
import { useKeySelect } from '../mixins/key-select'
import useControllable from '../mixins/controllable'
import { pick, omit, without, includes, map } from 'lodash'
import '../common/global'

const SHARED_PROPS = [
  'placeholder',
  'value',
  'autofocus',
  'selectOnFocus',
  'composition',
  'clearable',
  'maxlength',
  'getLength',
  'strict',
  'trim'
]

export default {
  name: 'veui-search-box',
  uiTypes: ['select'],
  components: {
    'veui-input': Input,
    'veui-icon': Icon,
    'veui-overlay': Overlay,
    'veui-button': Button,
    'veui-option-group': OptionGroup,
    'veui-input-group': InputGroup
  },
  mixins: [
    prefix,
    ui,
    input,
    dropdown(),
    useKeySelect({
      expandedKey: 'realExpanded',
      useNativeFocus: false
    }),
    focusable,
    useSearchable({
      datasourceKey: 'realSuggestions',
      childrenKey: 'options',
      keywordKey: 'keyword',
      resultKey: 'filteredSuggestions',
      exposeProps: true
    }),
    useControllable({
      prop: 'value',
      event: 'input',
      set (val, commit) {
        commit(val)
        if (this.hasFocusTrigger || this.hasInputTrigger) {
          this.$emit('suggest', val)
        }
      }
    }),
    i18n
  ],
  props: {
    suggestions: {
      type: Array,
      default () {
        return []
      }
    },
    replaceOnSelect: {
      type: [Boolean, String],
      default: false
    },
    suggestTrigger: {
      type: [String, Array],
      default: 'input',
      validator (val) {
        return []
          .concat(val)
          .every((trigger) => includes(['focus', 'input', 'submit'], trigger))
      }
    },
    ...pick(Input.props, SHARED_PROPS)
  },
  data () {
    return {
      keyword: this.value || ''
    }
  },
  computed: {
    attrs () {
      return pick(this, ['ui', ...without(SHARED_PROPS, 'value')])
    },
    listeners () {
      return omit(this.$listeners, ['suggest', 'select', 'search'])
    },
    isStrong () {
      return this.uiProps.style === 'strong'
    },
    finalExpanded () {
      return !!(
        this.realExpanded &&
        this.realSuggestions &&
        this.realSuggestions.filter(({ hidden }) => !hidden).length
      )
    },
    valueProperty () {
      if (typeof this.replaceOnSelect !== 'string') {
        return 'value'
      }
      return this.replaceOnSelect
    },
    realSuggestions () {
      return map(this.suggestions, (item) =>
        typeof item === 'string' ? { label: item, value: item } : item
      )
    },
    suggestTriggers () {
      return [].concat(this.suggestTrigger)
    },
    hasFocusTrigger () {
      return includes(this.suggestTriggers, 'focus')
    },
    hasInputTrigger () {
      return includes(this.suggestTriggers, 'input')
    },
    hasSubmitTrigger () {
      return includes(this.suggestTriggers, 'submit')
    },
    inputPopup () {
      return this.hasFocusTrigger || this.hasInputTrigger ? 'listbox' : null
    },
    submitPopup () {
      return this.hasSubmitTrigger ? 'listbox' : null
    }
  },
  watch: {
    realValue (val) {
      // 因为 selectSuggestion 中关闭用了 nextTick
      this.$nextTick(() => {
        if (this.realExpanded) {
          this.keyword = val
        }
      })
    },
    realSuggestions () {
      if (this.finalExpanded) {
        this.$nextTick(() => {
          this.relocate()
        })
      }
    }
  },
  methods: {
    handleInput () {
      if (this.hasFocusTrigger || this.hasInputTrigger) {
        this.openSuggestions()
      }
    },
    handleClickBox () {
      if (!this.realDisabled && !this.realReadonly) {
        this.focus()
      }
    },
    focus () {
      this.$refs.input.focus()
    },
    handleInputFocus () {
      if (this.hasFocusTrigger && !this.realReadonly) {
        this.openSuggestions()
        this.$emit('suggest', this.realValue)
      }
    },
    selectSuggestion (suggestion) {
      if (this.replaceOnSelect !== false) {
        this.commit('value', suggestion[this.valueProperty])
      }
      this.focus()
      this.$emit('select', suggestion)
      this.closeSuggestions()
    },
    search ($event) {
      this.$emit('search', this.realValue, $event)
      if (this.hasSubmitTrigger) {
        this.openSuggestions()
        this.$emit('suggest', this.realValue)
      } else if (this.hasInputTrigger || this.hasFocusTrigger) {
        this.closeSuggestions()
      }
    },
    activate () {
      // for label activation
      if (this.realDisabled || this.realReadonly) {
        return
      }
      this.focus()
    },
    handleInputKeydown (e) {
      let passive = false
      switch (e.key) {
        case 'Up':
        case 'ArrowUp':
        case 'Down':
        case 'ArrowDown':
          this.openSuggestions()
          if (this.finalExpanded) {
            this.$nextTick(() => {
              this.handleKeydown(e)
            })
          } else {
            passive = true
          }
          break
        case 'Enter': {
          let elem = null
          if (this.finalExpanded) {
            elem = this.getCurrentActiveElement()
          }
          if (!elem) {
            this.search(e)
            passive = false
          } else {
            // 会调用 selectSuggestion，所以已经会关闭了
            elem.click()
          }
          break
        }
        case 'Tab':
          passive = true
          this.closeSuggestions()
          break
        default:
          passive = true
      }
      if (!passive) {
        e.preventDefault()
        e.stopPropagation()
      }
    },
    handleSelect (value) {
      // find suggestion object recursively according to selected value
      let suggestion = findSuggestion(this.realSuggestions, value)
      this.selectSuggestion(suggestion)
    },
    closeSuggestions () {
      if (this.realExpanded) {
        this.commit('expanded', false)
      }
    },
    openSuggestions () {
      if (!this.realExpanded) {
        // select 时，先关闭了建议，然后 realValue watcher 中因为关闭而没有同步到 keyword，这里打开时保证 keyword 是正确的
        this.keyword = this.realValue
        this.commit('expanded', true)
      }
    }
  }
}

function findSuggestion (suggestions, val) {
  if (!suggestions) {
    return null
  }
  let result = null
  suggestions.some((suggestion) => {
    if (!suggestion.options) {
      if (suggestion.value === val) {
        result = suggestion
        return true
      }
    }
    let inner = findSuggestion(suggestion.options, val)
    if (inner !== null) {
      result = inner
      return true
    }
  })
  return result
}
</script>
