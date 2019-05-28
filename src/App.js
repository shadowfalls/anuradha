import React from 'react';

import { BrowserRouter, HashRouter, Route, Switch } from "react-router-dom";

import { library } from '@fortawesome/fontawesome-svg-core';
import { faLink, faQuoteLeft, faTimes, faArrowLeft, faPlus, faCode, faPen } from '@fortawesome/free-solid-svg-icons';

library.add([faLink, faQuoteLeft, faTimes, faArrowLeft, faPlus, faCode, faPen]);

import Editor from './app/editor/Editor';
import BlogList from './app/blogList/BlogList';

function App() {
  return (
    <HashRouter>
      <Switch>
        <Route exact path='/blog' component={Editor} />
        <Route exact path='/' component={BlogList} />
      </Switch>
    </HashRouter>
  );
}

export default App;
