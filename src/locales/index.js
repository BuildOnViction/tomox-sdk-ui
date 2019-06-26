// others but default language - en

import { addLocaleData } from 'react-intl'
import locale_en from 'react-intl/locale-data/en'
import locale_vi from 'react-intl/locale-data/vi'
import messages_en from './langs/en.json'
import messages_vi from './langs/vi.json'

addLocaleData([...locale_en, ...locale_vi])

export const messsages = {
    'en': messages_en,
    'vi': messages_vi,
}

export const locales = {
    'en': 'English',
    'vi': 'Tiếng Việt',
}
