import { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [cards, setCards] = useState([]);

  // Function to simulate pulling cards based on rarity
  const pullCards = async () => {
    const pullRates = {
      common: 0.74,
      uncommon: 0.2,
      rare: 0.05,
      ultraRare: 0.01,
    };

    let pulledCards = [];
    for (let i = 0; i < 5; i++) {
      const rarity = getRarity(pullRates);
      const card = await getRandomCard(rarity);
      pulledCards.push(card);
    }

    setCards((prevCards) => [...prevCards, ...pulledCards]);
  };

  // Helper function to determine the rarity of each pull
  const getRarity = (rates) => {
    const rand = Math.random();
    if (rand <= rates.ultraRare) return "Rare Holo";
    if (rand <= rates.rare + rates.ultraRare) return "Rare";
    if (rand <= rates.uncommon + rates.rare + rates.ultraRare)
      return "Uncommon";
    return "Common";
  };

  // Fetch a random card from the API, filtered by rarity
  const getRandomCard = async (rarity) => {
    const response = await axios.get(`https://api.pokemontcg.io/v2/cards`, {
      params: {
        q: `rarity:${rarity} set.id:base1`, // Filter for original 151 Pokémon
      },
    });
    const cards = response.data.data;
    return cards[Math.floor(Math.random() * cards.length)];
  };

  return (
    <div className="app-container">
      <h1>Pokémon Card Puller</h1>
      <button onClick={pullCards}>Pull 5 Cards</button>
      <div className="scroll-container">
        {cards.map((card) => (
          <div key={card.id} className="card">
            <img src={card.images.small} alt={card.name} />
            <p>{card.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
