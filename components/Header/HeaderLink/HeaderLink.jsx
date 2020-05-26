import { Link, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const HeaderLink = ({ action, children }) => (
  <Typography variant='button' color='inherit'>
    <Link href='#' onClick={action}>
      {children}
    </Link>
  </Typography>
);

HeaderLink.propTypes = {
  action: PropTypes.func,
  children: PropTypes.string,
};

export default HeaderLink;
