defmodule WsappWeb.RoomStore do
  use GenServer
  @server :rooms
  def start_link(opts) do
    GenServer.start_link(__MODULE__, %{}, opts)
  end

  def init(_) do
    rooms = :ets.new(@server, [:named_table, read_concurrency: true])
    idxs = []
    {:ok, {rooms, idxs}}
  end

  def create_room(server, room_name, creator_id) do
    GenServer.call(server, {:create, room_name, creator_id})
  end

  @spec delete_room(atom | pid | {atom, any} | {:via, atom, any}, any) :: any
  def delete_room(server, room_id) do
    GenServer.call(server, {:delete_room, room_id})
  end

  def get_rooms(server) do
    GenServer.call(server, {:get_rooms})
  end

  def has_member?(room_id, user_id) do
    case lookup_room(room_id) do
      :error ->
        false

      {:ok, room} ->
        case Enum.find(room.members, fn x -> x == user_id end) do
          nil -> false
          _ -> true
        end
    end
  end

  def add_member(server, room_id, user_id) do
    GenServer.cast(server, {:add_member, room_id, user_id})
  end

  def remove_member(server, room_id, user_id) do
    GenServer.cast(server, {:remove_member, room_id, user_id})
  end

  def lookup_room(room_id) do
    case :ets.lookup(@server, room_id) do
      [{^room_id, room}] -> {:ok, room}
      [] -> :error
    end
  end

  def handle_call({:create, room_name, creator_id}, _form, {rooms, []}) do
    idx = 1
    room = %{idx: idx, name: room_name, members: [creator_id], creator_id: creator_id}
    :ets.insert(rooms, {idx, room})

    {:reply, room, {rooms, [idx]}}
  end

  def handle_call({:create, room_name, creator_id}, _form, {rooms, [head | _] = idxs}) do
    idx = head + 1
    room = %{idx: idx, name: room_name, members: [creator_id]}
    :ets.insert(rooms, {idx, room})

    {:reply, room, {rooms, [idx | idxs]}}
  end

  def handle_call({:delete_room, room_id}, _form, {rooms, idxs}) do
    {:ok, room} = lookup_room(room_id)
    :ets.delete(rooms, room_id)
    idxs = Enum.filter(idxs, fn x -> x != room.idx end)
    {:reply, room, {rooms, idxs}}
  end

  def handle_call({:get_rooms}, _form, {rooms, idxs}) do
    ret =
      for idx <- idxs do
        {:ok, room} = lookup_room(idx)
        %{id: idx, room_name: room.name}
      end

    {:reply, ret, {rooms, idxs}}
  end

  def handle_cast({:remove_member, room_id, user_id}, {rooms, idxs}) do
    {:ok, room} = lookup_room(room_id)
    members = Enum.filter(room.members, fn x -> x != user_id end)
    room = %{room | members: members}
    :ets.insert(rooms, {room_id, room})
    {:noreply, {rooms, idxs}}
  end

  def handle_cast({:add_member, room_id, user_id}, {rooms, idxs}) do
    {:ok, room} = lookup_room(room_id)
    members = [user_id | room.members]
    room = %{room | members: members}
    :ets.insert(rooms, {room_id, room})
    {:noreply, {rooms, idxs}}
  end
end
