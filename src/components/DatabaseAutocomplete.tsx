import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect, useReducer, useState } from 'react';

import { SET_CURRENT_DB } from '../actions/databaseActions';
import databaseReducer from '../reducers/databaseReducer';


function DatabaseAutocomplete() {
  const [databases, setDatabases] = useState([]);
  const [currentDb, setCurrentDb] = useState('');
  const [state, dispatch] = useReducer(databaseReducer, { currentDb: '', currentTable: '' })
  useEffect(() => {
    fetch(
      `http://localhost:5000/databases`,
      {
        method: "GET",
        headers: new Headers({
          Accept: "application/json"
        })
      }
    )
      .then(res => res.json())
      .then(response => {
        const dbs = response.map((p: string) => ({ title: p }))
        setDatabases(dbs)
      })
      .catch(error => console.log(error));
  }, [state]);

  return (
    <Autocomplete
      id="combo-box-demo"
      options={databases}
      getOptionLabel={(option: any) => option.title}
      onChange={(_: any, newValue: any) => {
        setCurrentDb(newValue.title);
        dispatch({ type: SET_CURRENT_DB, payload: newValue.title });
      }}
      style={{ width: 300 }}
      renderInput={params => (
        <TextField {...params} label="Databases" variant="outlined" fullWidth />
      )}
    />
  );
}



export default DatabaseAutocomplete