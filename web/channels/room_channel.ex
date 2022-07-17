#receive updates from socket and broadcast drawing to all other sockets
defmodule Draw.RoomChannel do
  use Phoenix.Channel

  def join("room:lobby", _message, socket) do
    IO.puts "User Joined"
    {:ok, socket}
  end

  def join(_room, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  #draw method
  def handle_in("update_draw", payload, socket) do #from socket
  	#needs to take in co-ords and broadcast to all other clients
    #IO.puts "MESSAGE SENT"
    broadcast! socket, "update_draw", payload
    {:noreply, socket}

  end

  #clear method
  def handle_in("clear_canvas", payload, socket) do
    broadcast! socket, "clear_canvas", payload
    {:noreply, socket}
  end

  def handle_in("color_change", payload, socket) do
    broadcast! socket, "color_change", payload
    {:noreply, socket}
  end

  def handle_in("post", details, socket) do
    broadcast! socket, "update_post", details
    {:noreply, socket}

  end 

  def handle_in("touch", _details, socket) do
    IO.puts "MOBILE TOUCH"
    #broadcast! socket, "update_post", details
    {:noreply, socket}

  end 
end