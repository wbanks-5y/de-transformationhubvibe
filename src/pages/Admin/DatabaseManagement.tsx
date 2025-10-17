
import React from "react";
import DatabaseConfiguration from "./components/DatabaseConfiguration";
import BackButton from "@/components/ui/back-button";

const DatabaseManagement: React.FC = () => {
  return (
    <div>
      <BackButton />
      <DatabaseConfiguration />
    </div>
  );
};

export default DatabaseManagement;
