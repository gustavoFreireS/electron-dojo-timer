import React, { Component, Fragment } from "react";
import Timer from './timer-section';
import '../../stylesheets/styles.scss';

const HomePage = () => {
	return (
		<Fragment>
			<div className='dragBar'></div>
			<Timer />
		</Fragment>
	)
}
export default HomePage;
