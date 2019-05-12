import React from 'react';

import { BrowserRouter, Route, Switch } from "react-router-dom";

import { library } from '@fortawesome/fontawesome-svg-core';
import { faLink, faQuoteLeft, faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

library.add([faLink, faQuoteLeft, faTimes, faArrowLeft]);

import Editor from './app/editor/Editor';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Editor} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
