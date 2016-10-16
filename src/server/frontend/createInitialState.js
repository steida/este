/* @flow */
import config from '../config';
import configReducer from '../../common/config/reducer';
import deviceReducer from '../../common/device/reducer';
import intlReducer from '../../common/intl/reducer';

const createInitialState = () => ({
  config: configReducer(undefined, {})
    .set('appName', config.appName)
    .set('appVersion', config.appVersion)
    .set('firebase', config.firebase)
    .set('sentryUrl', config.sentryUrl),
  device: deviceReducer(undefined, {}),
  intl: intlReducer(undefined, {})
    .set('currentLocale', config.defaultLocale)
    .set('defaultLocale', config.defaultLocale)
    .set('locales', config.locales),
});

export default createInitialState;
