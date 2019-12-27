import React, { useState } from 'react';
import PropTypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import qs from 'query-string';

const countryToLocale = {
  us: 'en',
  mx: 'es',
};

const LocaleSelect = React.memo(({ locale }) => {
  const [_locale, setLocale] = useState(locale || 'en');

  const onChange = (e) => {
    setLocale(e.target.value);
    const sQueries = qs.parse(window.location.search);
    sQueries.locale = e.target.value;
    console.log(qs.stringify(sQueries));
    window.location.search = `${qs.stringify(sQueries)}`;
  };

  return (
    <FormControl>
      {/* <FormControl variant="outlined"> */}
      {/* <InputLabel id="locale-select-label">Locale</InputLabel> */}
      <Select id="locale-select" value={_locale} onChange={onChange}>
        {Object.keys(countryToLocale).map((cntry) => (
          <MenuItem value={countryToLocale[cntry]} key={cntry}>
            <img
              alt={`${cntry} flag`}
              width="32"
              src={`https://raw.githubusercontent.com/hjnilsson/country-flags/master/png100px/${cntry}.png`}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});

LocaleSelect.propTypes = {
  locale: PropTypes.string.isRequired,
};

LocaleSelect.displayName = 'LocaleSelect';

export default LocaleSelect;
