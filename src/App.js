import React from 'react';
import ReactNotification from 'react-notifications-component';
import { HashRouter, Route, Switch } from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faLink, faQuoteLeft, faArrowLeft, faPlus, faCode, faPen, faFileImage, faCamera, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

import Editor from './app/editor/Editor';
import BlogList from './app/blogList/BlogList';

library.add([faLink, faQuoteLeft, faArrowLeft, faPlus, faCode, faPen, faFileImage, faCamera, faTimes, faCheck]);

function App() {
  return (
    <>
      <ReactNotification />
      <HashRouter>
        <Switch>
          <Route exact path="/blog" component={Editor} />
          <Route exact path="/" component={BlogList} />
        </Switch>
      </HashRouter>
    </>
  );
}

export default App;
