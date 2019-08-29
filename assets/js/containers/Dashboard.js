import React from 'react'
import { connect } from 'react-redux'
class Dashboard extends React.Component {

    render() {
        return (
            <p> Dashboard </p>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return { dispatch };
}

export default connect(null, mapDispatchToProps)(Dashboard)