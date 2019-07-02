import React, { Component, Fragment } from "react";
import Timer from './timer-section';
import '../../stylesheets/styles.scss';

const HomePage = () => {
	return (
		<div className="app-container">
			<div className='dragBar'></div>
			<Timer />
		</div>
	)
}
export default HomePage;
