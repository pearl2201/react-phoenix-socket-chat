defmodule WsappWeb.UserChannel do
  use Phoenix.Channel
  def join("room:lobby", _message, socket) do
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
end
