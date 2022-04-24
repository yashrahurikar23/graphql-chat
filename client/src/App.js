import logo from './logo.svg';
import './App.css';
import {ApolloProvider} from '@apollo/client';
import { client, Chat } from './Chat';

function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
      <Chat/>
      </ApolloProvider>
    </div>
  );
}

export default App;
