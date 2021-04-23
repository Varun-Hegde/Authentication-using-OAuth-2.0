import React, { Component } from 'react';
import { connect } from 'react-redux';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

import * as actions from '../actions';
import { googleId, facebookId } from './keys';
class Dashboard extends Component {
	async componentDidMount() {
		this.props.getDashboard();
	}

	linkFacebook = async (res) => {
		console.log('Link with Facebook', res);
		await this.props.linkFacebook(res.accessToken);
	};

	linkGoogle = async (res) => {
		console.log('Link with Google', res);
		await this.props.linkGoogle(res.accessToken);
	};

	unlinkGoogle = async () => {
		console.log('Unlink Google');
		await this.props.unlinkGoogle();
	};

	unlinkFacebook = async (res) => {
		console.log('Unlink Facebook');
		await this.props.unlinkFacebook();
	};

	render() {
		return (
			<div>
				<h1>Dashboard</h1>
				<br />
				Our secret: <h3>{this.props.secret}</h3>
				<h2>Link your social media accounts</h2>
				<FacebookLogin
					appId={facebookId}
					disabled={true}
					render={(renderProps) => (
						<button
							style={{ marginRight: 15 }}
							className="btn btn-primary"
							onClick={renderProps.onClick}
							disabled={this.props.dashboard.methods.includes('facebook') ? true : false}
						>
							Link with Facebook
						</button>
					)}
					fields="name,email,picture"
					callback={this.linkFacebook}
					cssClass="btn btn-outline-primary"
				/>
				<GoogleLogin
					clientId={googleId}
					disabled={this.props.dashboard.methods.includes('google') ? true : false}
					render={(renderProps) => (
						<button
							className="btn btn-danger"
							onClick={renderProps.onClick}
							disabled={renderProps.disabled}
						>
							Link with Google
						</button>
					)}
					onSuccess={this.linkGoogle}
					onFailure={this.linkGoogle}
				/>
				<br />
				<br />
				<br />
				<h2>Unlink your social media accounts</h2>
				<button
					style={{ marginRight: 15 }}
					className="btn btn-primary"
					onClick={() => this.unlinkFacebook()}
					disabled={this.props.dashboard.methods.includes('facebook') ? false : true}
				>
					Unlink with Facebook
				</button>
				<button
					className="btn btn-danger"
					onClick={() => this.unlinkGoogle()}
					disabled={this.props.dashboard.methods.includes('google') ? false : true}
				>
					Unlink with Google
				</button>
			</div>
		);
	}
}

function mapStateToProps(state) {
	console.log('state', state);
	return {
		secret: state.dash.secret,
		dashboard: state.dash,
		auth: state.auth,
	};
}

export default connect(mapStateToProps, actions)(Dashboard);
