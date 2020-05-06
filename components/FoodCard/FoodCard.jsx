import { Button, Card, CardActions, CardContent, List, ListItem, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { uniqueId } from 'lodash/util';
import ScrollIntoView from '../ScrollIntoView';
import { getCardNutrients, parseNutrients } from '../../helpers/utils';
import { connect } from 'react-redux';
import ResultsTable from '../ResultsTable';
import LoadingPanel from '../LoadingPanel';
import ModalPanel from '../ModalPanel';
import ChangeNutrientModal from './ChangeNutrientModal';
import { setUserPreferencesAction } from '../../store/global/actions';
import { DEFAULT_CARD_NUTRIENTS } from '../../helpers/constants';
import { savePreferences } from '../../interfaces/api/users';
import Link from '@material-ui/core/Link';
import { isEqual } from 'lodash';

const FoodCard = ({ food, onMouseOver, highlightItem, classes, preferences, userDetails, setUserPreferencesState }) => {
  const [foodDetails, setFoodDetails] = useState();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [changeNutrientOpen, setChangeNutrientOpen] = useState(false);
  const [nutrientToChange, setNutrientToChange] = useState();
  const [undoHistory, setUndoHistory] = useState([]);
  const [nutrients, setNutrients] = useState();
  const title = food ? food.foodName : '';

  useEffect(() => {
    preferences
      ? setNutrients(getCardNutrients(food, preferences.cardNutrients))
      : setNutrients(getCardNutrients(food));
  }, [preferences]);

  const showFoodDetails = () => {
    const { foodName, proximates, vitamins, inorganics } = food;
    setDetailsOpen(true);
    setFoodDetails({
      foodName,
      nutrients: [
        ...parseNutrients({ nutrients: proximates, filterEmptyValues: false }),
        ...parseNutrients({ nutrients: vitamins, filterEmptyValues: false }),
        ...parseNutrients({ nutrients: inorganics, filterEmptyValues: false }),
      ],
    });
  };

  useEffect(() => {
    console.log('=== FoodCard.jsx #45 === ( undoHistory ) =======>', undoHistory);
  }, [undoHistory]);

  const handleClick = async ({ currentTarget }) => {
    const nutrientName = currentTarget.dataset.name;
    const nutrient = nutrients.find(({ name }) => name === nutrientName);
    setNutrientToChange(nutrient);
    setChangeNutrientOpen(true);
  };

  const handleCloseModal = () => {
    setDetailsOpen(false);
    setChangeNutrientOpen(false);
  };

  const addToUndoHistory = () => {
    setUndoHistory([...undoHistory, preferences.cardNutrients]);
  };

  const removeFromUndoHistory = () => {
    const history = [...undoHistory];
    const previousState = history.pop();
    setUndoHistory(history);
    return previousState;
  };

  const updatePreferences = (newPreferences) => {
    setUserPreferencesState(newPreferences);
    savePreferences(userDetails.email, newPreferences);
  };

  const handleNutrientChange = newNutrient => {
    const newNutrientsList = nutrients.map(({ label, name }) => ({ label, name }));
    const index = nutrients.findIndex(({ name }) => name === nutrientToChange.name);
    newNutrientsList.splice(index, 1, { label: newNutrient.label, name: newNutrient.name });
    const newPreferences = { ...preferences, cardNutrients: newNutrientsList };
    addToUndoHistory();
    updatePreferences(newPreferences);
    setChangeNutrientOpen(false);
  };

  const resetCardNutrients = () => {
    const newPreferences = { ...preferences, cardNutrients: DEFAULT_CARD_NUTRIENTS };
    addToUndoHistory();
    updatePreferences(newPreferences);
  };

  const undo = () => {
    const newPreferences = { ...preferences, cardNutrients: removeFromUndoHistory() };
    updatePreferences(newPreferences);
  };

  return (
    <>
      <Card className={classes.card}>
        <Typography className={classes.title} color="textSecondary" title={title} noWrap={true}>
          {title}
        </Typography>
        <CardContent className={classes.content}>
          <List className={classes.list}>
            {nutrients && nutrients.map(({ label, name, quantity }) => (
              <ListItem
                button key={uniqueId()}
                data-name={name}
                className={clsx(classes.item, highlightItem === name ? classes.highlight : '')}
                onMouseOver={onMouseOver}
                onClick={handleClick}
              >
                <span className={classes.nutrient}>{label}</span>
                <span className={classes.value}>{quantity}</span>
              </ListItem>
            ))}
          </List>
          <Typography className={classes.caption} variant='caption'>
            <sup>*</sup>Click a nutrient in the card to change it
          </Typography>
          <div className={classes.cardLinks}>
            {console.log('=== FoodCard.jsx #124 === ( preferences.cardNutrients ) =======>', preferences.cardNutrients)}
            {console.log('=== FoodCard.jsx #125 === ( DEFAULT_CARD_NUTRIENTS ) =======>', DEFAULT_CARD_NUTRIENTS)}
            {!isEqual(preferences.cardNutrients, DEFAULT_CARD_NUTRIENTS) && (
              <Link component='button' onClick={resetCardNutrients} className={classes.link} title='Reset to default nutrients'>
                Reset
              </Link>
            )}
            {undoHistory.length > 0 && (
              <Link component='button' onClick={undo} className={classes.link} title='Undo last change'>
                Undo
              </Link>
            )}
          </div>
        </CardContent>
        <CardActions className={classes.actions}>
          <ScrollIntoView/>
          <Button
            variant='outlined'
            color='primary'
            className={classes.button}
            onClick={showFoodDetails}
          >
            Show More
          </Button>
        </CardActions>
      </Card>
      {detailsOpen && (
        <ModalPanel open={detailsOpen}
                    onClose={handleCloseModal}
                    title={foodDetails.foodName}
                    subtitle='Nutritional information per 100g of food'
        >
          {foodDetails && foodDetails.nutrients ? <ResultsTable data={foodDetails.nutrients}/> : <LoadingPanel/>}
        </ModalPanel>)}
      {changeNutrientOpen && (
        <ChangeNutrientModal open={changeNutrientOpen} onClose={handleCloseModal} nutrientToChange={nutrientToChange}
                             onNutrientChange={handleNutrientChange} cardNutrients={nutrients}
        />)}
    </>
  );
};

FoodCard.propTypes = {
  food: PropTypes.object.isRequired,
  onMouseOver: PropTypes.func,
  highlightItem: PropTypes.string,
  classes: PropTypes.object.isRequired,
  preferences: PropTypes.object,
  userDetails: PropTypes.object,
  setUserPreferencesState: PropTypes.func.isRequired,
};

const mapStateToProps = states => {
  return {
    preferences: states.globalState.preferences,
    userDetails: states.globalState.userDetails,
  };
};

const mapDispatchToProps = dispatch => ({
  setUserPreferencesState: preferences => dispatch(setUserPreferencesAction(preferences)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FoodCard);




