import { useState, useEffect } from 'react';
import { Select, MenuItem, Button, Container, Typography, Grid, Box, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import axios from 'axios';

interface Puzzle {
  puzzle: number[][];
}

export default function SudokuPage() {
  const [inputPuzzle, setInputPuzzle] = useState<Puzzle>({
    puzzle: Array(9).fill(Array(9).fill(0)),
  });
  const [solvedPuzzle, setSolvedPuzzle] = useState<Puzzle | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    console.log('Current Puzzle:', inputPuzzle);
  }, [inputPuzzle]);

  const handleChange = (value: number, row: number, col: number) => {
    const newInputPuzzle = {
      puzzle: inputPuzzle.puzzle.map((r, rowIndex) =>
        rowIndex === row ? r.map((c, colIndex) => (colIndex === col ? value : c)) : r
      ),
    };
    setInputPuzzle(newInputPuzzle);
  };

  const solvePuzzle = async () => {
    try {
      const response = await axios.post<{ solved_puzzle: Puzzle }>(
        'https://sudoku-go-api.magicbox.monster/solve',
        {
          puzzle: inputPuzzle.puzzle,
        }
      );
      setSolvedPuzzle(response.data.solved_puzzle);
    } catch (error: any) {
      console.error('Error solving Sudoku:', error);
      setErrorMessage(error.message || 'An unknown error occurred.');
      setErrorDialogOpen(true);
    }
  };

  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h1" align="center" gutterBottom>
        Sudoku Solver
      </Typography>
      <Grid container spacing={2}>
        {inputPuzzle.puzzle.map((row, rowIndex) => (
          <Grid container item xs={12} key={rowIndex}>
            {row.map((cell, colIndex) => (
              <Grid item xs={1} key={colIndex}>
                <Select
                  value={cell}
                  onChange={(e) => handleChange(Number(e.target.value), rowIndex, colIndex)}
                >
                  <MenuItem value={0}>0</MenuItem>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={6}>6</MenuItem>
                  <MenuItem value={7}>7</MenuItem>
                  <MenuItem value={8}>8</MenuItem>
                  <MenuItem value={9}>9</MenuItem>
                </Select>
              </Grid>
            ))}
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={solvePuzzle}>
            Solve
          </Button>
        </Grid>
      </Grid>
      {solvedPuzzle && solvedPuzzle.puzzle && (
        <Box>
          <Typography variant="h2" align="center" gutterBottom>
            Solved Puzzle
          </Typography>
          <Grid container spacing={2}>
            {solvedPuzzle.puzzle.map((row, rowIndex) => (
              <Grid container item xs={12} key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <Grid item xs={1} key={colIndex}>
                    <Typography variant="body1" align="center">
                      {cell}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      <Dialog open={errorDialogOpen} onClose={handleCloseErrorDialog}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
