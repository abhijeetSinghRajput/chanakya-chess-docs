# Integrating Stockfish NNUE into Your Own Engine

This guide shows how to bolt Stockfish's NNUE evaluation onto an existing
chess engine — regardless of your own board representation, move encoding,
or search architecture — as long as you satisfy one small adapter interface.

By the end you will have:

1. Copied a fixed set of files from Stockfish, unmodified.
2. Written `position.h` — a thin adapter over *your* board state.
3. Initialized NNUE once at startup.
4. Wired `updateNNUE` / `revertNNUE` into your search loop, and switched
   your search to call the NNUE evaluation instead of your old static eval.
5. Made sure the accumulator gets reset whenever the board changes
   *outside* search (new game, `position` command, etc.).

Each step below builds on the last — follow them in order the first time
through.

---

## Step 1 — Copy the required files

From the [Chanakya](https://github.com/abhijeetSinghRajput/chanakya/tree/incremental-nnue)
source tree, copy these into your project **without modification**:

```
nnue/                    (entire folder)
incbin/                  (entire folder)
eval/
├── eval_nnue.cpp
└── eval_nnue.hpp
memory.cpp
memory.h
misc.cpp
misc.h
types.h
```

### Where the `.nnue` weight files go

```
nn-1c0000000000.nnue
nn-37f18f62d772.nnue
```

These are the actual network weights, and they're embedded straight into
your binary at compile time via the `incbin/` folder you just copied —
you don't load them from disk at runtime. Place both files in your
**project root**, next to your build system's entry point (the same
level as your `src/` folder), so the `incbin` macros in `nnue/` can find
them by relative path during compilation. If your build fails to locate
them, check the `INCBIN(...)` paths inside the `nnue/` source for the
exact relative path they expect, and move the files to match — don't
edit the macros themselves.

Your project layout should now look like this:

```
your-engine/
├── nn-1c0000000000.nnue
├── nn-37f18f62d772.nnue
├── nnue/
├── incbin/
├── src/
│   ├── eval/
│   │   ├── eval_nnue.cpp
│   │   ├── eval_nnue.hpp
│   │   └── ... (your existing eval)
│   ├── memory.cpp
│   ├── memory.h
│   ├── misc.cpp
│   ├── misc.h
│   ├── types.h
│   └── position.h        ← you'll create this in Step 2
└── ...
```

---

## Step 2 — Write your `position.h` adapter

Stockfish's NNUE code doesn't know anything about your board — it only
talks to a `Stockfish::Position` object. Since you're not using
Stockfish's actual board, you write a thin wrapper class that answers
Stockfish's questions ("what piece is on this square?", "whose turn is
it?") using *your* board's data underneath. Create `position.h` next to
the files you copied in Step 1.

### 2.1 Required piece encoding

Stockfish's NNUE expects pieces encoded exactly like this — if your
engine uses a different numbering, you'll convert between the two at
the boundary (you'll see this conversion already happening later, via
a `toSFPiece()`-style helper):

| Piece | Value |
|---|---|
| `NO_PIECE` | 0 |
| White Pawn | 1 |
| White Knight | 2 |
| White Bishop | 3 |
| White Rook | 4 |
| White Queen | 5 |
| White King | 6 |
| *(6 is the highest White value — Black starts at 9, not 7)* | |
| Black Pawn | 9 |
| Black Knight | 10 |
| Black Bishop | 11 |
| Black Rook | 12 |
| Black Queen | 13 |
| Black King | 14 |
| `PIECE_NB` | 16 |

### 2.2 The `Position` interface

Paste this skeleton into `position.h`, then fill in every method body
using your own board's fields and functions — e.g. `piece_on()` should
just index into whatever array your engine already uses to look up a
square's occupant, `side_to_move()` should return your board's current
side variable converted to Stockfish's `Color`, and so on.

```cpp
#ifndef POSITION_H_INCLUDED
#define POSITION_H_INCLUDED

namespace Stockfish {

class Position {
public:
    Color side_to_move() const { }

    Piece piece_on(Square s) const { }

    void put_piece(Piece pc, Square s) { }
    void remove_piece(Square s) { }

    template<PieceType Pt>
    Square square(Color c) const;

    Bitboard pieces() const { }
    Bitboard pieces(Color c) const { }
    Bitboard pieces(PieceType pt) const { }
    Bitboard pieces(Color c, PieceType pt) const { }

    template<PieceType Pt>
    int count() const { }

    template<PieceType Pt>
    int count(Color c) const { }

    int non_pawn_material(Color c) const { }
    int non_pawn_material() const { }

    int rule50_count() const { }
};

} // namespace Stockfish

#endif
```

