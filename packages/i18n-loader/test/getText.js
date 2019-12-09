import pickByLocale from '@iabbb/utils/locale/pickByLocale';

// These will set globally or read from a cookie
const locale = 'es';
const defaultLocale = 'en';

const getText = (obj) => pickByLocale(obj, locale, defaultLocale);

export default getText;
