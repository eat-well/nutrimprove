import { isValidEmail } from 'helpers/userUtils';
import { getUser, saveUser } from 'server/users/users';

const getCollectionResults = async (req, res) => {
  const { user } = req.query;

  if (!isValidEmail(user)) {
    return res.status(400).json('Invalid user!');
  }

  let result = await getUser(user);

  if (!result) {
    const newUserDocument = {
      email: user,
      role: 100,
      points: 1.0,
      approved: false,
    };
    result = await saveUser(newUserDocument);
    return result
      ? res.status(201).json(result)
      : res.status(500);
  }
  return res.status(200).json(result);
};

export default getCollectionResults;
