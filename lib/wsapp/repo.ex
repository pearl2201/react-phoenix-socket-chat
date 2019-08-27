defmodule Wsapp.Repo do
  use Ecto.Repo,
    otp_app: :wsapp,
    adapter: Ecto.Adapters.Postgres
end
