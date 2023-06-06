import CircularProgress from "@mui/material/CircularProgress";

import "./Loader.css";
import { Skeleton } from "@mui/material";

export function Circle({ recipe }) {
  return (
    <div className="loader">
      <CircularProgress />
    </div>
  );
}

export function SkeletonEffect() {
  return (
    <div className="recipe-card skeleton-loader">
      <div className="left">
        <Skeleton className="rc-heading" />

        <div className="rc-ing-container">
          <Skeleton className="rc-ingredient" />
          <Skeleton className="rc-ingredient mobile-view" />
          <Skeleton className="rc-ingredient display-line" />
        </div>

        <Skeleton className="rc-instruction" />
        <Skeleton className="rc-instruction-text" />
        <Skeleton className="rc-instruction-text" />
        <Skeleton className="rc-instruction-text" />
        <Skeleton className="rc-instruction-text" />
        <Skeleton className="rc-instruction-text display-line" />
        <Skeleton className="rc-instruction-text mobile-view" />
        <Skeleton className="rc-instruction-text mobile-view" />
        <Skeleton className="rc-instruction-text mobile-view" />
        <Skeleton className="rc-instruction-text mobile-view" />
        <Skeleton className="rc-instruction-text last-line" />
        <Skeleton className="rc-cooking-time" />
      </div>

      <div className="right">
        <Skeleton animation="wave" variant="rect" width={260} height={200} />
        <Skeleton animation="wave" variant="rect" width={140} height={40} />
      </div>
    </div>
  );
}
