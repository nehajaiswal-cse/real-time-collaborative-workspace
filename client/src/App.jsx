import { useEffect, useState } from "react";
import socket from "./socket";

const API_URL = "http://localhost:5000/api";

const BOARD_ID = "6ab7606daceacad087743964";

const WORKSPACE_ID = "6ab75f55e178a9deda763c9e";

function App() {
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Authentication token not found. Please login first.");
          setLoading(false);
          return;
        }

        // Get all lists of board
        const listsResponse = await fetch(
          `${API_URL}/lists/board/${BOARD_ID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const listsData = await listsResponse.json();

        if (!listsResponse.ok) {
          throw new Error(listsData.message || "Failed to fetch lists");
        }

        setLists(listsData.lists);

        // Get cards of every list
        const cardResponses = await Promise.all(
          listsData.lists.map((list) =>
            fetch(`${API_URL}/cards/list/${list._id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ),
        );

        const cardData = await Promise.all(
          cardResponses.map((response) => response.json()),
        );

        const allCards = cardData.flatMap((data) => data.cards || []);

        setCards(allCards);
      } catch (error) {
        console.error("Fetch board data error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBoardData();
  }, []);

  useEffect(() => {
    socket.emit("workspace:join", WORKSPACE_ID);

    const handleCardCreated = (card) => {
      console.log("REAL-TIME CARD CREATED:", card);

      setCards((previousCards) => {
        const alreadyExists = previousCards.some(
          (existingCard) => existingCard._id === card._id,
        );

        if (alreadyExists) {
          return previousCards;
        }

        return [...previousCards, card];
      });
    };

    const handleCardUpdated = (updatedCard) => {
      console.log("REAL-TIME CARD UPDATED:", updatedCard);

      setCards((previousCards) =>
        previousCards.map((card) =>
          card._id === updatedCard._id ? updatedCard : card,
        ),
      );
    };

    const handleCardDeleted = (cardId) => {
      console.log("REAL-TIME CARD DELETED:", cardId);

      setCards((previousCards) =>
        previousCards.filter((card) => card._id !== cardId),
      );
    };

    socket.on("card:created", handleCardCreated);
    socket.on("card:updated", handleCardUpdated);
    socket.on("card:deleted", handleCardDeleted);

    return () => {
      socket.off("card:created", handleCardCreated);
      socket.off("card:updated", handleCardUpdated);
      socket.off("card:deleted", handleCardDeleted);


      socket.emit("workspace:leave", WORKSPACE_ID);
    };
  }, []);

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>Loading Board...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.center}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1>My Development Board</h1>

      <div style={styles.board}>
        {lists.map((list) => {
          const listCards = cards.filter(
            (card) =>
              (typeof card.list === "string" ? card.list : card.list?._id) ===
              list._id,
          );

          return (
            <div key={list._id} style={styles.list}>
              <h2>{list.name}</h2>

              {listCards.length === 0 ? (
                <p style={styles.empty}>No cards</p>
              ) : (
                listCards.map((card) => (
                  <div key={card._id} style={styles.card}>
                    <h3>{card.title}</h3>

                    {card.description && <p>{card.description}</p>}

                    <span>Priority: {card.priority}</span>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "30px",
    background: "#f5f5f5",
    fontFamily: "Arial, sans-serif",
  },

  board: {
    display: "flex",
    gap: "20px",
    alignItems: "flex-start",
    marginTop: "30px",
    overflowX: "auto",
  },

  list: {
    width: "280px",
    minHeight: "300px",
    padding: "16px",
    background: "#e5e7eb",
    borderRadius: "10px",
    flexShrink: 0,
  },

  card: {
    background: "white",
    padding: "14px",
    marginTop: "12px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },

  empty: {
    color: "#666",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default App;
