// others but default language - en

import { addLocaleData } from 'react-intl'
import locale_en from 'react-intl/locale-data/en'
import locale_vi from 'react-intl/locale-data/vi'
import locale_tr from 'react-intl/locale-data/tr'
import locale_fr from 'react-intl/locale-data/fr'
import messages_en from './langs/en.json'
import messages_vi from './langs/vi.json'
import messages_tr from './langs/tr.json'
import messages_fr from './langs/fr.json'

addLocaleData([...locale_en, ...locale_vi, ...locale_tr, ...locale_fr])

export const messsages = {
    'en': messages_en,
    'vi': messages_vi,
    'tr': messages_tr,
    'fr': messages_fr,
}

export const locales = {
    'en': 'English',
    'vi': 'Tiếng Việt',
    'tr': 'Türkçe',
    'fr': 'Français',
}
