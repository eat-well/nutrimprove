import { AppBar, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import MenuDropdown from 'components/MenuDropdown';
import { isAdmin } from 'helpers/userUtils';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';

const menus = [
  {
    name: 'Search Food',
    options: [
      { label: 'By Food Name', link: '/search/food' },
      { label: 'By Nutrient', link: '/search/nutrient' },
    ],
  },
  {
    name: 'Recommendations',
    options: [
      { label: 'View Your Recommendations', link: '/recommendations/view' },
      { label: 'View All Recommendations', link: '/recommendations/view-all' },
      { divider: true },
      { label: 'Add Recommendations', link: '/recommendations/add' },
      { label: 'Bulk Add Recommendations', link: '/recommendations/bulk-add' },
      { divider: true },
      { label: 'Review Recommendations', link: '/recommendations/review' },
    ],
  },
];

const MainNav = ({ classes }) => {
  const userDetails = useSelector(({ globalState }) => globalState.userDetails);

  return (
    <AppBar position='static' classes={{ root: classes.menuBar }}>
      {!userDetails || !userDetails.email
        ? <Typography className={classes.welcomeText}>Welcome to Nutrimprove</Typography>
        : (
          <div className={classes.container}>
            {menus.map(menu => (
              <MenuDropdown key={menu.name} menu={menu}/>
            ))}
            {userDetails.approved && isAdmin(userDetails) && (
              <MenuDropdown menu={{name: 'Admin Panel', link: '/admin-panel'}}/>
            )}
          </div>
        )}
    </AppBar>
  );
};

MainNav.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default MainNav;
