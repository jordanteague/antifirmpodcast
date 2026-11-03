# Transcripts

One JSON file per episode, named in that episode's `transcript` field in `data/episode-meta.json`
(for example `"transcript": "ep001"` reads `ep001.json`). Each entry is one speaker turn:

```json
[{ "start": 32.46, "speaker": "Jordan Teague", "text": "George, what's the thing that bothers you most about the legal profession?" }]
```

`start` is seconds from the start of the published episode, so the timestamps on the page jump the player
to the right spot. The cleaned transcript, `.srt` and `.vtt` for each episode live in the show's library,
in the episode's `final/` folder.
