// Hooks
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { BrowserRouter } from 'react-router-dom';

// Components
import App from './App';

// Store
import store from './store/index';

// Styles
import './index.css';


const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

let persistor = persistStore(store);

root.render(
	<BrowserRouter>
		<Provider store={ store }>
			<PersistGate loading={ null } persistor={ persistor }>
				<App />
			</PersistGate>
		</Provider>
	</BrowserRouter>
);