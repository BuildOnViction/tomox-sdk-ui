import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img className="App-logo" alt="logo" />
          <h1 className="App-title">
            <FormattedMessage
              id="app.title"
              defaultMessage="Welcome to React"
            />
          </h1>
        </header>
        <p className="App-intro">
          <FormattedMessage
            id="app.introduction"
            defaultMessage="To get started, edit {code} and save to reload."
            values={{ code: <code>src/App.js</code> }}
          />
        </p>
      </div>
    )
  }
}

export default App
