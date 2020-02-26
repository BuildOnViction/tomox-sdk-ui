// others but default language - en

import { addLocaleData } from 'react-intl'
import locale_en from 'react-intl/locale-data/en'
import locale_vi from 'react-intl/locale-data/vi'
import locale_tr from 'react-intl/locale-data/tr'
import messages_en from './langs/en.json'
import messages_vi from './langs/vi.json'
import messages_tr from './langs/tr.json'

addLocaleData([...locale_en, ...locale_vi, ...locale_tr])

export const messsages = {
    'en': messages_en,
    'vi': messages_vi,
    'tr': messages_tr,
}

export const locales = {
    'en': 'English',
    'vi': 'Tiếng Việt',
    'tr': 'Türkçe',
}
