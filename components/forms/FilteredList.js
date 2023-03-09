import {FlatList} from 'react-native';

import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {useMedia} from '../../hooks/ApiHooks';

const FilteredList = ({navigation, filterString}) => {
  const {mediaArray} = useMedia(false);

  const filteredArray = mediaArray.filter((post) => {
    if (
      !filterString ||
      post.title.toLowerCase().includes(filterString.toLowerCase()) ||
      post.description.toLowerCase().includes(filterString.toLowerCase())
    ) {
      return true;
    }
    return false;
  });

  return (
    <FlatList
      data={filteredArray}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <ListItem navigation={navigation} singleMedia={item} />
      )}
    />
  );
};

FilteredList.propTypes = {
  navigation: PropTypes.object.isRequired,
  filterString: PropTypes.string,
};

export default FilteredList;
