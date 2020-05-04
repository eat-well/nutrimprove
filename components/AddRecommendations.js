import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import FoodCardWithSearch from './FoodCardWithSearch';

const AddRecommendations = ({ classes }) => {
  const [hoveredItem, setHoveredItem] = useState();

  const setHoveredNutrient = event => {
    setHoveredItem(event.currentTarget.dataset.label);
  };

  return (
    <div className={classes.root}>
      <FoodCardWithSearch title='Food' onHover={setHoveredNutrient} highlightItem={hoveredItem} context='food'/>
      <FoodCardWithSearch title='Recommendation' onHover={setHoveredNutrient} highlightItem={hoveredItem} context='recommendation'/>
    </div>
  );
};

AddRecommendations.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = {
  root: {
    display: 'flex',
    width: '100%',
    maxWidth: 1200,
  },
  card: {
    margin: '0 auto',
  },
};

export default withStyles(styles)(AddRecommendations);
