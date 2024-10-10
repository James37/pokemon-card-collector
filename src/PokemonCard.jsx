const PokemonCard = (props) => {
  const { src } = props;
  return (
    <div className="poke-card">
      <img
        src={src}
        alt={`Pokemon Card`}
        loading="lazy"
        className="mw-100 mh-100 object-fit-scale h-100 w-100"
      />
    </div>
  );
};

export default PokemonCard;
