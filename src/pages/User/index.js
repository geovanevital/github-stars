import React, {Component} from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  ActivityIndicator,
  ClickableRepository,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    refreshing: false,
    page: 1,
  };

  async componentDidMount() {
    this.setState({loading: true});

    const {navigation} = this.props;
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({stars: response.data, loading: false});
  }

  loadMore = async () => {
    const {stars, page} = this.state;
    const {navigation} = this.props;
    const user = navigation.getParam('user');

    const nextPage = page + 1;
    this.setState({page: nextPage});

    const response = await api.get(
      `/users/${user.login}/starred?page=${nextPage}`
    );

    const newStars = stars.concat(response.data);

    this.setState({stars: newStars});
  };

  handleNavigate = repository => {
    const {navigation} = this.props;

    navigation.navigate('Repository', {repository});
  };

  render() {
    const {navigation} = this.props;
    const {stars, loading, refreshing} = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{uri: user.avatar}} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <ActivityIndicator color="#7159c1" size={70} />
        ) : (
          <Stars
            onRefresh={() => this.componentDidMount()}
            refreshing={refreshing}
            onEndReachedThreshold={0.5}
            onEndReached={this.loadMore}
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({item}) => (
              <ClickableRepository onPress={() => this.handleNavigate(item)}>
                <Starred>
                  <OwnerAvatar source={{uri: item.owner.avatar_url}} />
                  <Info>
                    <Title>{item.name}</Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </Starred>
              </ClickableRepository>
            )}
          />
        )}
      </Container>
    );
  }
}
