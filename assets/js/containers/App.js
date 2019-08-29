import React, { Component } from 'react';
import { Route, BrowserRouter as Router, Link } from 'react-router-dom'
import { connect } from "react-redux";

import Dashboard from './Dashboard';
import Login from './Login';
import { DisconnectSocket } from '../actions/index'
class App extends Component {

    componentDidMount()
    {
        const self=this;
        window.onbeforeunload = function() {
            self.props.dispatch(DisconnectSocket());
        }.bind(this);
    }
    render() {
        return (
            <Router>

                {!this.props.isAuth && <Route path="/" component={Login} />}
                {this.props.isAuth && <Route path="/" component={Dashboard} />}
            </Router>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return { dispatch };
}
function mapStateToProps(state) {
    const isAuth = state.auth.isAuth;
    console.log(state);
    return {
        isAuth
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);