const assert = require("assert");
const Application = require("spectron").Application;
const join = require('path').join;


describe('Launch', function() {
  this.timeout(10000)

  beforeEach(function() {
    const electronPath = join(__dirname, '..', 'node_modules', '.bin', 'electron')
    this.app = new Application({
      path: electronPath,
      args: [join(__dirname, '..')]
    })
    return this.app.start()
  })

  afterEach(function() {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  it('show an initial window', function() {
    return this.app.client.getWindowCount().then(function(count){
      assert.equal(count, 1)
    })
  })
})