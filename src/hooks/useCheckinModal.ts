import { useState } from "react";

export function useCheckinModal(handleCheckin: () => Promise<boolean>) {
  const [showModal, setShowModal] = useState(false);

  async function onClick() {
    const success = await handleCheckin();
    if (success) setShowModal(true);
  }

  return { showModal, setShowModal, onClick };
}
