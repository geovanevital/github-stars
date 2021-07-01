import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Main from './pages/Main';
import User from './pages/User';
import Repository from './pages/Repository';

const Routes = createAppContainer(
  createStackNavigator(
    {
      Main,
      User,
      Repository,
    },
    {
      headerLayoutPreset: 'center', // Header Alignemnt
      headerBackTitleVisible: false, // IoS next page just with the icon (disable text)
      defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: '#7159c1', // Header Background Color
        },
        headerTintColor: '#FFF', // Header Text Color
      },
    }
  )
);

export default Routes;
