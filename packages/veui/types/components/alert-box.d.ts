import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  UiMixin,
  OverlayMixin,
  BeforeClose,
  Status
} from '../common'

type Props = {
  type?: Status
  open?: boolean
  title?: string
  beforeClose?: BeforeClose
  loading?: boolean
  disabled?: boolean
  okLabel?: string
}

type Emits = {
  ok(): void
  afteropen(): void
  afterclose(): void
}

type Mixins = [UiMixin, OverlayMixin]

type Slots = {
  default(): unknown
  title(): unknown
  foot(): unknown
}

type AlertBox = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default AlertBox
