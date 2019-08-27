defmodule WsappWeb.UserStore do
  use GenServer
  @server :users
  def start_link(opts) do
    GenServer.start_link(__MODULE__, %{}, opts)
  end

  def init(_) do
    users = :ets.new(@server, [:named_table, read_concurrency: true])
    idxs = []
    {:ok, {users, idxs}}
  end

  def add(server, user) do
    GenServer.call(server, {:add, user})
  end

  def lookup(user_id) do
    case :ets.lookup(@server, user_id) do
      [{^user_id, user}] -> {:ok, user}
      [] -> :error
    end
  end

  def handle_call({:add, user}, _form, {users, []}) do
    idx = 1

    user = Map.put(user, :idx, idx)
    :ets.insert(users, {idx, user})
    IO.puts("insert user success")
    {:reply, user, {users, [idx]}}
  end

  def handle_call({:add, user}, _form, {users, [head | _] = idxs}) do
    idx = head + 1

    user = Map.put(user, :idx, idx)
    :ets.insert(users, {idx, user})
    IO.puts("insert user success")
    {:reply, user, {users, [idx | idxs]}}
  end
end
