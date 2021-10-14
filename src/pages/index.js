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
    <FormControl sx={{ minWidth: 150 }}>
      <InputLabel id="selector">{label}</InputLabel>
      <Select
        labelId="selector"
        value={value}
        label={label}
        onChange={change}
        autoWidth
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 300
            }
          }
        }}
      >
        <MenuItem value={0}><em>None</em></MenuItem>
        {runes.map(rune => <MenuItem key={rune.id} value={rune.id}>{"#" + rune.id + " " + rune.name}</MenuItem>)}
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
    let rows = []

    if (this.state.rune > 0) {
      let cur_rune = this.props.data.allRunesJson.nodes.find(rune => rune.id === this.state.rune)

      if (cur_rune) {
        rows = this.props.data.allRunewordsJson.nodes.filter(runeword => runeword.runes.some(rune => rune === cur_rune.name))
      }
    } else {
      rows = this.props.data.allRunewordsJson.nodes
    }

    if (this.state.max_rune > 0) {
      rows = rows.filter(row => row.runes.every(name => {
        let data = this.props.data.allRunesJson.nodes.find(rune => rune.name === name)
        return data && data.id <= this.state.max_rune
      }))
    }

    rows.sort((a, b) => {
      if (a.version < b.version) return -1
      else if (a.version > b.version) return 1
      else {
        let a_name = a.name.toUpperCase()
        let b_name = b.name.toUpperCase()

        if (a_name < b_name) return -1
        else if (a_name > b_name) return 1
        else return 0
      }
    })

    rows.forEach(row => {
      if (row.type == null) {
        row.type = []
      }
    })

    return (
      <main>
        <title>D2 Info</title>
        <Grid container spacing={2} columnSpacing={2}>
          <Grid container item>
            <Grid item xs>
              <h1>D2 Info</h1>
            </Grid>
          </Grid>
          <Grid container item spacing={2}>
            <Grid item>
              <RunewordSelect label="Rune" runes={this.props.data.allRunesJson.nodes} value={this.state.rune} change={this.handleRuneChange.bind(this)}/>
            </Grid>
            <Grid item>
              <RunewordSelect label="Max Rune" runes={this.props.data.allRunesJson.nodes} value={this.state.max_rune} change={this.handleMaxRuneChange.bind(this)}/>
            </Grid>
          </Grid>
          <Grid container item>
            <TableContainer component={Paper} sx={{ maxWidth: 1200 }}>
              <Table sx={{ minWidth: 1000 }}>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">{row.version}</TableCell>
                      <TableCell align="center">{row.type.map(type => (<p>{type}</p>))}</TableCell>
                      <TableCell align="center">{row.runes.map(rune => (<p>{rune}</p>))}</TableCell>
                      <TableCell align="center">{row.stats.map(stat => (<p>{stat}</p>))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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

  data.allRunesJson.nodes.forEach(rune => {
    let id = parseInt(rune.id)
    rune.id = isNaN(id) ? -1 : id
  })

  return (
    <App data={data}/>
  )
}

export default IndexPage
