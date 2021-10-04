import * as React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const RunewordSelect = ({label, runes, value, change}) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="selector">{label}</InputLabel>
      <Select
        labelId="selector"
        value={value}
        label={label}
        onChange={change}
      >
        <MenuItem value={0}><em>None</em></MenuItem>
        {runes.map(rune => <MenuItem key={rune.id} value={rune.id}>{rune.name}</MenuItem>)}
      </Select>
    </FormControl>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      rune: 0,
      max_rune: 0
    }
  }

  handleRuneChange(event) {
    this.setState({rune: event.target.value})
  }

  handleMaxRuneChange(event) {
    this.setState({max_rune: event.target.value})
  }

  render() {
    let rows = this.props.data.allRunewordsJson.nodes
                   .filter(runeword => runeword.runes.some((rune) => rune === this.state.rune))

    if (this.state.max_rune !== "") {
      rows = rows.filter(row => row.runes.any(rune => rune.id < this.state.max_rune.id))
    }

    return (
      <main>
        <title>D2 Info</title>
        <Grid container>
          <Grid container item spacing={2}>
            <Grid item xs>
              <h1>D2 Info</h1>
            </Grid>
          </Grid>
          <Grid container item spacing={2}>
            <Grid item xs={2}>
              <RunewordSelect label="Rune" runes={this.props.data.allRunesJson.nodes} value={this.state.rune} change={this.handleRuneChange.bind(this)}/>
            </Grid>
            <Grid item xs={2}>
              <RunewordSelect label="Max Rune" runes={this.props.data.allRunesJson.nodes} value={this.state.max_rune} change={this.handleMaxRuneChange.bind(this)}/>
            </Grid>
          </Grid>
          <Grid container item spacing={2}>
            <Grid item xs>
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell align="center">{row.name}</TableCell>
                        <TableCell align="center">{row.version}</TableCell>
                        <TableCell align="center">{row.type}</TableCell>
                        <TableCell align="center">{row.runes.join(' + ')}</TableCell>
                        <TableCell align="center">{row.stats.map((stat) => (<p>{stat}</p>))}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
        <Link to="/about"></Link>
      </main>
    )
  }
}

const IndexPage = () => {
  const data = useStaticQuery(graphql`
    query {
      allRunewordsJson {
        nodes {
          name
          runes
          socket
          stats
          type
          version
        }
      }
      allRunesJson {
        nodes {
          id
          name
        }
      }
    }
  `)

  return (
    <App data={data}/>
  )
}

export default IndexPage