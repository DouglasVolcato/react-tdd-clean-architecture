import React from "react";
import "./styles.scss";

type Props = {
  loading: boolean;
};

export const LoadingSpinner: React.FC<Props> = ({ loading }: Props) => {
  return <div>{loading ? <div data-testid='loading-spinner' className="loading-spinner" /> : null}</div>;
};
