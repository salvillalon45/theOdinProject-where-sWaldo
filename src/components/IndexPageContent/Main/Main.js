// -----------------------------------------------
//
// Main -> Main.js
// Desc: Main parent component to hold all state that will
// be used by child components
//
// -----------------------------------------------

// -----------------------------------------------
// Imports

// React
import * as React from 'react';

// Components
import Dropdown from '../Dropdown';
import CharacterChoiceResult from '../CharacterChoiceResult';
import GameModal from '../GameModal';
import GameImage from '../GameImage';
import Header from '../../Layout/Header';
import Footer from '../../Layout/Footer';

// Util
import {
	getCoordsFromDB,
	getUserResultsFromDB
} from '../../../util/firebaseUtil';
import {
	checkInputCoords,
	removeCharacter,
	formatTime
} from '../../../util/gameUtil';
// -----------------------------------------------

function Main() {
	const [showDropdown, setShowDropdown] = React.useState(false);
	const [dbCoords, setDBCoords] = React.useState(null);
	const [styleCoords, setStyleCoords] = React.useState([]);
	const [userCoords, setUserCoords] = React.useState([]);
	const [userCharacterChoice, setUserCharacterChoice] = React.useState('');
	const [characterSelected, setCharacterSelect] = React.useState(false);
	const [open, setOpen] = React.useState(false);
	const [characters, setCharacters] = React.useState([]);
	const [gameStatus, setGameStatus] = React.useState(0);
	const [isGameOver, setIsGameOver] = React.useState('');
	const [timer, setTimer] = React.useState(0);
	const [popUpFlag, setPopUpFlag] = React.useState(false);
	const [userResultsDB, setUserResultsDB] = React.useState([]);

	function handleClick(event) {
		setShowDropdown(!showDropdown);
		const { pageX, pageY } = event;
		const x = Math.round((pageX / window.innerWidth) * 100);
		const y = Math.round((pageY / window.innerWidth) * 100);
		setUserCoords([x, y]);
		setStyleCoords([pageX, pageY]);
	}

	function renderCharacterChoiceResult() {
		return (
			<CharacterChoiceResult userCharacterChoice={userCharacterChoice} />
		);
	}

	function checkCharacterChoice(userInput) {
		const result = checkInputCoords(userCoords, userInput, dbCoords);

		if (result) {
			removeCharacter(userInput, characters);
			setUserCharacterChoice(userInput);
		} else {
			setUserCharacterChoice('');
		}

		setPopUpFlag(!popUpFlag);
	}

	function handleUserCharacterChoice(userInput) {
		setCharacterSelect(!characterSelected);
		setShowDropdown(!showDropdown);
		checkCharacterChoice(userInput);
	}

	function handleSetTimer(stopCheck) {
		if (stopCheck === 0) {
			setTimer(0);
		} else {
			setTimer(timer => timer + 1);
		}
	}

	function handleIsGameOver(value) {
		setIsGameOver(value);
	}

	function handleGameStatus(value) {
		setGameStatus(value);
	}

	function handleModalOpen() {
		setOpen(true);
	}

	function handleModalClose() {
		setOpen(false);
	}

	async function getDataFromDB() {
		const result = await getCoordsFromDB(1);
		setDBCoords(result);
		setCharacters(Object.keys(result));

		const userResults = await getUserResultsFromDB();
		setUserResultsDB(userResults);
	}

	React.useEffect(async () => {
		handleModalOpen();
		getDataFromDB();
	}, []);

	React.useEffect(() => {
		const choiceTimer = setTimeout(() => {
			if (characterSelected) {
				setCharacterSelect(!characterSelected);
				setUserCharacterChoice('');
				setPopUpFlag(!popUpFlag);
			}
		}, [3000]);

		return () => clearTimeout(choiceTimer);
	}, [characterSelected]);

	React.useEffect(() => {
		if (characters.length === 0 && dbCoords) {
			handleModalOpen();
			setGameStatus(1);
			handleIsGameOver(true);
		}
	}, [characters.length !== 0]);

	return (
		<>
			<Header
				timer={timer}
				handleSetTimer={handleSetTimer}
				isGameOver={isGameOver}
			/>

			<main>
				<section>
					<div
						className='gameImageContainer'
						onClick={event => handleClick(event)}
					>
						<GameModal
							open={open}
							handleModalClose={handleModalClose}
							handleIsGameOver={handleIsGameOver}
							gameStatus={gameStatus}
							handleGameStatus={handleGameStatus}
							timer={formatTime(timer)}
							userResultsDB={userResultsDB}
						/>

						{popUpFlag && renderCharacterChoiceResult()}

						{showDropdown && (
							<Dropdown
								handleUserCharacterChoice={
									handleUserCharacterChoice
								}
								coords={styleCoords}
								characters={characters}
							/>
						)}

						<GameImage />
					</div>
				</section>
			</main>

			<Footer />
		</>
	);
}

export default Main;
