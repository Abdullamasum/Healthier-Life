import {StatusBar} from 'expo-status-bar';
import {MainProvider} from './contexts/MainContext';
import Navigator from './navigators/Navigator';
import AppRating from './views/Apprating';

const App = () => {
  return (
    <MainProvider>
      <Navigator />
      <AppRating />
      <StatusBar style="auto" />
    </MainProvider>
  );
};

export default App;
