import React, { useEffect, useState } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ButtonWithSpinner from './ButtonWithSpinner';
import { getFoodByName, getFoodsByNutrient, getNutrients } from '../interfaces/api/foods';
import AutoComplete from './AutoComplete';
import { parseNutrients } from '../helpers/utils';
import ResultsTable from './ResultsTable';
import ResultsModal from './ResultsModal';
import Typography from '@material-ui/core/Typography';

const SearchFoodByNutrient = ({ classes, categories }) => {
  const [nutrient, setNutrient] = useState();
  const [nutrients, setNutrients] = useState([]);
  const [tableTitle, setTableTitle] = useState();
  const [foods, setFoods] = useState();
  const [selectedFood, setSelectedFood] = useState('');
  const [selectedFoodDetails, setSelectedFoodDetails] = useState();
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const nutrientList = await getNutrients(['proximates', 'vitamins', 'inorganics']);
      setNutrients(nutrientList);
    })();
  }, []);

  const formatFoods = foods =>
    foods.map(food => {
      const foodObj = food[nutrient.group][nutrient.name];
      // In some rare cases and due to some rounding calculations (from the source data)
      // the quantity of a nutrient is higher than 100 for 100g of food (eg: Simple sugar and carbohydrates)
      // In these cases we are setting 100 as the value
      const quantity = nutrient.label === 'Carbohydrate' && foodObj.quantity > 100 ? 100 : foodObj.quantity;
      return {
        name: food.foodName,
        [nutrient.label]: `${quantity} ${foodObj.unit}`,
        group: food.group,
      };
    });

  const getFoods = async () => {
    const nutrientKey = `${nutrient.group}.${nutrient.name}`;
    const foods = await getFoodsByNutrient({nutrient: nutrientKey, filters: categories.selectedGroups});
    setTableTitle(`${nutrient && nutrient.label} per 100g of food`);
    setFoods(formatFoods(foods));
  };

  const handleRowClick = async ({ currentTarget }) => {
    const foodName = currentTarget.firstChild.innerText;
    setSelectedFood(foodName);
    setDetailsOpen(true);
    const food = await getFoodByName(foodName);
    if (food) {
      const proximates = parseNutrients(food.proximates);
      const vitamins = parseNutrients(food.vitamins);
      const minerals = parseNutrients(food.inorganics);
      const combinedResults = [...proximates, ...vitamins, ...minerals];
      setSelectedFoodDetails(combinedResults);
    }
  };

  const handleCloseModal = () => {
    setDetailsOpen(false);
  };

  return (
    <>
      <Typography variant='subtitle2' paragraph={true}>Display the foods with the highest levels of a nutrient</Typography>
      <div className={classes.search}>
        <AutoComplete
          values={nutrients}
          groupBy={(option) => option.group}
          label='Choose nutrient'
          noMatchText='No nutrient matched!!'
          labelProp='label'
          context='getNutrients'
          loading={nutrients.length === 0}
          onChange={setNutrient}
          openOnFocus={true}
        />
        <ButtonWithSpinner
          className={classes.button}
          context='getFoodsByNutrient'
          action={getFoods}
          disabled={!nutrient}
        >
          Search
        </ButtonWithSpinner>
      </div>
      {foods && <ResultsTable
        data={foods}
        title={tableTitle}
        onRowClick={handleRowClick}
      />}
      {detailsOpen && <ResultsModal
        data={selectedFoodDetails}
        open={detailsOpen}
        onClose={handleCloseModal}
        title={selectedFood}
        subtitle='Nutritional information per 100g of food'
      />}
    </>
  );
};

SearchFoodByNutrient.propTypes = {
  classes: PropTypes.object.isRequired,
  categories: PropTypes.object.isRequired,
};

const mapStateToProps = states => {
  return {
    categories: states.globalState.categories,
  };
};

const styles = {
  search: {
    display: 'inline-flex',
    borderStyle: 'solid',
    borderWidth: 'thin',
    borderRadius: 7,
    borderColor: 'lightgray',
    padding: '10px 10px 10px 20px',
  },
  table: {
    marginTop: 20,
    maxHeight: 600,
    overflow: 'auto',
    '& tbody tr': {
      cursor: 'pointer',
    },
  },
  button: {
    margin: 10,
  },
};

export default connect(mapStateToProps)(withStyles(styles)(SearchFoodByNutrient));
