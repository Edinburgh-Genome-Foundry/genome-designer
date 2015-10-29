module.exports = {
  'Test 1' : function (browser) {
    browser
      .url('http://localhost:3000/scenegraph')
      .waitForElementPresent('.ViewGraph', 50000, 'expected a viewgraph to appear')
      .assert.countelements('.ViewGraphNode', 58, 'expected 58 view graph nodes')
      .end();
  }
};
