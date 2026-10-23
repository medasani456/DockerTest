# GeoQuiz: geography quiz app

A geography quiz modeled on [quiz.com/geography](https://quiz.com/geography/). It is static HTML, CSS and JS with no build step and no dependencies. The existing Nginx image serves it at `/geography/`.

## Features

| Feature | Details |
|---|---|
| Quiz catalogue | 9 quiz cards: Guess the Flag, World Capitals, Capital → Country, Which Continent?, regional sets (Europe flags, Africa capitals, Asia flags, Americas capitals), and an Ultimate Mix |
| Gameplay | 4 colour/shape answer tiles in the quiz.com/Kahoot style (▲ ◆ ● ■), a 20 s countdown bar, keyboard keys 1–4 |
| Scoring | Up to 1000 pts per correct answer, falling to 500 pts at the buzzer, plus a streak bonus of +100 per streak step (capped at +500) |
| Distractors | Wrong options come from the same continent where possible, so the questions stay hard |
| Results | Score, accuracy, a per-question review, and a best score per quiz (saved in `localStorage`) |
| Data | 159 countries (ISO code, name, capital, continent) in `data.js`. Transcontinental countries are left out of continent questions |
| Flags | PNGs from `flagcdn.com`. If that fails to load, the app falls back to emoji flags so it still works offline |

## Run

```bash
docker build -t geoquiz . && docker run -p 8080:80 geoquiz
# open http://localhost:8080/geography/

# or, without Docker, from the repo root
python3 -m http.server 8080
```

## Files

```
geography/
├── index.html   # screens: home grid → lobby → play → results
├── styles.css   # theme tokens, light/dark, responsive grid
├── data.js      # COUNTRIES, CONTINENTS, QUIZZES catalogue
└── app.js       # question builders, timer, scoring, persistence
```

To add a quiz, add an entry to `QUIZZES` in `data.js`. Set `type` to `flag`, `capital`, `reverse`, `continent` or `mixed`. Use the optional `filter` to limit it to one continent or a list of continents.

## Using REA to study the reference site

[REA](https://github.com/morluto/rea) (Reverse Engineer Anything) is an MCP server and CLI. It can observe a website through a Chrome-family browser using the Chrome DevTools Protocol. This PoC was built in a sandbox that cannot reach quiz.com, so the UX above was rebuilt from how quiz.com plays, not from a capture. To check it against the real site on a machine with internet access:

```bash
npx rea-agents setup                     # register REA with your agent
google-chrome --remote-debugging-port=9222 https://quiz.com/geography/

rea list-browser-targets                 # find the quiz.com tab
rea inspect-web-page                     # DOM, accessibility tree, scripts, network metadata
rea analyze-web-bundle                   # routes, API endpoint candidates, vendor fingerprints
rea observe-web-session                  # record navigation while you play one round
rea capture-web-screenshot               # visual reference for UI comparison
```

See `docs/browser-observation.md` in the REA repo for the flags of each command. Compare the captured question/answer flow and scoring endpoints with `app.js`.
