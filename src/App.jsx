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

    // Keep pulling cards until we have 5 that pass the pull rate check
    while (pulledCards.length < 5) {
      const randomNumbers = generateRandomNumbers(5, 1, 151); // Generate 5 random numbers between 1 and 151
      const randomCards = await fetchRandomCards(randomNumbers); // Fetch 5 random cards based on these numbers

      for (let card of randomCards) {
        const rarity = getRarity(pullRates); // Get a rarity based on rates
        if (mapRarity(card.rarity) === rarity) {
          pulledCards.push(card); // Keep card if rarity matches
          if (pulledCards.length === 5) break; // Stop once we have 5 cards
        }
      }
    }

    setCards((prevCards) => [...prevCards, ...pulledCards]);
  };

  // Helper function to generate random numbers within a range
  const generateRandomNumbers = (count, min, max) => {
    const numbers = [];
    while (numbers.length < count) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    return numbers;
  };

  // Helper function to determine the rarity of each pull
  const getRarity = (rates) => {
    const rand = Math.random();
    if (rand <= rates.ultraRare) return "UltraRare";
    if (rand <= rates.rare + rates.ultraRare) return "Rare";
    if (rand <= rates.uncommon + rates.rare + rates.ultraRare)
      return "Uncommon";
    return "Common";
  };

  // Map detailed rarities to broader categories for pull rates
  const mapRarity = (rarity) => {
    const rarityMap = {
      "Amazing Rare": "UltraRare",
      Common: "Common",
      Uncommon: "Uncommon",
      Rare: "Rare",
      "Rare Holo": "Rare",
      "Rare Holo EX": "UltraRare",
      "Rare Holo GX": "UltraRare",
      "Rare Holo LV.X": "UltraRare",
      "Rare Holo Star": "UltraRare",
      "Rare Holo V": "UltraRare",
      "Rare Holo VMAX": "UltraRare",
      "Rare Prime": "UltraRare",
      "Rare Prism Star": "UltraRare",
      "Rare Rainbow": "UltraRare",
      "Rare Secret": "UltraRare",
      "Rare Shining": "UltraRare",
      "Rare Shiny": "UltraRare",
      "Rare Shiny GX": "UltraRare",
      "Rare Ultra": "UltraRare",
      LEGEND: "UltraRare",
      Promo: "Rare",
      "Rare ACE": "UltraRare",
      "Rare BREAK": "UltraRare",
    };

    return rarityMap[rarity] || "Common"; // Default to Common if not mapped
  };

  // Fetch Pokémon based on their national dex numbers
  const fetchRandomCards = async (numbers) => {
    const promises = numbers.map(async (num) => {
      const response = await axios.get(`https://api.pokemontcg.io/v2/cards`, {
        params: {
          q: `supertype:Pokémon nationalPokedexNumbers:${num}`, // Fetch Pokémon with the given national dex number
        },
      });
      return response.data.data[0]; // Assuming the first card returned is the one we need
    });

    return Promise.all(promises); // Return all the fetched cards
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
