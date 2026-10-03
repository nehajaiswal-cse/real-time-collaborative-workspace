import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Box,
  Button,
  Card as MuiCard,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import Navbar from "../components/common/Navbar.jsx";
import Sidebar from "../components/common/Sidebar.jsx";
import socket from "../socket";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

const BoardDetail = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dialog state for adding/editing cards and lists
  const [newListOpen, setNewListOpen] = useState(false);
  const [newListName, setNewListName] = useState("");

  const [newCardOpen, setNewCardOpen] = useState(false);
  const [activeListId, setActiveListId] = useState("");
  const [cardForm, setCardForm] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  const [editCardOpen, setEditCardOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  const fetchBoardDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const headers = getAuthHeaders();

      // 1. Fetch Board
      const boardRes = await fetch(`${API_URL}/boards/${boardId}`, { headers });
      const boardData = await boardRes.json();
      if (!boardRes.ok) throw new Error(boardData.message || "Failed to load board");
      setBoard(boardData.board);

      const workspaceId =
        typeof boardData.board.workspace === "object"
          ? boardData.board.workspace._id
          : boardData.board.workspace;

      // 2. Fetch Lists
      const listsRes = await fetch(`${API_URL}/lists/board/${boardId}`, { headers });
      const listsData = await listsRes.json();
      if (!listsRes.ok) throw new Error(listsData.message || "Failed to load lists");
      setLists(listsData.lists || []);

      // 3. Fetch Cards for all lists
      const cardResponses = await Promise.all(
        (listsData.lists || []).map((l) =>
          fetch(`${API_URL}/cards/list/${l._id}`, { headers })
        )
      );
      const cardData = await Promise.all(cardResponses.map((r) => r.json()));
      const allCards = cardData.flatMap((d) => d.cards || []);
      setCards(allCards);

      return workspaceId;
    } catch (err) {
      console.error("Fetch board detail error:", err);
      setError(err.message || "Error loading board details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let currentWorkspaceId = null;

    fetchBoardDetails().then((wsId) => {
      if (wsId) {
        currentWorkspaceId = wsId;
        socket.emit("workspace:join", wsId);
      }
    });

    const handleCardCreated = (card) => {
      setCards((prev) => (prev.some((c) => c._id === card._id) ? prev : [...prev, card]));
    };

    const handleCardUpdated = (updatedCard) => {
      setCards((prev) => prev.map((c) => (c._id === updatedCard._id ? updatedCard : c)));
    };

    const handleCardDeleted = (cardId) => {
      setCards((prev) => prev.filter((c) => c._id !== cardId));
    };

    const handleCardMoved = (movedCard) => {
      setCards((prev) => prev.map((c) => (c._id === movedCard._id ? movedCard : c)));
    };

    socket.on("card:created", handleCardCreated);
    socket.on("card:updated", handleCardUpdated);
    socket.on("card:deleted", handleCardDeleted);
    socket.on("card:moved", handleCardMoved);

    return () => {
      socket.off("card:created", handleCardCreated);
      socket.off("card:updated", handleCardUpdated);
      socket.off("card:deleted", handleCardDeleted);
      socket.off("card:moved", handleCardMoved);
      if (currentWorkspaceId) {
        socket.emit("workspace:leave", currentWorkspaceId);
      }
    };
  }, [boardId]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Optimistically update card position locally
    setCards((prevCards) =>
      prevCards.map((card) => {
        if (card._id === draggableId) {
          return {
            ...card,
            list: destination.droppableId,
            position: destination.index,
          };
        }
        return card;
      })
    );

    try {
      const res = await fetch(`${API_URL}/cards/${draggableId}/move`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          listId: destination.droppableId,
          position: destination.index,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to move card");
    } catch (err) {
      console.error("Move card error:", err);
      // Revert/refresh on error
      fetchBoardDetails();
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      const res = await fetch(`${API_URL}/lists`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: newListName.trim(),
          boardId,
          position: lists.length,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create list");

      setLists((prev) => [...prev, data.list]);
      setNewListName("");
      setNewListOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateCard = async (e) => {
    e.preventDefault();
    if (!cardForm.title.trim() || !activeListId) return;

    try {
      const res = await fetch(`${API_URL}/cards`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: cardForm.title.trim(),
          description: cardForm.description.trim(),
          priority: cardForm.priority,
          listId: activeListId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create card");

      setNewCardOpen(false);
      setCardForm({ title: "", description: "", priority: "medium" });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateCard = async (e) => {
    e.preventDefault();
    if (!editingCard || !editingCard.title.trim()) return;

    try {
      const res = await fetch(`${API_URL}/cards/${editingCard._id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: editingCard.title.trim(),
          description: editingCard.description.trim(),
          priority: editingCard.priority,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update card");

      setEditCardOpen(false);
      setEditingCard(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm("Are you sure you want to delete this card?")) return;

    try {
      const res = await fetch(`${API_URL}/cards/${cardId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete card");

      setEditCardOpen(false);
      setEditingCard(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return { bg: "#FEE2E2", text: "#991B1B" };
      case "medium":
        return { bg: "#FEF3C7", text: "#92400E" };
      case "low":
      default:
        return { bg: "#E0E7FF", text: "#3730A3" };
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />
      <Sidebar open={sidebarOpen} />

      <Box
        component="main"
        sx={{
          mt: "72px",
          ml: sidebarOpen ? "256px" : "72px",
          height: "calc(100vh - 72px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transition: "margin-left 0.3s ease",
          p: 3,
        }}
      >
        {/* Header toolbar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <IconButton onClick={() => navigate("/myboards")} sx={{ color: "#3F342C" }}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#3F342C" }}>
              {board?.name || "Board"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Drag and drop cards to reorder or move between lists
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setNewListOpen(true)}
            sx={{
              backgroundColor: "#A9744F",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#8B5E3C" },
            }}
          >
            Add List
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
            <CircularProgress sx={{ color: "#A9744F" }} />
          </Box>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Box
              sx={{
                display: "flex",
                gap: 2.5,
                alignItems: "flex-start",
                overflowX: "auto",
                flex: 1,
                pb: 2,
              }}
            >
              {lists.map((list) => {
                const listCards = cards.filter(
                  (card) =>
                    (typeof card.list === "string" ? card.list : card.list?._id) ===
                    list._id
                );

                return (
                  <Paper
                    key={list._id}
                    elevation={0}
                    sx={{
                      width: 300,
                      maxHeight: "100%",
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "#F4ECE6",
                      borderRadius: 3,
                      p: 2,
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: 700, color: "#3F342C" }}>
                        {list.name} ({listCards.length})
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setActiveListId(list._id);
                          setNewCardOpen(true);
                        }}
                        sx={{ color: "#A9744F" }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Droppable droppableId={list._id}>
                      {(provided, snapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          sx={{
                            minHeight: 120,
                            flex: 1,
                            overflowY: "auto",
                            borderRadius: 2,
                            p: 0.5,
                            backgroundColor: snapshot.isDraggingOver
                              ? "rgba(169, 116, 79, 0.08)"
                              : "transparent",
                            transition: "background-color 0.2s ease",
                          }}
                        >
                          {listCards.length === 0 ? (
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#99918B",
                                textAlign: "center",
                                py: 3,
                                fontStyle: "italic",
                              }}
                            >
                              No cards in this list
                            </Typography>
                          ) : (
                            listCards.map((card, index) => {
                              const priorityStyle = getPriorityColor(card.priority);
                              return (
                                <Draggable
                                  key={card._id}
                                  draggableId={card._id}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <MuiCard
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      sx={{
                                        mb: 1.5,
                                        borderRadius: 2,
                                        border: "1px solid #E8E3DE",
                                        backgroundColor: "#FFFFFF",
                                        boxShadow: snapshot.isDragging
                                          ? "0 8px 24px rgba(63, 52, 44, 0.18)"
                                          : "0 2px 6px rgba(63, 52, 44, 0.04)",
                                        opacity: snapshot.isDragging ? 0.9 : 1,
                                        cursor: "grab",
                                        "&:hover": {
                                          borderColor: "#A9744F",
                                        },
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            justifyContent: "space-between",
                                          }}
                                        >
                                          <Typography
                                            sx={{
                                              fontWeight: 600,
                                              fontSize: "14px",
                                              color: "#3F342C",
                                            }}
                                          >
                                            {card.title}
                                          </Typography>
                                          <IconButton
                                            size="small"
                                            onClick={() => {
                                              setEditingCard(card);
                                              setEditCardOpen(true);
                                            }}
                                            sx={{ color: "#77716C", p: 0.5 }}
                                          >
                                            <EditOutlinedIcon fontSize="small" />
                                          </IconButton>
                                        </Box>

                                        {card.description && (
                                          <Typography
                                            variant="body2"
                                            sx={{
                                              color: "#77716C",
                                              fontSize: "12px",
                                              mt: 0.5,
                                              display: "-webkit-box",
                                              WebkitLineClamp: 2,
                                              WebkitBoxOrient: "vertical",
                                              overflow: "hidden",
                                            }}
                                          >
                                            {card.description}
                                          </Typography>
                                        )}

                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            mt: 1.5,
                                          }}
                                        >
                                          <Chip
                                            label={card.priority}
                                            size="small"
                                            sx={{
                                              height: 20,
                                              fontSize: "10px",
                                              fontWeight: 700,
                                              textTransform: "uppercase",
                                              backgroundColor: priorityStyle.bg,
                                              color: priorityStyle.text,
                                            }}
                                          />
                                          {card.assignedTo?.name && (
                                            <Typography
                                              variant="caption"
                                              sx={{ color: "#77716C" }}
                                            >
                                              {card.assignedTo.name}
                                            </Typography>
                                          )}
                                        </Box>
                                      </CardContent>
                                    </MuiCard>
                                  )}
                                </Draggable>
                              );
                            })
                          )}
                          {provided.placeholder}
                        </Box>
                      )}
                    </Droppable>

                    <Button
                      fullWidth
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setActiveListId(list._id);
                        setNewCardOpen(true);
                      }}
                      sx={{
                        mt: 1,
                        color: "#A9744F",
                        textTransform: "none",
                        fontWeight: 600,
                        justifyContent: "flex-start",
                        "&:hover": { backgroundColor: "rgba(169, 116, 79, 0.08)" },
                      }}
                    >
                      Add Card
                    </Button>
                  </Paper>
                );
              })}
            </Box>
          </DragDropContext>
        )}
      </Box>

      {/* Dialog for adding new List */}
      <Dialog open={newListOpen} onClose={() => setNewListOpen(false)} fullWidth maxWidth="xs">
        <form onSubmit={handleCreateList}>
          <DialogTitle>Add New List</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              autoFocus
              label="List Title"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewListOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: "#A9744F" }}>
              Create List
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog for adding new Card */}
      <Dialog open={newCardOpen} onClose={() => setNewCardOpen(false)} fullWidth maxWidth="xs">
        <form onSubmit={handleCreateCard}>
          <DialogTitle>Add New Card</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              autoFocus
              label="Card Title"
              value={cardForm.title}
              onChange={(e) => setCardForm((prev) => ({ ...prev, title: e.target.value }))}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={cardForm.description}
              onChange={(e) => setCardForm((prev) => ({ ...prev, description: e.target.value }))}
              margin="normal"
            />
            <TextField
              select
              fullWidth
              label="Priority"
              value={cardForm.priority}
              onChange={(e) => setCardForm((prev) => ({ ...prev, priority: e.target.value }))}
              margin="normal"
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewCardOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: "#A9744F" }}>
              Add Card
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog for editing/deleting Card */}
      <Dialog open={editCardOpen} onClose={() => setEditCardOpen(false)} fullWidth maxWidth="xs">
        {editingCard && (
          <form onSubmit={handleUpdateCard}>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              Edit Card
              <IconButton color="error" onClick={() => handleDeleteCard(editingCard._id)}>
                <DeleteIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Card Title"
                value={editingCard.title}
                onChange={(e) => setEditingCard((prev) => ({ ...prev, title: e.target.value }))}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={editingCard.description || ""}
                onChange={(e) => setEditingCard((prev) => ({ ...prev, description: e.target.value }))}
                margin="normal"
              />
              <TextField
                select
                fullWidth
                label="Priority"
                value={editingCard.priority || "medium"}
                onChange={(e) => setEditingCard((prev) => ({ ...prev, priority: e.target.value }))}
                margin="normal"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditCardOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained" sx={{ bgcolor: "#A9744F" }}>
                Save Changes
              </Button>
            </DialogActions>
          </form>
        )}
      </Dialog>
    </Box>
  );
};

export default BoardDetail;
