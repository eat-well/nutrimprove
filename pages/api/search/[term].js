import { addSearchTerm, getSearchTerm } from '../../../server/db';
import { fetchFoods } from '../../../connect/api';

const formatSearchTerm = (searchTerm, foods) => {
  const searchTermObj = {
    search_term: searchTerm,
    matches: [],
  };
  if (foods) {
    foods.map(food => {
      const foodName = food.food.brand
        ? `${food.food.brand} ${food.food.label}`
        : food.food.label;
      searchTermObj.matches.push({
        food_id: food.food.foodId,
        food_name: foodName,
      });
    });
  }
  return searchTermObj;
};

const getCollectionResults = async (req, res) => {
  let { term } = req.query;

  if (term) {
    term = term.toLowerCase();
    const result = await getSearchTerm(term);

    if (!result) {
      const foods = await fetchFoods(term);
      const searchTermObject = formatSearchTerm(term, foods);
      const savedTerm = await addSearchTerm(searchTermObject);

      return savedTerm
        ? res.status(201).json(savedTerm)
        : res.status(500);
    }

    return res.status(200).json(result);
  }
};

export default getCollectionResults;