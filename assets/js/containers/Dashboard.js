import React from 'react'
import { connect } from 'react-redux'
import { CreateChatroom } from '../ducks/chatroom'

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            channelName: ''
        }
        this.handleConnect = this.handleConnect.bind(this);
        this.handleChannelNameChange = this.handleChannelNameChange.bind(this);
    }

    handleChannelNameChange(e) {
        this.setState({
            channelName: e.target.value
        });
    }

    handleConnect(e) {
        this.props.dispatch(CreateChatroom(this.state.channelName));
    }


    render() {
        return (
            <>
                <div id="channel-exists">
                    {this.props.rooms.map((room, key) => <div key={room.idx}>room </div>)}
                </div>
                <div id="new-channel-wrapper">
                    <input type="text" onChange={this.handleChannelNameChange} value={this.state.channelName} />
                    <button onClick={this.handleConnect} > Create Channel </button>
                </div>
            </>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return { dispatch };
}
function mapStateToProps(state) {
    console.log(state);
    return { rooms: state.channel.rooms };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)