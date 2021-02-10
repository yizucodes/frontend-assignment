import React, { ChangeEvent, useState } from 'react';
import { Button, Input } from 'antd';
import { useQuery } from '@apollo/react-hooks';
import PokeTable from './PokeTable';
import { PokemonEdge } from '../Types';
import { SEARCH_NAME_QUERY } from '../Queries';
import { useApolloClient } from '@apollo/react-hooks';

function FilterByName() {
  const client = useApolloClient();
  const [searchText, setSearchText] = useState<string>('');
  const [results, setResults] = useState([]);

  const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    const { data } = await client.query({
      query: SEARCH_NAME_QUERY,
      variables: { q: event.target.value },
    });
    setResults(data);
    console.log(results);
  };

  return (
    <>
      <Input placeholder='Search for option' onChange={handleSearch} />
    </>
  );
}

export default FilterByName;
