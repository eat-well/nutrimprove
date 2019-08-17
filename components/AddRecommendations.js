import SearchFoodField from './SearchFoodField';
import React from 'react';
import RemoveIcon from './RemoveIcon';
import AddButton from './AddButton';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import uniqid from 'uniqid';
import {
  addFood,
  addRecommendedFood,
} from '../store/addRecommendation/actions';
import { addRecommendations } from '../connect/api';

const maxFoodFields = 2;
const maxRecommendationFields = 5;

const styles = {
  fieldBox: {
    float: 'left',
    marginRight: 80,
    marginBottom: 30,
    width: 300,
    border: '1px dashed #ddd',
    padding: 20,
  },
  title: {
    marginBottom: 30,
    fontWeight: 'bold',
  },
};

const AddRecommendations = ({
  foods,
  recommendations,
  addEmptyRecommendedFood,
  addEmptyFood,
}) => {
  const renderField = foods => {
    return foods.map(food => (
      <div key={food.id} style={{ display: '-webkit-box' }}>
        <SearchFoodField className='food' food={food} />
        {foods.length <= 1 ? (
          <RemoveIcon />
        ) : (
          <RemoveIcon foodItem={food} />
        )}
      </div>
    ));
  };

  const update = () => {
    console.log(`====Foods===> ${JSON.stringify(foods)}`);
    console.log(`====Recs===> ${JSON.stringify(recommendations)}`);

    const recommendationsPayload = [];

    foods.forEach(food => {
      recommendations.forEach(recommendation => {
        recommendationsPayload.push({
          foodId: food.id,
          recommendationId: recommendation.id,
          contributorId: '099',
        });
      });
    });
    return addRecommendations(recommendationsPayload);
  };

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div style={styles.fieldBox}>
          <div className='title' style={styles.title}>
            Choose food:
          </div>
          <div id='foods_input'>
            {renderField(foods)}
            {foods.length < maxFoodFields ? (
              <AddButton action={addEmptyFood} text='Add' />
            ) : (
              <AddButton text='Add' />
            )}
          </div>
        </div>
        <div style={styles.fieldBox}>
          <div className='title' style={styles.title}>
            Healthier alternatives(s):
          </div>
          <div id='recommendations_input'>
            {renderField(recommendations)}
            {recommendations.length < maxRecommendationFields ? (
              <AddButton action={addEmptyRecommendedFood} text='Add' />
            ) : (
              <AddButton text='Add' />
            )}
          </div>
        </div>
      </div>
      <div id='submit' style={{ marginTop: 20 }}>
        <AddButton action={update} text='Add recommendation(s)' />
      </div>
    </>
  );
};

AddRecommendations.propTypes = {
  recommendations: PropTypes.Array,
  foods: PropTypes.Array,
  addEmptyFood: PropTypes.function,
  addEmptyRecommendedFood: PropTypes.function,
};

const mapStateToProps = (states, ownProps) => {
  return {
    recommendations: states.addRecommendationState.recommendedFoods,
    foods: states.addRecommendationState.foods,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addEmptyRecommendedFood: () => {
      dispatch(addRecommendedFood({ id: uniqid('rec-'), name: '' }));
    },
    addEmptyFood: () => {
      dispatch(addFood({ id: uniqid(), name: '' }));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddRecommendations);
