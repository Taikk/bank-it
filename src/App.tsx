import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Offcanvas,
  Modal,
} from "react-bootstrap";

type Player = {
  id: number;
  name: string;
  points: number;
};

const App = () => {
  const [roundCount, setRoundCount] = useState(5);
  const [showPlayerSetup, setShowPlayerSetup] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showRules, setShowRules] = useState(false); // State for rules modal

  // Player Management Functions
  const addPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer: Player = {
        id: Date.now(),
        name: newPlayerName.trim(),
        points: 0,
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName("");
    }
  };

  const removePlayer = (id: number) => {
    setPlayers(players.filter((player) => player.id !== id));
  };

  const movePlayerUp = (index: number) => {
    if (index > 0) {
      const newPlayers = [...players];
      [newPlayers[index], newPlayers[index - 1]] = [
        newPlayers[index - 1],
        newPlayers[index],
      ];
      setPlayers(newPlayers);
    }
  };

  const movePlayerDown = (index: number) => {
    if (index < players.length - 1) {
      const newPlayers = [...players];
      [newPlayers[index], newPlayers[index + 1]] = [
        newPlayers[index + 1],
        newPlayers[index],
      ];
      setPlayers(newPlayers);
    }
  };

  const handleStartGame = () => {
    setShowPlayerSetup(false);
  };

  const handleNumberSelect = (number: number) => {
    setTotalPoints((prev) => prev + number);

    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextPlayerIndex);

    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex] = {
      ...updatedPlayers[currentPlayerIndex],
      points: updatedPlayers[currentPlayerIndex].points + number,
    };
    setPlayers(updatedPlayers);
  };

  const renderPlayerSetupPane = () => (
    <Offcanvas
      show={showPlayerSetup}
      onHide={() => setShowPlayerSetup(false)}
      placement="bottom"
      style={{ height: "80vh", transition: "transform 0.3s ease-in-out" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Add Players</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Row className="my-3 justify-content-center">
          <Col xs={12} md={6} className="d-flex">
            <Form.Control
              type="text"
              placeholder="Enter player name"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              className="me-2"
            />
            <Button
              variant="success"
              onClick={addPlayer}
              disabled={!newPlayerName.trim()}
            >
              Add
            </Button>
          </Col>
        </Row>

        <Row className="justify-content-center overflow-auto">
          <Col xs={12} md={6}>
            {players.map((player, index) => (
              <div key={player.id} className="d-flex align-items-center mb-2">
                <div className="me-3">{index + 1}.</div>
                <div className="flex-grow-1">{player.name}</div>
                <div>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="me-1"
                    onClick={() => movePlayerUp(index)}
                    disabled={index === 0}
                  >
                    Up
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="me-1"
                    onClick={() => movePlayerDown(index)}
                    disabled={index === players.length - 1}
                  >
                    Down
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removePlayer(player.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </Col>
        </Row>

        <Row className="fixed-bottom p-3">
          <Col className="text-center">
            <Button
              variant="primary"
              size="lg"
              disabled={players.length === 0}
              onClick={handleStartGame}
            >
              Let's GO
            </Button>
          </Col>
        </Row>
      </Offcanvas.Body>
    </Offcanvas>
  );

  const renderRulesModal = () => (
    <Modal show={showRules} onHide={() => setShowRules(false)}>
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
    <Container fluid className="vh-100 d-flex flex-column">
      <Row className="justify-content-between align-items-center bg-primary text-white py-2 px-4">
        <Col>
          <h1>Bank It!</h1>
        </Col>
        <Col className="text-end">
          <Button variant="light" onClick={() => setShowRules(true)}>
            Rules
          </Button>
        </Col>
      </Row>

      <Row
        className="justify-content-center align-items-center"
        style={{ height: "60%" }}
      >
        <Col className="text-center">
          <h1 style={{ fontSize: "6rem" }}>{totalPoints}</h1>
        </Col>
      </Row>

      <Row className="justify-content-center mb-3">
        <Col className="text-center">
          <h2>{players[currentPlayerIndex].name}'s Turn</h2>
        </Col>
      </Row>

      <Row className="justify-content-center mb-3">
        <Col xs={12} md={8}>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
              <Button
                key={num}
                variant="outline-primary"
                onClick={() => handleNumberSelect(num)}
                style={{ width: "80px" }}
              >
                {num}
              </Button>
            ))}

            <Button
              variant="outline-primary"
              onClick={() => handleNumberSelect(totalPoints)}
              style={{ width: "80px" }}
            >
              Double
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );

  return (
    <>
      <Container fluid className="vh-100 d-flex flex-column">
        <Row className="bg-primary text-white text-center py-3">
          <Col>
            <h1>Bank It!</h1>
          </Col>
          <Col className="text-end">
            <Button variant="light" onClick={() => setShowRules(true)}>
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
                  checked={roundCount === rounds}
                  onChange={() => setRoundCount(rounds)}
                />
              ))}
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowPlayerSetup(true)}
            >
              Start Game
            </Button>
          </Col>
        </Row>
      </Container>

      {renderPlayerSetupPane()}
      {players.length > 0 && !showPlayerSetup && renderGameScreen()}
      {renderRulesModal()}
    </>
  );
};

export default App;
