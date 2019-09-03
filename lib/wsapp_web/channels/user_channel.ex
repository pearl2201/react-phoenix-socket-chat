defmodule WsappWeb.UserChannel do
  use Phoenix.Channel

  def join("room:lobby", _message, socket) do
    IO.inspect("user join")
    {:ok, %{user: socket.assigns.current_user}, socket}
  end

  def join("room:" <> private_room_id, _params, socket) do
    case WsappWeb.RoomStore.lookup_room(private_room_id) do
      :error ->
        {:error, %{reason: "room not exists"}}

      {:ok, room} ->
        {:ok, %{"room" => room}, socket}
    end
  end

  def handle_in("msg", %{"hello" => hello}, socket) do
    broadcast!(socket, "msg", %{hello: hello})
    {:noreply, socket}
  end
end
