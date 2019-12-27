import React from 'react';
import loadable from '@loadable/component';
import LoadingIndicator from '../../LoadingIndicators/Circular';

export default loadable(() => import('./index'), { fallback: <LoadingIndicator /> });
