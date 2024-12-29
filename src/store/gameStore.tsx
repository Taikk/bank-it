import { makeAutoObservable, computed } from "mobx";

export type Player = {
  id: number;
  name: string;
  points: number;
  hasFinished: boolean;
};

export class GameStore {
  roundCount = 5;
  currentRound = 1;
  players: Player[] = [];
  currentPlayerIndex = 0;
  totalPoints = 0;
  isGameStarted = false;
  isGameFinished = false;
  isTransitioning = false;
  showPlayerSetup = false;
  showRules = false;
  newPlayerName = "";

  constructor() {
    makeAutoObservable(this, {
      isGameOver: computed,
      isRoundThreeOrLater: computed,
    });
  }

  get isGameOver() {
    return (
      (this.currentRound > this.roundCount || this.isGameFinished) &&
      !this.isTransitioning
    );
  }

  get isRoundThreeOrLater() {
    return this.currentRound >= 3;
  }

  setRoundCount = (count: number) => {
    this.roundCount = count;
  };

  setNewPlayerName = (name: string) => {
    this.newPlayerName = name;
  };

  addPlayer = () => {
    if (this.newPlayerName.trim()) {
      const newPlayer: Player = {
        id: Date.now(),
        name: this.newPlayerName.trim(),
        points: 0,
        hasFinished: false,
      };
      this.players.push(newPlayer);
      this.newPlayerName = "";
    }
  };

  removePlayer = (id: number) => {
    this.players = this.players.filter((player) => player.id !== id);
  };

  movePlayerUp = (index: number) => {
    if (index > 0) {
      const temp = this.players[index];
      this.players[index] = this.players[index - 1];
      this.players[index - 1] = temp;
    }
  };

  movePlayerDown = (index: number) => {
    if (index < this.players.length - 1) {
      const temp = this.players[index];
      this.players[index] = this.players[index + 1];
      this.players[index + 1] = temp;
    }
  };

  startGame = () => {
    this.isTransitioning = true;
    this.showPlayerSetup = false;
    this.currentRound = 1;
    this.totalPoints = 0;
    this.players.forEach((player) => {
      player.points = 0;
      player.hasFinished = false;
    });
    setTimeout(() => {
      this.isGameStarted = true;
      this.isTransitioning = false;
    }, 300);
  };

  clearRound = () => {
    // Mark all players as finished
    this.players.forEach((player) => (player.hasFinished = true));
    this.checkRoundEnd();
  };

  handleNumberSelect = (number: number) => {
    if (this.isGameOver) return;

    // Handle 7s
    if (number === 7) {
      this.totalPoints += 50; // 7 always adds 50 points now
    }
    // Handle double number after round 3
    else if (number === this.totalPoints && this.isRoundThreeOrLater) {
      this.totalPoints *= 2;
    } else {
      this.totalPoints += number;
    }

    this.moveToNextPlayer();
  };

  bankPoints = () => {
    if (this.isGameOver || this.totalPoints === 0) return;

    // Add current points to player's total
    this.players[this.currentPlayerIndex].points += this.totalPoints;
    this.players[this.currentPlayerIndex].hasFinished = true;

    this.moveToNextPlayer();
    this.checkRoundEnd();
  };

  checkRoundEnd = () => {
    if (this.players.every((player) => player.hasFinished)) {
      if (this.currentRound >= this.roundCount) {
        this.isGameFinished = true; // Set this when game should end
      } else {
        this.currentRound++;
        this.players.forEach((player) => (player.hasFinished = false));
        this.moveToNextPlayer();
        this.totalPoints = 0;
      }
    }
  };

  moveToNextPlayer = () => {
    // Find next unfinished player
    let nextPlayerIndex = this.currentPlayerIndex;
    do {
      nextPlayerIndex = (nextPlayerIndex + 1) % this.players.length;
    } while (
      this.players[nextPlayerIndex].hasFinished &&
      nextPlayerIndex !== this.currentPlayerIndex
    );

    this.currentPlayerIndex = nextPlayerIndex;
  };

  setShowPlayerSetup = (show: boolean) => {
    this.showPlayerSetup = show;
  };

  setShowRules = (show: boolean) => {
    this.showRules = show;
  };

  resetGame = () => {
    this.isTransitioning = true;
    setTimeout(() => {
      this.currentRound = 1;
      this.totalPoints = 0;
      this.players.forEach((player) => {
        player.points = 0;
        player.hasFinished = false;
      });
      this.currentPlayerIndex = 0;
      this.isGameFinished = false; // Use this instead
      this.isTransitioning = false;
    }, 300);
  };

  returnToMenu = () => {
    this.isTransitioning = true;
    setTimeout(() => {
      this.isGameStarted = false;
      this.currentRound = 1;
      this.totalPoints = 0;
      this.players = [];
      this.currentPlayerIndex = 0;
      this.isGameFinished = false; // Use this instead
      this.isTransitioning = false;
    }, 300);
  };
}

export const gameStore = new GameStore();
