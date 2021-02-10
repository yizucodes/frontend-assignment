import React, { useState, ChangeEvent } from 'react';
import { Button, Select, Input } from 'antd';
import { useQuery } from '@apollo/react-hooks';
import PokeTable from './PokeTable';
import { pokeTypes } from '../constants';
import { PokemonEdge } from '../Types';
import { gql } from 'apollo-boost';

const { Option } = Select;

interface FilterPokeProps {
  filterType: string;
}

function FilterPoke({ filterType }: FilterPokeProps) {
  const [selType, setSelType] = useState<string>('Normal');
  const [searchText, setSearchText] = useState<string>('');

  const FILTER_QUERY = () => {
    let query = filterType === 'byType' ? `"${selType}"` : `"${searchText}"`;
    // let query = `"${selType}"`;
    console.log('query', query);

    const queryParams =
      filterType === 'byName'
        ? `pokemons(q:${query})`
        : `pokemonsByType(type:${query})`;

    // const queryParams = `pokemonsByType(type:${query})`;

    console.log('queryParams', queryParams);

    return gql`{
      ${queryParams}{ 
  
      edges{
        node{
          name
          types
          id
          classification
        }
      }
      pageInfo{
        hasNextPage
        endCursor
      }
    }}
    `;
  };
  console.log('filterType', filterType);
  const { loading, error, data, fetchMore } = useQuery(FILTER_QUERY());

  // Using a variable to conditionally render Show More button because with state I get error:
  // Too many re-renders. React limits the number of renders to prevent an infinite loop.”
  let isMore: boolean = false;

  let pokemon;
  let pokemonData: any;

  if (loading === false) {
    pokemonData = filterType === 'byType' ? data.pokemonsByType : data.pokemons;
    console.log('pokemonData', pokemonData);

    if (pokemonData.pageInfo.hasNextPage) {
      isMore = true;
    }

    pokemon = pokemonData.edges.map((edge: PokemonEdge) => {
      return {
        key: edge.node.id,
        name: edge.node.name,
        types: edge.node.types,
        classification: edge.node.classification,
      };
    });
  }

  function handleTypeSelect(selectedValue: string) {
    setSelType(selectedValue);
  }

  const handleLoadMore = () => {
    const { endCursor } = pokemonData.pageInfo;
    console.log(endCursor);

    fetchMore({
      variables: { after: endCursor },
      updateQuery: (prevResult: any, { fetchMoreResult }) => {
        fetchMoreResult.pokemonsByType.edges = [
          ...prevResult.pokemonsByType.edges,
          ...fetchMoreResult.pokemonsByType.edges,
        ];
        return fetchMoreResult;
      },
    });
  };

  return (
    <>
      {filterType === 'byType' && (
        <>
          <Select
            defaultValue='Normal'
            style={{ width: 120 }}
            onChange={handleTypeSelect}
          >
            {pokeTypes.map((pokeType) => (
              <Option key={pokeType} value={pokeType}>
                {pokeType}
              </Option>
            ))}
          </Select>
        </>
      )}
      {filterType === 'byName' && (
        <Input
          type='text'
          placeholder='Search Pokémon by name...'
          style={{ width: 200 }}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setSearchText(event.target.value)
          }
        />
      )}
      <div className='PokeTable'>
        <PokeTable pokemons={pokemon} error={error} loading={loading} />
      </div>
      {isMore && <Button onClick={handleLoadMore}>Show More</Button>}
    </>
  );
}

export default FilterPoke;
