import React from 'react';

import Editor from './app/editor/Editor';

import { Container } from 'reactstrap';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faLink, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';

library.add([faLink, faQuoteLeft]);


function App() {
  return (
    <Container>
      <Editor />
    </Container>
  );
}

export default App;
