import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DynamicCard } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<DynamicCard>{(key) => key}</DynamicCard>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
