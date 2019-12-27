import React from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import invariant from 'tiny-invariant';
import pickByLocale from '@iabbb/utils/locale/pickByLocale';
import I18nContext from './Context';

function connectI18n(i18nResource) {
  /**
   * A public higher-order component to access the imperative API
   */
  return function withI18n(Component) {
    const displayName = `withI18n(${Component.displayName || Component.name})`;
    const C = (props) => {
      const { wrappedComponentRef, ...remainingProps } = props;

      return (
        <I18nContext.Consumer>
          {(context) => {
            invariant(context, `You should not use <${displayName} /> outside a <I18nProvider>`);
            const { locale, isSSR } = context;
            const text = isSSR ? pickByLocale(i18nResource, locale, 'en') : i18nResource;
            // console.log(i18nResource);
            const i18nProps = { text, locale };
            return <Component {...remainingProps} {...i18nProps} ref={wrappedComponentRef} />;
          }}
        </I18nContext.Consumer>
      );
    };

    C.displayName = displayName;
    C.WrappedComponent = Component;

    if (process.env.NODE_ENV !== 'production') {
      C.propTypes = {
        wrappedComponentRef: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object]),
      };
    }

    return hoistStatics(C, Component);
  };
}

export default connectI18n;
