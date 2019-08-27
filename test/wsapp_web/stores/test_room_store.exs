defmodule WsappWeb.RoomStoreTest do
  use ExUnit.Case
  alias WsappWeb.RoomStore

  setup do
    {:ok, room_store} = GenServer.start_link(RoomStore, :ok)
    {:ok, room_store: room_store}
  end

  test "create_store", context do
    room = RoomStore.create_room(context[:room_store], "ahihi", 1)
    assert room.idx == 1
    assert room.name == "ahihi"
    assert room.members == [1]
    assert room.creator_id == 1
  end

  test "test has member", context do
    room = RoomStore.create_room(context[:room_store], "ahihi", 1)
    assert RoomStore.has_member?(room.idx, 1) == true
  end

  test "test lookup", context do
    room = RoomStore.create_room(context[:room_store], "ahihi", 1)
    assert RoomStore.lookup_room(room.idx) == {:ok, room}
  end

  test "test remove room", context do
    room = RoomStore.create_room(context[:room_store], "ahihi", 1)
    room = RoomStore.delete_room(context[:room_store], room.idx)
    assert RoomStore.lookup_room(room.idx) == :error
  end

  test "test add member", context do
    room = RoomStore.create_room(context[:room_store], "ahihi", 1)
    RoomStore.add_member(context[:room_store], room.idx, 2)
    :timer.sleep(100)
    assert RoomStore.has_member?(room.idx, 2) == true
  end

  test "test remove member", context do
    room = RoomStore.create_room(context[:room_store], "ahihi", 1)
    RoomStore.add_member(context[:room_store], room.idx, 2)
    :timer.sleep(100)
    RoomStore.remove_member(context[:room_store], room.idx, 2)
    :timer.sleep(100)
    assert RoomStore.has_member?(room.idx, 2) == false
  end
end
