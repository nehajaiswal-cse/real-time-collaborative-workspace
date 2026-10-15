import { useCallback, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";

const useResponsiveSidebar = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"), { noSsr: true });

  const [open, setOpen] = useState(isDesktop);
  const [wasDesktop, setWasDesktop] = useState(isDesktop);

  // Screen crossed the breakpoint -> re-sync (runs during render, no effect)
  if (wasDesktop !== isDesktop) {
    setWasDesktop(isDesktop);
    setOpen(isDesktop);
  }

  const toggle = useCallback(() => setOpen((previous) => !previous), []);

  return [open, setOpen, toggle];
};

export default useResponsiveSidebar;