const get = (i18nResource, cur, loc) => i18nResource[cur] && loc && i18nResource[cur][loc];

/**
 * Creates an object composed of the picked locale values. Uses the default locale if unable to find the given locale in the i18nResource.
 * @param {Object} i18nResource i18n.json object
 * @param {string} locale Two letter locale, ex. 'en'
 * @param {string} defaultLoc Two letter default locale, ex. 'en'
 */
const pickByLocale = (i18nResource, locale, defaultLoc = undefined) =>
  Object.keys(i18nResource).reduce((acc, cur) => {
    const val = get(i18nResource, cur, locale) || get(i18nResource, cur, defaultLoc);
    return val ? { ...acc, [cur]: val } : acc;
  }, {});

module.exports = pickByLocale;
