# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :draw,
  ecto_repos: [Draw.Repo]

# Configures the endpoint
config :draw, Draw.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "nHk2k6pgRpH8UyIW6Wt9hdrTL9qOpFQOYv0y54SnjUxgZzANvAamFK8J2gR5vTWA",
  render_errors: [view: Draw.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Draw.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
