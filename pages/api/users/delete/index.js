import { deleteUser } from 'server/users/users';

const getCollectionResults = async (req, res) => {
  const { user } = req.body;
  if (!user) return res.status(400).json('No user specified!');

  const result = await deleteUser(user);
  return result ? res.status(200).json(result) : res.status(404).json([]);
};

export default getCollectionResults;
