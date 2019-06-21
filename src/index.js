import React from "react";
import ReactDOM from "react-dom";
import HomePage from "./containers/HomePage/HomePage.js";

const Index = () => {
	return <HomePage />;
};

ReactDOM.render(<Index />, document.getElementById("index"));
export default Index;
