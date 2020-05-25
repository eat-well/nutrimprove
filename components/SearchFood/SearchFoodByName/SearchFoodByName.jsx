import React, { useState } from 'react';
import { getNutritionData } from '../../../interfaces/api/nutrition';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { filterFoodNames, parseNutrients } from '../../../helpers/utils';
import ResultsTable from '../../ResultsTable';
import SearchField from '../../SearchField';
import SectionHeader from '../../SectionHeader';
import Filters from '../../Filters';

const sectionHeader = {
  title: 'Search Food by Name',
  subtitle: 'Search for a food to display its nutritional data (use the filters to refine your search)',
};

const SearchFoodByName = () => {
  const { categories, foodNames } = useSelector(state => state.globalState);
  const [selectedFood, setSelectedFood] = useState();
  const [data, setData] = useState();
  const filteredFoodNames = filterFoodNames(foodNames, categories.selectedGroups);

  const updateResults = async () => {
    const data = await getNutritionData(selectedFood.foodCode);
    if (data) {
      const proximates = parseNutrients({ nutrients: data.proximates });
      const vitamins = parseNutrients({ nutrients: data.vitamins });
      const minerals = parseNutrients({ nutrients: data.inorganics });
      const combinedResults = [...proximates, ...vitamins, ...minerals];
      setData(combinedResults);
    }
  };

  const handleFoodSelection = (event, value) => {
    setSelectedFood(value);
  };

  return (
    <>
      <SectionHeader content={sectionHeader}/>
      <Filters/>
      <SearchField loading={!filteredFoodNames}
                   onSelection={handleFoodSelection}
                   onButtonClick={updateResults}
                   buttonContext='getFoodData'
                   values={filteredFoodNames}
                   buttonDisabled={!selectedFood}
      />
      {data && <ResultsTable data={data} title='Nutritional values per 100g of food'/>}
    </>
  );
};

SearchFoodByName.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default SearchFoodByName;
