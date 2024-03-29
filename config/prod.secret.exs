use Mix.Config

# In this file, we keep production configuration that
# you likely want to automate and keep it away from
# your version control system.
#
# You should document the content of this
# file or create a script for recreating it, since it's
# kept out of version control and might be hard to recover
# or recreate for your teammates (or you later on).
config :draw, Draw.Endpoint,
  secret_key_base: "I0xlmE5t1xkMPS67nwIq/hT15HrMNetEbAdThjQ0uQWvDi/zb9La8ixHnBhIW0Lt"

# Configure your database
config :draw, Draw.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "draw_prod",
  pool_size: 20
