defmodule WsappWeb.PageController do
  use WsappWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
