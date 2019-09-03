defmodule WsappWeb.SettingChannel do
  use Phoenix.Channel

  def join("setting", _message, socket) do
    IO.inspect("user join")
    {:ok, socket}
  end

  def join("room:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("msg", %{"hello" => hello}, socket) do
    broadcast!(socket, "msg", %{hello: hello})
    {:noreply, socket}
  end

  def handle_in("req_profile", _params, socket) do
    {:reply, {:ok, %{user: socket.assigns.current_user}}, socket}
  end

  def handle_in("create_chatroom", %{"channel" => channel}, socket) do
    room =
      WsappWeb.RoomStore.create_room(WsappWeb.RoomStore, channel, socket.assigns.current_user.idx)

    {:reply, {:ok, %{"channel" => room}}, socket}
  end
end
