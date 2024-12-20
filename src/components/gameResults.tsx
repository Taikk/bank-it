import { Trophy, Medal, Home, RotateCcw } from "lucide-react";
import { Button } from "react-bootstrap";

// Define the Player type (should match your existing Player type in GameStore)
interface Player {
  id: number;
  name: string;
  points: number;
  hasFinished: boolean;
}

// Define props interface for the component
interface Props {
  players: Player[];
  onPlayAgain: () => void;
  onReturnToMenu: () => void;
}

const GameResults = (props: Props) => {
  const { players, onPlayAgain, onReturnToMenu } = props;
  // Sort players by points in descending order
  const sortedPlayers = players.slice().sort((a, b) => b.points - a.points);

  const getPlacementIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-8 h-8 text-yellow-400" />;
      case 1:
        return <Medal className="w-8 h-8 text-gray-400" />;
      case 2:
        return <Medal className="w-8 h-8 text-amber-700" />;
      default:
        return null;
    }
  };

  return (
    <div className="d-flex flex-column justify-content-between min-vh-100">
      {/* Centered Winner Section */}
      <div className="d-flex flex-column justify-content-center align-items-center flex-grow-0 mb-12">
        <h1 className="text-4xl font-bold mb-2">Game Over!</h1>

        <div className="flex flex-col items-center justify-center gap-4 mb-4">
          <Trophy className="w-12 h-12 text-yellow-400" />
          <h2 className="text-3xl font-bold text-center">
            {sortedPlayers[0]?.name}
          </h2>
        </div>

        <p className="text-2xl">
          Winner with {sortedPlayers[0]?.points} points!
        </p>
      </div>

      {/* Other Players Section */}
      <div className="flex-grow-1 space-y-4 mb-12">
        {sortedPlayers.slice(1).map((player, index) => (
          <div
            key={player.id}
            className="flex items-center justify-between bg-white/10 rounded-lg p-4 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4">
              {getPlacementIcon(index + 1)}
              <span className="text-xl font-semibold">{player.name}</span>
            </div>
            <span className="text-xl">{player.points} points</span>
          </div>
        ))}
      </div>

      {/* Action Buttons at the Bottom */}
      <div className="d-flex flex-column align-items-center justify-content-end gap-4">
        <Button onClick={onPlayAgain} className="">
          <RotateCcw className="w-5 h-5" />
          Play Again
        </Button>
        <Button onClick={onReturnToMenu} variant="secondary" className="">
          <Home className="w-5 h-5" />
          Main Menu
        </Button>
      </div>
    </div>
  );
};

export default GameResults;
