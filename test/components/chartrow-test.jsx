import { expect } from 'chai';

import React from 'react';
import ReactShallowRenderer from 'react-addons-test-utils';

import Chartrow from '../../src/js/components/chartrow.jsx';

describe('Chartrow component', function () {
  before(() => {
    let shallowRenderer = ReactShallowRenderer.createRenderer();
    shallowRenderer.render(
      <Chartrow />
    );
    this.result = shallowRenderer.getRenderOutput();
  });

  it('renders a <div>', () => {
    expect(this.result.type).to.equal('div');
  });
});
