// -----------------------------------------------
//
// GameModal -> GameModal.js
// Desc: Component that will show when the user starts
// or finishes finding all characters
//
// -----------------------------------------------

// -----------------------------------------------
// Imports

// React
import * as React from 'react';

// Material UI
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

//  Styled Components
import styled from 'styled-components';
import { ModalContent } from './styling';

// Util
import { pushToDatabase } from '../../../util/firebaseUtil';
// -----------------------------------------------

function GameModal(props) {
	const { gameStatus, timer, userResultsDB } = props;
	const [userName, setUserName] = React.useState('');

	function handleModalAction(event) {
		event.stopPropagation();
		event.preventDefault();
		console.log({ userName });

		if (gameStatus === 0) {
			props.handleIsGameOver(1);
			props.handleModalClose();
		} else if (gameStatus === 1) {
			pushToDatabase(userName, timer);
			props.handleIsGameOver(2);
			props.handleGameStatus(2);
		}
	}

	function handleChange(event) {
		console.log(event.target.value);
		setUserName(event.target.value);
	}

	function buildTableRows() {
		return Object.entries(userResultsDB).map((userResult, index) => {
			const { userName, time } = userResult[1];

			return (
				<TableRow key={index}>
					<TableCell align='center' component='th' scope='row'>
						{userName}
					</TableCell>

					<TableCell align='center'>{time}</TableCell>
				</TableRow>
			);
		});
	}

	function showTable() {
		return (
			<TableContainer component={Paper}>
				<Table aria-label='simple table'>
					<TableHead>
						<TableRow>
							<TableCell align='center'>User Name</TableCell>

							<TableCell align='center'>Time</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>{buildTableRows()}</TableBody>
				</Table>
			</TableContainer>
		);
	}

	function renderModalContent() {
		let result = '';

		if (gameStatus === 0) {
			result = (
				<>
					<p>Welcome to Where's Waldow!</p>
					<p>Tag these characters as fast as you can!</p>
					<p>
						Scroll through the image to find the correct character.
					</p>
					<p>
						Click the character and choose the correct name. You
						will be timed and your score will be recorded, so move
						fast!
					</p>

					<button
						type='button'
						onClick={event => handleModalAction(event)}
					>
						Start Game
					</button>
				</>
			);
		} else if (gameStatus === 1) {
			result = (
				<form>
					<p>You found all characters! Submit your score!</p>

					<TextField
						id='outlined-basic'
						label='Enter Your Name'
						variant='outlined'
						onChange={event => handleChange(event)}
					/>

					<button
						type='submit'
						onClick={event => handleModalAction(event)}
					>
						Submit
					</button>

					<p>High Scores</p>
					{showTable()}
				</form>
			);
		} else {
			result = (
				<>
					<p>Thanks for playing!</p>

					<p>High Scores</p>
					{showTable()}
				</>
			);
		}

		return result;
	}

	React.useEffect(() => {
		renderModalContent();
	});

	return (
		<div>
			<Modal
				open={props.open}
				aria-labelledby='simple-modal-title'
				aria-describedby='simple-modal-description'
			>
				<ModalContent>{renderModalContent()}</ModalContent>
			</Modal>
		</div>
	);
}

export default GameModal;
