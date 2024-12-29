import { observer } from "mobx-react-lite";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Offcanvas,
  Modal,
} from "react-bootstrap";
import "./App.css";
import { gameStore } from "./store";
import GameResults from "./components/gameResults";

const App = observer(() => {
  const renderPlayerSetupPane = () => (
    <Offcanvas
      show={gameStore.showPlayerSetup}
      onHide={() => gameStore.setShowPlayerSetup(false)}
      placement="top"
      className="align-items-between custom-offcanvas"
      style={{ height: "80vh" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Add Players</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column">
        <Row className="my-3 justify-content-center">
          <Col xs={12} md={6} className="d-flex">
            <Form.Control
              type="text"
              placeholder="Enter player name"
              value={gameStore.newPlayerName}
              onChange={(e) => gameStore.setNewPlayerName(e.target.value)}
              className="me-2"
            />
            <Button
              variant="success"
              onClick={gameStore.addPlayer}
              disabled={!gameStore.newPlayerName.trim()}
            >
              Add
            </Button>
          </Col>
        </Row>

        <Row className="justify-content-center overflow-auto flex-grow-1">
          <Col xs={12} md={6}>
            {gameStore.players.map((player, index) => (
              <div key={player.id} className="d-flex align-items-center mb-2">
                <div className="me-3">{index + 1}.</div>
                <div className="flex-grow-1">{player.name}</div>
                <div>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => gameStore.removePlayer(player.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </Col>
        </Row>

        <Row className="mt-auto">
          <Col xs={12} md={6} className="mx-auto">
            <Button
              className="w-100"
              variant="primary"
              onClick={() => {
                gameStore.startGame();
                gameStore.setShowPlayerSetup(false);
              }}
              disabled={gameStore.players.length < 2}
            >
              Game Start!
            </Button>
          </Col>
        </Row>
      </Offcanvas.Body>
    </Offcanvas>
  );

  const renderRulesModal = () => (
    <Modal
      show={gameStore.showRules}
      onHide={() => gameStore.setShowRules(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Game Rules</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Here are the game Rules:</p>
        <ul>
          <li>Players will take turn rolling 2 dice</li>
          <li>The value of the dice will be added to the total</li>
          <li>Before round 3, a 7 is worth 50 points.</li>
          <li>After the 3rd round, if a 7 is rolled. It ends the round</li>
          <li>Rolling doubles after round 3, will double the total</li>
          <li>
            Players can bank at any time to take the current point value, and no
            longer roll
          </li>
          <li>
            Play continues until all players bank, or a 7 is rolled, in which,
            no points are scored
          </li>
        </ul>
      </Modal.Body>
    </Modal>
  );

  const renderGameScreen = () => (
    <Container
      fluid
      className={`screen ${
        gameStore.isGameStarted && !gameStore.isGameOver
          ? "screen-visible"
          : "screen-hidden"
      } vh-100 d-flex flex-column`}
    >
      <Row className="justify-content-between align-items-center bg-primary text-white py-2 px-4">
        <Col>
          <h1>Bank It!</h1>
        </Col>
        <Col className="text-center">
          <h2>
            Round {gameStore.currentRound} of {gameStore.roundCount}
          </h2>
        </Col>
        <Col className="text-end">
          <Button variant="light" onClick={() => gameStore.setShowRules(true)}>
            Rules
          </Button>
        </Col>
      </Row>

      <Row className="justify-content-center align-items-center points-display">
        <Col className="text-center">
          <h1 className="points-value">{gameStore.totalPoints}</h1>
        </Col>
      </Row>

      <Row className="justify-content-center mb-3">
        <Col className="text-center">
          {gameStore.isGameOver ? (
            <h2>Game Over!</h2>
          ) : (
            <h2>
              {gameStore.players[gameStore.currentPlayerIndex]?.name}'s Turn
            </h2>
          )}
        </Col>
      </Row>

      <Row className="justify-content-center mb-3">
        <Col xs={12} md={8}>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
              <Button
                key={num}
                variant="outline-primary"
                onClick={() => gameStore.handleNumberSelect(num)}
                className="number-button"
                disabled={gameStore.isGameOver}
              >
                {num}
                {num === 7 && " (50pts)"}
              </Button>
            ))}

            <Button
              variant="outline-primary"
              onClick={() =>
                gameStore.handleNumberSelect(gameStore.totalPoints)
              }
              className="number-button"
              disabled={gameStore.isGameOver}
            >
              Double
            </Button>

            <Button
              variant="success"
              onClick={gameStore.bankPoints}
              className="number-button"
              disabled={gameStore.isGameOver || gameStore.totalPoints === 0}
            >
              Bank
            </Button>

            <Button
              variant="danger"
              onClick={gameStore.clearRound}
              className="number-button"
              disabled={gameStore.isGameOver}
            >
              Clear
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="justify-content-center mb-3">
        <Col xs={12} md={8}>
          <div className="text-center">
            <h3>Scores:</h3>
            {gameStore.players.map((player) => (
              <div key={player.id}>
                {player.name}: {player.points} points
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );

  const renderResultsScreen = () => (
    <div
      className={`screen ${
        gameStore.isGameOver ? "screen-visible" : "screen-hidden"
      }`}
    >
      <GameResults
        players={gameStore.players}
        onPlayAgain={() => gameStore.resetGame()}
        onReturnToMenu={() => gameStore.returnToMenu()}
      />
    </div>
  );

  const renderWelcomeScreen = () => (
    <Container
      fluid
      className={`screen ${
        gameStore.isGameStarted ? "screen-hidden" : "screen-visible"
      } vh-100 d-flex flex-column`}
    >
      <Row className="bg-primary text-white text-center py-3">
        <Col>
          <h1>Bank It!</h1>
        </Col>
        <Col className="text-end">
          <Button variant="light" onClick={() => gameStore.setShowRules(true)}>
            Rules
          </Button>
        </Col>
      </Row>

      <Row className="flex-grow-1 align-items-center justify-content-center">
        <Col xs={12} className="text-center">
          IMAGE
        </Col>
      </Row>

      <Row className="bg-light py-3 position-absolute bottom-0 w-100">
        <Col className="d-flex flex-column align-items-center">
          <div className="d-flex gap-3 mb-3">
            {[5, 10, 20].map((rounds) => (
              <Form.Check
                key={rounds}
                type="radio"
                label={`${rounds} Rounds`}
                name="roundOptions"
                checked={gameStore.roundCount === rounds}
                onChange={() => gameStore.setRoundCount(rounds)}
              />
            ))}
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => gameStore.setShowPlayerSetup(true)}
          >
            Start Game
          </Button>
        </Col>
      </Row>
    </Container>
  );

  return (
    <div className="game-container">
      {renderWelcomeScreen()}
      {renderGameScreen()}
      {renderResultsScreen()}
      {renderPlayerSetupPane()}
      {renderRulesModal()}
    </div>
  );
});

export default App;
