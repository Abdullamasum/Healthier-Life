import {TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../../utils/variables';
import {Card, Text} from '@rneui/base';
import {CardTitle} from '@rneui/base/dist/Card/Card.Title';
import {CardDivider} from '@rneui/base/dist/Card/Card.Divider';
import {CardImage} from '@rneui/base/dist/Card/Card.Image';

const ListItem = ({singleMedia, navigation}) => {
  const item = singleMedia;
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Single', item);
      }}
    >
      <Card>
        <CardTitle>{item.title}</CardTitle>
        <CardDivider />
        <CardImage source={{uri: uploadsUrl + item.thumbnails?.w160}} />
        <CardDivider />
        <CardDivider />
        <Text>{item.description}</Text>
      </Card>
    </TouchableOpacity>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListItem;
