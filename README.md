# marcguinea.com

## Development

Run `bundle exec jekyll serve` and go to `http://localhost:4000` 

If you need to use another port, add `--port=XXXX`

Running `bundle update` will rebuild your snapshot from scratch, using only
the gems in your Gemfile

## Deployment

Just push to master branch.

If you want to refresh site, run `git commit -m 'rebuild pages' --allow-empty && git push`