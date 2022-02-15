import './App.css';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import PokemonCard from './PokemonCard';

const App = () => {

  const [allPokemons, setAllPokemons] = useState([]);
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonChoosen, setPokemonChoosen] = useState(false);
  const [pokemonInfo, setPokemonInfo] = useState({
    name: "",
    species: "",
    img: "",
    hp: "",
    atttack: "",
    defense: "",
    type: "",
  });

  const getAllPokemons = async () => {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
    const data = await res.json();
    console.log(data);

    const createPokemonObject = (results) => {
      results.forEach(async pokemon => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
        // console.log(res);
        const data = await res.json();
        setAllPokemons(currentList => [...currentList, data]);
      })
    }
    createPokemonObject(data.results);
  }

  useEffect(() => {
    getAllPokemons();
  }, [])


  const serchPokemon = () => {
    Axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`).then(
      (response) => {
        // console.log(response);
        setPokemonInfo({
          name: pokemonName,
          species: response.data.species.name,
          img: response.data.sprites.other.dream_world.front_default,
          hp: response.data.stats[0].base_stat,
          atttack: response.data.stats[1].base_stat,
          defense: response.data.stats[2].base_stat,
          type: response.data.types[0].type.name,
        });
        setPokemonChoosen(true);
      });
  }

  return (
    <div className="App">
      <div className="titleSection">
        <h1 style={{ fontSize: "45px" }}>Pokemon Status</h1>
        <input
          type="text"
          onChange={(event) => {
            setPokemonName(event.target.value)
          }}
        />
        <button onClick={serchPokemon}> Search Pokemon </button>
      </div>

      <div className="displayPokemon">
        {!pokemonChoosen ? (
          <>
            <div className="pokemon-container">
              <div className="all-container">
                {allPokemons.map((pokemonStats, index) =>
                  <PokemonCard
                    key={index}
                    id={pokemonStats.id}
                    image={pokemonStats.sprites.other.dream_world.front_default}
                    name={pokemonStats.name}
                    type={pokemonStats.types[0].type.name}
                  />)}

              </div>
              <button className="load-more" onClick={() => getAllPokemons()}>Load more</button>
            </div>
          </>
        ) : (
          <>
            <div className="container">
              <div className="card">
                <div className="face face1">
                  <div className="content">
                    <div className="icon">
                      <img src={pokemonInfo.img} alt="img" />
                    </div>
                  </div>
                </div>
                <div className="face face2">
                  <div className="content">
                    <h2 className='info'> Name: {pokemonInfo.name} </h2>
                    <p className='info'> Species: {pokemonInfo.species} </p>
                    <p className='info'> High Power: {pokemonInfo.hp} </p>
                    <p className='info'> Attack: {pokemonInfo.atttack} </p>
                    <p className='info'> Defence: {pokemonInfo.defense} </p>
                  </div>
                </div>
              </div>
            </div>

          </>
        )}
      </div>
    </div>
  );
}

export default App;