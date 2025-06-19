import React, { useState, useEffect } from "react";
import "./Memotest.css";

function createCards() {
  const colors = ["red", "blue", "green", "yellow", "purple", "orange"];
  const pairedColors = [...colors, ...colors];

  const shuffled = pairedColors
    .map((color) => ({ color, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((item, index) => ({
      id: index,
      color: item.color,
      isFlipped: false,
      isMatched: false,
    }));

  return shuffled;
}

const Card = ({ card, onClick }) => {
  const cardClass = `card ${card.isFlipped || card.isMatched ? card.color : ""}`;

  return (
    <div
      className={cardClass}
      onClick={() => onClick(card.id)}
      style={{ pointerEvents: card.isFlipped || card.isMatched ? "none" : "auto" }}></div>
  );
};

const Memotest = () => {
  const [cards, setCards] = useState(createCards);
  const [selectedCards, setSelectedCards] = useState([]);
  const [blocked, setBlocked] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    if (selectedCards.length === 2) {
      const [first, second] = selectedCards;

      if (cards[first].color === cards[second].color) {
        const updated = cards.map((card) => (card.color === cards[first].color ? { ...card, isMatched: true } : card));
        setCards(updated);
        setSelectedCards([]);
      } else {
        setBlocked(true);
        setTimeout(() => {
          const updated = cards.map((card, index) =>
            index === first || index === second ? { ...card, isFlipped: false } : card
          );
          setCards(updated);
          setSelectedCards([]);
          setBlocked(false);
        }, 1000);
      }
    }
  }, [selectedCards, cards]);

  useEffect(() => {
    if (cards.every((card) => card.isMatched)) {
      setGameWon(true);
    }
  }, [cards]);

  const handleCardClick = (id) => {
    if (blocked || selectedCards.length >= 2 || cards[id].isFlipped || cards[id].isMatched) return;

    const updated = cards.map((card) => (card.id === id ? { ...card, isFlipped: true } : card));
    setCards(updated);
    setSelectedCards([...selectedCards, id]);
  };

  const restartGame = () => {
    setCards(createCards());
    setSelectedCards([]);
    setBlocked(false);
    setGameWon(false);
  };

  return (
    <div className="memotest">
      {gameWon && (
        <div className="winner">
          <h2>You won!</h2>
          <button onClick={restartGame}>Play again</button>
        </div>
      )}
      <div className="grid">
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>
    </div>
  );
};

export default Memotest;
