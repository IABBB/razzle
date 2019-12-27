import React from 'react';

export const I18nContext = React.createContext(null);

// if (process.env.NODE_ENV !== 'production') {
I18nContext.displayName = 'I18n';
// }

export default I18nContext;
