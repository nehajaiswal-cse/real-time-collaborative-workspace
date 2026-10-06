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

      console.log("WORKSPACES FROM DATABASE:", workspaceList);

      setWorkspaces(workspaceList);

      if (workspaceList.length === 0) {
        setSelectedWorkspace(null);
        localStorage.removeItem("selectedWorkspaceId");
        return;
      }

      // ==========================================
      // Get previously selected workspace ID
      // ==========================================

      const savedWorkspaceId =
        localStorage.getItem("selectedWorkspaceId");

      if (savedWorkspaceId) {
        const existingWorkspace = workspaceList.find(
          (workspace) =>
            workspace._id === savedWorkspaceId
        );

        if (existingWorkspace) {
          setSelectedWorkspace(existingWorkspace);

          console.log(
            "RESTORED WORKSPACE:",
            existingWorkspace.name,
            existingWorkspace._id
          );

          return;
        }
      }

      // ==========================================
      // Default workspace
      // ==========================================

      const firstWorkspace = workspaceList[0];

      setSelectedWorkspace(firstWorkspace);

      localStorage.setItem(
        "selectedWorkspaceId",
        firstWorkspace._id
      );

      console.log(
        "DEFAULT WORKSPACE:",
        firstWorkspace.name,
        firstWorkspace._id
      );
    } catch (error) {
      console.error(
        "Failed to load workspaces:",
        error
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
    if (!workspace?._id) return;

    console.log(
      "SWITCHING WORKSPACE:",
      workspace.name,
      workspace._id
    );

    setSelectedWorkspace(workspace);

    localStorage.setItem(
      "selectedWorkspaceId",
      workspace._id
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
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error(
      "useWorkspace must be used inside WorkspaceProvider"
    );
  }

  return context;
};