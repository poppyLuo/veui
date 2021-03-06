import { IconCalendar, IconTimesCircle } from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      calendar: IconCalendar,
      clear: IconTimesCircle
    },
    ui: {
      size: {
        values: ['s', 'm'],
        inherit: true
      }
    },
    parts: {
      clear: 'icon aux',
      input: 'inline'
    }
  },
  'datepicker'
)
