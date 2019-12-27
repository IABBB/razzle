import React from 'react';
import PropTypes from 'prop-types';
import I18nContext from './Context';

function I18nProvider(props) {
  const { children, locale, isSSR } = props;

  return <I18nContext.Provider value={{ locale, isSSR }}>{children}</I18nContext.Provider>;
}

I18nProvider.propTypes = {
  /**
   * Your component tree.
   */
  children: PropTypes.node.isRequired,
  /**
   * A locale.
   */
  locale: PropTypes.string.isRequired,
  /**
   * Is being server-side rendered or is being rendered on the client
   */
  isSSR: PropTypes.bool,
};

I18nProvider.defaultProps = {
  isSSR: false,
};

export default I18nProvider;
