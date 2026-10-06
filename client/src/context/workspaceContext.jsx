import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { getMyWorkspaces } from "../api/workspaceApi";

const WorkspaceContext = createContext(null);

export const WorkspaceProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] =
    useState(null);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // Load workspaces from database
  // ==========================================

  const loadWorkspaces = async () => {
    try {
      setLoading(true);

      const data = await getMyWorkspaces();

      const workspaceList = Array.isArray(data)
        ? data
        : data?.workspaces || [];

      // ==========================================
      // Remove invalid/null workspaces
      // ==========================================

      const validWorkspaces = workspaceList.filter(
        (workspace) =>
          workspace &&
          (workspace._id || workspace.id)
      );

      console.log(
        "WORKSPACES FROM DATABASE:",
        validWorkspaces
      );

      setWorkspaces(validWorkspaces);

      // ==========================================
      // No workspaces
      // ==========================================

      if (validWorkspaces.length === 0) {
        setSelectedWorkspace(null);

        localStorage.removeItem(
          "selectedWorkspaceId"
        );

        return;
      }

      // ==========================================
      // Get previously selected workspace ID
      // ==========================================

      const savedWorkspaceId =
        localStorage.getItem(
          "selectedWorkspaceId"
        );

      if (savedWorkspaceId) {
        const existingWorkspace =
          validWorkspaces.find(
            (workspace) =>
              String(
                workspace._id || workspace.id
              ) === String(savedWorkspaceId)
          );

        if (existingWorkspace) {
          setSelectedWorkspace(
            existingWorkspace
          );

          const existingId =
            existingWorkspace._id ||
            existingWorkspace.id;

          console.log(
            "RESTORED WORKSPACE:",
            existingWorkspace.name,
            existingId
          );

          return;
        }
      }

      // ==========================================
      // Default workspace
      // ==========================================

      const firstWorkspace =
        validWorkspaces[0];

      const firstWorkspaceId =
        firstWorkspace._id ||
        firstWorkspace.id;

      setSelectedWorkspace(
        firstWorkspace
      );

      localStorage.setItem(
        "selectedWorkspaceId",
        firstWorkspaceId
      );

      console.log(
        "DEFAULT WORKSPACE:",
        firstWorkspace.name,
        firstWorkspaceId
      );
    } catch (error) {
      console.error(
        "Failed to load workspaces:",
        error
      );

      setWorkspaces([]);
      setSelectedWorkspace(null);

      localStorage.removeItem(
        "selectedWorkspaceId"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Initial load
  // ==========================================

  useEffect(() => {
    loadWorkspaces();
  }, []);

  // ==========================================
  // Switch workspace
  // ==========================================

  const switchWorkspace = (workspace) => {
    if (!workspace) return;

    const workspaceId =
      workspace._id || workspace.id;

    if (!workspaceId) return;

    console.log(
      "SWITCHING WORKSPACE:",
      workspace.name,
      workspaceId
    );

    setSelectedWorkspace(workspace);

    localStorage.setItem(
      "selectedWorkspaceId",
      workspaceId
    );
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        selectedWorkspace,
        loading,
        switchWorkspace,
        loadWorkspaces,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

// ==========================================
// Custom Hook
// ==========================================

export const useWorkspace = () => {
  const context =
    useContext(WorkspaceContext);

  if (!context) {
    throw new Error(
      "useWorkspace must be used inside WorkspaceProvider"
    );
  }

  return context;
};