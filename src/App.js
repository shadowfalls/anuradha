import React from 'react';

import Editor from './app/editor/Editor';

import { Container } from 'reactstrap';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faLink, faQuoteLeft, faTimes } from '@fortawesome/free-solid-svg-icons';

library.add([faLink, faQuoteLeft, faTimes]);


function App() {
  return (
    <Container>
      <Editor />
    </Container>
  );
}

export default App;
