import { useState } from "react";
// import axios from "axios";
import { Button, Container, Row, Col, Carousel } from "react-bootstrap";
import "./App.css";
import PokemonCard from "./PokemonCard";
import pokemonList from "./pokemon.json"

const App = () => {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allCards, setAllCards] = useState([]);

  const pullRates = {
    common: 0.74,
    uncommon: 0.2,
    rare: 0.05,
    ultraRare: 0.01,
  };

  // Function to pull cards based on rarity distribution
  const pullCards = async () => {
    // Fetch all relevant Gen 1 cards in one go
    let allGen1Cards = allCards;
    if (!allGen1Cards.length) {
      // allGen1Cards = await fetchAllGen1Cards();
      allGen1Cards = pokemonList;
      setAllCards(allGen1Cards)
      console.log(allGen1Cards)
    }
    let pulledCards = [];

    // Determine how many of each rarity to pull
    const rarityDistribution = getRarityDistribution(5, pullRates);
    // Try to find the cards that match the rarity
    for (let rarity in rarityDistribution) {
      let rarityCount = rarityDistribution[rarity];
      const matchingCards = allGen1Cards.filter(
        (card) => mapRarity(card.rarity) === rarity
      );

      // If not enough cards for that rarity, fallback to another rarity
      while (rarityCount > 0 && matchingCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * matchingCards.length);
        pulledCards.push(matchingCards.splice(randomIndex, 1)[0]);
        rarityCount--;
      }
    }

    // If we have less than 5 cards, refetch or handle fallback
    if (pulledCards.length < 5) {
      // Handle fallback logic here (e.g., refetch or fill with lower rarity cards)
    }

    setCards(pulledCards);
    setCurrentIndex(0);
  };

  // Get rarity based on pull rates
  const getRarity = (rates) => {
    const rand = Math.random();
    if (rand <= rates.ultraRare) return "ultraRare";
    if (rand <= rates.rare + rates.ultraRare) return "rare";
    if (rand <= rates.uncommon + rates.rare + rates.ultraRare)
      return "uncommon";
    return "common";
  };

  // Map API rarities to the internal rarity categories
  const mapRarity = (rarity) => {
    const rarityMap = {
      "Amazing Rare": "ultraRare",
      Common: "common",
      Uncommon: "uncommon",
      Rare: "rare",
      "Rare Holo": "rare",
      "Rare Holo EX": "ultraRare",
      "Rare Holo GX": "ultraRare",
      "Rare Holo LV.X": "ultraRare",
      "Rare Holo Star": "ultraRare",
      "Rare Holo V": "ultraRare",
      "Rare Holo VMAX": "ultraRare",
      "Rare Prime": "ultraRare",
      "Rare Prism Star": "ultraRare",
      "Rare Rainbow": "ultraRare",
      "Rare Secret": "ultraRare",
      "Rare Shining": "ultraRare",
      "Rare Shiny": "ultraRare",
      "Rare Shiny GX": "ultraRare",
      "Rare Ultra": "ultraRare",
      LEGEND: "ultraRare",
      Promo: "rare",
      "Rare ACE": "ultraRare",
      "Rare BREAK": "ultraRare",
    };

    return rarityMap[rarity] || "common";
  };

  // Fetch all Pokémon cards for Gen 1 and filter duplicates
  // const fetchAllGen1Cards = async () => {
  //   const response = await axios.get(`https://api.pokemontcg.io/v2/cards`, {
  //     headers: {
  //       "X-Api-Key": "d565b5ad-e036-49a1-a815-bc143e29dcd5",
  //     },
  //     params: {
  //       q: "nationalPokedexNumbers:[1 TO 151] (set.id:base1 OR set.id:base2 OR set.id:base3 OR set.id:base4)",
  //     },
  //   });

  //   setAllCards(response.data.data);
  //   return response.data.data;

  //   // List of Gen 1 set IDs
  //   // const gen1SetIds = [
  //   //   "base1", // Base Set
  //   //   "base2", // Jungle
  //   //   "base3", // Fossil
  //   //   "base5", // Team Rocket
  //   //   "base4", // Base Set 2
  //   //   "gym1", // Gym Heroes
  //   //   "gym2", // Gym Challenge
  //   // ];

  //   // Filter cards from Gen 1 sets
  //   // const filteredCards = response.data.data.filter(
  //   //   (card) => card.set && gen1SetIds.includes(card.set.id)
  //   // );

  //   // // Remove duplicate cards based on nationalPokedexNumbers
  //   // const uniqueCards = [];
  //   // const seen = new Set();
  //   // for (const card of filteredCards) {
  //   //   const dexNumber = card.nationalPokedexNumbers?.[0];
  //   //   if (!seen.has(dexNumber)) {
  //   //     uniqueCards.push(card);
  //   //     seen.add(dexNumber);
  //   //   }
  //   // }

  //   // return uniqueCards;
  // };

  // Get rarity distribution based on pull rates
  const getRarityDistribution = (totalCards, pullRates) => {
    const distribution = { common: 0, uncommon: 0, rare: 0, ultraRare: 0 };
    for (let i = 0; i < totalCards; i++) {
      const rarity = getRarity(pullRates);
      distribution[rarity]++;
    }
    return distribution;
  };

  return (
    <Container fluid className="d-flex flex-column wrapper">
      <Row className="justify-content-center">
        <Col xs="auto">
          <Button size="sm" variant="primary" onClick={pullCards}>
            Pull 5 Cards
          </Button>
        </Col>
      </Row>
      <Row className="flex-grow-1 text-center overflow-hidden mw-100v">
        <Col className="background h-100 py-2">
          {cards.length > 0 && (
            <Carousel
              activeIndex={currentIndex}
              onSelect={setCurrentIndex}
              className="h-100"
            >
              {cards.map((card) => (
                <Carousel.Item key={card.id}>
                  {card && <PokemonCard src={card?.images?.large} />}
                </Carousel.Item>
              ))}
            </Carousel>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default App;
