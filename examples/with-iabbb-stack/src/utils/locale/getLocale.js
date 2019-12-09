import Cookies from 'js-cookie';
import pickByLocale from '@iabbb/utils/locale/pickByLocale';
import { LOCALE_COOKIE } from '../cookie/names';

// TODO add to .env
const defaultLocale = 'en';

const locale = Cookies.get(LOCALE_COOKIE);

const getLocale = (obj) => pickByLocale(obj, locale, defaultLocale);

export default getLocale;
