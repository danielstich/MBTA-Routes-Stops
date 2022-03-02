import { useEffect, useState } from 'react';
import './App.scss';

// Main App Component
function App() {
	// API Routes
	const API_URL = 'https://api-v3.mbta.com';
	const ROUTES = 'routes';
	const TYPE = '0,1';

	// State
	const [routes, setRoutes] = useState(null);
	const [currentRoute, setCurrentRoute] = useState(null);

	// Get all Routes on initial render
	useEffect(() => {
		const options = {
			method: 'GET',
		};
		fetch(`${API_URL}/${ROUTES}?type=${TYPE}`, options)
			.then((response) => response.json())
			.then((data) => {
				setRoutes(data);
			})
			.catch((error) => {
				console.log('Error:', error);
			});
	}, []);

	// Render Routes and Stops components
	return (
		<div className='App'>
			{routes && <Routes routes={routes} API_URL={API_URL} setCurrentRoute={setCurrentRoute} />}
			{currentRoute && <Stops route={currentRoute} />}
		</div>
	);
}

// Route List Component
function Routes(props) {
	// props from App Component and API Route
	const { routes, API_URL, setCurrentRoute } = props;
	const STOPS = 'stops';

	// Get Route API call, sets route to currentRoute and name to currentRouteName
	const getRoute = (routeID, name) => {
		const options = {
			method: 'GET',
		};
		fetch(`${API_URL}/${STOPS}?route=${routeID}`, options)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				data.name = name;
				setCurrentRoute(data);
			})
			.catch((error) => {
				console.log('Error:', error);
			});
	};

	// Build Route List elements
	const routeList = [];
	for (let i = 0; i < routes.data.length; i++) {
		const route = routes.data[i];

		routeList.push(
			<li key={route.id} style={{ backgroundColor: `#${route.attributes.color}` }} className='Route' onClick={() => getRoute(route.id, route.attributes.long_name)}>
				{route.id} - {route.attributes.long_name}
			</li>
		);
	}

	// Render Route List
	return (
		<div className='Routes'>
			<h3 className='Routes__header'>Routes</h3>
			{routeList}
		</div>
	);
}

// Stops Component
function Stops(props) {
	// props from App Component
	const { route } = props;

	// Build Stop List
	const stopList = [];
	for (let i = 0; i < route.data.length; i++) {
		const stop = route.data[i];
		stopList.push(
			<li className='Stop' key={stop.id}>
				{stop.attributes.name}
			</li>
		);
	}

	// Render Stop List
	return (
		<div className='Stops'>
			<h3>Stops - {route.name}</h3>
			{stopList}
			<div className='Stops__line'></div>
		</div>
	);
}

export default App;
