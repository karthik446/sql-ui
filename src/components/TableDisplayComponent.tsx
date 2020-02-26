import { Box, Button, Grid, ListItemText, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { Fragment, useEffect, useState } from 'react';

import EditableTable from './EditableTable';

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      position: 'relative',
      overflow: 'auto',
    },
    listSection: {
      backgroundColor: 'inherit',
    },
    ul: {
      backgroundColor: 'inherit',
      padding: 0,
    },
  }),
);


function TableDisplayComponent() {
  const [tables, setTables] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [currentDb, setCurrentDb] = useState('');
  const [nlp, setNlp] = useState('');
  const [sql, setSql] = useState('');
  const [dbname, setDbName] = useState('');
  const [sqlresult, setSqlResult] = useState();
  const [currentTable, setCurrentTable] = useState('');
  const [tableData, setTableData] = useState({ columns: [], data: [] });
  const [value, setValue] = React.useState(0);
  const classes = useStyles();

  const baseUrl = 'http://13.82.61.127:5000';
  const handleChangeTab = (_: any, newValue: any) => {
    setValue(newValue);
  };
  useEffect(() => {
    fetch(
      `${baseUrl}/databases`,
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
  }, []);

  useEffect(() => {
    if (!currentDb) {
      return;
    }
    fetch(
      `${baseUrl}/tables/${currentDb}`,
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
        setTables(dbs)
      })
      .catch(error => console.log(error));
  }, [currentDb]);

  useEffect(() => {
    if (!currentDb || !currentTable) {
      return;
    }
    fetch(
      `${baseUrl}/tableData/${currentDb}?tablename=${currentTable}`,
      {
        method: "GET",
        headers: new Headers({
          Accept: "application/json"
        })
      }
    )
      .then(res => res.json())
      .then(response => {
        setTableData(response);
      })
      .catch(error => console.log(error));
    console.log(currentTable)
  }, [currentTable, currentDb])

  const handleChange = (event: any) => {
    setNlp(event.target.value);

  }

  const confirmSql = async () => {
    //
    try {
      const res = await fetch(`${baseUrl}/sqlresult?sql=${sql}&dbname=${dbname}`, {
        method: "GET",
        headers: new Headers({
          Accept: "application/json"
        }),
        credentials: 'same-origin',
      });
      const response = await res.json();
      console.log(response);
      console.log(response.map((p: any) => p.keys()));
      setSqlResult(response);
    }
    catch (error) {
      return console.log(error);
    }
  }
  const getSql = async () => {
    try {
      const res = await fetch(`${baseUrl}/sql?utterance="${nlp}"`, {
        method: "GET",
        headers: new Headers({
          Accept: "application/json"
        })
      });
      const response = await res.json();
      setSql(response.sql);
      setDbName(response.dbname);
    }
    catch (error) {
      return console.log(error);
    }
  }
  return (
    <div>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChangeTab} aria-label="simple tabs example">
          <Tab label="SQL AI" />
          <Tab label="Table Data" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <div className="grid nlp-container">
          <div className="nlp-input">
            <TextField
              id="standard-basic"
              label="Enter NLP for SQL"
              className="nlp-input-text"
              onChange={handleChange}
              value={nlp}
            />
          </div>
          <div >
            <Button variant="contained" color="primary" onClick={getSql}>
              Get SQL
            </Button>
          </div>

        </div>
        <div className="grid">

          <span>{sql}</span>

          {sql ?
            (<div>
              <Button variant="contained" color="primary" onClick={confirmSql}>
                Execute SQL
            </Button>
            </div>) :
            (<Fragment></Fragment>)}
        </div>

        {sqlresult ?
          (
            <div className="table"><List className={classes.root} subheader={<li />}>
              {sqlresult.map((item: any) => (
                <li key={item} className={classes.listSection}>
                  <ul className={classes.ul}>
                    <ListItem >
                      {item.map((i: string) => (
                        <ListItemText primary={i} className="text-item" />
                      ))}
                    </ListItem>
                  </ul>
                </li>
              ))}
            </List>
            </div>)
          :
          (<Fragment></Fragment>)
        }

      </TabPanel>
      <TabPanel value={value} index={1}>
        <Grid container spacing={1}>
          <Grid container item xs={6} spacing={1}>
            <Autocomplete
              id="database-autocomplete"
              options={databases}
              getOptionLabel={(option: any) => option.title}
              onChange={(_: any, newValue: any) => newValue ? setCurrentDb(newValue.title) : void 0}
              style={{ width: 300 }}
              renderInput={params => (
                <TextField {...params} label="Databases" variant="outlined" fullWidth />
              )}
            />
          </Grid>
          <Grid container item xs={6} spacing={1}>
            <Autocomplete
              id="table-autocomplete"
              options={tables}
              getOptionLabel={(option: any) => option.title}
              onChange={(_: any, newValue: any) => newValue ? setCurrentTable(newValue.title) : void 0}
              style={{ width: 300 }}
              renderInput={params => (
                <TextField {...params} label="Tables" variant="outlined" fullWidth />
              )}
            />
          </Grid>
        </Grid>

        <div className="db-table">
          <EditableTable
            columns={tableData.columns.map(p => ({ title: p, field: p }))}
            data={tableData.data}
            tableName={currentTable}
            dbName={currentDb}
          />
        </div>
      </TabPanel>
    </div>
  );
}


export default TableDisplayComponent
