import { useEffect, useState } from 'react';
import './App.scss';

function App() {
	const API_URL = 'https://api-v3.mbta.com';
	const ROUTES = 'routes';
	const STOPS = 'stops';
	const TYPE = '0,1';

	const [routes, setRoutes] = useState([]);
	const [currentRoute, setCurrentRoute] = useState({});

	useEffect(() => {
		const options = {
			method: 'GET',
		};
		fetch(`${API_URL}/${ROUTES}?type=${TYPE}`, options)
			.then((response) => response.json())
			.then((data) => {
				setRoutes(data.data);
			});
	}, []);

	const buildRoutes = () => {
		const routeList = [];
		for (let i = 0; i < routes.length; i++) {
			routeList.push(
				<li key={i} className='Route' onClick={() => getRoute(routes[i].id)}>
					{routes[i].attributes.description} - {routes[i].id}
				</li>
			);
		}

		return routeList;
	};

	const getRoute = (routeID) => {
		const options = {
			method: 'GET',
		};
		fetch(`${API_URL}/${STOPS}?route=${routeID}`, options)
			.then((resposne) => resposne.json())
			.then((data) => {
				setCurrentRoute(data);
			});
	};

	const renderStops = () => {
		const stopList = [];
		console.log(currentRoute);
		for (let i = 0; i < currentRoute.data.length; i++) {
			stopList.push(<li>{currentRoute.data[i].attributes.name}</li>);
		}
		return stopList;
	};

	return (
		<div className='App'>
			<ul>{buildRoutes()}</ul>
			<div>{renderStops()}</div>
		</div>
	);
}

export default App;
