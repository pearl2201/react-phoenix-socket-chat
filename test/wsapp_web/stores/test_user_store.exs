defmodule WsappWeb.UserStoreTest do
  use ExUnit.Case

  alias WsappWeb.UserStore

  setup do
    {:ok, store} = GenServer.start_link(UserStore, :ok)
    {:ok, store: store}
  end

  test "add user", context do
    user = UserStore.add(context[:store], %{name: "pearl"})
    assert user.name == "pearl"
  end

  test "lookup user", context do
    user = UserStore.add(context[:store], %{name: "pearl"})
    assert UserStore.lookup(user.idx) == {:ok, user}
  end
end

