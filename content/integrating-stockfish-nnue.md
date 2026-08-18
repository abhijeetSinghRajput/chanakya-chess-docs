# Integrating Stockfish NNUE into Your Own Engine

This guide shows how to bolt Stockfish's NNUE evaluation onto an existing
chess engine, regardless of your own board representation, move encoding,
or search architecture — as long as you can satisfy one small interface.

The integration has three parts:

1. Copy a fixed set of files from Stockfish, unmodified.
2. Implement `position.h` — a thin adapter over *your* board state.
3. Call `updateNNUE`/`revertNNUE` around your existing `do_move`/`take_move`, only in search.

---

## 1. Files to copy

From a [Chanakya](https://github.com/abhijeetSinghRajput/chanakya/tree/incremental-nnue) source tree, copy these into your project without
modification:

```
nnue/          (entire folder)
incbin/        (entire folder)
memory.cpp
memory.h
misc.cpp
misc.h
types.h

nn-1c0000000000.nnue
nn-37f18f62d772.nnue
```

---

## 2. `position.h` — connect with own state

This is the one file you write yourself. It's the entire bridge between
your board and Stockfish's NNUE code. The NNUE feature transformer and
accumulator logic call a small, fixed set of methods on `Position` —
implement these against your own `board`/`bitboard` state and the rest
of the NNUE machinery works unmodified.

### 2.1 Required piece encoding

Stockfish's `Piece` enum has a specific layout that the NNUE feature
tables are indexed against. Whatever your own piece encoding looks
like, you need a **stable, cheap conversion** in both directions:

```cpp
NO_PIECE     =  0,

WHITE PAWN   =  1, 
WHITE KNIGHT =  2, 
WHITE BISHOP =  3, 
WHITE ROOK   =  4, 
WHITE QUEEN  =  5, 
WHITE KING   =  6,

BLACK PAWN   =  9, 
BLACK KNIGHT = 10, 
BLACK BISHOP = 11, 
BLACK ROOK   = 12, 
BLACK QUEEN  = 13, 
BLACK KING   = 14,

PIECE_NB     = 16
```


### 2.2 The interface

Below is the **empty-body contract** every adopter must fill in. Every
method signature must match exactly — return types, `const`-ness, and
template parameters are all load-bearing, since NNUE code calls these
through templates instantiated at compile time, not through virtual
dispatch.

```cpp
#ifndef POSITION_H_INCLUDED
#define POSITION_H_INCLUDED

namespace Stockfish {

class Position {
public:
    // Whose turn it is.
    Color side_to_move() const { }

    // Piece sitting on a square, or NO_PIECE.
    Piece piece_on(Square s) const { }

    // Board mutation hooks — called only from your doMove/undoMove
    // wrapper (see part 3), never directly by NNUE code, but required
    // so your move-decoding layer can update the board through one
    // consistent path.
    void put_piece(Piece pc, Square s) { }
    void remove_piece(Square s) { }

    // Square of the king of color c. Only ever instantiated with
    // Pt = KING by NNUE code — you can ignore Pt entirely in your
    // implementation and just look up the king.
    template<PieceType Pt>
    Square square(Color c) const;

    // Bitboard queries / occupancy.
    Bitboard pieces() const { }                       // all pieces
    Bitboard pieces(Color c) const { }                // one side
    Bitboard pieces(PieceType pt) const { }           // one piece type, both sides
    Bitboard pieces(Color c, PieceType pt) const { }  // one side, one type

    // Piece counts.
    template<PieceType Pt>
    int count() const { }               // both sides (Pt = ALL_PIECES supported)
    template<PieceType Pt>
    int count(Color c) const { }        // one side

    // Material, in Stockfish centipawn units, excluding pawns and kings.
    int non_pawn_material(Color c) const { }
    int non_pawn_material() const { }

    // Halfmove clock (used for the 50-move eval scaling term).
    int rule50_count() const { }
};

}  // namespace Stockfish

#endif
```

---

## 3. Search integration

Two functions, from `eval_nnue.hpp`:

```cpp
void updateNNUE(int move);   // call after a successful do_move
void revertNNUE();           // call before take_move
```

Use them only inside search, like this:

```cpp
if (doMove(move))
{
    void updateNNUE(
      int  side,              // captured BEFORE doMove flips it
      int  piece,
      int  from,
      int  to,
      int  capture_piece,
      int  promotion_piece,
      bool is_castling,
      bool is_enpassant
    );

    // ... recurse ...

    revertNNUE();
    takeMove();
}
```
> **Note:** The piece encoding used by `updateNNUE()` must follow the
> [Required piece encoding](#21-required-piece-encoding) defined above.

That's it. Don't call `updateNNUE`/`revertNNUE` anywhere else — not in
UCI, not in perft

### 3.1 Reset NNUE for New Positions

`updateNNUE()` and `revertNNUE()` should only be used during search. Whenever a new position is loaded or the board is modified outside the search tree, rebuild the NNUE accumulator using:

```cpp
resetNNUEAccumulator();

// for example:
void newGame()
{
    // Existing new game logic

    resetNNUEAccumulator();
}
```

Also call it after the board is fully constructed in the `UCI position` command:
```cpp
position startpos
position startpos moves ...
position fen ...
```

For positions with moves, apply all moves first, then reset:
```cpp
loadPosition();

for (Move move : moves)
    makeMove(move);

resetNNUEAccumulator();
```

---

## 4. Common mistakes

- Calling `updateNNUE`/`revertNNUE` outside search (UCI, perft, `undo`)
  → accumulator overflow.
- Calling `updateNNUE` without a matching `revertNNUE` on every return
  path → accumulator desyncs from the board.
- Forgetting `resetNNUEAccumulator()` after moves applied outside
  search → stale eval.

## 5. Checklist

- [ ] `updateNNUE`/`revertNNUE` only appear inside search.
- [ ] Every `updateNNUE` has a matching `revertNNUE`.
- [ ] `resetNNUEAccumulator()` runs after every board change outside search.
- [ ] Long `position ... moves ...` replay, then `eval`, matches Stockfish.
- [ ] Perft with `updateNNUE`/`revertNNUE` matches fresh Stockfish eval per leaf.
