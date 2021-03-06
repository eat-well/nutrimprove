import { MIN_WIDTH } from 'helpers/constants';

export default {
  header: {
    margin: 'auto',
    minWidth: MIN_WIDTH,
  },
  logo: {
    width: 50,
    margin: '0 18px',
  },
  link: {
    fontSize: 12,
  },
  toolbar: {
    height: 60,
    '& a': {
      marginRight: '20px',
    },
    width: MIN_WIDTH,
    margin: '0 auto',
    padding: 0,
  },
  right: {
    position: 'absolute',
    right: 0,
    '& img': {
      maxWidth: 45,
      maxHeight: 45,
    },
  },
};
