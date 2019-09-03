import React from 'react'
import { connect } from 'react-redux'
import { ConnectSocket } from '../ducks/auth'
class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: ''
        }
        this.handleConnect = this.handleConnect.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
    }

    handleUsernameChange(e) {
        this.setState({
            username: e.target.value
        });
    }

    handleConnect(e) {
        this.props.dispatch(ConnectSocket(this.state.username));
    }

    render() {
        return (
            <>
                <input type="text" onChange={this.handleUsernameChange} value={this.state.username} />
                <button onClick={this.handleConnect} > Connect </button>
            </>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return { dispatch };
}

export default connect(null, mapDispatchToProps)(Login)