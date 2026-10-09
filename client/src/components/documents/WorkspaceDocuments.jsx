import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../../socket";

const API_URL = "http://localhost:5000/api/documents";

function WorkspaceDocuments({ workspaceId }) {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch documents
  useEffect(() => {
    if (!workspaceId || !token) return;

    const fetchDocuments = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/workspace/${workspaceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDocuments(response.data.documents || []);
      } catch (error) {
        console.error("Failed to load documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [workspaceId, token]);

  // Join workspace + real-time document events
  useEffect(() => {
    if (!workspaceId) return;

    socket.emit("workspace:join", workspaceId);

    const handleDocumentCreated = (newDocument) => {
      setDocuments((prev) => {
        const exists = prev.some(
          (doc) => doc._id === newDocument._id
        );

        if (exists) return prev;

        return [newDocument, ...prev];
      });
    };

    const handleDocumentUpdated = (updatedDocument) => {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc._id === updatedDocument._id
            ? updatedDocument
            : doc
        )
      );

      setSelectedDocument((prev) => {
        if (!prev || prev._id !== updatedDocument._id) {
          return prev;
        }

        setTitle(updatedDocument.title);
        setContent(updatedDocument.content);

        return updatedDocument;
      });
    };

    socket.on(
      "document:created",
      handleDocumentCreated
    );

    socket.on(
      "document:updated",
      handleDocumentUpdated
    );

    return () => {
      socket.off(
        "document:created",
        handleDocumentCreated
      );

      socket.off(
        "document:updated",
        handleDocumentUpdated
      );

      socket.emit(
        "workspace:leave",
        workspaceId
      );
    };
  }, [workspaceId]);

  // Create document
  const handleCreateDocument = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/workspace/${workspaceId}`,
        {
          title: "Untitled Document",
          content: "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newDocument = response.data.document;

      setDocuments((prev) => {
        const exists = prev.some(
          (doc) => doc._id === newDocument._id
        );

        if (exists) return prev;

        return [newDocument, ...prev];
      });

      setSelectedDocument(newDocument);
      setTitle(newDocument.title);
      setContent(newDocument.content);
    } catch (error) {
      console.error(
        "Failed to create document:",
        error
      );
    }
  };

  // Select document
  const handleSelectDocument = (document) => {
    setSelectedDocument(document);
    setTitle(document.title);
    setContent(document.content);
  };

  // Save document
  const handleSave = async () => {
    if (!selectedDocument) return;

    try {
      setSaving(true);

      const response = await axios.put(
        `${API_URL}/${selectedDocument._id}`,
        {
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedDocument =
        response.data.document;

      setDocuments((prev) =>
        prev.map((doc) =>
          doc._id === updatedDocument._id
            ? updatedDocument
            : doc
        )
      );

      setSelectedDocument(updatedDocument);
    } catch (error) {
      console.error(
        "Failed to save document:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        height: "600px",
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
      }}
    >
      {/* Documents list */}
      <div
        style={{
          width: "250px",
          borderRight: "1px solid #ddd",
          paddingRight: "15px",
        }}
      >
        <button
          onClick={handleCreateDocument}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            background: "#A9744F",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          + New Document
        </button>

        {loading ? (
          <p>Loading...</p>
        ) : documents.length === 0 ? (
          <p style={{ color: "#777" }}>
            No documents yet.
          </p>
        ) : (
          documents.map((document) => (
            <div
              key={document._id}
              onClick={() =>
                handleSelectDocument(document)
              }
              style={{
                padding: "10px",
                marginBottom: "6px",
                borderRadius: "6px",
                cursor: "pointer",
                background:
                  selectedDocument?._id === document._id
                    ? "#f0e4da"
                    : "#f8f8f8",
              }}
            >
              {document.title}
            </div>
          ))
        )}
      </div>

      {/* Editor */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {!selectedDocument ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#777",
            }}
          >
            Select a document or create a new one.
          </div>
        ) : (
          <>
            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              style={{
                fontSize: "22px",
                fontWeight: "600",
                padding: "10px 0",
                border: "none",
                borderBottom: "1px solid #ddd",
                outline: "none",
                marginBottom: "15px",
              }}
            />

            <textarea
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              placeholder="Start writing..."
              style={{
                flex: 1,
                resize: "none",
                border: "1px solid #ddd",
                borderRadius: "6px",
                padding: "15px",
                fontSize: "16px",
                outline: "none",
              }}
            />

            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                alignSelf: "flex-end",
                marginTop: "12px",
                padding: "10px 20px",
                background: "#A9744F",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              {saving
                ? "Saving..."
                : "Save Document"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default WorkspaceDocuments;