You don't have to write every method from scratch — use Chanakya's own
`position.h` as a worked reference for what each method's body should
look like against a real, non-Stockfish board:
[Chanakya's `position.h`](https://github.com/abhijeetSinghRajput/chanakya/blob/incremental-nnue/src/position.h).

---

## Step 3 — Initialize NNUE once at startup

Before any evaluation call can succeed, the networks need to be loaded
into memory and the accumulator caches allocated. Call `initNNUE()`
**once**, near the top of `main()`, before your UCI loop starts
accepting commands:

```cpp
#include "eval/eval_nnue.hpp"

int main()
{
    initNNUE();          // load networks + allocate accumulator caches
    // ... your existing startup: opening book, transposition table, etc.

    uciLoop();            // or whatever your engine's main loop is called
    return 0;
}
```

If you skip this step, every NNUE evaluation call will read from
uninitialized network weights — don't put it behind a lazy
first-use check; call it unconditionally at startup.

---

## Step 4 — Wire NNUE into search

This step has two parts: maintaining the accumulator as you search
(push/pop), and actually switching your evaluation calls to use it.

### 4.1 Maintain the accumulator around every move made *in search*

Two functions are exposed from `eval_nnue.hpp`:

```cpp
void updateNNUE(
    int  side,              // side to move BEFORE makeMove() flips it
    int  piece,
    int  from,
    int  to,
    int  capture_piece,
    int  promotion_piece,
    bool is_castling,
    bool is_enpassant
);

void revertNNUE();
```

Call `updateNNUE()` immediately after a successful `makeMove()`, and
`revertNNUE()` immediately before the matching `takeMove()` — every
push needs exactly one matching pop, on every return path:

```cpp
int sideBefore = board->side;
if (makeMove(move) == false) continue;

updateNNUE(
    sideBefore,
    toSFPiece(move::getPiece(move)),
    move::getFrom(move),
    move::getTo(move),
    toSFPiece(move::getCapturedPiece(move)),
    toSFPiece(move::getPromotionPiece(move)),
    move::isCastle(move),
    move::isEnPassant(move)
);

// ... recurse into alphaBeta() / quiescence() ...

revertNNUE();
takeMove();
```

> **Only call `updateNNUE`/`revertNNUE` inside search** (`alphaBeta`,
> `quiescence`). Never call them from UCI command handling, `perft`,
> or anywhere outside the search tree — see Common Mistakes below for
> why.

### 4.2 Actually use the NNUE evaluation

Wiring the accumulator alone doesn't change your search's behavior —
your search still needs to *call* the NNUE eval instead of your old
static evaluation. Find every call site in `alphaBeta()` and
`quiescence()` that currently calls your old evaluation function, and
replace it with `evalPositionNNUE()`:

```cpp
// before:
int staticEval = evalPosition();

// after:
int staticEval = evalPositionNNUE();
```

This typically shows up in three places per search function: the
leaf/max-depth cutoff, reverse futility pruning's static eval, and the
standing-pat score in quiescence. Grep your `search.cpp` for every call
to your old eval function and swap each one — leaving even one call
site on the old evaluator means part of your search is still being
guided by different numbers than the rest, which will show up as
inconsistent move choices that are hard to trace back to this cause.

---

## Step 5 — Reset the accumulator outside search

`updateNNUE()`/`revertNNUE()` are only valid *during* search, where
every push is matched by a pop in strict LIFO order. Any time the board
is set up or changed **outside** that search tree — a new game, a UCI
`position` command, loading a FEN — the accumulator has no matching
history to unwind, so you must rebuild it from scratch instead:

```cpp
void resetNNUEAccumulator();
```

Call it:

- In your `newGame()` handler:
  ```cpp
  void newGame()
  {
      // ... your existing new-game logic ...
      resetNNUEAccumulator();
  }
  ```

- After fully constructing the board from a UCI `position` command —
  apply all moves first, *then* reset once at the end, not once per move:
  ```cpp
  // position startpos moves e2e4 e7e5 g1f3 ...
  loadPosition();

  for (Move move : moves)
      makeMove(move);

  resetNNUEAccumulator();   // one reset, after all moves are applied
  ```

This also covers `position startpos` and `position fen ...` with no
trailing moves — the loop above simply has zero iterations, and you
still reset once at the end.

---

## Common mistakes

- **Calling `updateNNUE`/`revertNNUE` outside search** (UCI handling,
  `perft`, manual `undo`) → the accumulator's internal stack grows
  without the matching pops it expects, eventually overflowing or
  reading stale entries.
- **A `return` between `updateNNUE()` and `revertNNUE()`** on some
  code path → one push never gets its matching pop, and the
  accumulator silently desyncs from the real board for the rest of
  the search.
- **Forgetting `resetNNUEAccumulator()`** after applying moves outside
  search → the accumulator keeps evaluating a stale, earlier position
  no matter what the board actually looks like now.
- **Leaving some eval call sites on the old evaluator** after wiring
  in `evalPositionNNUE()` → search becomes inconsistent, using two
  different evaluators in different parts of the same tree.
- **En passant / castling captures need special handling** in how you
  populate `capture_piece` for `updateNNUE` — an en passant capture's
  target square is never where the captured pawn actually stands, so
  don't rely on a naive "piece on the destination square" lookup for
  that field.

---

## Checklist

- [ ] `.nnue` weight files sit where your `incbin` macros expect them.
- [ ] `initNNUE()` is called once, near the top of `main()`, before
      any evaluation can be requested.
- [ ] `position.h` is fully implemented against your own board.
- [ ] `updateNNUE`/`revertNNUE` only appear inside search.
- [ ] Every `updateNNUE` call has a matching `revertNNUE` on every
      return path.
- [ ] Every old static-eval call site in `alphaBeta()` and
      `quiescence()` has been switched to `evalPositionNNUE()`.
- [ ] `resetNNUEAccumulator()` runs after every board change made
      outside search.
- [ ] A long `position ... moves ...` replay followed by `eval`
      matches Stockfish's own evaluation of the same position.
- [ ] A `perft` run comparing your engine's per-leaf eval against a
      fresh Stockfish evaluation of the same FEN matches, with zero
      mismatches, at reasonable depth.
